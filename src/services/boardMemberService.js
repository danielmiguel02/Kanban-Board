import { findBoardById } from "../repositories/boardRepository.js";
import { findUserByEmail } from "../repositories/authRepository.js";
import { findBoardMember, createBoardMember, removeBoardMember } from "../repositories/boardMemberRepository.js";


const addMembersToBoardService = async ({data, boardId, userId}) => {
    const { email, role } = data;

    if (!email) {
        throw new Error("Email is required to add member");
    }

    if (!["VIEW", "EDIT"].includes(role)) {
        throw new Error("Invalid role");
    }

    const board = await findBoardById(boardId);

    if (!board) {
        throw new Error("Board not found");
    }

    if (board.ownerId !== userId) {
        throw new Error("Not authorized to add members");
    }

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("User not found by that email");
    }

    const existingMember = await findBoardMember(boardId, user.id);

    if (existingMember) {
        throw new Error("User is already a member of this board");
    }

    if (user.id == userId) {
        throw new Error("Can't add owner to members");
    }

    const boardMember = await createBoardMember({
        boardId,
        userId: user.id,
        role,
    });

    return {
        boardMember: {
            id: boardMember.id,
            boardId: boardMember.boardId,
            userId: boardMember.userId,
            role: boardMember.role,
        },
    };
};

const removeMembersFromBoardService = async ({data, boardId, userId}) => {
    const { email } = data;

    if (!email) {
        throw new Error("Email is required to remove member");
    }

    const board = await findBoardById(boardId);

    if (!board) {
        throw new Error("Board not found");
    }

    if (board.ownerId !== userId) {
        throw new Error("Not authorized to remove members");
    }

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("User not found by that email");
    }

    const existingMember = await findBoardMember(boardId, userId);

    if (!existingMember) {
        throw new Error("User is not a member of this board");
    }

    await removeBoardMember({
        boardId,
        userId: user.id
    });
};

export { addMembersToBoardService, removeMembersFromBoardService };