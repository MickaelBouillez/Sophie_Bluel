document.addEventListener("DOMContentLoaded", function () {
    const worksGallery = document.querySelector(".gallery");
    const listFilter = document.querySelector(".filters");

    // Fonction pour filtrer les images par catégorie
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

    // Récupère les œuvres depuis l'API
    fetch('http://localhost:5678/api/works')
        .then(response => {
            if (!response.ok) {
                throw new Error('La réponse du réseau n\'était pas correcte. Code de statut : ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Parcourt chaque œuvre dans les données récupérées
            data.forEach(item => {
                // Crée un conteneur pour chaque œuvre
                const workContainer = document.createElement('div');
                workContainer.classList.add('work-item');
                workContainer.dataset.categoryName = item.category.name;

                // Crée une balise img pour afficher l'image
                const workImage = document.createElement('img');
                workImage.src = item.imageUrl;
                workImage.alt = item.title;

                // Crée un titre pour l'œuvre
                const workTitle = document.createElement('div');
                workTitle.classList.add('work-title');
                workTitle.textContent = item.title;

                // Ajoute l'image et le titre au conteneur
                workContainer.appendChild(workImage);
                workContainer.appendChild(workTitle);

                // Ajoute le conteneur à la galerie
                worksGallery.appendChild(workContainer);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données :', error);
        });

    // Récupère les catégories depuis l'API
    fetch('http://localhost:5678/api/categories')
        .then(response => {
            if (!response.ok) {
                throw new Error('La réponse du réseau n\'était pas correcte. Code de statut : ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Ajout du bouton "Tous" avec un gestionnaire d'événements
            const allFilterButton = document.createElement('button');
            allFilterButton.classList.add('filter-item', 'all-button');
            const allFilterName = document.createElement('span');
            allFilterName.classList.add('filter-name');
            allFilterName.textContent = 'Tous';

            allFilterButton.appendChild(allFilterName);
            listFilter.prepend(allFilterButton);  // Utilisez prepend pour placer le bouton "Tous" en premier

            allFilterButton.addEventListener('click', () => {
                filterImagesByCategory('all');
            });

            // Parcourt chaque catégorie dans les données récupérées
            data.forEach(item => {
                // Crée un bouton de filtre
                const filterButton = document.createElement('button');
                filterButton.classList.add('filter-item');

                // Crée un span pour le texte du bouton
                const filterName = document.createElement('span');
                filterName.classList.add('filter-name');
                filterName.textContent = item.name;

                // Ajoute le texte au bouton
                filterButton.appendChild(filterName);
                // Ajoute le bouton à la liste de filtres
                listFilter.appendChild(filterButton);

                // Ajoute un gestionnaire d'événements pour détecter les clics sur le bouton de filtre
                filterButton.addEventListener('click', () => {
                    // Récupère le nom de la catégorie associée au bouton de filtre cliqué
                    const selectedCategoryName = item.name;
                    // Appelle la fonction de filtrage avec le nom de la catégorie
                    filterImagesByCategory(selectedCategoryName);
                });
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des catégories:', error);
        });
});




