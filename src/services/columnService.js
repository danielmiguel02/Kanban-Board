import { getColumnsLastPos, findColumnById, reorderColumns, createColumn, editColumn, deleteColumn, archiveColumn, unarchiveColumn } from "../repositories/columnRepository.js";
import { findBoardById } from "../repositories/boardRepository.js";
import { checkBoardPermission } from "./permissionService.js";

const createColumnService = async ({data, boardId, userId}) => {
    const { name } = data;

    if (!name) {
        throw new Error("Name is required to create a column.");
    }

    const board = await findBoardById(boardId);

    if (!board) {
        throw new Error("Board not found");
    }

    await checkBoardPermission({
        boardId: boardId,
        userId,
        requiredRole: "EDIT",
    });

    if (board.archived) {
        throw new Error("Column board is archived, can't create column");
    }

    const columnsLastPosResult = await getColumnsLastPos(boardId);
    const columnsLastPos = (columnsLastPosResult._max.position ?? 0);

    const createdColumn = await createColumn({
            name,
            position: columnsLastPos + 1,
            boardId
    });

    return {
        data: {
            column: {
                id: createdColumn.id,
                name: createdColumn.name,
                position: columnsLastPos + 1,
                boardId: boardId
            },
        },
    };
};

const editColumnService = async ({data, columnId, userId}) => {
    const { name } = data;

    if (!name) {
        throw new Error("Name is required to edit a column");
    }

    const column = await findColumnById(columnId);

    if (!column) {
        throw new Error("Column not found");
    }

    const board = await findBoardById(column.boardId);

    if (!board) {
        throw new Error("Board not found");
    }

    await checkBoardPermission({
        boardId: board.id,
        userId,
        requiredRole: "EDIT",
    });

    if (column.archived) {
        throw new Error("Can't edit archived column");
    }

    const editedColumn = await editColumn({
        name,
        columnId
    });

    return {
        data: {
            column: {
                id: editedColumn.id,
                name: editedColumn.name,
                position: editedColumn.position,
                boardId: editedColumn.boardId
            },
        },
    };
};

const deleteColumnService = async ({columnId, userId}) => {
    const column = await findColumnById(columnId);

    if (!column) {
        throw new Error("Column not found");
    }

    const board = await findBoardById(column.boardId);

    if (!board) {
        throw new Error("Board not found");
    }

    await checkBoardPermission({
        boardId: board.id,
        userId,
        requiredRole: "EDIT",
    });

    await deleteColumn({
        columnId
    });

    await reorderColumns(userId);
};

const archiveColumnService = async ({columnId, userId}) => {
    const column = await findColumnById(columnId);

    if (!column) {
        throw new Error("Column not found");
    }

    const board = await findBoardById(column.boardId);

    if (!board) {
        throw new Error("Board not found");
    }

    await checkBoardPermission({
        boardId: board.id,
        userId,
        requiredRole: "EDIT",
    });

    if (column.archived) {
        throw new Error("Column is already archived, can't archive");
    }

    if (board.archived) {
        throw new Error("Column board is archived, can't archive column");
    }

    await archiveColumn({
        columnId
    });

    await reorderColumns(userId);
};

const unarchiveColumnService = async ({columnId, userId}) => {
    const column = await findColumnById(columnId);

    if (!column) {
        throw new Error("Column not found");
    }

    const board = await findBoardById(column.boardId);

    if (!board) {
        throw new Error("Board not found");
    }

    await checkBoardPermission({
        boardId: board.id,
        userId,
        requiredRole: "EDIT",
    });

    if (!column.archived) {
        throw new Error("Column is not archived, can't unarchive");
    }

    if (board.archived) {
        throw new Error("Board is archived, can't unarchive column");
    }

    await unarchiveColumn({
        columnId
    });

    await reorderColumns(userId);
};

export { createColumnService, editColumnService, deleteColumnService, archiveColumnService, unarchiveColumnService };