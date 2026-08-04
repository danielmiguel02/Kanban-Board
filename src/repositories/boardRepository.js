import { prisma } from "../config/db.js";

const getBoardsRepository = async (userId) => {
    return prisma.board.findMany({
        where: {
            ownerId: userId,
            archived: false,
        },
        select: {
            id: true,
            name: true,
            position: true,
            archived: true,
        },
        orderBy: {
            position: "asc",
        },
    });
};

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

const getBoardsLastPos = async (userId) => {
    return prisma.board.aggregate({
        _max: { position: true },
        where: { ownerId: userId, archived: false },
    });
};

const reorderBoards = async (userId) => {
    return prisma.$transaction(async (tx) => {
        const boards = await tx.board.findMany({
            where: { 
                ownerId: userId,
                archived: false,
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

const archiveBoard = async (data) => {
    const { boardId } = data;

    return prisma.$transaction(async (tx) => {
        await tx.card.updateMany({
            where: {
                column: {
                    boardId,
                },
                archived: false,
            },
            data: {
                archived: true,
            },
        });

        await tx.column.updateMany({
            where: {
                boardId,
                archived: false,
            },
            data: {
                archived: true,
            },
        });

        await tx.board.update({
            where: {
                id: boardId,
            },
            data: {
                archived: true,
            },
        });
    });
};

const unarchiveBoard = async (data) => {
    const { boardId } = data;

    return prisma.$transaction(async (tx) => {
        await tx.card.updateMany({
            where: {
                column: {
                    boardId,
                },
                archived: true,
            },
            data: {
                archived: false,
            },
        });

        await tx.column.updateMany({
            where: {
                boardId,
                archived: true,
            },
            data: {
                archived: false,
            },
        });

        await tx.board.update({
            where: {
                id: boardId,
            },
            data: {
                archived: false,
            },
        });
    });
}

export { getBoardsRepository, createBoard, editBoard, deleteBoard, findBoardById, reorderBoards, getBoardsLastPos, archiveBoard, unarchiveBoard };