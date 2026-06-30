const API = "https://kanbanboard.fly.dev";

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const message = document.getElementById("message");

// =========================
// PAGE LOAD
// =========================

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();

    loginForm.addEventListener("submit", loginUser);
    registerForm.addEventListener("submit", registerUser);

    loginTab.addEventListener("click", showLogin);
    registerTab.addEventListener("click", showRegister);
});

// =========================
// AUTH CHECK
// =========================

async function checkAuth() {

    try {

        const response = await fetch(`${API}/auth/me`, {
            credentials: "include"
        });

        if (response.ok) {
            window.location.href = "boards.html";
        }

    } catch (error) {
        console.error(error);
    }

}

// =========================
// REGISTER
// =========================

async function registerUser(e) {

    e.preventDefault();

    clearMessage();

    const body = {

        username: document.getElementById("registerUsername").value.trim(),
        email: document.getElementById("registerEmail").value.trim(),
        password: document.getElementById("registerPassword").value

    };

    try {

        const response = await fetch(`${API}/auth/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify(body)

        });

        const data = await response.json();

        if (!response.ok) {
            return showMessage(data.message, "danger");
        }

        showMessage("Registration successful! You can now login.", "success");

        registerForm.reset();

        setTimeout(() => {
            showLogin();
        }, 1200);

    } catch (error) {

        showMessage(error.message, "danger");

    }

}

// =========================
// LOGIN
// =========================

async function loginUser(e) {

    e.preventDefault();

    clearMessage();

    const body = {

        email: document.getElementById("loginEmail").value.trim(),
        password: document.getElementById("loginPassword").value

    };

    try {

        const response = await fetch(`${API}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify(body)

        });

        const data = await response.json();

        if (!response.ok) {
            return showMessage(data.message, "danger");
        }

        showMessage("Login successful!", "success");

        setTimeout(() => {
            window.location.href = "boards.html";
        }, 500);

    } catch (error) {

        showMessage(error.message, "danger");

    }

}

// =========================
// LOGOUT
// =========================

async function logout() {

    try {

        await fetch(`${API}/auth/logout`, {

            method: "POST",

            credentials: "include"

        });

        window.location.href = "index.html";

    } catch (error) {

        console.error(error);

    }

}

// =========================
// UI
// =========================

function showLogin() {

    loginForm.classList.remove("d-none");
    registerForm.classList.add("d-none");

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    clearMessage();

}

function showRegister() {

    registerForm.classList.remove("d-none");
    loginForm.classList.add("d-none");

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    clearMessage();

}

function showMessage(text, type) {

    message.innerHTML = `
        <div class="alert alert-${type}">
            ${text}
        </div>
    `;

}

function clearMessage() {

    message.innerHTML = "";

}