"use strict";

const inputTitle = document.querySelector(".js-inputtitle");
const button = document.querySelector(".js-btn");
const listTvShow = document.querySelector(".js-list");
const favouriteList = document.querySelector(".js-favourite");
const imagePlaceholder =
  "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
let favourites = [];

//lista búsqueda derecha
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
        //lista de resultados derecham Problemas para click en evento entonces click en elemento
        listTvShow.appendChild(
          newHtmlListNodeWithOnClick(titleShow, imageShow)
        );
      }
    });
}

//función para mi local storage - tienda de camisetas
function handlerCardClick(title, img) {
  const showSelected = { title: title, img: img };
  //findIndex o find luego decidir si hago push o no
  favourites.push(showSelected);
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

//bonus: borrar favoritos: splice?

button.addEventListener("click", handlerButtonClick);

getFromLocalStorage();
buildFavouritesList();
