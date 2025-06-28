import { Mark, mergeAttributes, Extension, RawCommands } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { checkGrammarText } from "../../../api/AI";
import { Node as ProseMirrorNode } from 'prosemirror-model';

interface GrammarError {
  offset: number;
  length: number;
  message: string;
  type: 'spelling' | 'grammar' | 'conjugation';
  suggestions: string[];
  severity: 'error' | 'warning' | 'suggestion';
  context?: string;
  ruleId?: string;
  ruleDescription?: string;
}

interface SpellCheckAPI {
  checkText(text: string): Promise<GrammarError[]>;
}

export const GrammarMark = Mark.create({
  name: 'grammarMark',

  addAttributes() {
    return {
      message: { default: null },
      type: { default: 'spelling' },
      suggestions: { default: [] },
      severity: { default: 'error' },
      offset: { default: 0 },
      length: { default: 0 },
      ruleId: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-grammar-error]',
        getAttrs: (el) => {
          const element = el as HTMLElement;

          return {
            message: element.getAttribute('data-message') || null,
            type: element.getAttribute('data-type') || 'spelling',
            suggestions: element.getAttribute('data-suggestions')?.split('||').filter(Boolean) || [],
            severity: element.getAttribute('data-severity') || 'error',
            offset: parseInt(element.getAttribute('data-offset') || '0'),
            length: parseInt(element.getAttribute('data-length') || '0'),
            ruleId: element.getAttribute('data-rule-id') || null,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-grammar-error': 'true',
        'data-message': HTMLAttributes.message,
        'data-type': HTMLAttributes.type,
        'data-severity': HTMLAttributes.severity,
        'data-offset': HTMLAttributes.offset?.toString() || '0',
        'data-length': HTMLAttributes.length?.toString() || '0',
        'data-rule-id': HTMLAttributes.ruleId || '',
        'data-suggestions': Array.isArray(HTMLAttributes.suggestions)
          ? HTMLAttributes.suggestions.join('||')
          : '',
        class: `grammar-error grammar-${HTMLAttributes.severity} grammar-${HTMLAttributes.type}`,
      }),
      0,
    ];
  },
});

