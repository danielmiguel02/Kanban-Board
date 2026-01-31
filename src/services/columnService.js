import { getLastColumnPosition, createColumn } from "../repositories/columnRepository.js";

const createColumnService = async (data) => {
    const { name, boardId } = data;

    const columnPosition = getLastColumnPosition(boardId);

    if (!name) {
        throw new Error("Name is required to create a column.");
    }

    const createdColumn = await createColumn({
        data: {
            name,
            columnPosition,
        },
    });

    return {
        data: {
            column: {
                id: createdColumn.id,
                name: createdColumn.name,
                position: columnPosition,
                boardId: boardId
            },
        },
    };
};

export { createColumnService };