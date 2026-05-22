import { prisma } from './client'

export async function initIndexerState(): Promise<void> {
  console.log('✅ Indexer state table ready')
}

export async function getLastSignature(): Promise<string | null> {
  const row = await prisma.indexerState.findUnique({
    where: { key: 'last_signature' },
    select: { value: true },
  })
  return row?.value ?? null
}

export async function setLastSignature(signature: string): Promise<void> {
  await prisma.indexerState.upsert({
    where: { key: 'last_signature' },
    create: { key: 'last_signature', value: signature },
    update: { value: signature },
  })
}
