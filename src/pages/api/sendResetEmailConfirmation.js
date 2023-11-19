// import SendGrid mail service
import sgMail from '@sendgrid/mail';


// Setting the SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send a reset email confirmation
export const sendResetEmailConfirmation = async (email, res) => {
  const msg = {
    to: email,
    from: {
      email: 'cs@injexi.com',
      name: 'Injexi',
    },
    subject: 'Password Reset Successful',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h1 style="background-color: #252525; color: white; padding: 20px; text-align: center;">
          Injexi
        </h1>
        <div style="padding: 20px; text-align: center;">
          <h2>Password Reset Successful</h2>
          <p style="margin-bottom: 30px;">Your password has been successfully reset. If you didn't perform this action, please contact us immediately.</p>
          <a href="${process.env.NEXT_PUBLIC_API_BASE_URL}" style="background-color: #F64CB7; color: white; padding: 14px 20px; margin: 30px 0 30px 0; border: none; cursor: pointer; width: 100%; text-align: center; text-decoration: none; border-radius: 12px;">
            Visit Website
          </a>
        </div>
        <footer style="background-color: #f2f2f2; color: grey; padding: 10px; text-align: center;">
          <p>If you didn't request a password change, please contact customer support.</p>
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
    res.status(200).json({ success: true, message: 'Password reset confirmation email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error sending password reset confirmation email: ${error.message}` });
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
