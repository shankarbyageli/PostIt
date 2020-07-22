let editor = new EditorJS({
  holderId: 'editorjs',
  autofocus: true,
  tools: {
    header: {
      class: Header,
      config: {
        placeholder: 'Enter a header',
        levels: [1, 2, 3, 4, 5, 6],
        defaultLevel: 1,
      },
      shortcut: 'CMD+SHIFT+H',
      inlineToolbar: ['link'],
    },
    Lists: {
      class: List,
      inlineToolbar: true,
    },
  },
});

let saveBtn = document.querySelector('button');

saveBtn.addEventListener('click', function () {
  editor.save().then((outputData) => {
    console.log(outputData);
  });
});

window.onload;
