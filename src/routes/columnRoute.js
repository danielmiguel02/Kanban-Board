import express from 'express';
import { createColumn } from '../repositories/columnRepository.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/:boardId", authMiddleware, createColumn);

export default router;