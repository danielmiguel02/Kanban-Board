import { prisma } from "../config/db.js";

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

export { findBoardMember, createBoardMember, removeBoardMember, editBoardMemberRole };