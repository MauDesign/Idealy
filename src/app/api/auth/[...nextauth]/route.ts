import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth-utils";

// Helper to prevent database queries from hanging
function withTimeout<T>(promise: Promise<T>, ms: number = 1500): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Idealy Admin",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const inputUser = credentials.username.trim();
        const inputPass = credentials.password;

        const envAdminUser = (process.env.ADMIN_USERNAME || "admin").trim();
        const envAdminPass = (process.env.ADMIN_PASSWORD || "password").trim();

        const isEnvMatch =
          (inputUser.toLowerCase() === envAdminUser.toLowerCase() || inputUser === envAdminUser) &&
          inputPass === envAdminPass;

        // 1. FAST PATH: If input matches .env credentials, authorize INSTANTLY!
        if (isEnvMatch) {
          // Sync with database asynchronously in background without blocking response
          (async () => {
            try {
              if (prisma && (prisma as any).user) {
                const existing = await withTimeout(
                  prisma.user.findFirst({
                    where: { OR: [{ username: envAdminUser.toLowerCase() }, { username: 'admin' }] },
                  }),
                  2000
                );

                if (!existing) {
                  await prisma.user.create({
                    data: {
                      name: "Administrador General",
                      username: envAdminUser.toLowerCase(),
                      email: "admin@idealy.com.mx",
                      password: hashPassword(envAdminPass),
                      role: "SUPER_ADMIN",
                      active: true,
                    },
                  });
                }
              }
            } catch (err) {
              console.error("Background DB admin sync error (ignored):", err);
            }
          })();

          return {
            id: "admin-super",
            name: "Administrador General",
            email: "admin@idealy.com.mx",
            role: "SUPER_ADMIN",
          };
        }

        // 2. DATABASE PATH: Search for other registered users in DB
        try {
          if (prisma && (prisma as any).user) {
            const dbUser = await withTimeout(
              prisma.user.findFirst({
                where: {
                  OR: [
                    { username: inputUser.toLowerCase() },
                    { email: inputUser.toLowerCase() },
                    { username: inputUser },
                  ],
                },
              }),
              2000
            );

            if (dbUser && dbUser.active) {
              const isValid = verifyPassword(inputPass, dbUser.password);
              if (isValid) {
                return {
                  id: dbUser.id,
                  name: dbUser.name,
                  email: dbUser.email,
                  role: dbUser.role || "ADMIN",
                };
              }
            }
          }
        } catch (error) {
          console.error("DB Auth check error:", error);
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "f33250f5850974ad05a76985474c3d40",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "SUPER_ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
