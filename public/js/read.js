const disableEdit = () => {
  let editable_elements = document.querySelectorAll('[contenteditable=true]');
  editable_elements.forEach((el) => el.removeAttribute('contenteditable'));
  let icon_settings = document.querySelectorAll('.ce-toolbar__settings-btn');
  icon_settings.forEach((el) => el.remove());
  let blockElements = document.getElementById('editorjs'); // id of editor element
  blockElements.style.pointerEvents = 'none';
};

const renderPage = function (data) {
  new EditorJS({
    holderId: 'editorjs',
    data,
    tools: {
      paragraph: { class: Paragraph },
      Lists: { class: List },
    },
    onReady: disableEdit,
  });
};
