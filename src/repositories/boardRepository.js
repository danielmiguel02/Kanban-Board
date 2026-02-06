import { prisma } from "../config/db.js";

const createBoard = async (data) => {
    const { name, ownerId, position } = data;

    return prisma.board.create({
        data: {
            name: name,
            ownerId: ownerId,
            position: position
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

const deleteBoard = async (data) => {
    const { boardId } = data;

    return prisma.$transaction(async (tx) => {

        await tx.card.deleteMany({
            where: {
                column: {
                    boardId,
                },
            },
        });

        await tx.column.deleteMany({
            where: {
                boardId,
            },
        });

        await tx.board.delete({
            where: {
                id: boardId,
            },
        });
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

const getBoardsLastPos = async (userId) => {
    return prisma.board.aggregate({
        _max: { position: true },
        where: { ownerId: userId },
    });
};

const reorderBoards = async (userId) => {
    return prisma.$transaction(async (tx) => {
        const boards = await tx.board.findMany({
            where: { 
                ownerId: userId,
            },
            orderBy: {
                position: 'asc',
            },
        });
        
        for (let i = 0; i < boards.length; i++) {
            if (boards[i].position !== i + 1) {
                await tx.board.update({
                    where: {
                        id: boards[i].id
                    },
                    data: {
                        position: i + 1,
                    },
                });
            }
        }
    });
};

export { createBoard, editBoard, deleteBoard, findBoardById, findOwnedBoard, reorderBoards, getBoardsLastPos };