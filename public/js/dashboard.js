const renderPage = function (response) {
  document.open();
  document.write(response);
  document.close();
};
const getSearchResults = function () {
  let searchText = document.querySelector(
    '.search-container input[type=search]'
  ).value;
  searchText = searchText.replace('#', '%23');

  sendPost('GET', `/user/search?searchText=${searchText}`, renderPage, null);
};

const getSearchText = function (event) {
  if (event.keyCode === 13) {
    getSearchResults();
  }
};
