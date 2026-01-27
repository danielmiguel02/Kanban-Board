import { emailExists, createUser } from '../repositories/authRepository.js';
import { hashPassword } from '../utils/hashPassword.js';

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
        name: createdUser.name,
        email: createdUser.email
    };
};

export { registerUserService };