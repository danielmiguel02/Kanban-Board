import { getColumnsLastPos, findOwnedColumn, reorderColumns, createColumn, editColumn, deleteColumn, archiveColumn, unarchiveColumn, isColumnArchived } from "../repositories/columnRepository.js";
import { findOwnedBoard, isBoardArchived } from "../repositories/boardRepository.js";

const createColumnService = async ({data, boardId, userId}) => {
    const { name } = data;

    if (!name) {
        throw new Error("Name is required to create a column.");
    }

    const board = await findOwnedBoard(boardId, userId);

    if (!board) {
        throw new Error("Board not found or not authorized");
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

    const column = await findOwnedColumn(columnId, userId);

    if (!column) {
        throw new Error("Column not found or not authorized");
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
    const column = await findOwnedColumn(columnId, userId);

    if (!column) {
        throw new Error("Column not found or not authorized");
    }

    await deleteColumn({
        columnId
    });

    await reorderColumns(userId);
};

const archiveColumnService = async ({columnId, userId}) => {
    const column = await findOwnedColumn(columnId, userId);

    if (!column) {
        throw new Error("Column not found or not authorized");
    }

    await archiveColumn({
        columnId
    });

    await reorderColumns(userId);
};

const unarchiveColumnService = async ({columnId, userId}) => {
    const column = await findOwnedColumn(columnId, userId);

    if (!column) {
        throw new Error("Column not found or not authorized");
    }

    const columnArchived = await isColumnArchived(columnId);

    if (!columnArchived?.archived) {
        throw new Error("Column is not archived, can't unarchive");
    }

    const boardArchived = await isBoardArchived(column.boardId);

    if (boardArchived) {
        throw new Error("Column board is archived, can't unarchive");
    }

    await unarchiveColumn({
        columnId
    });

    await reorderColumns(userId);
};

export { createColumnService, editColumnService, deleteColumnService, archiveColumnService, unarchiveColumnService };