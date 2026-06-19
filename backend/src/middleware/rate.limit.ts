import rateLimit from 'express-rate-limit'

// Auth endpoints — brute force protection 
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: { error: 'Too many attempts, please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Email-sending endpoints — prevent email bombing 
export const emailRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 emails per IP per hour
  message: { error: 'Too many email requests, please try again in an hour' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Registration — prevent mass account creation 
export const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 registrations per IP per hour
  message: { error: 'Too many accounts created from this network, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Credential viewing — already existed, kept as-is 
export const credentialRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: 'Too many credential requests, slow down' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Key regeneration — sensitive, tightly limited 
export const regenerateRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 regenerations per hour
  message: { error: 'Too many regeneration requests, please wait before trying again' },
  standardHeaders: true,
  legacyHeaders: false,
})

// General API — soft global limit 
export const generalApiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  message: { error: 'Too many requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
})