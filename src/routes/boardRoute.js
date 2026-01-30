import express from 'express';
import { createBoard, editBoard } from '../controllers/boardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware, createBoard);
router.patch("/", authMiddleware, editBoard);

export default router;