import { getColumnsLastPos, findOwnedColumn, findOwnedBoard, createColumn, editColumn } from "../repositories/columnRepository.js";

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

export { createColumnService, editColumnService };