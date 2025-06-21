import { Mark, mergeAttributes } from '@tiptap/core'
import { CommandProps } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    commentMark: {
      setComment: (params: {
        commentId: number | string;
        user: string;
        type?: string;
      }) => ReturnType;
      unsetComment: () => ReturnType;
    }
  }
}

export const CommentMark = Mark.create({
  name: 'commentMark',

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: element => element.getAttribute('data-comment-id'),
        renderHTML: attributes => {
          if (!attributes.commentId) return {};

          return {
            'data-comment-id': attributes.commentId,
            class: 'tiptap-comment',
          };
        },
      },
      user: {
        default: '',
        parseHTML: element => element.getAttribute('data-user'),
        renderHTML: attributes => {
          if (!attributes.user) return {};

          return {
            'data-user': attributes.user,
            title: `💬 ${attributes.user}`,
          };
        },
      },
      type: {
        default: '',
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => {
          if (!attributes.type) return {};

          return {
            'data-type': attributes.type,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-comment-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setComment:
        ({ commentId, user, type }: { commentId: string | number; user: string; type?: string }) =>
          ({ commands }: CommandProps) => {
            return commands.setMark('commentMark', {
              commentId: commentId.toString(),
              user,
              type: type || '',
            });
          },

      unsetComment:
        () =>
          ({ commands }: CommandProps) => {
            return commands.unsetMark('commentMark');
          },
    };
  },
});
