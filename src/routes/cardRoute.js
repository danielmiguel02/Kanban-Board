import express from "express";
import { createCard, editCard, deleteCard, moveCardToColumn } from "../controllers/cardController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:columnId", authMiddleware, createCard);
router.patch("/:cardId", authMiddleware, editCard);
router.delete("/:cardId", authMiddleware, deleteCard);
router.patch("/:cardId/:columnId", authMiddleware, moveCardToColumn);

export default router;