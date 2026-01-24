import { prisma } from "../config/db.js";

const createUser = async (data) => {
    const { name, email, hashedPassword } = data;

    prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
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