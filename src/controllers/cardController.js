import { createCardService, editCardService } from "../services/cardService.js";

const createCard = async (req, res) => {
    try {
        const columnId = Number(req.params.columnId);

        if (isNaN(columnId)) {
            return res.status(400).json({
                message: "Invalid column ID"
            });
        }

        const result = await createCardService({
            data: req.body,
            columnId: columnId,
            userId: req.user.id
        });

        return res.status(201).json({
            message: "Card created successfully",
            result
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

const editCard = async (req, res) => {
    try {
        const cardId = Number(req.params.cardId);

        if (isNaN(cardId)) {
            return res.status(400).json({
                message: "Invalid card ID"
            });
        }

        const result = editCardService({
            data: req.body,
            cardId: cardId,
            userId: req.user.id
        });

        return res.status(200).json({
            message: "Card edited successfully",
            card: result,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

export { createCard, editCard };