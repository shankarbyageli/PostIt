const removeTag = function (event) {
  event.target.parentElement.remove();
};

const addTag = function (event) {
  const tagElement = document.getElementById('tag');
  const tag = tagElement.value.trim();
  const allTags = document.getElementById('added-tags');
  if (tag && event.keyCode == 13 && allTags.childElementCount < 4) {
    const newTag = ` <span class="added-tag">
              <img src="./images/close.svg" alt="" class="close" onclick="removeTag(event)" />
           <span class="tag-text"> ${tag} </span>
          </span>`;
    allTags.innerHTML += newTag;
    tagElement.value = '';
  }
};
