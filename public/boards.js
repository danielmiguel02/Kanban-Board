const API = "https://kanbanboard.fly.dev";

const name = document.getElementById("name");
const ownedBoards = document.getElementById("ownedBoards");
const sharedBoards = document.getElementById("sharedBoards");

const createBoardBtn = document.getElementById("createBoardBtn");
const saveBoardBtn = document.getElementById("saveBoardBtn");
const logoutBtn = document.getElementById("logoutBtn");

let modal;

/* =========================
   PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", async () => {

    modal = new bootstrap.Modal(
        document.getElementById("createBoardModal")
    );

    createBoardBtn.addEventListener("click", openCreateBoardModal);
    saveBoardBtn.addEventListener("click", createBoard);
    logoutBtn.addEventListener("click", logout);

    await getCurrentUser();
    await loadBoards();

});

/* =========================
   CURRENT USER
========================= */

async function getCurrentUser() {

    try {

        const response = await fetch(`${API}/auth/me`, {
            credentials: "include"
        });

        if (!response.ok) {
            window.location.href = "index.html";
            return;
        }

        const data = await response.json();

        name.textContent = data.user.name;

    } catch (error) {

        console.error(error);

    }

}

/* =========================
   LOAD BOARDS
========================= */

async function loadBoards() {

    try {

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

    } catch (error) {

        console.error(error);

    }

}

/* =========================
   OWNED BOARDS
========================= */

function renderOwnedBoards(boards) {

    ownedBoards.innerHTML = "";

    if (!boards || boards.length === 0) {
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

        const col = document.createElement("div");
        col.className = "col-lg-3 col-md-4 col-sm-6";

        const card = document.createElement("div");
        card.className = "board-card shadow-sm";
        card.style.background = board.color;

        card.innerHTML = `
            <span>${board.name}</span>
        `;

        card.addEventListener("click", () => openBoard(board.id));

        col.appendChild(card);
        ownedBoards.appendChild(col);
    });
}

/* =========================
   SHARED BOARDS
========================= */

function renderSharedBoards(boards) {

    sharedBoards.innerHTML = "";

    if (!boards || boards.length === 0) {
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

        const col = document.createElement("div");
        col.className = "col-lg-3 col-md-4 col-sm-6";

        const card = document.createElement("div");
        card.className = "board-card shadow-sm";
        card.style.background = member.board.color;

        card.innerHTML = `
            <span>${member.board.name}</span>
            <small>${member.board.owner.name}</small>
            <span class="badge bg-light text-dark mt-2">
                ${member.role}
            </span>
        `;

        card.addEventListener("click", () => openBoard(member.board.id));

        col.appendChild(card);
        sharedBoards.appendChild(col);
    });
}

/* =========================
   CREATE BOARD MODAL
========================= */

function openCreateBoardModal() {

    document.getElementById("boardName").value = "";
    document.getElementById("boardColor").value = "#0d6efd";

    modal.show();

}

/* =========================
   CREATE BOARD
========================= */

async function createBoard() {

    const body = {

        name: document.getElementById("boardName").value.trim(),
        color: document.getElementById("boardColor").value

    };

    if (!body.name) {

        alert("Board name is required.");
        return;

    }

    try {

        const response = await fetch(`${API}/boards`, {

            method: "POST",

            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(body)

        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);
            return;

        }

        modal.hide();

        await loadBoards();

    } catch (error) {

        console.error(error);

    }

}

/* =========================
   OPEN BOARD
========================= */

function openBoard(boardId) {
    window.location.href = `board.html?id=${boardId}`;
}

/* =========================
   LOGOUT
========================= */

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