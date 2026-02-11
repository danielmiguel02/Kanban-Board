import { createColumnService, editColumnService, deleteColumnService, archiveColumnService, unarchiveColumnService } from '../services/columnService.js';

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
            boardId: boardId,
            userId: req.user.id
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

        const result = await editColumnService({
            data: req.body,
            columnId: columnId,
            userId: req.user.id
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

const deleteColumn = async (req, res) => {
    try {
        const columnId = Number(req.params.columnId);
        
        if (isNaN(columnId)) {
            return res.status(400).json({
                message: "Invalid column ID"
            });
        }

        const result = await deleteColumnService({
            columnId: columnId,
            userId: req.user.id,
        });

        return res.status(200).json({
            message: "Column deleted successfully",
            column: result,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

const archiveColumn = async (req, res) => {
    try {
        const columnId = Number(req.params.columnId);

        if (isNaN(columnId)) {
            return res.status(400).json({
                message: "Invalid column ID",
            });
        }

        await archiveColumnService({
            columnId: columnId,
            userId: req.user.id,
        });

        return res.status(200).json({
            message: "Column archived successfully",
        });

    } catch (error) {
        return res.status(400).json({
            message: message.error,
        });
    }
};

const unarchiveColumn = async (req, res) => {
    try {
        const columnId = Number(req.params.columnId);

        if (isNaN(columnId)) {
            return res.status(400).json({
                message: "Invalid column ID",
            });
        }

        await unarchiveColumnService({
            columnId: columnId,
            userId: req.user.id,
        });

        return res.status(200).json({
            message: "Column unarchived successfully",
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

export { createColumn, editColumn, deleteColumn, archiveColumn, unarchiveColumn };