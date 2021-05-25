"use strict";

const inputTitle = document.querySelector(".js-inputtitle");
const button = document.querySelector(".js-btn");
const listTvShow = document.querySelector(".js-list");
const favouriteList = document.querySelector(".js-favourite");
const inputRadioBtn = document.querySelector(".js-radiobtn");
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
    //lista de resultados derecha Problemas para click en evento entonces onclick en elemento
    listTvShow.appendChild(
      newHtmlListNodeWithOnClick(titleShow, imageShow, idShow, false)
    );
  }
}

//función para mi local storage - tienda de camisetas
function handlerCardClick(title, img, id) {
  console.log(id);

  // busco el id en el array de favoritos >>> find me devuelve elem si no undefined
  // - Si está: lo saco
  // - Si no está: lo coloco.

  const foundIndex = favourites.findIndex((favourite) => {
    if (favourite.id === id) {
      return true;
    } else {
      return false;
    }
  });

  if (foundIndex === -1) {
    // no está en favoritos, lo meto
    const showSelected = { title: title, img: img, id: id };
    //findIndex o find luego decidir si hago push o no
    favourites.push(showSelected);
  } else {
    // sí está en favoritos
    console.log("ya está en fav", foundIndex);
    favourites.splice(foundIndex, 1);
  }

  //findIndex o find luego decidir si hago push o no

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
    favouriteList.appendChild(
      newHtmlListNode(favourite.title, favourite.img, favourite.id, true)
    );

    //de mi array de favoritos elimina todos los elem. comenzando en index 0
    //let removed = favourites.splice(0);
  }
}

//Dom avanzado - proceso de crear el <li>
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

//función para radio button. getElementsByName: regresa todos los rb del grupo?.
/*function getCheckedRadio() {
    let radioButtons = document.getElementsByName("???");
    const radioBtnValue = inputRadioBtn.value;
      for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
          alert("You checked" + radioButtons[i].//name or id);
        }
      }
    }*/

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
