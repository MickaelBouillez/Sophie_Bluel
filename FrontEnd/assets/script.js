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


    // Récupère le bouton de connexion
    const loginButton = document.getElementById('loginButton');

    // Vérifier l'état de connexion au chargement de la page
    const isLoggedIn = localStorage.getItem('LogOk');

    if (isLoggedIn === 'true') {
        // Si l'utilisateur est connecté, masquer le formulaire de connexion
        document.querySelector('.login').style.display = 'none';
        // Mettre à jour le texte du bouton
        loginButton.textContent = 'Logout';
    }

    // Fetch avec la methode post ( JSON.stringify())
    const loginform = document.getElementById(".loginform");

    loginform.addEventListener("submit", async function (event) {
        event.preventDefault(); // Empêcher le rechargement de la page

        const isLoggedIn = localStorage.getItem('LogOk');

        if (isLoggedIn === 'true') {
            // Si l'utilisateur est connecté, effectuer la déconnexion
            logout();
        } else {
            // Si l'utilisateur n'est pas connecté, exécuter le processus de connexion existant
            await login();
        }
    });

    // Fonction pour gérer la connexion
    async function login() {
        const email = document.querySelector("#email");
        const password = document.querySelector("#password");

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    accept: "application/JSON",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                }),
            });

            if (!response.ok) {
                console.error("Erreur lors de la requête:", response.status, response.statusText);
                afficherMessageErreur("Une erreur inattendue s'est produite. Veuillez réessayer.");
                return;
            }

            const data = await response.json();
            let token = data.token;

            if (token) {
                console.log("Connexion ok");
                window.location.href = "index.html";
                localStorage.setItem('LogOk', 'true');
                localStorage.setItem('token', token); // Stocker le token
                // Mettre à jour le texte du bouton
                loginButton.textContent = 'Logout';
            } else {
                console.log("Non connecté");
                afficherMessageErreur("Erreur de connexion. Veuillez vérifier vos identifiants.");
            }
        } catch (error) {
            console.error("Erreur", error);
            afficherMessageErreur("Une erreur inattendue s'est produite. Veuillez réessayer.");
        }
    }

    document.querySelector('.login-button').addEventListener("click", logout);
    // Fonction pour gérer la déconnexion
    function logout() {
        // Supprimer l'état de connexion et le token du localStorage
        console.log('logout');
        localStorage.removeItem('LogOk');
        localStorage.removeItem('token');

        // Rafraîchir la page après la déconnexion (vous pouvez rediriger ailleurs si nécessaire)
        window.location.reload();
    }

    function afficherMessageErreur(message) {
        const badLogin = document.querySelector(".bad_login");
        badLogin.style.display = "flex";
        badLogin.textContent = message;
    }

    // Vérifier l'état de connexion au chargement de la page
    if (isLoggedIn !== 'true') {
        // Si l'utilisateur est connecté, masquer le mode edition
        document.querySelector('.edition').style.display = 'none';
        document.querySelector('.editproject').style.display = 'none';
    }
    console.log(isLoggedIn);

    //affichage modale
    const containerModals = document.querySelector(".containerModals")
    const edition = document.querySelector(".edition");

    edition.addEventListener("click", () => {
        console.log("edition");
        containerModals.style.display = "flex";
    })
})
