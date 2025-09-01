
// FIX: The named import for PrismaClient can fail due to module resolution issues.
// Switched to a namespace import ('* as Prisma') which is more robust against such problems.
import * as Prisma from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: 
// https://pris.ly/d/help/next-js-best-practices

// FIX: Replaced non-standard `global` with `globalThis` to fix a TypeScript error where `global` was not defined. `globalThis` is a standard way to access the global object.
// FIX: Update PrismaClient type to use the imported namespace.
const globalForPrisma = globalThis as unknown as { prisma: Prisma.PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  // FIX: Instantiate PrismaClient from the imported namespace.
  new Prisma.PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
