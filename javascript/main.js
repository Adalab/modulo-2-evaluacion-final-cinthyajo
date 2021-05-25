"use strict";

const inputTitle = document.querySelector(".js-inputtitle");
const button = document.querySelector(".js-btn");
const listTvShow = document.querySelector(".js-list");
const favouriteList = document.querySelector(".js-favourite");
const eraseBtn = document.querySelector(".js-eraseallbtn");
const imagePlaceholder =
  "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
let favourites = [];
let series = [];

function handlerButtonClick(event) {
  listTvShow.innerHTML = null;
  const searchValue = inputTitle.value;
  const url = `//api.tvmaze.com/search/shows?q=${searchValue}`;
  console.log(url);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      series = data;
      paintSeries();
    });
}

function paintSeries() {
  listTvShow.innerHTML = "";
  for (let index = 0; index < series.length; index++) {
    let titleShow = series[index].show.name;
    let idShow = series[index].show.id;
    let imageShow = null;
    if (series[index].show.image != null) {
      imageShow = series[index].show.image.medium;
    } else {
      imageShow = imagePlaceholder;
    }

    listTvShow.appendChild(
      newHtmlListNodeWithOnClick(titleShow, imageShow, idShow, false)
    );
  }
}

function handlerCardClick(title, img, id) {
  console.log(id);
  const foundIndex = favourites.findIndex((favourite) => {
    if (favourite.id === id) {
      return true;
    } else {
      return false;
    }
  });

  if (foundIndex === -1) {
    const showSelected = { title: title, img: img, id: id };
    favourites.push(showSelected);
  } else {
    favourites.splice(foundIndex, 1);
  }
  paintSeries();
  setInLocalStorage();
  buildFavouritesList();
}

function buildFavouritesList() {
  favouriteList.innerHTML = null;
  for (const favourite of favourites) {
    favouriteList.appendChild(
      newHtmlListNode(favourite.title, favourite.img, favourite.id, true)
    );
  }
}

function newHtmlListNode(titleShow, imageShow, idShow, paintRemoveButton) {
  console.log(titleShow, imageShow, idShow, paintRemoveButton);
  const divItem = document.createElement("div");

  const foundFav = favourites.find((favourite) => {
    if (favourite.id === idShow) {
      return true;
    } else {
      return false;
    }
  });

  if (foundFav !== undefined) {
    divItem.classList.add("favorite");
  }

  const imageItem = document.createElement("img");
  imageItem.src = imageShow;
  imageItem.id = "js-img";

  const h3Item = document.createElement("h3");
  const h3Content = document.createTextNode(titleShow);
  h3Item.appendChild(h3Content);
  h3Item.id = "js-showTitle";

  divItem.appendChild(imageItem);
  divItem.appendChild(h3Item);

  if (paintRemoveButton === true) {
    const buttonItem = document.createElement("button");
    const buttonContent = document.createTextNode("Borrar este favorito");
    buttonItem.appendChild(buttonContent);
    buttonItem.onclick = function () {
      handlerCardClick(titleShow, imageShow, idShow);
    };
    divItem.appendChild(buttonItem);
  }

  const liItem = document.createElement("li");
  liItem.appendChild(divItem);
  return liItem;
}

function newHtmlListNodeWithOnClick(
  titleShow,
  imageShow,
  idShow,
  paintRemoveButton
) {
  let liItem = newHtmlListNode(titleShow, imageShow, idShow, paintRemoveButton);
  liItem.onclick = function () {
    handlerCardClick(titleShow, imageShow, idShow);
  };
  return liItem;
}

function handlerEraseBtnClick(event) {
  let removed = favourites.splice(0);
  buildFavouritesList();
  paintSeries();
  setInLocalStorage();
}

const setInLocalStorage = () => {
  const stringifyfavourites = JSON.stringify(favourites);
  localStorage.setItem("favourite", stringifyfavourites);
};

const getFromLocalStorage = () => {
  const localStoragefavourites = localStorage.getItem("favourite");
  if (localStoragefavourites !== null) {
    favourites = JSON.parse(localStoragefavourites);
  }
};

button.addEventListener("click", handlerButtonClick);
eraseBtn.addEventListener("click", handlerEraseBtnClick);

getFromLocalStorage();
buildFavouritesList();
