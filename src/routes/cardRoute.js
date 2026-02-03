import express from "express";
import { createCard } from "../controllers/cardController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:columnId", authMiddleware, createCard);

export default router;