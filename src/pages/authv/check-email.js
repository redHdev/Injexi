// pages/check-email.js
import { useRouter } from "next/router";
import { useState } from "react";
import Head from 'next/head';

export default function CheckEmail() {
  const router = useRouter();
  const { email } = router.query;  // Get the email from query parameter
  const [loading, setLoading] = useState(false);

  // Function to handle resending the email
  const handleResendEmail = async () => {
    setLoading(true);
    const res = await fetch("/api/resendEmailVerify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok && res.status === 200) {
      alert(data.message); // Show a success message
    } else {
      alert(`Failed to resend email: ${data.message}`); // Show an error message
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Check Your Email - Injexi</title>  
      </Head>
    <div className="container">
      <h1>Check Your Email Address</h1>
      {email && <p>We have sent a verification link to <strong>{email}</strong>.</p>}
      <p>Click on the link in the email to complete the verification process.</p>
      <p>You might need to check your spam folder.</p>
      {email && <p>
    If you don't receive an email within 15 minutes, you can
    <a 
      href="#" 
      onClick={handleResendEmail} 
      disabled={loading}
      style={{ color: loading ? 'grey' : 'white', cursor: 'pointer', marginLeft: '5px' }}
    >
      {loading ? "Resending..." : "send again."}
    </a>
  </p>}
  <p>If you have any problems please <a href="/contact/">Contact Us</a></p>
    </div>
    </>
  );
}
