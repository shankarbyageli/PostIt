const publishComment = async function (blogId) {
  const newComment = document.getElementById('new-comment').innerText;
  if (newComment.trim()) {
    await fetch('/user/publishComment', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        comment: newComment,
        blogId,
      }),
    }).then((data) => {
      if (data.status == 200) {
        window.location.href = `/seeAllComments/${blogId}`;
      }
    });
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
