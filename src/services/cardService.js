import { findOwnedCard, getCardsLastPos, reorderCards, createCard, editCard, deleteCard, moveCardToColumn, archiveCard, unarchiveCard, isCardArchived} from "../repositories/cardRepository.js";
import { findOwnedColumn, isColumnArchived } from "../repositories/columnRepository.js";

const createCardService = async ({data, columnId, userId}) => {
    const { title } = data;

    if (!title) {
        throw new error("Title is required to create a card.");
    }

    const column = await findOwnedColumn(columnId, userId);

    if (!column) {
        throw new Error("Column not found or not authorized");
    }

    const cardsLastPosResult = await getCardsLastPos(columnId);
    const cardsLastPos = (cardsLastPosResult._max.position ?? 0);

    const createdCard = await createCard({
        title,
        position: cardsLastPos + 1,
        columnId
    });

    return {
        data: {
            card: {
                id: createdCard.id,
                title: createdCard.title,
                position: cardsLastPos + 1,
                columnId: columnId
            },
        },
    };
};

const editCardService = async ({data, cardId, userId}) => {
    const { title } = data;

    if (!title) {
        throw new Error("Title is required to edit card");
    }

    const card = await findOwnedCard(cardId, userId);

    if (!card) {
        throw new Error("Card not found or not authorized");
    }

    const editedCard = await editCard({
        title,
        cardId
    });

    return {
        data: {
            card: {
                id: editedCard.id,
                title: editedCard.title,
                position: editedCard.position,
                columnId: editedCard.columnId
            },
        },
    };
};

const deleteCardService = async ({cardId, userId}) => {
    const card = await findOwnedCard(cardId, userId);

    if (!card) {
        throw new Error("Card not found or not authorized");
    }

    await deleteCard({
        cardId
    });

    await reorderCards(userId);
};

const moveCardToColumnService = async ({cardId, columnId, userId}) => {
    const card = await findOwnedCard(cardId, userId);

    if (!card) {
        throw new Error("Card not found or not authorized");
    }

    const column = await findOwnedColumn(columnId, userId);

    if (!column) {
        throw new Error("Column not found or not authorized");
    }

    const movedCard = await moveCardToColumn({
        cardId,
        columnId
    });
    
    await reorderCards(userId);

    return {
        data: {
            card: {
                id: movedCard.id,
                title: movedCard.title,
                position: movedCard.position,
                columnId: movedCard.columnId,
            },
        },
    };
};

const archiveCardService = async ({cardId, userId}) => {
    const card = await findOwnedCard(cardId, userId);

    if (!card) {
        throw new Error("Card not found or not authorized");
    }

    await archiveCard({
        cardId
    });

    await reorderCards(userId);
};

const unarchiveCardService = async ({cardId, userId}) => {
    const card = await findOwnedCard(cardId, userId);

    if (!card) {
        throw new Error("Card not found or not authorized");
    }

    const isArchived = await isCardArchived(cardId);

    if (!isArchived?.archived) {
        throw new Error("Card is not archived, can't unarchive");
    }

    const isColumnArchived = await isColumnArchived(card.columnId);

    if (isColumnArchived) {
        throw new Error("Card column is archived, can't unarchive");
    }

    await unarchiveCard({
        cardId
    });

    await reorderCards(userId);
};

export { createCardService, editCardService, deleteCardService, moveCardToColumnService, archiveCardService, unarchiveCardService };