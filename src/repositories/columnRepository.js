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

const editColumn = async (data) => {
    const { name, columnId } = data;

    return prisma.column.update({
        where: {
            id: columnId
        },
        data: {
            name: name
        },
    });
};

const getColumnsLastPos = async (boardId) => {
    return prisma.column.aggregate({
        _max: { position: true },
        where: { boardId: boardId }
    });
};

const findOwnedColumn = async (columnId, userId) => {
    return prisma.column.findFirst({
        where: {
            id: columnId,
            board: {
                ownerId: userId,
            },
        },
    });
};

<<<<<<< HEAD
const findOwnedBoard = async (boardId, userId) => {
    return prisma.board.findFirst({
        where: {
            id: boardId,
            ownerId: userId,
        },
    });
};

export { createColumn, editColumn, getColumnsLastPos, findOwnedColumn, findOwnedBoard };
=======
export { createColumn, editColumn, getColumnsLastPos, findOwnedColumn };
>>>>>>> feat/kanban-routes
