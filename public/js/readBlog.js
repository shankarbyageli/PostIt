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

const renderPage = function ({ posts }) {
  const allPost = document.createElement('div');
  allPost.classList.add('all-posts');
  document.getElementById('post').parentNode.removeChild(post);
  document.body.appendChild(allPost);
  renderSearchResults({ posts });
};

const searchTag = function (event) {
  const searchTag = event.target.innerText;
  const url = `/user/search?searchText=%23${searchTag}`;
  sendReq('GET', url, renderPage, null);
};
