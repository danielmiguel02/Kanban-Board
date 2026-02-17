import { findBoardById } from "../repositories/boardRepository.js";
import { findBoardMember } from "../repositories/boardMemberRepository.js"


const checkBoardPermission = async ({boardId, userId, requiredRole}) => {
    const board = await findBoardById(boardId);

    if (!board) {
        throw new Error("Board not found");
    }

    if (board.ownerId === userId) {
        return board;
    }

    const member = await findBoardMember(boardId, userId);

    if (!member) {
        throw new Error("Not authorized");
    }

    if (requiredRole === "EDIT" && member.role !== "EDIT") {
        throw new Error("Insufficient permissions.");
    }

    return board;
};

return { checkBoardPermission };