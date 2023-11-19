import sgMail from '@sendgrid/mail';

// Setting the SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/authv/verify-email/?token=${token}`;
  const msg = {
    to: email,
    from: {
        email: 'cs@injexi.com', 
        name: 'Injexi'
      },
    subject: 'Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h1 style="background-color: #252525; color: white; padding: 20px; text-align: center;">
          Welcome to Injexi
        </h1>
        <div style="padding: 20px; text-align: center;">
          <h2>Verify Your Email Address</h2>
          <p style="margin-bottom: 30px;">Thank you for signing up with us. To complete the registration process, you need to verify your email address.</p>
          <a href="${verificationUrl}" style="background-color: #F64CB7; color: white; padding: 14px 20px; margin: 30px 0 30px 0; border: none; cursor: pointer; width: 100%; text-align: center; text-decoration: none; border-radius: 12px;">
            Verify Email
          </a>
          <p style="margin-top: 30px;">Or copy and paste this link into your browser:</p>
          <p>${verificationUrl}</p>
        </div>
        <footer style="background-color: #f2f2f2; color: grey; padding: 10px; text-align: center;">
          <p>If you did not sign up for an Injexi account, you can ignore this email.</p>
        </footer>
      </div>
    `,
    trackingSettings: {
      clickTracking: {
        enable: true,
      },
    },
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: 'Verification email sent successfully' };
  } catch (error) {
    return { success: false, message: `Error sending verification email: ${error.message}` };
  }
};

// Existing function to handle general inquiries
export default async (req, res) => {
  // ... (your existing code)
};

export const config = {
  api: {
    bodyParser: true,
  },
};
