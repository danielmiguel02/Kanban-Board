import { prisma } from "../config/db.js";

const createBoard = async (data) => {
    const { name, ownerId } = data;

    return prisma.board.create({
        data: {
            name: name,
            ownerId: ownerId,
        },
    });
};

export { createBoard };