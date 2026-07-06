const API = "https://kanbanboard.fly.dev";

const params = new URLSearchParams(window.location.search);
const boardId = params.get("id");

const boardName = document.getElementById("boardName");
const columnsContainer = document.getElementById("columnsContainer");

const addColumnBtn = document.getElementById("addColumnBtn");
const saveColumnBtn = document.getElementById("saveColumnBtn");
const columnNameInput = document.getElementById("columnNameInput");

const saveCardBtn = document.getElementById("saveCardBtn");
const cardTitleInput = document.getElementById("cardTitleInput");
const activeColumnIdInput = document.getElementById("activeColumnId");

const logoutBtn = document.getElementById("logoutBtn");

let addColumnModal;
let addCardModal;

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", async () => {

    addColumnModal = new bootstrap.Modal(document.getElementById("addColumnModal"));
    addCardModal = new bootstrap.Modal(document.getElementById("addCardModal"));

    addColumnBtn.addEventListener("click", () => addColumnModal.show());
    saveColumnBtn.addEventListener("click", createColumn);

    saveCardBtn.addEventListener("click", createCard);

    logoutBtn.addEventListener("click", logout);

    await loadBoard();
    await loadColumns();
});

/* =========================
   LOAD BOARD INFO
========================= */

async function loadBoard() {

    try {

        const res = await fetch(`${API}/boards/${boardId}`, {
            credentials: "include"
        });

        const data = await res.json();

        boardName.textContent = data.board.name;

    } catch (err) {
        console.error(err);
    }
}

/* =========================
   LOAD COLUMNS
========================= */

async function loadColumns() {

    try {

        const res = await fetch(`${API}/columns/${boardId}`, {
            credentials: "include"
        });

        const data = await res.json();

        renderColumns(data.columns);

    } catch (err) {
        console.error(err);
    }
}

/* =========================
   RENDER COLUMNS
========================= */

function renderColumns(columns) {

    columnsContainer.innerHTML = "";

    if (!columns || columns.length === 0) {
        columnsContainer.innerHTML = `
            <div class="text-muted">
                No columns yet. Create one.
            </div>
        `;
        return;
    }

    columns.forEach(column => {

        const columnEl = document.createElement("div");
        columnEl.className = "card shadow-sm p-2";
        columnEl.style.minWidth = "280px";

        columnEl.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <strong>${column.name}</strong>

                <button class="btn btn-sm btn-outline-primary">
                    + Card
                </button>
            </div>

            <div id="column-${column.id}" class="d-flex flex-column gap-2">
                <!-- cards go here -->
            </div>
        `;

        const addCardBtn = columnEl.querySelector("button");

        addCardBtn.addEventListener("click", () => {
            activeColumnIdInput.value = column.id;
            addCardModal.show();
        });

        columnsContainer.appendChild(columnEl);

        loadCards(column.id);
    });
}

/* =========================
   LOAD CARDS
========================= */

async function loadCards(columnId) {

    try {

        const res = await fetch(`${API}/cards/${columnId}`, {
            credentials: "include"
        });

        const data = await res.json();

        const container = document.getElementById(`column-${columnId}`);

        container.innerHTML = "";

        data.cards.forEach(card => {

            const cardEl = document.createElement("div");
            cardEl.className = "card p-2";

            cardEl.innerHTML = `
                ${card.title}
            `;

            container.appendChild(cardEl);
        });

    } catch (err) {
        console.error(err);
    }
}

/* =========================
   CREATE COLUMN
========================= */

async function createColumn() {

    const name = columnNameInput.value.trim();

    if (!name) return;

    try {

        await fetch(`${API}/columns/${boardId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name })
        });

        columnNameInput.value = "";
        addColumnModal.hide();

        await loadColumns();

    } catch (err) {
        console.error(err);
    }
}

/* =========================
   CREATE CARD
========================= */

async function createCard() {

    const title = cardTitleInput.value.trim();
    const columnId = activeColumnIdInput.value;

    if (!title || !columnId) return;

    try {

        await fetch(`${API}/cards/${columnId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        });

        cardTitleInput.value = "";
        addCardModal.hide();

        await loadCards(columnId);

    } catch (err) {
        console.error(err);
    }
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

    } catch (err) {
        console.error(err);
    }
}