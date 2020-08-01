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

const clapOnPost = function (postId) {
  sendReq(
    'POST',
    `/user/clap/${postId}`,
    ({ clapped, clapsCount }) => {
      document.getElementById('clapCount').innerText = `${clapsCount} Claps`;
      if (clapped) {
        document.getElementById('clap').src = '/images/clapBlack.svg';
        return;
      }
      document.getElementById('clap').src = '/images/clapWhite.svg';
    },
    null
  );
};

const sendReq = function (method, url, callback, content) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.status === 200 || this.status === 302) {
      callback && callback(this.response);
    }
  };
  xhr.responseType = 'json';
  xhr.open(method, url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(content);
};
