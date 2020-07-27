const isAbleToPublish = function () {
  const title = document.getElementById('title').innerText;
  const publishBtn = document.querySelector('#publish');
  if (title.trim() === '') {
    publishBtn.setAttribute('style', 'background-color: #c5cac9');
    return;
  }
  publishBtn.setAttribute('style', 'background-color: #03a87c;cursor: pointer');
};

const getPostContent = async function (editor) {
  const title = document.getElementById('title').innerText;
  if (title.trim() === '') return;
  editor.save().then((content) => {
    const data = JSON.stringify({ content, title });
    sendReq('POST', '/user/publish', () => (window.location.href = '/'), data);
  });
};

const getEditorOptions = function () {
  return {
    holderId: 'editorjs',
    tools: {
      paragraph: {
        class: Paragraph,
        config: { placeholder: 'Lets write ! ', inlineToolbar: true },
      },
      Lists: { class: List, inlineToolbar: true },
    },
  };
};

const addListeners = function () {
  let editor = new EditorJS(getEditorOptions());
  const publishBtn = document.getElementById('publish');
  publishBtn.addEventListener('click', getPostContent.bind(null, editor));
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

window.onload = addListeners;
