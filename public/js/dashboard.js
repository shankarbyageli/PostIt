const convertHtmlToNode = function (html) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.firstChild;
};

const generatePost = function (post) {
  const postInnerHtml = `<div class="container">
  <div class="post">
    <div class="title-text title">
      <a class="title-link link-text" href="/blog/${post.id}">${post.title}</a>
    </div>
    <div class="data">${JSON.parse(post.content).blocks[0].data.text}</div>
    <div class="user-details">
      <img class="author-profile profile" src=${post.avatarUrl}>
      <div class="details">
        <span class="author-name">
          <a class="link-text author_url" href="/profile/${post.userId}">
          ${post.displayName}
          </a>
        </span>
        <span class="date">${new Date(post.lastModified).toDateString()}</span>
      </div>
    </div>
  </div>
  <img class="cover-image-post" 
    src=/coverImage/${post.imagePath} alt="Cover image"/>
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
  let searchText = document.querySelector(
    '.search-container input[type=search]'
  ).value;
  searchText = searchText.replace('#', '%23');

  sendReq(
    'GET',
    `/user/search?searchText=${searchText}`,
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
