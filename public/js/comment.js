const publishComment = async function (blogId) {
  const newComment = document.getElementById('new-comment').innerText;
  if (newComment.trim()) {
    const commentDetails = JSON.stringify({
      comment: newComment,
      blogId,
    });
    sendReq(
      'POST',
      '/user/publishComment',
      () => {
        window.location.href = `/comments/${blogId}`;
      },
      commentDetails
    );
  }
};

const isAbleToPublish = function () {
  const newComment = document.getElementById('new-comment').innerText;
  const publishBtn = document.querySelector('#publish');
  if (newComment.trim()) {
    publishBtn.setAttribute(
      'style',
      'background-color: #03a87c;cursor: pointer;'
    );
    return;
  }
  publishBtn.setAttribute('style', 'background-color: #c5cac9');
};
