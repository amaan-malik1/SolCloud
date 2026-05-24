import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { createUser, findUserByEmail, findUserById } from "../db/queries";
import type { JwtPayload, AuthResponse } from "../types/auth";

const SALT_ROUNDS = 12;

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.auth.jwtSecret, {
    expiresIn: config.auth.jwtExpiresIn,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.auth.jwtSecret) as JwtPayload;
}

export async function register(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) throw new Error("EMAIL_TAKEN");
  if (password.length < 8) throw new Error("PASSWORD_TOO_SHORT");
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser(normalizedEmail, passwordHash);
  const token = signToken({ userId: user.id, email: normalizedEmail });
  return {
    token,
    user: {
      id: user.id,
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await findUserByEmail(normalizedEmail);
  const hashToCompare =
    user?.passwordHash ?? "$2b$12$invalidhashfortimingattackprevention";
  const passwordMatch = await bcrypt.compare(password, hashToCompare);
  if (!user || !passwordMatch) throw new Error("INVALID_CREDENTIALS");
  const token = signToken({ userId: user.id, email: user.email });
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function getMe(userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  return user;
}
