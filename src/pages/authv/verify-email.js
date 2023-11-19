import { useEffect, useState } from 'react';
import axios from 'axios'; 

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    // Assuming that the token is in the URL as a query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Token is missing. Unable to verify email.');
      return;
    }

    axios.get(`/api/verifyEmail?token=${token}`)
      .then((response) => {
        setStatus('success');
        setMessage('😍 Email verified successfully!'); // Customize this message
      })
      .catch((error) => {
        setStatus('error');
        setMessage(`😓 Error verifying email: ${error.response?.data?.message || 'Unknown error'}`); // Customize the error message
      });

  }, []);

  return (
    <div class="container">
      <h1>{message}</h1>
      {status === 'verifying' && <p>Please wait...</p>}
      {status === 'success' && <p>You can now <a href="/login/">log in</a></p>}
      {status === 'error' && <p>Please try again or <a href="/contact/">contact support</a></p>}
    </div>
  );
};

export default VerifyEmail;
