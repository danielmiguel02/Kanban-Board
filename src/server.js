import express from 'express';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';

// Import routes
import authRoute from './routes/authRoute.js';
import boardRoute from './routes/boardRoute.js';
import columnRoute from './routes/columnRoute.js';
import cardRoute from './routes/cardRoute.js';

dotenv.config();

const app = express();

// Body parse middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/auth', authRoute);
app.use('/boards', boardRoute);
app.use('/columns', columnRoute);
app.use('/cards', cardRoute);

const PORT = process.env.PORT || 9001;
const startServer = async () => {
    try {
        await connectDB();
        console.log("DB connected");

        const server = app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`);
        });

        return server;
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();


// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close( async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    await disconnectDB();
    process.exit(1);
});

// Graceful shutdown on SIGTERM
process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close( async () => {
        await disconnectDB();
        process.exit(0);
    });
}); 