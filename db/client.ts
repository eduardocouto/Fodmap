// FIX: Changed import to use @prisma/client/edge which is required for edge environments like Vercel Serverless Functions.
import { PrismaClient } from '@prisma/client/edge';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: 
// https://pris.ly/d/help/next-js-best-practices

// FIX: Replaced non-standard `global` with `globalThis` to fix a TypeScript error where `global` was not defined. `globalThis` is a standard way to access the global object.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
