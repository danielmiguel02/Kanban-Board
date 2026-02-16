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
    return prisma.boardMember.remove({
        where: {
            boardId,
            userId
        }
    });
}

export { findBoardMember, createBoardMember, removeBoardMember };