import { getColumnsService, createColumnService, editColumnService, deleteColumnService, moveColumnService, archiveColumnService, unarchiveColumnService } from '../services/columnService.js';

const getColumns = async (req, res) => {
    try {
        const columns = await getColumnsService({
            userId: req.user.id,
            boardId: Number(req.params.boardId),
        });

        return res.status(200).json({
            message: "Columns retrieved successfully",
            columns,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

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

const moveColumn = async (req, res) => {
    try {

        const result = await moveColumnService({
            columnId: Number(req.params.columnId),
            position: Number(req.body.position),
            userId: req.user.id,
        });

        return res.status(200).json({
            message: "Column moved successfully",
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
            message: error.message,
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

export { getColumns, createColumn, editColumn, deleteColumn, moveColumn, archiveColumn, unarchiveColumn };