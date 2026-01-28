import { prisma } from "../config/db.js";

const createUser = async (data) => {
    const { name, email, password } = data;

    return prisma.user.create({
        data: {
            name: name,
            email: email,
            password: password,
        },
    });
};

const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
};


export { createUser, findUserByEmail };