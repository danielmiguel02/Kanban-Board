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

const editBoardBtn = document.getElementById("editBoardBtn");

const editBoardNameInput = document.getElementById("editBoardName");
const editBoardColorInput = document.getElementById("editBoardColor");

const saveBoardChangesBtn = document.getElementById("saveBoardChangesBtn");

let editBoardModal;

let currentBoard = null;

let currentUser;

/* =========================
   DRAG STATE
========================= */

let draggedCard = null;
let draggedColumn = null;

/* =========================
   THEMES
========================= */

const THEMES = {

    "#2563eb": {

        background:"#dbeafe",

        column:"#bfdbfe",

        card:"#ffffff",

        text:"#1e293b"

    },

    "#374151": {

        background:"#2d333b",

        column:"#3b4453",

        card:"#596275",

        text:"#ffffff"

    },

    "#7c3aed": {

        background:"#ede9fe",

        column:"#ddd6fe",

        card:"#ffffff",

        text:"#2e1065"

    },

    "#991b1b": {

        background:"#fee2e2",

        column:"#fecaca",

        card:"#ffffff",

        text:"#7f1d1d"

    },

    "#f4f6fb": {

        background:"#f4f6fb",

        column:"#ffffff",

        card:"#ffffff",

        text:"#111827"

    }

};

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", async () => {

    addColumnModal = new bootstrap.Modal(document.getElementById("addColumnModal"));
    addCardModal = new bootstrap.Modal(document.getElementById("addCardModal"));
    editBoardModal = new bootstrap.Modal(document.getElementById("editBoardModal"));

    addColumnBtn.addEventListener("click", () => addColumnModal.show());
    saveColumnBtn.addEventListener("click", createColumn);
    saveCardBtn.addEventListener("click", createCard);
    logoutBtn.addEventListener("click", logout);

    editBoardBtn.addEventListener("click", openEditBoardModal);
    saveBoardChangesBtn.addEventListener("click", saveBoardChanges);

    await loadCurrentUser();

    await loadBoard();
    await loadColumns();
});

/* =========================
   LOAD CURRENT USER
========================= */

async function loadCurrentUser(){

    const res = await fetch(
        `${API}/auth/me`,
        {
            credentials:"include"
        }
    );

    const data = await res.json();

    currentUser = data.user;

}

/* =========================
   LOAD BOARD
========================= */

async function loadBoard() {

    const res = await fetch(`${API}/boards/${boardId}`, {
        credentials: "include"
    });

    const data = await res.json();
    currentBoard = data.board;

    if (currentBoard.owner.id === currentUser.id) {
        editBoardBtn.classList.remove("d-none");
    }

    boardName.textContent = currentBoard.name;

    applyTheme(currentBoard.themePicker);
}

/* =========================
   LOAD COLUMNS
========================= */

async function loadColumns() {

    const res = await fetch(`${API}/columns/${boardId}`, {
        credentials: "include"
    });

    const data = await res.json();

    await renderColumns(data.columns);
}

/* =========================
   RENDER COLUMNS
========================= */

async function renderColumns(columns) {

    columnsContainer.innerHTML = "";

    if (!columns || columns.length === 0) {
        columnsContainer.innerHTML = `<div class="text-muted">No columns yet</div>`;
        return;
    }

    columns.forEach(column => {

        const columnEl = document.createElement("div");
        columnEl.className = "kanban-column";
        columnEl.dataset.id = column.id;

        columnEl.innerHTML = `
            <div class="column-header" draggable="true">

                <strong>${column.name}</strong>

                <button class="btn btn-sm btn-outline-primary add-card-btn">
                    + Add Card
                </button>

            </div>

            <div class="kanban-card-list" id="column-${column.id}"></div>
        `;

        const header = columnEl.querySelector(".column-header");

        /* =========================
           COLUMN DRAG (HEADER ONLY)
        ========================= */

        header.addEventListener("dragstart", () => {

            draggedColumn = columnEl;
            columnEl.classList.add("dragging");

        });

        header.addEventListener("dragend", async () => {

            columnEl.classList.remove("dragging");
            draggedColumn = null;

            await updateColumnPositions();

        });

        /* =========================
           COLUMN DROP
        ========================= */

        columnEl.addEventListener("dragover", e => {

            if (!draggedColumn) return;

            e.preventDefault();

        });

        columnEl.addEventListener("drop", e => {

            if (!draggedColumn) return;

            e.preventDefault();

            if (draggedColumn === columnEl) return;

            const rect = columnEl.getBoundingClientRect();
            const next = e.clientX < rect.left + rect.width / 2;

            columnsContainer.insertBefore(
                draggedColumn,
                next ? columnEl : columnEl.nextSibling
            );

        });

        /* =========================
           ADD CARD BUTTON
        ========================= */

        const addCardBtn = columnEl.querySelector(".add-card-btn");

        addCardBtn.addEventListener("click", () => {

            activeColumnIdInput.value = column.id;
            addCardModal.show();

        });

        columnsContainer.appendChild(columnEl);

    });

    await loadAllCards(columns);

}

