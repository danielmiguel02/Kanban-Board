// findOwnedCard, getCardsLastPos, createCard
import { prisma } from "../config/db.js";

const createCard = async (data) => {
    const { title, position, columnId } = data;

    return prisma.card.create({
        data: {
            title: title,
            position: position,
            columnId: columnId
        },
    });
};

const getCardsLastPos = async (columnId) => {
    return prisma.card.aggregate({
        _max: { position: true },
        where: { columnId: columnId },
    });
};

const findOwnedCard = async (cardId, userId) => {
    return prisma.card.findFirst({
        where: {
            id: cardId,
            column: {
                board: {
                    ownerId: userId,
                },
            },
        },
    });
};

export { createCard, getCardsLastPos, findOwnedCard };