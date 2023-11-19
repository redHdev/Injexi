import '../../app/globals.css';
import Head from "next/head";
import Footer from "../footer";
import Header from "../header";

import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';

function PublicLayout({ children }) {
    const router = useRouter();
    const isHomepage = router.pathname === '/';
    const { data: session } = useSession();

    // if (session) {
    //     return null;
    // }

    return (
        <>
            <Head>
                <link rel="icon" type="image/png" href="/favicon-32x32.png" />
            </Head>

            {!isHomepage && <Header />} {/* Conditionally render the Header component */}

            {children}

            <Footer />
        </>
    )
}

export default PublicLayout;