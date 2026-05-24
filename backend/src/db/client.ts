import { PrismaClient } from "@prisma/client";
import { config } from "../config";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.app.isDev ? ["warn", "error"] : ["error"],
  });

if (config.app.isDev) globalForPrisma.prisma = prisma;

export async function testConnection(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`;
  console.log("Postgres connected via Prisma");
}
