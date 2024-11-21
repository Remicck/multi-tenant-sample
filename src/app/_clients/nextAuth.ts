import { prisma } from "@/app/_clients/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/signin",
  },
  // https://github.com/nextauthjs/next-auth/issues/9493
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      return baseUrl;
    },
    session: async ({ session, user }) => {
      if (session?.user) {
        // ユーザーIDとロールをセッションに含める
        session.user.id = user.id;

        // テナント情報を取得してセッションに含める
        const tenantUsers = await prisma.tenantUser.findMany({
          where: {
            userId: user.id,
          },
          include: {
            tenant: true,
          },
        });

        session.user.tenants = tenantUsers.map((tu) => ({
          id: tu.tenant.id,
          name: tu.tenant.name,
          role: tu.role,
        }));
      }
      return session;
    },
  },
};
