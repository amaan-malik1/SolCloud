import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

const CURRENT_KEY_VERSION = 1

function getKey(version: number): Buffer {
  const envVar = version === 1 ? 'ENCRYPTION_KEY' : `ENCRYPTION_KEY_V${version}`
  const key = process.env[envVar]
  if (!key) throw new Error(`Missing encryption key for version ${version}: ${envVar}`)
  if (key.length !== 64) throw new Error(`${envVar} must be exactly 64 hex characters (got ${key.length})`)
  return Buffer.from(key, 'hex')
}

export function encrypt(text: string): string {
  const key = getKey(CURRENT_KEY_VERSION)
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return `v${CURRENT_KEY_VERSION}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(data: string): string {
  const parts = data.split(':')

  let version: number
  let ivHex: string
  let authTagHex: string
  let encryptedHex: string

  if (parts.length === 4 && parts[0].startsWith('v')) {
    // New format: v{n}:iv:authTag:ciphertext
    version = parseInt(parts[0].slice(1), 10)
      ;[, ivHex, authTagHex, encryptedHex] = parts
  } else if (parts.length === 3) {
    // Legacy format: iv:authTag:ciphertext (implicit v1)
    version = 1
      ;[ivHex, authTagHex, encryptedHex] = parts
  } else {
    throw new Error('Invalid encrypted data format')
  }

  const key = getKey(version)
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString('utf8')
}

/**
 * Re-encrypts a value with the current key version.
 * Use this in a migration script to rotate old data to new keys.
 */
export function reencrypt(data: string): string {
  const plaintext = decrypt(data)
  return encrypt(plaintext)
}