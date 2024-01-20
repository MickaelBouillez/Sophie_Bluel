document.addEventListener("DOMContentLoaded", function () {
    const photoModal = document.querySelector(".modalphoto");
    const uploadImageInput = document.querySelector("#imageUpload");
    const projectUpload = document.querySelector("#previewImage");
    const uploadContent = document.querySelector("#previewdetails");
    const ajoutForm = document.querySelector("#ajout-form");
    const titreAjoutInput = document.querySelector("#titreAjout");
    const selectCategorie = document.querySelector("#selectCategorie");
    const validerBtn = document.querySelector(".modalAddBtn");
    const textFieldsError = document.querySelector("#textFieldsError");

    ///////

    async function displayPhotoModal() {
        photoModal.innerHTML = "";

        try {
            const response = await fetch("http://localhost:5678/api/works");

            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut : ${response.status}`);
            }

            const data = await response.json();

            data.forEach((item) => {
                const workPhoto = document.createElement("div");
                workPhoto.classList.add("work-item");
                workPhoto.dataset.categoryName = item.category.name;

                const workImg = document.createElement("img");
                workImg.src = item.imageUrl;

                const span = document.createElement("span");
                const trash = document.createElement("i");
                trash.classList.add("fa-solid", "fa-trash");
                trash.id = item.id;

                span.appendChild(trash);
                workPhoto.appendChild(span);
                workPhoto.appendChild(workImg);
                photoModal.appendChild(workPhoto);
            });
            deleteWork();
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }
    }

    function deleteWork() {
        const trashAll = document.querySelectorAll(".fa-trash");

        trashAll.forEach((trash) => {
            trash.addEventListener("click", (e) => {
                const id = trash.id;
                const token = localStorage.getItem("token");
                const init = {
                    method: "DELETE",
                    headers: {
                        "content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };
                fetch("http://localhost:5678/api/works/" + id, init)
                    .then((response) => {
                        if (!response.ok) {
                            console.log("Le delete a rencontré une erreur");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("Le delete à réussi! Voici la data :", data);
                        displayPhotoModal();
                        fetchWorks();
                    });
            });
        });
    }

    async function sendWorkData(data) {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("Erreur : Token manquant.");
                // Rediriger l'utilisateur vers la page de connexion ou afficher un message d'erreur
                return;
            }

            const postWorkUrl = "http://localhost:5678/api/works";
            const response = await fetch(postWorkUrl, {
                method: "POST",
                headers: {
                    accept: "application/JSON",
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut : ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error("Erreur lors de la requête POST :", error);
            throw error;
        }
    }

    async function uploadFormSubmit(event) {
        event.preventDefault();

        const title = titreAjoutInput.value;
        const category = selectCategorie.value;
        const file = uploadImageInput.files[0];

        if (!title || !category || !file || category === "1") {
            displayGroupError(
                "textFieldsError",
                "Merci de renseigner tous les champs\net/ou\nd'ajouter une photo"
            );
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", category);
            formData.append("image", file);

            console.log("FormData:", formData);

            const response = await sendWorkData(formData);
            console.log("API Response:", response);

            ajoutForm.reset();

            const alert = document.getElementById("alert");
            alert.innerHTML = "Votre photo a été ajoutée avec succès";
            alert.style.display = "block";
            setTimeout(function () {
                alert.style.display = "none";
            }, 5000);
        } catch (error) {
            console.error("Erreur lors de l'envoi des données à l'API :", error);
        }
    }

    function uploadImage() {
        if (uploadImageInput.files && uploadImageInput.files[0]) {
            const reader = new FileReader();
            const image = new Image();
            const fileName = uploadImageInput.files[0].name;

            reader.onload = (event) => {
                image.src = event.target.result;
                image.alt = fileName.split(".")[0];
            };

            uploadContent.style.display = "none";
            projectUpload.style.display = "block";
            reader.readAsDataURL(uploadImageInput.files[0]);
            projectUpload.appendChild(image);
        }
    }

    function displayGroupError(groupName, errorMessage) {
        const groupErrorElement = document.getElementById(groupName);
        groupErrorElement.textContent = errorMessage;
        groupErrorElement.style.display = "block";
    }

    function updateSubmitButton() {
        const isValid = isFormValid();

        if (isValid) {
            validerBtn.classList.add("green-btn");
            textFieldsError.textContent = ""; // Effacer le message d'erreur
        } else {
            validerBtn.classList.remove("green-btn");
        }
    }

    function isFormValid() {
        const titreValue = titreAjoutInput.value;
        const categorieValue = selectCategorie.value;
        const file = uploadImageInput.files[0];

        const isValid = titreValue && categorieValue && file && categorieValue !== "1";
        console.log("Is Form Valid:", isValid);

        return isValid;
    }

    uploadImageInput.addEventListener("change", () => {
        uploadImage();
        updateSubmitButton();
    });

    ajoutForm.addEventListener("submit", (event) => {
        if (!isFormValid()) {
            event.preventDefault();
            textFieldsError.textContent =
                "Merci de renseigner tous les champs et/ou d'ajouter une photo.";
        }
    });
    ajoutForm.addEventListener("submit", uploadFormSubmit);

    ///////
    ///////
    ///////

    const worksGallery = document.querySelector(".gallery");

    async function fetchWorks() {
        try {
            const response = await fetch("http://localhost:5678/api/works");

            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut : ${response.status}`);
            }

            const data = await response.json();

            data.forEach((item) => {
                const workContainer = document.createElement("div");
                workContainer.classList.add("work-item");
                workContainer.dataset.categoryName = item.category.name;

                const workImage = document.createElement("img");
                workImage.src = item.imageUrl;
                workImage.alt = item.title;

                const workTitle = document.createElement("div");
                workTitle.classList.add("work-title");
                workTitle.textContent = item.title;

                workContainer.appendChild(workImage);
                workContainer.appendChild(workTitle);

                worksGallery.appendChild(workContainer);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }
    }

    ///////
    ///////
    ///////
    ///////

    displayPhotoModal();
});
