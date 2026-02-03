import { findOwnedCard, getCardsLastPos, createCard} from "../repositories/cardRepository.js";
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

export { createCardService };