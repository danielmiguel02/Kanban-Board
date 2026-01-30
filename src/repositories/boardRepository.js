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

const findBoardById = async(data) => {
    const { boardId } = data;

    return prisma.board.findUnique({
        where: {
            id: boardId,
        },
    });
};

export { createBoard, editBoard, findBoardById };