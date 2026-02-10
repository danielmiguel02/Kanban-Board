import express from 'express';
import { createColumn, editColumn, deleteColumn, archiveColumn } from '../controllers/columnController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/:boardId", authMiddleware, createColumn);
router.patch("/:columnId", authMiddleware, editColumn);
router.delete("/:columnId", authMiddleware, deleteColumn);
router.patch("/:columnId/archive", authMiddleware, archiveColumn);

export default router;