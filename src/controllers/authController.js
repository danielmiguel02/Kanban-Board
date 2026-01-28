import dotenv from 'dotenv';
import { registerUserService, loginUserService } from '../services/authService.js';

dotenv.config();

const registerUser = async (req, res) => {
    try {
        const result = await registerUserService(req.body);

        return res.status(201).json({
            message: "User registeres successfully",
            user: result,
        });
    } catch (error) { 
        return res.status(400).json({
            message: error.message,
        });
    };
};

const loginUser = async (req, res) => {
    try {
        const result = await loginUserService(req.body);

        res.cookie("jwt", result.token, {
            httpOnly: true,
            secore: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return res.status(200).json({
            message: "User logged in successfully",
            user: result,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    };
};

const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
    });

    return res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
};

export { registerUser, loginUser, logout};