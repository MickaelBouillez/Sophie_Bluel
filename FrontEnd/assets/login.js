document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginform");

    ///////

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

            if (response.ok) {
                // get token
                const data = await response.json();
                const token = data.token;
                console.log("Token récupéré :", token);

                // set token to LS
                localStorage.setItem("token", token);

                // go to home page
                window.location.href = "index.html";
            } else {
                badLogin();
            }
        } catch (error) {
            console.error("Erreur", error);
            afficherMessageErreur(
                "Une erreur inattendue s'est produite. Veuillez réessayer."
            );
        }
    }

    function afficherMessageErreur() {
        const badLogin = document.querySelector(".bad_login");
        badLogin.style.display = "flex";
    }

    ///////

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const isLoggedIn = localStorage.getItem("token");
            if (isLoggedIn === "true") {
                alert("Vous êtes déja connecté");
            } else {
                await login();
            }
        });
    } else {
        console.error("Le formulaire de connexion n'a pas été trouvé dans le DOM.");
    }

    ///////
})