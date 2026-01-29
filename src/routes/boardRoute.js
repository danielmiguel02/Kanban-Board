import express from 'express';
import { createBoard } from '../controllers/boardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware, createBoard);

export default router;