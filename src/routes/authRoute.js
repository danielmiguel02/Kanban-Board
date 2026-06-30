import express from 'express';
import { getCurrentUser, registerUser, loginUser, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);

export default router;