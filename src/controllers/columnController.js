import { createColumnService, editColumnService } from '../services/columnService.js';

const createColumn = async (req, res) => {
    try {
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
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    };
};

const editColumn = async (req, res) => {
    try {
        const columnId = Number(req.params.columnId);

        if (isNaN(columnId)) {
            return res.status(400).json({
                message: "Invalid column ID"
            });
        }

        const result = editColumnService({
            data: req.body,
            columnId: columnId
        });

        return res.status(200).json({
            message: "Column edited successfully",
            column: result,
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

export { createColumn, editColumn };