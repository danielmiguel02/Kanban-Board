import express from "express";
import { getCards, createCard, editCard, deleteCard, moveCardToColumn, archiveCard, unarchiveCard, getArchivedCards} from "../controllers/cardController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:columnId", authMiddleware, getCards);
router.get("/:boardId/archived", authMiddleware, getArchivedCards);
router.post("/:columnId", authMiddleware, createCard);
router.patch("/:cardId", authMiddleware, editCard);
router.delete("/:cardId", authMiddleware, deleteCard);
router.patch("/:cardId/move/:columnId", authMiddleware, moveCardToColumn);
router.patch("/:cardId/archive", authMiddleware, archiveCard);
router.patch("/:cardId/unarchive", authMiddleware, unarchiveCard);

export default router;