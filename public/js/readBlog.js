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

const renderClap = function (clappedDetails) {
  const { clapped, clapsCount } = JSON.parse(clappedDetails);
  document.getElementById('clapCount').innerText = `${clapsCount} Claps`;
  if (clapped) {
    document.getElementById('clap').src = '/images/clapBlack.svg';
    return;
  }
  document.getElementById('clap').src = '/images/clapWhite.svg';
};

const clapOnPost = function (postId) {
  sendReq('POST', `/user/clap/${postId}`, renderClap, null);
};

const searchTag = function (event) {
  const searchTag = event.target.innerText;
  const url = `/user/search?searchText=%23${searchTag}`;
  sendPost('GET', url, renderPage, null);
};
