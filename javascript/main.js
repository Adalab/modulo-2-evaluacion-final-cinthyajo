"use strict";
//variable de string
const imagePlaceholder =
  "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
const inputTitle = document.querySelector(".js-inputtitle");
const button = document.querySelector(".js-btn");
const listTvShow = document.querySelector(".js-list");
const favouriteList = document.querySelector(".js-favourite");

function handlerButtonClick(event) {
  //Para construir la URL de búsqueda hay que recoger el texto que ha introducido la usuaria en el campo de búsqueda
  const searchValue = inputTitle.value;
  //esta es mi url de búsqueda con el valor que busco searchValue. Construir la URL búsqueda...
  const url = `http://api.tvmaze.com/search/shows?q=${searchValue}`;
  console.log(url);
  //aquí ya le paso toda la url creada
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      //recorrido toda la lista de resultados de la búsqueda. Fetch me devuelve el resultado de la búsqueda.
      for (let index = 0; index < data.length; index++) {
        /*console.log(data[index]);*/
        let titleShow = data[index].show.name;
        let imageShow = null;
        if (data[index].show.image != null) {
          imageShow = data[index].show.image.medium;
        } else {
          imageShow = imagePlaceholder;
        }
        /*console.log(titleShow + " " + imageShow);*/

        listTvShow.innerHTML += `<li onclick="handlerCardClick(this)">
            <div > 
            <img src="${imageShow}" alt="" id="js-img" />
            <h3 id="js-showTitle">${titleShow}</h3>
            </div>
        </li>`;
      }
      /*const card = document.querySelector(".js-cardShow");
      card.addEventListener("click", handlerCardClick);*/
    });
}
//element.show.name / element.show.image.medium
//estoy recibiendo todo el list item. element es el li
function handlerCardClick(element) {
  /*con el children 0 porque pueden haber más cosas dentro del div
  console.log(element.children[0]);*/
  const newItem = document.createElement("li");
  newItem.appendChild(element.children[0]);
  favouriteList.appendChild(newItem);
}

button.addEventListener("click", handlerButtonClick);
