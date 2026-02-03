import { findOwnedCard, getCardsLastPos, createCard, editCard} from "../repositories/cardRepository.js";
import { findOwnedColumn } from "../repositories/columnRepository.js";

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

export { createCardService, editCardService };