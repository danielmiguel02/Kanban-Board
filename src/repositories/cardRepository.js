import { prisma } from "../config/db.js";

const getCardsRepository = async (columnId) => {

    return prisma.card.findMany({

        where: {
            columnId,
            archived: false
        },

        orderBy: {
            position: "asc"
        }

    });

};

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

const moveCardToColumn = async ({ cardId, columnId, position }) => {
    return prisma.card.update({
        where: {
            id: cardId,
        },
        data: {
            columnId,
            position
        },
    });
};

const getCardsLastPos = async (columnId) => {
    return prisma.card.aggregate({
        _max: { position: true },
        where: { columnId: columnId, archived: false },
    });
};

const findCardById = async (cardId) => {
    return prisma.card.findUnique({
        where: {
            id: cardId,
        },
    });
};

const reorderCards = async (userId) => {
    return prisma.$transaction(async (tx) => {
        const columns = await tx.column.findMany({
            where: {
                archived: false,
                board: {
                    ownerId: userId,
                },
            },
            select: { id: true },
        });

        for (const column of columns) {
            const cards = await tx.card.findMany({
                where: {
                    columnId: column.id,
                    archived: false,
                },
                orderBy: {
                    position: 'asc',
                },
            });

            for (let i = 0; i < cards.length; i++) {
                if (cards[i].position !== i + 1) {
                    await tx.card.update({
                        where: { id: cards[i].id },
                        data: { position: i + 1 },
                    });
                }
            }
        }
    });
};

const archiveCard = async (data) => {
    const { cardId } = data;
    return prisma.card.update({
        where: {
            id: cardId,
        },
        data: {
            archived: true,
        },
    });
};

const unarchiveCard = async (data) => {
    const { cardId } = data;

    return prisma.card.update({
        where: {
            id: cardId,
        },
        data: {
            archived: false,
        },
    });
};

export { getCardsRepository, createCard, editCard, deleteCard, moveCardToColumn, getCardsLastPos, findCardById, reorderCards, archiveCard, unarchiveCard };