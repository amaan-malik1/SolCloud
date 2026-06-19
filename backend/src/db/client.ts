import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export async function testConnection(): Promise<void> {
  let attempts = 0
  const MAX_ATTEMPTS = 5

  while (attempts < MAX_ATTEMPTS) {
    try {
      await prisma.$queryRaw`SELECT 1`
      console.log('Postgres connected via Prisma')
      return
    } catch (err: any) {
      attempts++
      if (attempts >= MAX_ATTEMPTS) throw err
      console.warn(`[db] Connection attempt ${attempts} failed — retrying in 3s...`)
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
  }
}