import { verifyToken } from '../utils/verifyToken.js';
import { prisma } from '../config/db.js';

export const authMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({
            message: "Not authorized, no token provided.",
        });
    }

    try {
        const decoded = await verifyToken(token);

        if (!decoded?.id) {
            return res.status(401).json({
                message: "Invalid token payload",
            });
        }


        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists.",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, token failed",
        });
    }
};