"use strict";

const inputTitle = document.querySelector(".js-inputtitle");
const button = document.querySelector(".js-btn");
const listTvShow = document.querySelector(".js-list");
const favouriteList = document.querySelector(".js-favourite");
const imagePlaceholder =
  "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
let favourites = [];
let series = [];

//lista búsqueda derecha
function handlerButtonClick(event) {
  listTvShow.innerHTML = null;

  const searchValue = inputTitle.value;

  const url = `http://api.tvmaze.com/search/shows?q=${searchValue}`;
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
    //lista de resultados derecha Problemas para click en evento entonces click en elemento
    listTvShow.appendChild(
      newHtmlListNodeWithOnClick(titleShow, imageShow, idShow)
    );
  }
}

//función para mi local storage - tienda de camisetas
function handlerCardClick(title, img, id) {
  console.log(id);

  // busco el id en el array de favoritos >>> find me devuelve elem si no undefined
  // - Si está: lo saco
  // - Si no está: lo coloco.

  const foundId = favourites.find((favourite) => {
    if (favourite.id !== undefined) {
      return true;
    } else {
      return false;
    }
  });

  const showSelected = { title: title, img: img, id: id };
  //findIndex o find luego decidir si hago push o no
  favourites.push(showSelected);
  paintSeries();
  //local storage- ejecuto la función
  setInLocalStorage();
  buildFavouritesList();
}

//lista favoritos izquierda
function buildFavouritesList() {
  favouriteList.innerHTML = null;
  //recorro mi array con mis favoritos
  for (const favourite of favourites) {
    favouriteList.appendChild(newHtmlListNode(favourite.title, favourite.img));
  }
}

//Dom avanzado - proceso de crear el <li>
function newHtmlListNode(titleShow, imageShow, idShow) {
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

  const liItem = document.createElement("li");
  liItem.appendChild(divItem);

  return liItem;
}

function newHtmlListNodeWithOnClick(titleShow, imageShow, idShow) {
  let liItem = newHtmlListNode(titleShow, imageShow, idShow);
  liItem.onclick = function () {
    handlerCardClick(titleShow, imageShow, idShow);
  };
  return liItem;
}

//crear const local storage
const setInLocalStorage = () => {
  const stringifyfavourites = JSON.stringify(favourites);
  //setItem guardar datos de mi lista favoritos - tienda de camisetas
  localStorage.setItem("favourite", stringifyfavourites);
};

const getFromLocalStorage = () => {
  //getItem recuperar datos - tienda de camisetas
  const localStoragefavourites = localStorage.getItem("favourite");
  //diferente !==
  if (localStoragefavourites !== null) {
    favourites = JSON.parse(localStoragefavourites);
  }
};

button.addEventListener("click", handlerButtonClick);

getFromLocalStorage();
buildFavouritesList();
