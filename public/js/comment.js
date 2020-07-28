const publishComment = async function (blogId) {
  const newComment = document.getElementById('new-comment').innerText;
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
};