export const GrammarChecker = Extension.create({
  name: 'grammarChecker',

  addOptions() {
    return {
      debounceTime: 2000,
      minWordLength: 3,
      enabledTypes: ['spelling', 'grammar', 'conjugation'],
      language: 'fr-FR',
      customAPI: null as SpellCheckAPI | null,
      maxTextLength: 5000,
    };
  },

  addStorage() {
    return {
      debounceTimer: null as NodeJS.Timeout | null,
      lastCheckedText: '',
      errors: [] as GrammarError[],
      decorations: DecorationSet.empty,
      isChecking: false,
      offsetMap: [] as { textOffset: number; pos: number }[],
    };
  },

  addProseMirrorPlugins() {
    const options = this.options;
    const storage = this.storage;

    return [
      new Plugin({
        key: new PluginKey('grammarChecker'),

        state: {
          init: () => DecorationSet.empty,
          apply(tr, old) {
            const meta = tr.getMeta('grammarDecorations');
            return meta !== undefined ? meta : old.map(tr.mapping, tr.doc);
          },
        },

        view(view) {
          const runGrammarCheck = async (text: string) => {
            if (storage.isChecking) return;

            const cleanText = text.trim();
            if (
              cleanText === storage.lastCheckedText ||
              cleanText.length < options.minWordLength ||
              cleanText.length > options.maxTextLength
            ) {
              return;
            }

            storage.isChecking = true;
            storage.lastCheckedText = cleanText;

            try {
              const errors = await checkGrammarText(cleanText, { language: options.language });
              if (view.state.doc.textContent.trim() !== cleanText) return;

              storage.errors = errors;
              storage.offsetMap = buildOffsetMap(view.state.doc);

              const decorations = createDecorations(view.state.doc, errors, options.enabledTypes, storage.offsetMap);
              storage.decorations = decorations;

              view.dispatch(view.state.tr.setMeta('grammarDecorations', decorations));
            } catch (err) {
              console.error('Erreur vérification grammaticale:', err);
              storage.errors = [];
              storage.decorations = DecorationSet.empty;
              view.dispatch(view.state.tr.setMeta('grammarDecorations', DecorationSet.empty));
            } finally {
              storage.isChecking = false;
            }
          };

          const scheduleCheck = (text: string) => {
            if (storage.debounceTimer) clearTimeout(storage.debounceTimer);
            storage.debounceTimer = setTimeout(() => runGrammarCheck(text), options.debounceTime);
          };

          scheduleCheck(view.state.doc.textContent);

          return {
            update(view, prevState) {
              if (view.state.doc.textContent !== prevState.doc.textContent) {
                scheduleCheck(view.state.doc.textContent);
              }
            },
            destroy() {
              if (storage.debounceTimer) clearTimeout(storage.debounceTimer);
              storage.isChecking = false;
            },
          };
        },

        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },

  addCommands() {
    const storage = this.storage;

    return {
      acceptSuggestion: (position: number, suggestion: string) => ({ tr, dispatch, state }) => {
        const error = storage.errors.find(e => position >= e.offset && position < e.offset + e.length);
        if (!dispatch || !error) return true;

        const docSize = state.doc.content.size;
        const from = getPosFromTextOffsetWithMap(storage.offsetMap, error.offset);
        const to = getPosFromTextOffsetWithMap(storage.offsetMap, error.offset + error.length);

        if (from >= to || from < 0 || to > docSize) return true;

        tr.insertText(suggestion, from, to);
        storage.errors = storage.errors.filter(e => e !== error);
        const decorations = createDecorations(tr.doc, storage.errors, this.options.enabledTypes, storage.offsetMap);
        tr.setMeta('grammarDecorations', decorations);

        return true;
      },

      ignoreError: (position: number) => ({ tr, dispatch }) => {
        const index = storage.errors.findIndex(e => position >= e.offset && position < e.offset + e.length);
        if (index === -1 || !dispatch) return true;

        storage.errors.splice(index, 1);
        const decorations = createDecorations(tr.doc, storage.errors, this.options.enabledTypes, storage.offsetMap);
        tr.setMeta('grammarDecorations', decorations);

        return true;
      },
    } as Partial<RawCommands>;
  },
});

function buildOffsetMap(doc: ProseMirrorNode): { textOffset: number; pos: number }[] {
  const map: { textOffset: number; pos: number }[] = [];
  let accumulated = 0;

  doc.descendants((node, pos) => {
    if (!node.isText) return true;
    const nodeText = node.text || '';
    for (let i = 0; i < nodeText.length; i++) {
      map.push({ textOffset: accumulated + i, pos: pos + i });
    }
    accumulated += nodeText.length;

    return true;
  });

  return map;
}

function getPosFromTextOffsetWithMap(offsetMap: { textOffset: number; pos: number }[], textOffset: number): number {
  const found = offsetMap.find(m => m.textOffset === textOffset);
  return found ? found.pos : 0;
}

function createDecorations(
  doc: ProseMirrorNode,
  errors: GrammarError[],
  enabledTypes: string[],
  offsetMap: { textOffset: number; pos: number }[]
): DecorationSet {
  if (!errors?.length) return DecorationSet.empty;

  const decorations = errors
    .filter(error => enabledTypes.includes(error.type))
    .map(error => {
      const from = getPosFromTextOffsetWithMap(offsetMap, error.offset);
      const to = getPosFromTextOffsetWithMap(offsetMap, error.offset + error.length);
      if (from >= to || from < 0 || to > doc.content.size) return null;

      return Decoration.inline(from, to, {
        class: `grammar-error grammar-${error.severity} grammar-${error.type}`,
        'data-grammar-error': 'true',
        'data-message': error.message,
        'data-suggestions': error.suggestions.join('||'),
        'data-offset': error.offset.toString(),
        'data-length': error.length.toString(),
        'data-type': error.type,
        'data-severity': error.severity,
        'data-rule-id': error.ruleId || '',
      });
    })
    .filter(Boolean);

  return DecorationSet.create(doc, decorations);
}


export const suggestedCSS = `
.grammar-error {
  position: relative;
  cursor: pointer;
  border-radius: 2px;
  padding: 0 1px;
  transition: all 0.2s ease;
  display: inline;
}

.grammar-error.grammar-spelling {
  background-color: rgba(255, 0, 0, 0.2);
  border-radius: 4px;
  padding: 0 2px;
  border-bottom: none;
  color: #d60000;
  font-weight: 500;
}


.grammar-error.grammar-grammar {
  border-bottom: 2px wavy #ffaa00;
  background-color: rgba(255, 170, 0, 0.1);
  color: #cc8800;
}

.grammar-error.grammar-conjugation {
  border-bottom: 2px wavy #4488ff;
  background-color: rgba(68, 136, 255, 0.1);
  color: #0066cc;
}

.grammar-error.grammar-warning {
  border-bottom-style: dotted;
  opacity: 0.8;
}

.grammar-error.grammar-suggestion {
  border-bottom-style: dashed;
  opacity: 0.7;
  border-width: 1px;
}

.grammar-error:hover {
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.grammar-error:hover::after {
  content: attr(data-message);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 1000;
  font-size: 12px;
  max-width: 250px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  font-weight: normal;
  line-height: 1.4;
}

.grammar-error:hover::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  border: 6px solid transparent;
  border-top-color: #333;
  z-index: 1001;
}

/* Indicateurs visuels par type d'erreur */
.grammar-error.grammar-spelling::after {
  border-left: 3px solid #ff4444;
}

.grammar-error.grammar-grammar::after {
  border-left: 3px solid #ffaa00;
}

.grammar-error.grammar-conjugation::after {
  border-left: 3px solid #4488ff;
}

/* Adaptation responsive */
@media (max-width: 768px) {
  .grammar-error:hover::after {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    transform: none;
    max-width: none;
  }

  .grammar-error:hover::before {
    display: none;
  }
}
`;
