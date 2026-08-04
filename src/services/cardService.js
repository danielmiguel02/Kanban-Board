import { getCardsRepository, findCardById, getCardsLastPos, reorderCards, createCard, editCard, deleteCard, moveCardToColumn, archiveCard, unarchiveCard} from "../repositories/cardRepository.js";
import { findColumnById } from "../repositories/columnRepository.js";
import { checkBoardPermission } from "./permissionService.js";

const getCardsService = async ({ userId, columnId }) => {

    if (!columnId)
        throw new Error("ColumnId is required.");

    const column = await findColumnById(columnId);

    if (!column)
        throw new Error("Column not found.");

    await checkBoardPermission({
        boardId: column.boardId,
        userId,
        requiredRole: "VIEW"
    });

    return await getCardsRepository(columnId);

};

const createCardService = async ({data, columnId, userId}) => {
    const { title } = data;

    if (!title) {
        throw new Error("Title is required to create a card.");
    }

    const column = await findColumnById(columnId);

    if (!column) {
        throw new Error("Column not found");
    }

    await checkBoardPermission({
        boardId: column.boardId,
        userId,
        requiredRole: "EDIT",
    });

    if (column.archived) {
        throw new Error("Column is archived can't edit card");
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

const editCardService = async ({ data, cardId, userId }) => {
    const { title } = data;

    if (!title) {
        throw new Error("Title is required to edit card");
    }

    const card = await findCardById(cardId);

    if (!card) {
        throw new Error("Card not found");
    }

    const column = await findColumnById(card.columnId);

    if (!column) {
        throw new Error("Column not found");
    }

    await checkBoardPermission({
        boardId: column.boardId,
        userId,
        requiredRole: "EDIT",
    });

    if (card.archived) {
        throw new Error("Card is archived can't edit card");
    }

    if (column.archived) {
        throw new Error("Column is archived can't edit card");
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
    const card = await findCardById(cardId);

    if (!card) {
        throw new Error("Card not found");
    }

    const column = await findColumnById(card.columnId);

    if (!column) {
        throw new Error("Column not found");
    }

    await checkBoardPermission({
        boardId: column.boardId,
        userId,
        requiredRole: "EDIT",
    });

    await deleteCard({
        cardId
    });

    await reorderCards(userId);
};

const moveCardToColumnService = async ({ cardId, columnId, userId }) => {

    const card = await findCardById(cardId);

    if (!card)
        throw new Error("Card not found");

    const oldColumnId = card.columnId;

    const column = await findColumnById(columnId);

    if (!column)
        throw new Error("Column not found");

    await checkBoardPermission({
        boardId: column.boardId,
        userId,
        requiredRole: "EDIT",
    });

    if (card.archived)
        throw new Error("Card is archived.");

    if (column.archived)
        throw new Error("Column is archived.");

    const movedCard = await moveCardToColumn({
        cardId,
        columnId,
    });

    await reorderCards({
        columnId: oldColumnId
    });

    if (oldColumnId !== columnId) {
        await reorderCards({
            columnId
        });
    }

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
    const card = await findCardById(cardId);

    if (!card) {
        throw new Error("Card not found");
    }

    const column = await findColumnById(card.columnId);

    if (!column) {
        throw new Error("Column not found");
    }

    await checkBoardPermission({
        boardId: column.boardId,
        userId,
        requiredRole: "EDIT",
    });

    if (card.archived) {
        throw new Error("Card is already archived, can't archive");
    }

    if (column.archived) {
        throw new Error("Card column is archived, can't archive card");
    }

    await archiveCard({
        cardId
    });

    await reorderCards(userId);
};

const unarchiveCardService = async ({cardId, userId}) => {
    const card = await findCardById(cardId);

    if (!card) {
        throw new Error("Card not found");
    }

    const column = await findColumnById(card.columnId);

    if (!column) {
        throw new Error("Column not found");
    }

    await checkBoardPermission({
        boardId: column.boardId,
        userId,
        requiredRole: "EDIT",
    });

    if (!card.archived) {
        throw new Error("Card is not archived, can't unarchive");
    }

    if (column.archived) {
        throw new Error("Card column is archived, can't unarchive card");
    }

    await unarchiveCard({
        cardId
    });

    await reorderCards(userId);
};

export { getCardsService, createCardService, editCardService, deleteCardService, moveCardToColumnService, archiveCardService, unarchiveCardService };