import { createBoard } from '../repositories/boardRepository.js';

const createBoardService = async (data) => {
    const { name } = data;

    if (!name) {
        throw new Error("Name is required to create a board.");
    }

    const createdBoard = await createBoard({
        data: {
            name,
        },
    });

    return {
        data: {
            board: {
                id: createdBoard.id,
                name: createdBoard.name,
            },
        },
    };
};

export { createBoardService };