const convertHtmlToNode = function (html) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.firstChild;
};

const generatePost = function (post) {
  const postInnerHtml = `<div class="post">
    <div class="title-text">
      <a class="title" href="/blog/${post.id}">${post.title}</a>
    </div>
    <div class="data">${JSON.parse(post.content).blocks[0].data.text}</div>
    <div class="user-details">
      <img class="author-profile" src=${post.avatarUrl}>
      <div class="details">
        <span class="author-name">
          <a class="author_url" href="/profile/${post.userId}">
          ${post.username}
          </a>
        </span>
        <span class="date">${new Date(post.lastModified).toDateString()}</span>
      </div>
    </div>
  </div>`;
  return convertHtmlToNode(postInnerHtml);
};

const renderSearchResults = function ({ posts }) {
  const allPosts = document.querySelector('.all-posts');
  allPosts.innerHTML = null;
  const children = [];
  for (const post in posts) {
    children.push(generatePost(posts[post]));
  }
  children.forEach((postDiv) => {
    allPosts.appendChild(postDiv);
  });
};

const getSearchResults = function () {
  const searchText = document.querySelector('.search-box input[type=text]')
    .value;
  const filter = document.querySelector('.filter select').value;
  sendReq(
    'GET',
    `/user/search?filter=${filter}&searchText=${searchText}`,
    renderSearchResults,
    null
  );
};

const getSearchText = function (event) {
  if (event.keyCode !== 13) {
    return;
  }
  return getSearchResults();
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
