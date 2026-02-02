import express from 'express';
import { createColumn, editColumn } from '../controllers/columnController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/:boardId", authMiddleware, createColumn);
router.patch("/:columnId", authMiddleware, editColumn);

export default router;