import { findOwnedCard, getCardsLastPos, createCard} from "../repositories/cardRepository.js";

const createCardService = async ({data, columnId, userId}) => {
    const { title } = data;

    if (!title) {
        throw new error("Title is required to create a card.");
    }

    const card = await findOwnedCard(columnId, userId);

    if (!card) {
        throw new Error("Card not found or not authorized");
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