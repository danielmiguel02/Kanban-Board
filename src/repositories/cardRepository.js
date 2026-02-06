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

const editCard = async (data) => {
    const { title, cardId } = data;

    return prisma.card.update({
        where: {
            id: cardId,
        },
        data: {
            title: title
        },
    });
};

const deleteCard = async (data) => {
    const { cardId } = data;

    return prisma.card.delete({
        where: {
            id: cardId,
        },
    });
}

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

const reorderCards = async (userId) => {
    return prisma.$transaction(async (tx) => {
        const cards = await tx.card.findMany({
            where: {
                column: {
                    board: {
                        ownerId: userId,
                    },
                },
            },
            orderBy: {
                position: 'asc',
            },
        });

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].position !== i + 1) {
                await tx.card.update({
                    where: {
                        id: cards[i].id,
                    },
                    data: {
                        position: i + 1,
                    },
                });
            }
        }
    });
};

export { createCard, editCard, deleteCard, getCardsLastPos, findOwnedCard, reorderCards };