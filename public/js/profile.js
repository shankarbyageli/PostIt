const follow = function (userId) {
  sendReq(
    'POST',
    `/user/follow/${userId}`,
    ({ followed, followersCount }) => {
      document.getElementById(
        'followers'
      ).innerText = `${followersCount} followers`;
      if (followed) {
        document.getElementById('follow').innerText = 'Following';
      } else {
        document.getElementById('follow').innerText = 'Follow';
      }
      window.location.reload();
    },
    null
  );
};

const postHtml = function (post) {
  return `
  <div class="post">
    <div class="user-details">
      <img class="profile" src=${post.avatarUrl}/>
      <div class="details">
        <a class="author-name" href="/user/profile/${post.userId}">
          ${post.displayName}
        </a>
        <span class="date">${new Date(post.lastModified).toDateString()}</span>
      </div>
    </div>
    <div class="title title-text">
      <a class="link-text" href="/blog/${post.id}">${post.title}</a>
    </div>
    <div class="data">${JSON.parse(post.content).blocks[0].data.text}</div>
</div>`;
};

const renderResults = function (posts) {
  const container = document.querySelector('.all-posts');
  let html = '';
  posts.forEach((post) => {
    html += postHtml(post);
  });
  if (html) {
    container.innerHTML = html;
  } else {
    container.innerHTML = '<span class="message">No clapped posts yet</span>';
  }
};

const getClappedPosts = function (userId) {
  document.getElementById('posts').classList.remove('selected');
  document.getElementById('clapped').classList.add('selected');
  sendReq('GET', `/user/clappedPosts/${userId}`, renderResults, null);
};
