import { getColumnsLastPos, createColumn } from "../repositories/columnRepository.js";

const createColumnService = async (data) => {
    const { name, boardId } = data;

    if (!name) {
        throw new Error("Name is required to create a column.");
    }

    const columnsLastPos = (await getColumnsLastPos(boardId)) ?? 0;

    const createdColumn = await createColumn({
        data: {
            name,
            position: columnsLastPos + 1,
            boardId
        },
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

export { createColumnService };