// FIX: The import from '@prisma/client/edge' was causing a TypeScript error because
// PrismaClient is not exported from that module. Changed to the standard '@prisma/client' import.
// For this to work in an edge environment, the `schema.prisma` file must be correctly
// configured with `engineType = "library"` in the `generator client` block.
import { PrismaClient } from '@prisma/client';

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
