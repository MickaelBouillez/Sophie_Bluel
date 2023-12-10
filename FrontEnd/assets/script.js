document.addEventListener("DOMContentLoaded", function () { //Permet de charger le DOM avant l'execution du script//
    const worksGallery = document.querySelector(".gallery"); //Sélectionne l'élément avec la classe "gallery"

    fetch('http://localhost:5678/api/works') //Effectue une requête vers l'API pour récupérer les données
        .then(response => {
            if (!response.ok) { // Vérifie si la réponse est OK, sinon génère une erreur
                throw new Error('La réponse du réseau n\'était pas correcte. Code de statut : ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Maintenant, 'data' contient la réponse du serveur
            console.log(data);

            // Creation du lieu de reception des données
            data.forEach(item => {
                // Créez un conteneur pour chaque élément
                const workContainer = document.createElement('div');
                workContainer.classList.add('work-item');

                // Créez une image pour chaque élément
                const workImage = document.createElement('img');
                workImage.src = item.imageUrl; ///!\ propriété imageURL obligatoire
                workImage.alt = item.title;

                // Créez un titre pour chaque élément
                const workTitle = document.createElement('div');
                workTitle.classList.add('work-title');
                workTitle.textContent = item.title; ///!\ propriété title obligatoire

                // Ajoutez l'image et le titre au conteneur
                workContainer.appendChild(workImage);
                workContainer.appendChild(workTitle);

                // Ajoutez le conteneur à la galerie
                worksGallery.appendChild(workContainer);
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données :', error); // En cas d'erreur, affiche un message dans la console
        });
});


