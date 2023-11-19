import { useSession } from "next-auth/react";
import { AuthProvider } from "@/app/provider";
import { useRouter } from "next/router";

import ProtectedLayout from "@/components/layout/protectedLayout";
import PublicLayout from "@/components/layout/publicLayout";
import NavMenu from "@/components/NavMenu";  // <-- import here

function Main({ component: Component, pageProps }) {
  const router = useRouter();
  const { data: session } = useSession();

  // Logging the current path and session data
 // console.log("Current route in Main:", router.pathname);
 // console.log("Current session in Main:", session);

  return (
    <>
      {session && <NavMenu />}  {/* Conditionally render TopNavBar */}
      {!router?.pathname?.includes("user") ? (
        <PublicLayout>
          <Component {...pageProps} />
        </PublicLayout>
      ) : (
        <ProtectedLayout>
          <Component {...pageProps} />
        </ProtectedLayout>
      )}
    </>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Main component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
