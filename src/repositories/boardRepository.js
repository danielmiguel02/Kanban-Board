import { prisma } from "../config/db.js";

const createBoard = async (data) => {
    const { name, ownerId } = data;

    return prisma.board.create({
        data: {
            name: name,
            ownerId: ownerId,
        },
    });
};

const editBoard = async (data) => {
    const { name, boardId } = data;

    return prisma.board.update({
        where: {
            id: boardId
        },
        data: {
            name: name
        },
    });
};

const findBoardById = async (id) => {
    return prisma.board.findUnique({
        where: {
            id,
        },
    });
};

const findOwnedBoard = async (boardId, userId) => {
    return prisma.board.findFirst({
        where: {
            id: boardId,
            ownerId: userId,
        },
    });
};

export { createBoard, editBoard, findBoardById, findOwnedBoard };