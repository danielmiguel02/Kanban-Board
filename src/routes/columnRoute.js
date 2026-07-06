import express from 'express';
import { getColumns, createColumn, editColumn, deleteColumn, archiveColumn, unarchiveColumn } from '../controllers/columnController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/:boardId", authMiddleware, getColumns);
router.post("/:boardId", authMiddleware, createColumn);
router.patch("/:columnId", authMiddleware, editColumn);
router.delete("/:columnId", authMiddleware, deleteColumn);
router.patch("/:columnId/archive", authMiddleware, archiveColumn);
router.patch("/:columnId/unarchive", authMiddleware, unarchiveColumn);

export default router;