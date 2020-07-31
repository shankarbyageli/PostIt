const removeTag = function (event) {
  event.target.parentElement.remove();
};

const hidePreview = function () {
  const preview = document.getElementById('preview');
  preview.classList.remove('display-preview');
  preview.classList.add('hide-preview');
  const container = document.getElementById('container');
  container.style.filter = 'none';
};

const addTag = function (event) {
  const tagElement = document.getElementById('tag');
  const tag = tagElement.value.trim();
  const allTags = document.getElementById('added-tags');
  if (tag && event.keyCode === 13 && allTags.childElementCount < 4) {
    event.preventDefault();
    const newTag = ` <span class="added-tag">
              <img 
                src="./images/close.svg" 
                alt="" class="close" 
                onclick="removeTag(event)" 
              />
           <span class="tag-text"> ${tag} </span>
          </span>`;
    allTags.innerHTML += newTag;
    tagElement.value = '';
  }
};

const renderImage = function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  const container = document.getElementById('cover-image');
  reader.onload = () => {
    container.style.content = `url(${reader.result})`;
  };
  if (file) {
    reader.readAsDataURL(file);
  }
};

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
    data,
  };
};

const modifyPublishBtn = function (id) {
  const publishBtn = document.querySelector('.action-button');
  if (id === -1) {
    publishBtn.style.background = '#c5cac9';
    publishBtn.disabled = true;
  } else {
    publishBtn.disabled = false;
  }
};

const callback = function (res) {
  const postId = document.getElementsByClassName('post')[0].id;
  if (+postId === -1) {
    document.getElementsByClassName('post')[0].id = res.id;
  }
  document.querySelector('.action-button').disabled = false;
  document.getElementById('status').innerText = 'Saved';
};

const getTags = function () {
  const tags = document.getElementsByClassName('added-tag');
  return Array.from(tags).map((tag) => tag.innerText);
};

const sendPost = function (method, url, callback, content) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.status === 200 || this.status === 302) {
      callback && callback(this.response);
    }
  };
  xhr.open(method, url);
  xhr.send(content);
};

const publishPost = async function (editor) {
  event.preventDefault();
  const data = await getPostContent(editor);
  const tags = getTags();
  const form = new FormData(document.getElementById('preview-form'));
  form.append('tags', JSON.stringify(tags));
  form.append('data', JSON.stringify(data));
  const postId = document.getElementsByClassName('post')[0].id;
  if (data.content.blocks.length) {
    sendPost(
      'POST',
      `/user/publish/${postId}`,
      function () {
        window.location.href = `/blog/${postId}`;
      },
      form
    );
  } else {
    window.alert('Please add some content !');
  }
};

const addPreview = function () {
  const preview = document.getElementById('preview');
  preview.classList.remove('hide-preview');
  preview.classList.add('display-preview');
  const container = document.getElementById('container');
  container.style.filter = 'blur(5px)';
  document.getElementById('preview-title').innerText = document.getElementById(
    'title'
  ).innerText;
};

const addListeners = function (id, data) {
  const editor = new EditorJS(getEditorOptions(data));
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

  document.getElementById('preview-publish').onclick = publishPost.bind(
    null,
    editor
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
