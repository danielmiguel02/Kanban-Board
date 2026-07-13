import { prisma } from "../config/db.js";

const getBoardsRepository = async (userId) => {
    return prisma.board.findMany({
        where: {
            ownerId: userId,
            archived: false,
        },
        select: {
            id: true,
            name: true,
            color: true,
            position: true,
            archived: true,
        },
        orderBy: {
            position: "asc",
        },
    });
};

const getBoardRepository = async (boardId) => {

    return prisma.board.findUnique({

        where: {
            id: Number(boardId),
        },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                }
            },
            members: {
                select: {
                    role: true,
                    userId: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    }
                }
            },
            columns: {
                where: {
                    archived: false,
                },
                orderBy: {
                    position: "asc",
                },
                include: {
                    cards: {
                        where: {
                            archived: false,
                        },
                        orderBy: {
                            position: "asc",
                        }
                    }

                }

            }

        }

    });

};

const createBoard = async (data) => {
    const { name, color, ownerId, position } = data;

    return prisma.board.create({
        data: {
            name: name,
            color: color,
            ownerId: ownerId,
            position: position
        },
    });
};

const editBoard = async (data) => {
    const { name, color, boardId } = data;

    return prisma.board.update({
        where: {
            id: boardId
        },
        data: {
            name: name,
            color: color,
        },
    });
};

const deleteBoard = async (data) => {
    const { boardId } = data;

    return prisma.$transaction(async (tx) => {

        await tx.card.deleteMany({
            where: {
                column: {
                    boardId,
                },
            },
        });

        await tx.column.deleteMany({
            where: {
                boardId,
            },
        });

        await tx.board.delete({
            where: {
                id: boardId,
            },
        });
    });
};

const findBoardById = async (id) => {
    return prisma.board.findUnique({
        where: {
            id,
        },
    });
};

const getBoardsLastPos = async (userId) => {
    return prisma.board.aggregate({
        _max: { position: true },
        where: { ownerId: userId, archived: false },
    });
};

const reorderBoards = async (userId) => {
    return prisma.$transaction(async (tx) => {
        const boards = await tx.board.findMany({
            where: { 
                ownerId: userId,
                archived: false,
            },
            orderBy: {
                position: 'asc',
            },
        });
        
        for (let i = 0; i < boards.length; i++) {
            if (boards[i].position !== i + 1) {
                await tx.board.update({
                    where: {
                        id: boards[i].id
                    },
                    data: {
                        position: i + 1,
                    },
                });
            }
        }
    });
};

const archiveBoard = async (data) => {
    const { boardId } = data;

    return prisma.$transaction(async (tx) => {
        await tx.card.updateMany({
            where: {
                column: {
                    boardId,
                },
                archived: false,
            },
            data: {
                archived: true,
            },
        });

        await tx.column.updateMany({
            where: {
                boardId,
                archived: false,
            },
            data: {
                archived: true,
            },
        });

        await tx.board.update({
            where: {
                id: boardId,
            },
            data: {
                archived: true,
            },
        });
    });
};

const unarchiveBoard = async (data) => {
    const { boardId } = data;

    return prisma.$transaction(async (tx) => {
        await tx.card.updateMany({
            where: {
                column: {
                    boardId,
                },
                archived: true,
            },
            data: {
                archived: false,
            },
        });

        await tx.column.updateMany({
            where: {
                boardId,
                archived: true,
            },
            data: {
                archived: false,
            },
        });

        await tx.board.update({
            where: {
                id: boardId,
            },
            data: {
                archived: false,
            },
        });
    });
}

export { getBoardsRepository, getBoardRepository, createBoard, editBoard, deleteBoard, findBoardById, reorderBoards, getBoardsLastPos, archiveBoard, unarchiveBoard };