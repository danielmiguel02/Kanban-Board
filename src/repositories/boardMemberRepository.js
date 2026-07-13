import { prisma } from "../config/db.js";

const getSharedBoardsRepository = async (userId) => {
    return prisma.boardMember.findMany({
        where: {
            userId,
            board: {
                archived: false,
            },
        },
        select: {
            role: true,
            board: {
                select: {
                    id: true,
                    name: true,
                    position: true,
                    owner: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            board: {
                position: "asc",
            },
        },
    });
};

const findBoardMember = async (boardId, userId) => {
    return prisma.boardMember.findUnique({
        where: {
            boardId_userId: {
                boardId,
                userId,
            },
        },
    });
};

const createBoardMember = async ({boardId, userId, role}) => {
    return prisma.boardMember.create({
        data: {
            boardId: boardId,
            userId: userId,
            role: role,
        },
    });
};

const removeBoardMember = async ({boardId, userId}) => {
    return prisma.boardMember.delete({
        where: {
            boardId_userId: {
                boardId,
                userId,
            },
        }
    });
}

const editBoardMemberRole = async ({boardId, userId, role}) => {
    return prisma.boardMember.update({
        where: {
            boardId_userId: {
                boardId,
                userId,
            },
        },
        data: {
            role: role,
        },
    });
};

export { getSharedBoardsRepository, findBoardMember, createBoardMember, removeBoardMember, editBoardMemberRole };