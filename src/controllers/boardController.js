import { getBoardsService, createBoardService, editBoardService, deleteBoardService, archiveBoardService, unarchiveBoardService } from '../services/boardService.js';
import { getSharedBoardsService, addMembersToBoardService, removeMembersFromBoardService } from '../services/boardMemberService.js';

const getBoards = async (req, res) => {
    try {

        const ownedBoards = await getBoardsService(req.user.id);

        const sharedBoards = await getSharedBoardsService(req.user.id);

        return res.status(200).json({
            message: "Boards retrieved successfully",
            ownedBoards,
            sharedBoards
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }
};

const getBoard = async (req, res) => {
    try {
        const board = await getBoardsService({
            boardId: req.params.boardId,
            ownerId: req.user.id,
        });

        return res.status(200).json({
            message: "Board retrieved successfully",
            board,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

const createBoard = async (req, res) => {
    try {
        const result = await createBoardService({
            data: req.body, 
            ownerId: req.user.id
        });

        return res.status(201).json({
            message: "Board created successfully",
            board: result,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

const editBoard = async (req, res) => {
    try {
        const boardId = Number(req.params.id);
        if (isNaN(boardId)) {
            return res.status(400).json({ 
                message: "Invalid board ID"
            });
        }

        const result = await editBoardService({
            data: req.body,
            boardId: boardId,
            ownerId: req.user.id,
        });

        return res.status(200).json({
            message: "Board edited successfully",
            board: result,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

const deleteBoard = async (req, res) => {
    try {
        const boardId = Number(req.params.boardId);

        if (isNaN(boardId)) {
            return res.status(400).json({
                message: "Invalid board ID"
            });
        }

        const result = await deleteBoardService({
            boardId: boardId,
            ownerId: req.user.id,
        });

        return res.status(200).json({
            message: "Board deleted successfully",
            board: result,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

const archiveBoard = async (req, res) => {
    try {
        const boardId = Number(req.params.boardId);

        if (isNaN(boardId)) {
            return res.status(400).json({
                message: "Invalid board ID"
            });
        }

        await archiveBoardService({
            boardId: boardId,
            userId: req.user.id,
        });

        return res.status(200).json({
            message: "Board archived successfully",
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

const unarchiveBoard = async (req, res) => {
    try {
        const boardId = Number(req.params.boardId);

        if (isNaN(boardId)) {
            return res.status(400).json({
                message: "Invalid board ID",
            });
        }

        await unarchiveBoardService({
            boardId: boardId,
            userId: req.user.id,
        });

        return res.status(200).json({
            message: "Board unarchived successfully",
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

const addMembersToBoard = async (req, res) => {
    try {
        const boardId = Number(req.params.boardId);

        if (isNaN(boardId)) {
            return res.status(400).json({
                message: "Invalid board ID",
            });
        }

        await addMembersToBoardService({
            data: req.body,
            boardId: boardId,
            userId: req.user.id,
        });

        return res.status(201).json({
            message: "Member added to the board successfully",
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

const removeMembersFromBoard = async (req, res) => {
    try {
        const boardId = Number(req.params.boardId);

        if (isNaN(boardId)) {
            return res.status(400).json({
                message: "Invalid board ID",
            });
        }

        await removeMembersFromBoardService({
            data: req.body,
            boardId: boardId,
            userId: req.user.id
        });

        return res.status(200).json({
            message: "Member removed successfully",
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

export { getBoards, createBoard, editBoard, deleteBoard, archiveBoard, unarchiveBoard, addMembersToBoard, removeMembersFromBoard };