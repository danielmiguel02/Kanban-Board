import { createBoard, editBoard, deleteBoard, findBoardById, reorderBoards } from '../repositories/boardRepository.js';

const createBoardService = async ({data, ownerId}) => {
    const { name } = data;

    if (!name) {
        throw new Error("Name is required to create a board.");
    }

    const createdBoard = await createBoard({
        name,
        ownerId,
    });

    return {
        data: {
            board: {
                id: createdBoard.id,
                name: createdBoard.name,
                ownerId: ownerId
            },
        },
    };
};

const editBoardService = async ({data, boardId, ownerId}) => {
    const { name } = data;

    if (!name) {
        throw new Error("Name is required to edit a board.");
    }

    const board = await findBoardById(boardId);
    
    if (!board) {
        throw new Error("Board not found");
    }

    if (board.ownerId !== ownerId) {
        throw new Error("Not authorized to edit this board");
    }

    const editedBoard = await editBoard({
        name,
        boardId
    });

    return {
        data: {
            board: {
                id: editedBoard.id,
                name: editedBoard.name,
                ownerId: ownerId
            },
        },
    };
};

const deleteBoardService = async ({boardId, ownerId}) => {
    const board = await findBoardById(boardId);

    if (!board) {
        throw new Error("Board not found");
    }

    if (board.ownerId !== ownerId) {
        throw new Error("Not authorized to delete this board");
    }

    const deletedBoard = await deleteBoard({
        boardId
    });

    await reorderBoards(ownerId);

    return {
        data: {
            board: {
                id: deletedBoard.id,
                name: deletedBoard.name,
                ownerId: ownerId
            },
        },
    };
};

export { createBoardService, editBoardService, deleteBoardService };