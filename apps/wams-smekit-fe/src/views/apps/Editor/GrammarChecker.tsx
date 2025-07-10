import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { checkGrammarText } from '../../../api/AI';
import { Node as ProseMirrorNode } from 'prosemirror-model';

export const GrammarChecker = Extension.create({
  name: 'grammarChecker',

  addOptions() {
    return {
      debounceTime: 1000,
      enabledTypes: ['spelling', 'grammar', 'conjugation'],
      language: 'fr-FR',
    };
  },

  addStorage() {
    return {
      debounceTimer: null,
      lastCheckedText: '',
      errors: [],
      decorations: DecorationSet.empty,
      offsetMap: [],
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

            return meta ? meta : old.map(tr.mapping, tr.doc);
          },
        },

        props: {
          decorations(state) {
            return this.getState(state);
          },
          handleDOMEvents: {
            click: (view, event) => {
              const target = event.target as HTMLElement;
              console.log("Target cliqué :", target);

              if (target?.dataset?.grammarError) {
                console.log("✅ Détection d'une erreur grammaticale cliquée");

                const suggestions = target.dataset.suggestions?.split('||').filter(Boolean) || [];
                const offset = parseInt(target.dataset.offset || '0');
                const message = target.dataset.message || '';
                const length = parseInt(target.dataset.length || '0');

                if (suggestions.length) {
                  view.dispatch(view.state.tr.setMeta('showGrammarPopup', {
                    x: (event as MouseEvent).clientX,
                    y: (event as MouseEvent).clientY,
                    suggestions,
                    offset,
                    message,
                    length,
                    offsetMap: buildOffsetMap(view.state.doc),
                  }));
                }
                event.preventDefault();
                return true;
              }
              return false;
            },
          },

        },

        view(view) {
          const runCheck = async () => {
            const text = view.state.doc.textContent.trim();
            if (text === storage.lastCheckedText || text.length < 2) return;

            storage.lastCheckedText = text;
            const errors = await checkGrammarText(text, { language: options.language });
            storage.errors = errors;
            storage.offsetMap = buildOffsetMap(view.state.doc);

            const decorations = createDecorations(view.state.doc, errors, options.enabledTypes, storage.offsetMap);
            storage.decorations = decorations;
            view.dispatch(view.state.tr.setMeta('grammarDecorations', decorations));
          };

          const schedule = () => {
            clearTimeout(storage.debounceTimer);
            storage.debounceTimer = setTimeout(runCheck, options.debounceTime);
          };

          schedule();

          return {
            update(view, prevState) {
              if (view.state.doc.textContent !== prevState.doc.textContent) schedule();
            },
            destroy() {
              clearTimeout(storage.debounceTimer);
            },
          };
        },
      }),
    ];
  },
});

function buildOffsetMap(doc: ProseMirrorNode) {
  const map = [];
  let count = 0;
  doc.descendants((node, pos) => {
    if (!node.isText) return true;
    for (let i = 0; i < (node.text?.length || 0); i++) {
      map.push({ textOffset: count + i, pos: pos + i });
    }
    count += node.text?.length || 0;

    return true;
  });

  return map;
}

function getPos(offsetMap, textOffset) {
  const found = offsetMap.find(m => m.textOffset === textOffset);

  return found ? found.pos : 0;
}

function createDecorations(doc, errors, enabledTypes, offsetMap) {
  return DecorationSet.create(doc, errors
    .filter(e => enabledTypes.includes(e.type))
    .map(e => {
      const from = getPos(offsetMap, e.offset);
      const to = getPos(offsetMap, e.offset + e.length);
      if (from >= to) return null;

      return Decoration.inline(from, to, {
        class: `grammar-error grammar-${e.severity} grammar-${e.type}`,
        'data-grammar-error': 'true',
        'data-message': e.message,
        'data-suggestions': e.suggestions.join('||'),
        'data-offset': e.offset,
        'data-length': e.length,
      });

    }).filter(Boolean));
}
