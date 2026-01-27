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

const emailExists = async (email) => {
    const exists = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    return exists;
};


export { createUser, emailExists };