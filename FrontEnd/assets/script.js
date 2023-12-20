document.addEventListener("DOMContentLoaded", function () {
    const worksGallery = document.querySelector(".gallery");
    const listFilter = document.querySelector(".filters");

    function filterImagesByCategory(categoryName) {
        const allWorkItems = document.querySelectorAll('.work-item');

        allWorkItems.forEach(workItem => {
            const workItemCategoryName = workItem.dataset.categoryName;

            if (categoryName === "all" || workItemCategoryName === categoryName) {
                workItem.style.display = "block";
            } else {
                workItem.style.display = "none";
            }
        });
    }

    function fetchWorks() {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const workContainer = document.createElement('div');
                    workContainer.classList.add('work-item');
                    workContainer.dataset.categoryName = item.category.name;

                    const workImage = document.createElement('img');
                    workImage.src = item.imageUrl;
                    workImage.alt = item.title;

                    const workTitle = document.createElement('div');
                    workTitle.classList.add('work-title');
                    workTitle.textContent = item.title;

                    workContainer.appendChild(workImage);
                    workContainer.appendChild(workTitle);

                    worksGallery.appendChild(workContainer);
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données :', error);
            });
    }

    function fetchCategories() {
        fetch('http://localhost:5678/api/categories')
            .then(response => response.json())
            .then(data => {
                const allFilterButton = document.createElement('button');
                allFilterButton.classList.add('filter-item', 'all-button');
                const allFilterName = document.createElement('span');
                allFilterName.classList.add('filter-name');
                allFilterName.textContent = 'Tous';

                allFilterButton.appendChild(allFilterName);
                listFilter.prepend(allFilterButton);

                allFilterButton.addEventListener('click', () => {
                    filterImagesByCategory('all');
                });

                data.forEach(item => {
                    const filterButton = document.createElement('button');
                    filterButton.classList.add('filter-item');

                    const filterName = document.createElement('span');
                    filterName.classList.add('filter-name');
                    filterName.textContent = item.name;

                    filterButton.appendChild(filterName);
                    listFilter.appendChild(filterButton);

                    filterButton.addEventListener('click', () => {
                        filterImagesByCategory(item.name);
                    });
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des catégories:', error);
            });
    }

    fetchWorks();
    fetchCategories();

    //fonctionnement login

    // Récupere le formaulaire du HTML qqaund il est envoyé
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");

    //AddEvenT... quand il est envoyé
    const connexion = document.querySelector(".login");

    // Récupère les infos mail et password
    let badLogin = document.querySelector(".bad_login");

    // Fetch avec la methode post ( JSON.stringify())
    connexion.addEventListener("submit", function (e) {
        e.preventDefault();

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                accept: "application/JSON",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                let token = data.token;

                if (token) {
                    console.log("Connexion ok");
                    window.location.href = "index.html";
                } else {
                    console.log("Non connecté");
                    afficherMessageErreur("Erreur de connexion. Veuillez vérifier vos identifiants.");
                }
            })
            .catch((error) => {
                console.error("Erreur", error);
                afficherMessageErreur("Une erreur inattendue s'est produite. Veuillez réessayer.");
            });
    });

    function afficherMessageErreur(message) {
        badLogin.style.display = "flex";
        badLogin.textContent = message;
    }
})
//////////////////////////////////////////////mode édition

/* Fonction pour générer le mode édition
function genererEdit() {
    editorMode.style.display = "none";
    modal.style.display = "none";
    if (token) {
        LogIn.style.display = "none";
        editorMode.style.display = "flex";
        divCategory.style.display = "none";
        Modifier.style.display = "flex";
        console.log("Mode éditeur");
    } else {
        LogOut.style.display = "none";
    }
}
genererEdit();

// Gestion de la déconnexion
LogOut.addEventListener("click", function disconnect() {
    console.log("Déconnecté avec succès");
    LogIn.style.display = "block";
    LogOut.style.display = "none";
    editorMode.style.display = "none";
    divCategory.style.display = "flex";
    Modifier.style.display = "none";
    localStorage.clear();
    window.location.reload();
});

// Génération du contenu de la modale pour les œuvres
function genererModalWorks(works) {
    const galleryModal = document.querySelector(".galleryModal");
    galleryModal.innerHTML = "";

    if (token) {
        for (const modalWork of works) {
            const modalContainer = document.createElement("figure");
            modalContainer.classList.add("imgWidth");

            // Création de la div d'image
            const divImgAdd = document.createElement("div");
            divImgAdd.classList.add("div_img_add");

            // Création de l'image
            const modalImg = document.createElement("img");
            modalImg.src = modalWork.imageUrl;

            // Création du titre d'édition
            const modalImgTitle = document.createElement("figcaption");
            modalImgTitle.innerText = "éditer";
            modalImgTitle.classList.add("editText");

            // Création du bouton de suppression
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("poubelle");
            deleteButton.innerHTML = '<i class="fa-regular fa-trash-can modal_trash-icon"></i>';

            // Suppression d'une œuvre
            deleteButton.addEventListener("click", (e) => {
                e.preventDefault();
                console.log(modalWork.id);
                let request = {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                fetch("http://localhost:5678/api/works/" + modalWork.id, request)
                    .then((response) => {
                        if (response.ok) {
                            console.log("Suppression réussie");
                            init();
                        } else {
                            console.log("Échec de la suppression");
                        }
                    })
                    .catch((error) => {
                        console.error("Échec", error);
                    });
            });
        }
    }
}

// Ouvrir la modale
edit_button.addEventListener("click", function openModal() {
    // Affiche la modale d'édition et masque la modale d'ajout
    modal.style.display = "flex";
    modal_edit.style.display = "flex";
    modal_add.style.display = "none";
    console.log(token);
    // Variable non utilisée - à revoir si nécessaire
    edit_button = true;
});

// Fermer la modale
const closeModalButtons = document.querySelectorAll('.close_Modal button');

closeModalButtons.forEach(button => {
    button.addEventListener('click', function () {
        modal.style.display = 'none';
        information.style.display = 'none';
        console.log("Fermeture");
        // Réinitialisez l'état de la modale si nécessaire
        edit_button = false;
    });
});

// Retour en arrière
return_back.addEventListener("click", function returnBack() {
    modal_edit.style.display = "none";
    modal_add.style.display = "none"; // Ajoutez cette ligne pour masquer la modale d'ajout également
    information.style.display = "none";
    resetForm();
});

// Ajout de photo
add_picture.addEventListener("click", function addPicture() {
    // Masque la modale d'édition et affiche la modale d'ajout
    modal_edit.style.display = "none";
    modal_add.style.display = "flex";
    // Initialise le formulaire d'ajout
    addModal();
});
*/

