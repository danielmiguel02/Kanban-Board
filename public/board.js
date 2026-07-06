const API = "https://kanbanboard.fly.dev";

const params = new URLSearchParams(window.location.search);
const boardId = params.get("id");

const columnsContainer = document.getElementById("columns");
const boardTitle = document.getElementById("boardTitle");

document.addEventListener("DOMContentLoaded", async () => {

    await loadBoard();
    await loadColumns();

});