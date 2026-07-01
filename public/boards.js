const API = "https://kanbanboard.fly.dev";

const username = document.getElementById("username");

const ownedBoards = document.getElementById("ownedBoards");

const sharedBoards = document.getElementById("sharedBoards");

document
    .getElementById("logoutBtn")
    .addEventListener("click", logout);

document.addEventListener("DOMContentLoaded", async () => {

    await getCurrentUser();

    await loadBoards();

});

/* =========================
   CURRENT USER
========================= */

async function getCurrentUser() {

    const response = await fetch(`${API}/auth/me`, {
        credentials: "include"
    });

    if (!response.ok) {

        window.location.href = "index.html";
        return;

    }

    const data = await response.json();

    username.textContent = data.user.name;

}

/* =========================
   LOAD BOARDS
========================= */

async function loadBoards() {

    const response = await fetch(`${API}/boards`, {

        credentials: "include"

    });

    if (!response.ok) {

        alert("Unable to load boards.");

        return;

    }

    const data = await response.json();

    renderOwnedBoards(data.ownedBoards);

    renderSharedBoards(data.sharedBoards);

}

/* =========================
   OWNED BOARDS
========================= */

function renderOwnedBoards(boards) {

    ownedBoards.innerHTML = "";

    if (boards.length === 0) {

        ownedBoards.innerHTML = `
            <div class="col-12">

                <div class="alert alert-secondary">

                    You don't have any boards yet.

                </div>

            </div>
        `;

        return;

    }

    boards.forEach(board => {

        ownedBoards.innerHTML += `

        <div class="col-md-4">

            <div
                class="card shadow-sm board-card"
                data-id="${board.id}">

                <div class="card-body">

                    <h5>

                        ${board.name}

                    </h5>

                </div>

            </div>

        </div>

        `;

    });

}

/* =========================
   SHARED BOARDS
========================= */

function renderSharedBoards(boards) {

    sharedBoards.innerHTML = "";

    if (boards.length === 0) {

        sharedBoards.innerHTML = `
            <div class="col-12">

                <div class="alert alert-secondary">

                    No shared boards.

                </div>

            </div>
        `;

        return;

    }

    boards.forEach(member => {

        sharedBoards.innerHTML += `

        <div class="col-md-4">

            <div
                class="card shadow-sm">

                <div class="card-body">

                    <h5>

                        ${member.board.name}

                    </h5>

                    <small class="text-muted">

                        Owner:
                        ${member.board.owner.name}

                    </small>

                    <br>

                    <span class="badge bg-primary mt-2">

                        ${member.role}

                    </span>

                </div>

            </div>

        </div>

        `;

    });

}

/* =========================
   LOGOUT
========================= */

async function logout() {

    await fetch(`${API}/auth/logout`, {

        method: "POST",

        credentials: "include"

    });

    window.location.href = "index.html";

}