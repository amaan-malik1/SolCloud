import type { ParsedTransactionWithMeta, ParsedInstruction } from '@solana/web3.js'

const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
const MEMO_PROGRAM_V1 = 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo'

export function extractMemo(tx: ParsedTransactionWithMeta): string | null {
  const instructions = tx.transaction.message.instructions
  for (const ix of instructions) {
    const parsed = ix as ParsedInstruction
    if (
      parsed.programId?.toBase58() === MEMO_PROGRAM_ID ||
      parsed.programId?.toBase58() === MEMO_PROGRAM_V1
    ) {
      if (parsed.parsed && typeof parsed.parsed === 'string') {
        return parsed.parsed.trim()
      }
    }
  }
  return null
}

export function parseUserIdFromMemo(memo: string): string | null {
  if (!memo || memo.length > 500) return null
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  const parts = memo.split(':')
  if (parts.length >= 3 && parts[0] === 'solstore') {
    const userId = parts[1]
    if (UUID_REGEX.test(userId)) return userId
  }
  if (UUID_REGEX.test(memo)) return memo
  return null
}
