import express from 'express';
import { createBoard, editBoard, deleteBoard, archiveBoard } from '../controllers/boardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware, createBoard);
router.patch("/:id", authMiddleware, editBoard);
router.delete("/:boardId", authMiddleware, deleteBoard);
router.patch("/:boardId/archive", authMiddleware, archiveBoard);

export default router;