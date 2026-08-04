import express from 'express';
<<<<<<< HEAD
import { getBoard, getBoards, createBoard, editBoard, deleteBoard, archiveBoard, unarchiveBoard, addMembersToBoard, removeMembersFromBoard, editMembersRoleFromBoard } from '../controllers/boardController.js';
=======
import { getBoards, createBoard, editBoard, deleteBoard, archiveBoard, unarchiveBoard, addMembersToBoard, removeMembersFromBoard, editMembersRoleFromBoard } from '../controllers/boardController.js';
>>>>>>> feat/kanban-controller
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", authMiddleware, getBoards);
<<<<<<< HEAD
router.get("/:boardId", authMiddleware, getBoard);
=======
>>>>>>> feat/kanban-controller
router.post("/", authMiddleware, createBoard);
router.patch("/:id", authMiddleware, editBoard);
router.delete("/:boardId", authMiddleware, deleteBoard);
router.patch("/:boardId/archive", authMiddleware, archiveBoard);
router.patch("/:boardId/unarchive", authMiddleware, unarchiveBoard);

router.post("/:boardId/members", authMiddleware, addMembersToBoard);
router.delete("/:boardId/members", authMiddleware, removeMembersFromBoard);
router.patch("/:boardId/members", authMiddleware, editMembersRoleFromBoard);

export default router;