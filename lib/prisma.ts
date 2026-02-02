import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const getPrisma = (): PrismaClient => {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient({
            log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
        });
    }
    return globalForPrisma.prisma;
};

// Use a Proxy to defer instantiation until a property is actually accessed.
// This prevents Next.js from triggering the Prisma constructor during build-time module imports.
export const prisma = new Proxy({} as PrismaClient, {
    get: (target, prop, receiver) => {
        const p = getPrisma();
        const value = Reflect.get(p, prop, receiver);
        if (typeof value === 'function') {
            return value.bind(p);
        }
        return value;
    },
});
