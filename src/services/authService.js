import { findUserByEmail, createUser } from '../repositories/authRepository.js';
import { hashPassword, checkPassword } from '../utils/hashPassword.js';
import { generateToken } from '../utils/generateToken.js';

const registerUserService = async (data) => {
    const { name, email, password } = data;

    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    if (await findUserByEmail(email)) {
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

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Email or password is wrong.");
    }

    const isValid = await checkPassword(password, user.password);

    if (!isValid) {
        throw new Error("Email or password is wrong.");
    }

    const token = generateToken({id: user.id });

    return {
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token
        },
    };
};

export { registerUserService, loginUserService };