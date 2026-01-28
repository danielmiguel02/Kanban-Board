import { emailExists, createUser } from '../repositories/authRepository.js';
import { hashPassword, checkPassword } from '../utils/hashPassword.js';

const registerUserService = async (data) => {
    const { name, email, password } = data;

    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    if (await emailExists(email)) {
        throw new Error("Email already in use.");
    }

    const hashedPassword = await hashPassword(password);

    const createdUser = await createUser({
        name,
        email,
        password: hashedPassword
    });

    return {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email
    };
};

const loginUserService = async (data) => {
    const { email, password } = data;

    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    if (!await emailExists(email)) {
        throw new Error("Email or password is wrong.");
    }

    if (!checkPassword(password)) {
        throw new Error("Email or password is wrong.")
    }

    return {
        data: {
            user: {
                id: loggedinUser.id,
                name: loggedinUser.name,
                email: loggedinUser.email,
            },
            token: loggedinUser.token
        },
    };
};

export { registerUserService, loginUserService };