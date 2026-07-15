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
   DRAG STATE
========================= */

let draggedCard = null;
let draggedColumn = null;

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
   LOAD BOARD
========================= */

async function loadBoard() {

    const res = await fetch(`${API}/boards/${boardId}`, {
        credentials: "include"
    });

    const data = await res.json();
    boardName.textContent = data.board.name;
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
        columnEl.draggable = true;


        columnEl.innerHTML = `
            <div class="column-header">

                <strong>${column.name}</strong>

                <button class="btn btn-sm btn-outline-primary add-card-btn">
                    + Add Card
                </button>

            </div>


            <div class="kanban-card-list" id="column-${column.id}"></div>
        `;



        /*
            COLUMN DRAG
        */

        columnEl.addEventListener("dragstart", () => {

            draggedColumn = columnEl;

            columnEl.classList.add("dragging");

        });



        columnEl.addEventListener("dragend", async () => {

            columnEl.classList.remove("dragging");

            draggedColumn = null;

            await updateColumnPositions();

        });



        columnEl.addEventListener("dragover", e => {

            e.preventDefault();

        });



        columnEl.addEventListener("drop", e => {

            e.preventDefault();


            if (!draggedColumn || draggedColumn === columnEl)
                return;


            const rect = columnEl.getBoundingClientRect();

            const next =
                e.clientX < rect.left + rect.width / 2;


            columnsContainer.insertBefore(
                draggedColumn,
                next ? columnEl : columnEl.nextSibling
            );

        });



        const addCardBtn =
            columnEl.querySelector(".add-card-btn");


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

            if (!draggedCard)
                return;

            const afterElement =
                getDragAfterElement(container, e.clientY);

            if (afterElement == null) {

                container.appendChild(draggedCard);

            } else {

                container.insertBefore(
                    draggedCard,
                    afterElement
                );

            }

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
   LOGOUT
========================= */

async function logout() {

    await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include"
    });

    window.location.href = "index.html";
}