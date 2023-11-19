import bcrypt from "bcryptjs";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDatabase, getDb } from "../../../../../utilities/mongodb";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          connectDatabase();

          const db = await getDb();
          const collection = db.collection("Users");

          const lowerCaseEmail = credentials.email.toLowerCase();

          const user = await collection.findOne({ email: lowerCaseEmail });

          if (user) {
            const isPasswordValid = bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isPasswordValid) {
              // Update the lastLoggedIn date in the database.
              await collection.updateOne(
                { _id: user._id },
                { $set: { lastLoggedIn: new Date() } }
              );
              
              return user;
            } else {
              throw new Error("Email or password is incorrect");
            }
          } else {
            throw new Error("User not found");
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: "/login/",
    signOut: "/login/",
    newUser: "/dashboard/",
    error: "/login/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          _id: user._id,
          profilePhoto: user.profilePhoto,
          email: user.email,
          name: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          newsletterSubscribed: user.newsletterSubscribed,
          suburb: user.suburb,
          postcode: user.postcode,
          country: user.country,
          isVerified: user.isVerified,
          isPhoneVerified: user.isPhoneVerified,
          profileCompletion: user.profileCompletion
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
