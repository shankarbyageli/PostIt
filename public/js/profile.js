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

const commentHtml = function (comment) {
  return `
  <div class="post">
    <div class="user-details">
       <img class="profile" src=${comment.avatarUrl} />
      <div class="details">
        <a class="author-name" href="/user/profile/${comment.userId}">
          ${comment.displayName}
        </a>
        <span class="date">
          ${new Date(comment.commentedAt).toDateString()}
        </span>
      </div>
    </div>
    <div class="title post comment-title">
      <a class="link-text" href="/blog/${comment.id}">${comment.title}</a>
    </div>
    <div class="data">${comment.comment}</div>
</div>`;
};

const renderComments = function (comments) {
  const container = document.querySelector('.all-posts');
  let html = '';
  comments.forEach((comment) => {
    html += commentHtml(comment);
  });
  if (html) {
    container.innerHTML = html;
  } else {
    container.innerHTML = '<span class="message">No comments yet</span>';
  }
};

const getComments = function (userId) {
  document.querySelector('.selected').classList.remove('selected');
  document.getElementById('comments').classList.add('selected');
  sendReq('GET', `/user/profile/${userId}/comments`, renderComments, null);
};

const selectMenu = function (selectedMenu) {
  selectedMenu.classList.add('selected');
};
