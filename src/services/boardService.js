import { createBoard, editBoard, deleteBoard, findBoardById, reorderBoards, getBoardsLastPos, archiveBoard, unarchiveBoard } from '../repositories/boardRepository.js';

const createBoardService = async ({data, ownerId}) => {
    const { name } = data;

    if (!name) {
        throw new Error("Name is required to create a board.");
    }

    const boardsLastPosResult = await getBoardsLastPos(ownerId);
    const boardsLastPos = (boardsLastPosResult._max.position ?? 0);

    const createdBoard = await createBoard({
        name,
        ownerId,
        position: boardsLastPos + 1,
    });

    return {
        data: {
            board: {
                id: createdBoard.id,
                name: createdBoard.name,
                ownerId: ownerId,
                position: boardsLastPos + 1,
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

    if (board.archived) {
        throw new Error("Can't edit archived board");
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

    await deleteBoard({
        boardId
    });

    await reorderBoards(ownerId);
};

const archiveBoardService = async ({boardId, userId}) => {
    const board = await findBoardById(boardId);

    if (!board) {
        throw new Error("Board not found");
    }

    if (board.ownerId !== userId) {
        throw new Error("Not authorized to archive this board");
    }

    if (board.archived) {
        throw new Error("Board is already archived, can't archive");
    }

    await archiveBoard({
        boardId
    });

    await reorderBoards(userId);
};

const unarchiveBoardService = async ({boardId, userId}) => {
    const board = await findBoardById(boardId);

    if (!board) {
        throw new Error("Board not found");
    }

    if (board.ownerId !== userId) {
        throw new Error("Not authorized to unarchive this board");
    }

    if (!board.archived) {
        throw new Error("Board is not archived, can't unarchive");
    }

    await unarchiveBoard({
        boardId
    });

    await reorderBoards(userId);
};

export { createBoardService, editBoardService, deleteBoardService, archiveBoardService, unarchiveBoardService };