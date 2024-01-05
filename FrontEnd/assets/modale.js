document.addEventListener("DOMContentLoaded", function () {

    const photoModal = document.querySelector(".modalphoto");

    ///////

    async function displayPhotoModal() {

        photoModal.innerHTML = ""

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

                const span = document.createElement("span")
                const trash = document.createElement("i")
                trash.classList.add("fa-solid", "fa-trash")
                trash.id = item.id

                span.appendChild(trash)
                workPhoto.appendChild(span)
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

        trashAll.forEach(trash => {
            trash.addEventListener("click", (e) => {
                const id = trash.id;
                const init = {
                    methode: "DELETE",
                    Headers: { "content-Type": "application/json" },

                }
                fetch("http://localhost:5678/api/works/" + id, init)
                    .then((response) => {
                        if (!response.ok) {
                            console.log("Le delete a rencontré une erreur")
                        }
                        return response.json()
                    })
                    .then((data) => {
                        console.log("Le delete à réussi! Vopici la data :", data)
                        displayPhotoModal();
                        fetchWorks();
                    })
            })
        });
    }
    ///////

    displayPhotoModal();

})