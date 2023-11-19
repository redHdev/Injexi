import { useState } from 'react';

export default function Review() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  
  const handleVerification = async () => {
    let formattedPhoneNumber = phoneNumber.trim().replace(/\s+/g, '');
    if (!formattedPhoneNumber.startsWith('+')) {
      formattedPhoneNumber = '+' + formattedPhoneNumber; // Ensure it starts with '+'
    }
  
    try {
      if (formattedPhoneNumber && !otpCode) {
        // Call verifypost.js API route to send OTP
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phoneNumber: formattedPhoneNumber }),
        });
        const data = await response.json();
        console.log(data);
      } else if (formattedPhoneNumber && otpCode) {
        // Encode the phone number before including it in the URL
        const encodedPhoneNumber = encodeURIComponent(formattedPhoneNumber);
        
        // Call verifyget.js API route to verify OTP
        const response = await fetch(`/api/verify?phoneNumber=${encodedPhoneNumber}&code=${otpCode}`);
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error('Error during verification:', error);
    }
  };
  

  return (
    <form>
      <label>
        Phone Number:
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </label>
      <br />
      <label>
        OTP:
        <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} disabled={!phoneNumber} />
      </label>
      <br />
      <button type="button" onClick={handleVerification}>Verify</button>
    </form>
  );
}
