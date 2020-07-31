const disableEdit = () => {
  const editableElements = document.querySelectorAll('[contenteditable=true]');
  editableElements.forEach((el) => el.removeAttribute('contenteditable'));
  const iconSettings = document.querySelectorAll('.ce-toolbar__settings-btn');
  iconSettings.forEach((el) => el.remove());
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
