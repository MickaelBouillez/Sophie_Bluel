document.addEventListener("DOMContentLoaded", function () {
    const worksGallery = document.querySelector(".gallery");
    const listFilter = document.querySelector(".filters");
    const isLoggedIn = localStorage.getItem("token");
    const loginButton = document.getElementById("loginButton");
    const containerModals = document.querySelector(".containerModals");
    const edition = document.querySelector(".edition");
    const edition2 = document.querySelector(".editbutton");
    const xmark = document.querySelector(".containerModals .fa-xmark");
    const addPhotoBtn = document.querySelector(".addPhotoBtn")
    const containerModalsAdd = document.querySelector(".containerModalsAdd")
    const backArrow = document.querySelector(".modalAdd .fa-arrow-left")
    const xmark2 = document.querySelector(".modalAdd .fa-xmark")

    ///////

    function filterImagesByCategory(categoryName) {
        const allWorkItems = document.querySelectorAll(".work-item");

        allWorkItems.forEach((workItem) => {
            const workItemCategoryName = workItem.dataset.categoryName;

            if (
                categoryName === "all" ||
                workItemCategoryName === categoryName
            ) {
                workItem.style.display = "block";
            } else {
                workItem.style.display = "none";
            }
        });
    }

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

    function fetchCategories() {
        fetch("http://localhost:5678/api/categories")
            .then((response) => response.json())
            .then((data) => {
                const allFilterButton = document.createElement("button");
                allFilterButton.classList.add("filter-item", "all-button");
                const allFilterName = document.createElement("span");
                allFilterName.classList.add("filter-name");
                allFilterName.textContent = "Tous";

                allFilterButton.appendChild(allFilterName);
                listFilter.prepend(allFilterButton);

                allFilterButton.addEventListener("click", () => {
                    filterImagesByCategory("all");
                });

                data.forEach((item) => {
                    const filterButton = document.createElement("button");
                    filterButton.classList.add("filter-item");

                    const filterName = document.createElement("span");
                    filterName.classList.add("filter-name");
                    filterName.textContent = item.name;

                    filterButton.appendChild(filterName);
                    listFilter.appendChild(filterButton);

                    filterButton.addEventListener("click", () => {
                        filterImagesByCategory(item.name);
                    });
                });
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de la récupération des catégories:",
                    error
                );
            });
    }

    function setLoginLogout() {
        if (isLoggedIn) {
            loginButton.textContent = "Logout";
            loginButton.removeAttribute("href");
            loginButton.addEventListener("click", () => {
                console.log("CLICK CLICK");
                localStorage.removeItem("token");
                location.reload();
            });
        } else {
            document.querySelector(".edition").style.display = "none";
            document.querySelector(".editbutton").style.display = "none";
        }
    }

    ///////

    edition.addEventListener("click", () => {
        containerModals.style.display = "flex";
    });

    edition2.addEventListener("click", () => {
        containerModals.style.display = "flex";
    });

    xmark.addEventListener("click", () => {
        console.log(xmark)
        containerModals.style.display = "none";
    });

    containerModals.addEventListener("click", (e) => {
        if (e.target.className === "containerModals") {
            containerModals.style.display = "none";
        }
    });

    addPhotoBtn.addEventListener("click", () => {
        containerModalsAdd.style.display = "flex";
    });

    backArrow.addEventListener("click", () => {
        containerModalsAdd.style.display = "none";
    });

    xmark2.addEventListener("click", () => {
        containerModalsAdd.style.display = "none";
        containerModals.style.display = "none";
    });


    ///////

    fetchWorks();
    fetchCategories();
    setLoginLogout();
});
