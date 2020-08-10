const getSearchResults = function () {
  let searchText = document.querySelector(
    '.search-container input[type=search]'
  ).value;
  searchText = searchText.replace('#', '%23');

  sendPost(
    'GET',
    `/user/search?searchText=${searchText}`,
    (response) => {
      document.open();
      document.write(response);
      document.close();
    },
    null
  );
};

const getSearchText = function (event) {
  if (event.keyCode !== 13) {
    return;
  }
  return getSearchResults();
};
