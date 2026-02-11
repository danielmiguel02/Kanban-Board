import { prisma } from "../config/db.js";

const createColumn = async (data) => {
    const { name, position, boardId } = data;

    return prisma.column.create({
        data: {
            name: name,
            position: position,
            boardId: boardId,
        },
    });
};

const editColumn = async (data) => {
    const { name, columnId } = data;

    return prisma.column.update({
        where: {
            id: columnId
        },
        data: {
            name: name
        },
    });
};

const deleteColumn = async (data) => {
    const { columnId } = data;

    return prisma.$transaction(async (tx) => {
        await tx.card.deleteMany({
            where: {
                columnId,
            },
        });

        await tx.column.delete({
            where: {
                id: columnId,
            },
        });
    });
}

const getColumnsLastPos = async (boardId) => {
    return prisma.column.aggregate({
        _max: { position: true },
        where: { boardId: boardId, archived: false }
    });
};

const findOwnedColumn = async (columnId, userId) => {
    return prisma.column.findFirst({
        where: {
            id: columnId,
            board: {
                ownerId: userId,
            },
        },
    });
};

const reorderColumns = async (userId) => {
    return prisma.$transaction(async (tx) => {
        const columns = await tx.column.findMany({
            where: {
                archived: false,
                board: {
                    ownerId: userId,
                },
            },
            orderBy: {
                position: 'asc',
            },
        });

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].position !== i + 1) {
                await tx.column.update({
                    where: {
                        id: columns[i].id
                    },
                    data: {
                        position: i + 1
                    },
                });
            }
        }
    });
};

const archiveColumn = async (data) => {
    const { columnId } = data;

    return prisma.$transaction(async (tx) => {
        await tx.card.updateMany({
            where: {
                columnId,
                archived: false,
            },
            data: {
                archived: true,
            },
        });

        await tx.column.update({
            where: {
                id: columnId,
            },
            data: {
                archived: true,
            },
        });
    });
};

const unarchiveColumn = async (data) => {
    const { columnId } = data;

    return prisma.column.update({
        where: {
            id: columnId,
        },
        data: {
            archived: false,
        },
    });
};

const isColumnArchived = async (columnId) => {
    return prisma.column.findUnique({
        where: {
            id: columnId,
        },
        select: {
            archived: true,
        },
    });
};

export { createColumn, editColumn, deleteColumn, getColumnsLastPos, findOwnedColumn, reorderColumns, archiveColumn, unarchiveColumn, isColumnArchived };
