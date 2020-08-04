const follow = function (userId) {
  sendReq(
    'POST',
    `/user/follow/${userId}`,
    ({ followed, followersCount }) => {
      document.getElementById(
        'followers'
      ).innerText = `${followersCount} followers`;
      if (followed) {
        document.getElementById('follow').value = 'unfollow';
        return;
      }
      document.getElementById('follow').value = 'follow';
    },
    null
  );
};
