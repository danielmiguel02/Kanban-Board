import { prisma } from "../config/db.js";

const getColumnsRepository = async (boardId) => {

    return prisma.column.findMany({

        where: {
            boardId,
            archived: false
        },

        orderBy: {
            position: "asc"
        }

    });

};

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

const findColumnById = async (columnId) => {
    return prisma.column.findUnique({
        where: {
            id: columnId,
        },
    });
};

const reorderColumns = async (boardId) => {
    return prisma.$transaction(async (tx) => {

        const columns = await tx.column.findMany({
            where: {
                boardId,
                archived: false,
            },
            orderBy: {
                position: "asc",
            },
        });

        for (let i = 0; i < columns.length; i++) {

            if (columns[i].position !== i + 1) {

                await tx.column.update({
                    where: {
                        id: columns[i].id,
                    },
                    data: {
                        position: i + 1,
                    },
                });

            }

        }

    });
};

const moveColumnRepository = async ({ columnId, position }) => {
    return prisma.column.update({
        where: {
            id: columnId,
        },
        data: {
            position,
        },
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

    return prisma.$transaction(async (tx) => {

        await tx.card.updateMany({
            where: {
                columnId,
                archived: true,
            },
            data: {
                archived: false,
            },
        });
        
        await tx.column.update({
            where: {
                id: columnId,
            },
            data: {
                archived: false,
            },
        });
    });
};

const getArchivedColumnsRepository = async (boardId) => {
    return prisma.column.findMany({
        where: {
            boardId,
            archived: true,
        },
        orderBy: {
            position: "asc",
        },
    });
};

export { getColumnsRepository, createColumn, editColumn, deleteColumn, getColumnsLastPos, findColumnById, reorderColumns, moveColumnRepository, archiveColumn, unarchiveColumn, getArchivedColumnsRepository };
