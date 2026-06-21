import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { prisma } from '../db/client'
import { createUser, findUserByEmail, findUserById } from '../db/queries'
import type { JwtPayload, AuthResponse } from '../types/auth'
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from './email.service'

const SALT_ROUNDS = 12

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.auth.jwtSecret, {
    expiresIn: config.auth.jwtExpiresIn,
  } as jwt.SignOptions)
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.auth.jwtSecret) as JwtPayload
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  const normalizedEmail = email.toLowerCase().trim()

  const existing = await findUserByEmail(normalizedEmail)
  if (existing) throw new Error('EMAIL_TAKEN')
  if (password.length < 8) throw new Error('PASSWORD_TOO_SHORT')

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await createUser(normalizedEmail, passwordHash)

  // Generate verification token
  const verifyToken = crypto.randomBytes(32).toString('hex')
  const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: { verifyToken, verifyTokenExpiry },
  })

  // Send verification email — don't block registration
  sendVerificationEmail(normalizedEmail, verifyToken).catch(err =>
    console.error('[email] Verification send failed:', err.message)
  )

  // tokenVersion starts at 0 for new users
  const token = signToken({ userId: user.id, email: normalizedEmail, tokenVersion: 0 })
  return {
    token,
    user: { id: user.id, email: normalizedEmail, createdAt: new Date().toISOString() },
  }
}

export async function login(email: string, password: string): Promise<AuthResponse & { emailVerified: boolean }> {
  const normalizedEmail = email.toLowerCase().trim()
  const user = await findUserByEmail(normalizedEmail)

  // Timing-safe — always run bcrypt
  const hashToCompare = user?.passwordHash ?? '$2b$12$invalidhashfortimingattackprevention'
  const passwordMatch = await bcrypt.compare(password, hashToCompare)

  if (!user || !passwordMatch) throw new Error('INVALID_CREDENTIALS')

  // Check email verified + get current tokenVersion
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { emailVerified: true, tokenVersion: true },
  })

  const token = signToken({
    userId: user.id,
    email: user.email,
    tokenVersion: fullUser?.tokenVersion ?? 0,
  })

  return {
    token,
    user: { id: user.id, email: user.email, createdAt: new Date().toISOString() },
    emailVerified: fullUser?.emailVerified ?? false,
  }
}

export async function verifyEmail(token: string): Promise<{ email: string }> {
  const user = await prisma.user.findFirst({
    where: {
      verifyToken: token,
      verifyTokenExpiry: { gt: new Date() },
    },
  })

  if (!user) throw new Error('INVALID_TOKEN')

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verifyToken: null,
      verifyTokenExpiry: null,
    },
  })

  // Send welcome email
  sendWelcomeEmail(user.email).catch(() => { })

  return { email: user.email }
}

export async function resendVerification(email: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true, emailVerified: true },
  })

  if (!user) return
  if (user.emailVerified) throw new Error('ALREADY_VERIFIED')

  const verifyToken = crypto.randomBytes(32).toString('hex')
  const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: { verifyToken, verifyTokenExpiry },
  })

  await sendVerificationEmail(email, verifyToken)
}

export async function forgotPassword(email: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true },
  })

  if (!user) return

  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  })

  await sendPasswordResetEmail(email, resetToken)
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  if (newPassword.length < 8) throw new Error('PASSWORD_TOO_SHORT')

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  })

  if (!user) throw new Error('INVALID_TOKEN')

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)

  // Increment tokenVersion — invalidates ALL existing sessions (security: 
  // if password was changed because of compromise, old stolen tokens stop working)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
      tokenVersion: { increment: 1 },
    },
  })
}


export async function invalidateAllSessions(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  })
}

export async function getMe(userId: string) {
  const user = await findUserById(userId)
  if (!user) throw new Error('USER_NOT_FOUND')
  return user
}