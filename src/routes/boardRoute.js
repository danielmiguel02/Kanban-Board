import express from 'express';
import { createBoard, editBoard, deleteBoard, archiveBoard, unarchiveBoard, addMembersToBoard, removeMembersFromBoard } from '../controllers/boardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware, createBoard);
router.patch("/:id", authMiddleware, editBoard);
router.delete("/:boardId", authMiddleware, deleteBoard);
router.patch("/:boardId/archive", authMiddleware, archiveBoard);
router.patch("/:boardId/unarchive", authMiddleware, unarchiveBoard);

router.post("/:boardId/members", authMiddleware, addMembersToBoard);
router.delete("/:boardId/members", authMiddleware, removeMembersFromBoard);

export default router;