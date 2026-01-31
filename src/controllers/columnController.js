import { createColumnService } from '../services/columnService.js';

const createColumn = async (req, res) => {
    const boardId = Number(req.params.boardId);

    if (isNaN(boardId)) {
        return res.status(400).json({
            message: "Invalid board ID"
        });
    }

    const result = await createColumnService({
        data: req.body,
        boardId: boardId
    });

    return res.status(201).json({
        message: "Column created successfully",
        result
    });
};

export { createColumn };