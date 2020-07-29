const isAbleToPublish = function () {
  const title = document.getElementById('title').innerText;
  const publishBtn = document.querySelector('#publish');
  if (title.trim() === '') {
    publishBtn.setAttribute(
      'style',
      'background-color: #c5cac9;cursor: default;'
    );
    return;
  }
  publishBtn.setAttribute('style', 'background-color: #03a87c;cursor: pointer');
};

const getPostContent = function (editor) {
  const title = document.getElementById('title').innerText;
  return new Promise((resolve, reject) => {
    editor.save().then((content) => {
      resolve({ content, title });
    });
  });
};

const getEditorOptions = function (data) {
  return {
    holderId: 'editorjs',
    tools: {
      paragraph: {
        class: Paragraph,
        config: { placeholder: 'Lets write ! ', inlineToolbar: true },
      },
      Lists: { class: List, inlineToolbar: true },
    },
    data
  };
};

const modifyPublishBtn = function (id) {
  const publishBtn = document.querySelector('.action-button');
  console.log("id", id);
  if (id == -1) {
    publishBtn.style.background = "#c5cac9";
    publishBtn.disabled = true;
  } else {
    publishBtn.disabled = false;
  }
};

const callback = function (res) {
  const postId = document.getElementsByClassName('post')[0].id;
  if (postId == -1) {
    document.getElementsByClassName('post')[0].id = res.id;
  }
  document.querySelector('.action-button').disabled = false;
  document.getElementById('status').innerText = 'Saved';
};

const addListeners = function (id, data) {
  let editor = new EditorJS(getEditorOptions(data));
  modifyPublishBtn(id);

  let editorTimeout = null;
  Array.from(document.getElementsByClassName('content')).forEach((element) => {
    element.addEventListener('keydown', () => {
      document.getElementById('status').innerText = '';
      clearTimeout(editorTimeout);
      editorTimeout = setTimeout(async () => {
        document.getElementById('status').innerText = 'Saving...';
        const data = await getPostContent(editor);
        const postId = document.getElementsByClassName('post')[0].id;
        sendReq(
          'POST',
          `/user/autosave/${postId || -1}`,
          callback,
          JSON.stringify(data)
        );
      }, 1000);
    });
  });

  const publishBtn = document.getElementById('publish');
  publishBtn.addEventListener('click', async () => {
    const data = await getPostContent(editor);
    const postId = document.getElementsByClassName('post')[0].id;
    sendReq(
      'POST',
      `/user/publish/${postId}`,
      () => (window.location.href = '/'),
      JSON.stringify(data)
    );
  });
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
