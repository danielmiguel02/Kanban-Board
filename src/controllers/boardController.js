import { createBoardService } from '../services/boardService.js';

const createBoard = async (req, res) => {
    try {
        const result = await createBoardService(req.body, req.user.id);

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

export { createBoard };