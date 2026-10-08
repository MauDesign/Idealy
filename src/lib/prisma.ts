import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const prismaClientSingleton = () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 10000,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Ensure singleton instance contains the newly generated models ('user' and 'emailCampaign')
export const prisma =
  globalThis.prisma && 'user' in globalThis.prisma && 'emailCampaign' in globalThis.prisma
    ? globalThis.prisma
    : (globalThis.prisma = prismaClientSingleton())

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
