import express from 'express';
import { getBoard, getBoards, createBoard, editBoard, deleteBoard, archiveBoard, unarchiveBoard, addMembersToBoard, removeMembersFromBoard, editMembersRoleFromBoard, getArchivedBoards } from '../controllers/boardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", authMiddleware, getBoards);
router.get("/:boardId", authMiddleware, getBoard);
router.get("/archived", authMiddleware, getArchivedBoards);
router.post("/", authMiddleware, createBoard);
router.patch("/:id", authMiddleware, editBoard);
router.delete("/:boardId", authMiddleware, deleteBoard);
router.patch("/:boardId/archive", authMiddleware, archiveBoard);
router.patch("/:boardId/unarchive", authMiddleware, unarchiveBoard);

router.post("/:boardId/members", authMiddleware, addMembersToBoard);
router.delete("/:boardId/members", authMiddleware, removeMembersFromBoard);
router.patch("/:boardId/members", authMiddleware, editMembersRoleFromBoard);

export default router;