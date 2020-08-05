const removeTag = function (event) {
  event.target.parentElement.remove();
};

const hidePreview = function () {
  const preview = document.getElementById('preview');
  preview.classList.remove('display-preview');
  preview.classList.add('hide-preview');
  const container = document.getElementById('container');
  container.style.display = '';
};

const showPreview = function () {
  const preview = document.getElementById('preview');
  preview.classList.remove('hide-preview');
  preview.classList.add('display-preview');
  const container = document.getElementById('container');
  container.style.display = 'none';
  document.getElementById('preview-title').innerText = document.getElementById(
    'title'
  ).innerText;
};

const addNewTag = function (tag) {
  const tagDiv = document.createElement('div');
  tagDiv.innerHTML = `<span class="tag-text"> ${tag} </span>
    <span class="cross-button" onclick="removeTag(event)"> x </span>`;
  tagDiv.classList.add('added-tag');
  const lastTag = document.querySelector('#tag div:last-of-type');
  if (lastTag) {
    lastTag.after(tagDiv);
  } else {
    document.querySelector('#tag').prepend(tagDiv);
  }
};

const addTag = function (event) {
  const tagElement = document.getElementById('tag-input');
  const tag = tagElement.value.trim();
  if (tag && event.keyCode === 13) {
    event.preventDefault();
    addNewTag(tag);
    tagElement.scrollIntoView();
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
    document.getElementById('preview-error').innerText = '';
    reader.readAsDataURL(file);
  }
};

const getPostContent = function (editor) {
  const title = document.getElementById('title').innerText;
  return new Promise((resolve) => {
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

const autoSaveCallback = function (res) {
  const postId = document.getElementsByClassName('post')[0].id;
  if (+postId === -1) {
    document.getElementsByClassName('post')[0].id = res.id;
  }
  document.getElementById('status').innerText = 'Saved';
};

const getTags = function () {
  const tags = document.getElementById('tag').childNodes;
  return Array.from(tags)
    .slice(0, -1)
    .map((tag) => tag.firstChild.innerText);
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

const displayPreviewError = function () {
  document.getElementById('preview-error').innerText =
    'Please add cover image !';
};

const getFormData = function (data, tags) {
  const form = new FormData(document.getElementById('preview-form'));
  form.append('tags', JSON.stringify(tags));
  form.append('data', JSON.stringify(data));
  return form;
};

const publishPost = async function (editor) {
  event.preventDefault();
  if (document.getElementById('file').files.length === 0) {
    return displayPreviewError();
  }
  const data = await getPostContent(editor);
  const tags = getTags();
  const form = getFormData(data, tags);
  const postId = document.getElementsByClassName('post')[0].id;
  sendPost(
    'POST',
    `/user/publish/${postId}`,
    () => {
      window.location.href = `/blog/${postId}`;
    },
    form
  );
};

const previewPost = async function (editor) {
  const title = document.getElementById('title').innerText;
  if (title.trim() === '') {
    document.getElementById('error').innerText = 'Please add some title !';
    return;
  }
  const data = await getPostContent(editor);
  if (data.content.blocks.length) {
    showPreview();
  } else {
    document.getElementById('error').innerText = 'Please add some content !';
  }
};

const addAutoSaveListener = function (editor) {
  let editorTimeout = null;
  Array.from(document.getElementsByClassName('content')).forEach((element) => {
    element.addEventListener('keydown', () => {
      document.getElementById('error').innerText = '';
      document.getElementById('status').innerText = '';
      clearTimeout(editorTimeout);
      editorTimeout = setTimeout(async () => {
        document.getElementById('status').innerText = 'Saving...';
        const data = await getPostContent(editor);
        const postId = document.getElementsByClassName('post')[0].id;
        sendReq(
          'POST',
          `/user/autosave/${postId || -1}`,
          autoSaveCallback,
          JSON.stringify(data)
        );
      }, 1000);
    });
  });
};

const addListeners = function (id, data) {
  const editor = new EditorJS(getEditorOptions(data));
  addAutoSaveListener(editor);
  document.getElementById('preview-publish').onclick = publishPost.bind(
    null,
    editor
  );
  document.getElementById('publish').onclick = previewPost.bind(null, editor);
};
