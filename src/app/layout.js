import { getServerSession } from "next-auth";
import "./globals.css";
import { AuthProvider } from "./provider";

export const metadata = {
  title: "Injexi | Find Cosmetic Treatment Providers",
  description:
    "Injexi is a pioneering online platform that bridges the gap between consumers & cosmetic treatment professionals. Discover local prices of...",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="en-AU">
      <body>
        {children}
        {/* <AuthProvider session={session}>{children}</AuthProvider> */}
      </body>
    </html>
  );
}
