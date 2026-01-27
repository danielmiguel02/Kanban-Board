import { registerUserService } from '../services/authService.js';

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

export { registerUser };