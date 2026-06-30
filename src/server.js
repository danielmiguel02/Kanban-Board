import express from 'express';
import { createServer } from "http";
import { connectDB, disconnectDB } from './config/db.js';
import cookieParser from "cookie-parser";

// Import routes
import authRoute from './routes/authRoute.js';
import boardRoute from './routes/boardRoute.js';
import columnRoute from './routes/columnRoute.js';
import cardRoute from './routes/cardRoute.js';

// Load .env locally only
if (process.env.NODE_ENV !== 'production') {
    import('dotenv').then(dotenv => dotenv.config());
}

const app = express();

// Body parse middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/auth', authRoute);
app.use('/boards', boardRoute);
app.use('/columns', columnRoute);
app.use('/cards', cardRoute);

/* =========================
   START SERVER
========================= */

// Create HTTP server
const httpServer = createServer(app);

const PORT = process.env.PORT || 9000;

const server = httpServer.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on PORT ${PORT}`);

    // IMPORTANT: connect AFTER server is up
    try {
        await connectDB();
        console.log("DB connected");
    } catch (err) {
        console.error("DB connection failed:", err);
    }
});

/* =========================
   ERROR HANDLING
========================= */

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