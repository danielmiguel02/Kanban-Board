import { prisma } from "../config/db.js";

const createColumn = async (data) => {
    const { name, position, boardId } = data;

    return prisma.column.create({
        data: {
            name: name,
            position: position,
            boardId: boardId,
        },
    });
};

const getColumnsLastPos = async (boardId) => {
    return prisma.column.aggregate({
        _max: { position: true },
        where: { boardId: boardId }
    });
};

export { createColumn, getColumnsLastPos };