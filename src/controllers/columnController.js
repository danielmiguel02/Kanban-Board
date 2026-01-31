import { createColumnService } from '../services/columnService.js';

const createColumn = async (req, res) => {
    const columnId = Number(req.params.columnId);

    if (isNaN(columnId)) {
        return res.status(400).json({
            message: "Invalid column ID"
        });
    }

    const result = await createColumnService({
        data: req.body,
        columnId: columnId
    });

    return res.status(201).json({
        message: "Column created successfully",
        result
    });
};

export { createColumn };