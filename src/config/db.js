import { PrismaClient } from '@prisma/client/extension';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error']
});

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("DB Connection Success");
    } catch (error) { 
        console.log(`DB Connection error: ${error}`); 
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
        console.log("DB Disconnect Success");
    } catch (error) { 
        console.log(`DB Disconnect error: ${error}`); 
        process.exit(1);
    }
}

export { connectDB, disconnectDB };