import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { users } from "../../db/schema/users.js";
import { env } from "../../config/env.js";

import type { LoginInput, SignupInput } from "./auth.schema.js";

const SALT_ROUNDS = 10;

export const signup = async (data: SignupInput) => {
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1);

    if (existingUser.length > 0) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(
        data.password,
        SALT_ROUNDS
    );

    const [user] = await db
        .insert(users)
        .values({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        })
        .returning({
            id: users.id,
            name: users.name,
            email: users.email,
        });

    if (!user) {
        throw new Error("Failed to create user");
    }

    const token = jwt.sign(
        { userId: user.id },
        env.jwtSecret,
        { expiresIn: "7d" }
    );

    return {
        user,
        token,
    };
};

export const login = async (data: LoginInput) => {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const passwordValid = await bcrypt.compare(
        data.password,
        user.password
    );

    if (!passwordValid) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        { userId: user.id },
        env.jwtSecret,
        { expiresIn: "7d" }
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        token,
    };
};