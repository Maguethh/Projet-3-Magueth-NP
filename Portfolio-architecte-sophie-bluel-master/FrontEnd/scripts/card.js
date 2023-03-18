const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();

function genererCards(projets) {
  for (let i = 0; i < projets.length; i++) {
    const card = projets[i];

    const sectionCard = document.querySelector(".gallery");

    const cardContainer = document.createElement("article");

    const imageCard = document.createElement("img");
    imageCard.id = "carte-" + card.id;
    imageCard.src = card.imageUrl;

    const descriptionCard = document.createElement("p");
    descriptionCard.innerText = card.title;

    sectionCard.appendChild(cardContainer);

    cardContainer.appendChild(imageCard);
    cardContainer.appendChild(descriptionCard);
  }
}

function genererCardsModale(projets) {
  for (let i = 0; i < projets.length; i++) {
    const card = projets[i];

    const sectionCard = document.querySelector(".modalecontent");

    const cardContainer = document.createElement("article");

    const imageCard = document.createElement("img");
    imageCard.id = "modale-carte-" + card.id;
    imageCard.src = card.imageUrl;
    imageCard.className = "modaleimage";

    sectionCard.appendChild(cardContainer);

    cardContainer.appendChild(imageCard);
  }
}

const modalePage1 = document.getElementById("gallery");
const modalePage2 = document.getElementById("project_creation_form");
const boutonPage1 = document.getElementById("modale1btn");
const boutonPage2 = document.querySelector(".ajouter-image");
const modaleGrayFilter = document.getElementById("modalefilter1");

modaleGrayFilter.addEventListener("click", function () {
  (document.getElementById("modale").style.display = "none"),
    (document.getElementById("gallery").style.display = "block"),
    (document.getElementById("project_creation_form").style.display = "none"),
    (boutonPage1.style.display = "block"),
    (modaleGrayFilter.style.display = "none");
});

boutonPage2.addEventListener("click", function () {
  modalePage1.style.display = "none";
  modalePage2.style.display = "block";
  boutonPage1.style.display = "none";
  document.getElementById("photo_uploading").style.display = "block";
  document.getElementById("modale_backward").style.display = "block";
  document.getElementById("page2modale").style.display = "block";
});

genererCards(projets);

const filtreTous = document.querySelector(".btn-tous");
filtreTous.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Affichage de tout les projets");
  document.querySelector(".gallery").innerHTML = "";
  genererCards(projets);
});

const filtreObjet = document.querySelector(".btn-objet");
filtreObjet.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Affichage du filtre (Objets)");
  fetch("http://localhost:5678/api/categories", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const cardFiltrees = projets.filter(function (card) {
    return card.categoryId == 1;
  });
  document.querySelector(".gallery").innerHTML = "";
  genererCards(cardFiltrees);
});

const filtreAppartement = document.querySelector(".btn-appartement");
filtreAppartement.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Affichage du filtre (Appartements)");
  fetch("http://localhost:5678/api/categories", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const cardFiltrees = projets.filter(function (card) {
    return card.categoryId == 2;
  });
  document.querySelector(".gallery").innerHTML = "";
  genererCards(cardFiltrees);
});

const filtreHotelRestaurant = document.querySelector(".btn-hotel-restaurant");
filtreHotelRestaurant.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Affichage du filtre (Hotel & Restaurants)");
  fetch("http://localhost:5678/api/categories", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const cardFiltrees = projets.filter(function (card) {
    return card.categoryId == 3;
  });
  document.querySelector(".gallery").innerHTML = "";
  genererCards(cardFiltrees);
});

/* MODALE */

var selectedImageId = 0;
const boutonModale = document.querySelector(".modifier");
boutonModale.addEventListener("click", function () {
  modaleGrayFilter.style.display = "block";
  // si le contenu de la modale n'a pas encore été intialisé,
  // initialisation
  if (document.querySelectorAll(".modalecontent article").length == 0) {
    // affichage des images
    genererCardsModale(projets);
    // click sur le close
    document
      .getElementById("closemodale")
      .addEventListener("click", function (event) {
        (document.getElementById("modale").style.display = "none"),
          (document.getElementById("gallery").style.display = "block"),
          (document.getElementById("project_creation_form").style.display =
            "none"),
          (boutonPage1.style.display = "block"),
          (modaleGrayFilter.style.display = "none");
      });

    let images = document.querySelectorAll(".modaleimage").forEach((elt) => {
      elt.addEventListener("click", (event) => {
        document.querySelectorAll(".modaleimage.selected").forEach((elt) => {
          elt.classList.remove("selected");
        });
        event.target.classList.add("selected");
        selectedImageId = event.target.id.replace("modale-carte-", "");
        console.log("selected Id : " + selectedImageId);
      });
    });

    const modaleSupprimer = document.querySelector(".supprimer-image");
    modaleSupprimer.addEventListener("click", function (event) {
      event.preventDefault();
      if (selectedImageId == 0) return;
      let elementToRemove = document.getElementById(
        "modale-carte-" + selectedImageId
      );
      elementToRemove.parentNode.parentNode.removeChild(
        elementToRemove.parentNode
      );

      elementToRemove = document.getElementById("carte-" + selectedImageId);
      const parentElement = elementToRemove.parentElement;
      parentElement.parentNode.removeChild(parentElement);
      console.log("deleted article : " + selectedImageId);

      fetch("http://localhost:5678/api/works/" + selectedImageId, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem("token"),
        },
      });
    });
  }
  document.getElementById("modale").style.display = "block";
  document.getElementById("modale_backward").style.display = "none";
});

document
  .getElementById("modale_backward")
  .addEventListener("click", function () {
    document.getElementById("page2modale").style.display = "none";
    document.getElementById("gallery").style.display = "block";
    document.getElementById("modale1btn").style.display = "block";
  });

document
  .getElementById("photo_upload_button")
  .addEventListener("click", function () {
    document.getElementById("photo").click();
  });

document
  .getElementById("project_creation_submit")
  .addEventListener("click", function (event) {
    event.preventDefault();
    let data = new FormData();
    data.append("title", document.getElementById("title").value);
    data.append("category", document.getElementById("category").value);
    data.append("image", document.getElementById("photo").files[0]);
    let url = "http://localhost:5678/api/works";
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const sectionCard = document.querySelector(".gallery");

        const cardContainer = document.createElement("article");

        const imageCard = document.createElement("img");
        imageCard.id = "carte-" + data.id;
        imageCard.src = data.imageUrl;

        const descriptionCard = document.createElement("p");
        descriptionCard.innerText = data.title;

        sectionCard.appendChild(cardContainer);

        cardContainer.appendChild(imageCard);
        cardContainer.appendChild(descriptionCard);
      })
      .catch((error) => {
        console.log(error);
      });
    document.getElementById("modale").style.display = "none";
    document.getElementById("modalefilter1").style.display = "none";
    genererCards();
    genererCardsModale();
    genererCards(cardFiltrees);
  });

if (window.localStorage.getItem("token")) {
  document.querySelector(".modifier").style.display = "flex";
  (document.getElementById("loginbutton").innerText = "logout"),
    (document.getElementById("modaletop").style.display = "flex");
}

document.getElementById("loginbutton").addEventListener("click", function () {
  if (localStorage.getItem("token") != null) {
    localStorage.removeItem("token");
    document.getElementById("loginbutton").innerText = "login";
  }
});
