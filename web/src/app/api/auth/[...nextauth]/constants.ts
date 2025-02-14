// import prisma from "@/utils/db/prisma";
import { AuthOptions, User } from "next-auth";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials;

        console.log("credentials", credentials);
        const authenticationResponse = await fetch(
          "https://localhost:7000/api/Auth/Login",
          {
            method: "POST",
            body: JSON.stringify({
              username: email,
              password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const authResponseBody = await authenticationResponse.json();

        const decodedToken: any = jwt.decode(authResponseBody.jwtToken);
        if (!decodedToken) return null;

        const userEmail =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ];
        let userRoles =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];

        if (typeof userRoles === "string") {
          userRoles = [userRoles];
        }

        return {
          id: undefined,
          email: userEmail,
          roles: userRoles,
          token: authResponseBody.jwtToken,
        } as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.token = (user as any).token;
        token.roles = (user as any).roles;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).roles = token.roles;
        (session as any).token = token.token;
      }
      return session;
    },
  },
};
