import { createBoard } from '../repositories/boardRepository.js';

const createBoardService = async ({data, ownerId}) => {
    const { name } = data;

    if (!name) {
        throw new Error("Name is required to create a board.");
    }

    const createdBoard = await createBoard({
        data: {
            name,
            ownerId: ownerId,
        },
    });

    return {
        data: {
            board: {
                id: createdBoard.id,
                name: createdBoard.name,
                ownerId: ownerId
            },
        },
    };
};

export { createBoardService };