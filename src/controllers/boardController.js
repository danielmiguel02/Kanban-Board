import { createBoardService, editBoardService } from '../services/boardService.js';

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
        const result = await editBoardService({
            data: req.body,
            boardId: req.params.id,
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

export { createBoard, editBoard };