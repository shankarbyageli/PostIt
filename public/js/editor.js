let editor = new EditorJS({
  holderId: 'editorjs',
  tools: {
    paragraph: {
      class: Paragraph,
      config: {
        placeholder: 'Enter the post details ',
      },
    },
    Lists: {
      class: List,
      inlineToolbar: true,
    },
  },
});
