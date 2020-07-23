let editor = new EditorJS({
  holderId: 'editorjs',
  autofocus: true,
  tools: {
    paragraph: {
      class: Paragraph,
      config: {
        placeholder: 'Lets write ! ',
        inlineToolbar: true,
      },
    },
    Lists: {
      class: List,
      inlineToolbar: true,
    },
  },
});

const getPostContent = function () {
  const title = document.getElementById('title').innerText;
  const data = { title };
  editor.save().then((outputData) => {
    data.content = outputData;
    sendReq('POST', '/publish', () => {}, JSON.stringify(data));
  });
};

const addListeners = function () {
  const saveBtn = document.getElementById('publish');
  saveBtn.addEventListener('click', getPostContent);
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
