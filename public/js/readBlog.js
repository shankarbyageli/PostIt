const disableEdit = () => {
  const editable_elements = document.querySelectorAll('[contenteditable=true]');
  editable_elements.forEach((el) => el.removeAttribute('contenteditable'));
  const icon_settings = document.querySelectorAll('.ce-toolbar__settings-btn');
  icon_settings.forEach((el) => el.remove());
  const blockElements = document.getElementById('editorjs');
  blockElements.style.pointerEvents = 'none';
};

const render = function (data) {
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