/* =========================
   LOAD CARDS
========================= */

async function loadCards(columnId) {

    const res = await fetch(`${API}/cards/${columnId}`, {
        credentials: "include"
    });

    const data = await res.json();

    const container = document.getElementById(`column-${columnId}`);

    container.innerHTML = "";

    data.cards.forEach(card => {

        const cardEl = document.createElement("div");

        cardEl.className = "kanban-card";
        cardEl.dataset.id = card.id;
        cardEl.draggable = true;

        cardEl.textContent = card.title;

        cardEl.addEventListener("dragstart", () => {

            draggedColumn = null;
            draggedCard = cardEl;

            setTimeout(() => {
                cardEl.classList.add("dragging");
                cardEl.style.opacity = "0";
            }, 0);

        });

        cardEl.addEventListener("dragend", async () => {

            cardEl.classList.remove("dragging");
            cardEl.style.opacity = "";

            const targetColumnId =
                cardEl.closest(".kanban-card-list")
                    .id.replace("column-", "");

            const cards =
                [...cardEl.parentElement.querySelectorAll(".kanban-card")];

            const position =
                cards.indexOf(cardEl) + 1;

            await fetch(
                `${API}/cards/${cardEl.dataset.id}/move/${targetColumnId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        position
                    })
                }
            );

            draggedCard = null;

        });

        container.appendChild(cardEl);

    });

    if (!container.dataset.dragInitialized) {

        container.dataset.dragInitialized = "true";

        container.addEventListener("dragover", e => {

            e.preventDefault();
            e.stopPropagation(); // prevent column drag logic

            if (!draggedCard) return;

            const afterElement = getDragAfterElement(container, e.clientY);

            if (afterElement == null) {

                container.appendChild(draggedCard);

            } else {

                container.insertBefore(draggedCard, afterElement);

            }

        });

        container.addEventListener("drop", e => {

            e.preventDefault();
            e.stopPropagation(); // prevent column drop

        });

    }

}

/* =========================
   Load Cards Helper
========================= */

function getDragAfterElement(container, mouseY) {

    const draggableCards = [
        ...container.querySelectorAll(".kanban-card:not(.dragging)")
    ];

    return draggableCards.reduce((closest, child) => {

        const box =
            child.getBoundingClientRect();

        const offset =
            mouseY - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {

            return {
                offset,
                element: child
            };

        }

        return closest;

    }, {
        offset: Number.NEGATIVE_INFINITY
    }).element;

}

/* =========================
   LOAD ALL CARDS
========================= */

async function loadAllCards(columns) {

    await Promise.all(
        columns.map(column => loadCards(column.id))
    );

}

/* =========================
   UPDATE COLUMN POSITIONS
========================= */

async function updateColumnPositions() {

    const cols =
        [...document.querySelectorAll(".kanban-column")];

    for (let i = 0; i < cols.length; i++) {

        await fetch(
            `${API}/columns/${cols[i].dataset.id}/move`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    position: i + 1
                })
            }
        );

    }

}

/* =========================
   CREATE COLUMN
========================= */

async function createColumn() {

    const name = columnNameInput.value.trim();
    if (!name) return;

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
}

/* =========================
   CREATE CARD
========================= */

async function createCard() {

    const title = cardTitleInput.value.trim();
    const columnId = activeColumnIdInput.value;

    if (!title || !columnId) return;

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

    await loadColumns();
}

/* =========================
   APPLY THEME
========================= */

function applyTheme(color){

    const theme = THEMES[color] || THEMES["#f4f6fb"];

    document.documentElement.style.setProperty("--board-bg",theme.background);

    document.documentElement.style.setProperty("--column-bg",theme.column);

    document.documentElement.style.setProperty("--column-border",theme.columnBorder);

    document.documentElement.style.setProperty("--card-bg",theme.card);

    document.documentElement.style.setProperty("--card-border",theme.cardBorder);

    document.documentElement.style.setProperty("--text",theme.text);

    document.documentElement.style.setProperty("--header-border",theme.header);

    document.documentElement.style.setProperty("--button",theme.button);

    document.documentElement.style.setProperty("--button-hover",theme.buttonHover);

    document.documentElement.style.setProperty("--scroll-track",theme.scrollTrack);

    document.documentElement.style.setProperty("--scroll-thumb",theme.scrollThumb);

}

/* =========================
   Open modal
========================= */

function openEditBoardModal() {

    editBoardNameInput.value = boardName.textContent;

    editBoardColorInput.value = currentBoard.themePicker;

    editBoardModal.show();

}

/* =========================
   Save Board Changes
========================= */

async function saveBoardChanges() {

    const body = {

        name: editBoardNameInput.value.trim(),
        color: editBoardColorInput.value

    };

    const response = await fetch(
        `${API}/boards/${boardId}`,
        {

            method: "PATCH",

            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(body)

        }
    );

    if (!response.ok) {

        alert("Unable to update board.");

        return;

    }

    editBoardModal.hide();

    await loadBoard();

    await loadColumns();

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