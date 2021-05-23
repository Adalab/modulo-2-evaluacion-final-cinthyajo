"use strict";

const inputTitle = document.querySelector(".js-inputtitle");
const button = document.querySelector(".js-btn");
const listTvShow = document.querySelector(".js-list");
const favouriteList = document.querySelector(".js-favourite");
const imagePlaceholder =
  "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
let favourites = [];

function handlerButtonClick(event) {
  listTvShow.innerHTML = null;

  const searchValue = inputTitle.value;

  const url = `http://api.tvmaze.com/search/shows?q=${searchValue}`;
  console.log(url);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for (let index = 0; index < data.length; index++) {
        let titleShow = data[index].show.name;
        let imageShow = null;
        if (data[index].show.image != null) {
          imageShow = data[index].show.image.medium;
        } else {
          imageShow = imagePlaceholder;
        }
        listTvShow.appendChild(
          newHtmlListNodeWithOnClick(titleShow, imageShow)
        );
      }
    });
}

function handlerCardClick(title, img) {
  const showSelected = { title: title, img: img };
  favourites.push(showSelected);
  setInLocalStorage();
  buildFavouritesLilst();
}

function buildFavouritesLilst() {
  favouriteList.innerHTML = null;
  for (const favourite of favourites) {
    favouriteList.appendChild(newHtmlListNode(favourite.title, favourite.img));
  }
}

function newHtmlListNode(titleShow, imageShow) {
  const divItem = document.createElement("div");

  const imageItem = document.createElement("img");
  imageItem.src = imageShow;
  imageItem.id = "js-img";

  const h3Item = document.createElement("h3");
  const h3Content = document.createTextNode(titleShow);
  h3Item.appendChild(h3Content);
  h3Item.id = "js-showTitle";

  divItem.appendChild(imageItem);
  divItem.appendChild(h3Item);

  const liItem = document.createElement("li");
  liItem.appendChild(divItem);

  return liItem;
}

function newHtmlListNodeWithOnClick(titleShow, imageShow) {
  let liItem = newHtmlListNode(titleShow, imageShow);
  liItem.onclick = function () {
    handlerCardClick(titleShow, imageShow);
  };
  return liItem;
}

button.addEventListener("click", handlerButtonClick);
