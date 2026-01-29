import { createBoard } from '../repositories/boardRepository.js';

const createBoardService = async (data) => {
    const { name, userId } = data;

    if (!name) {
        throw new Error("Name is required to create a board.");
    }

    const createdBoard = await createBoard({
        data: {
            name,
            ownerId: userId,
        },
    });

    return {
        data: {
            board: {
                id: createdBoard.id,
                name: createdBoard.name,
                ownerId: userId
            },
        },
    };
};

export { createBoardService };