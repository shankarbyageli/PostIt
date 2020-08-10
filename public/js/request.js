const renderPage = function (response) {
  document.open();
  document.write(response);
  document.close();
};

// eslint-disable-next-line
const onLoad = function (res, callback) {
  if (res.status === 200 || res.status === 302) {
    callback && callback(res.response);
  }
  if (res.status === 500) {
    renderPage(res.response);
  }
};

const sendReq = function (method, url, callback, content) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    onLoad(this, callback);
  };
  xhr.open(method, url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(content);
};

const sendPost = function (method, url, callback, content) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    onLoad(this, callback);
  };
  xhr.open(method, url);
  xhr.send(content);
};
