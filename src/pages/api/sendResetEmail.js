import sgMail from '@sendgrid/mail';

// Setting the SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendResetEmail = async (email, token) => {
  console.log('About to prepare email data');  // Added for debugging
  if (!token) {
    console.log("Token is undefined, skipping email send.");
    return { success: false, message: 'Token is undefined.' };
  }
  const resetUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/authv/change-password/?token=${token}`;
  const msg = {
    to: email,
    from: {
        email: 'cs@injexi.com', 
        name: 'Injexi'
    },
    subject: 'Password Reset Request',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h1 style="background-color: #252525; color: white; padding: 20px; text-align: center;">
        Password Reset Request
      </h1>
      <div style="padding: 20px; text-align: center;">
        <h2>Reset Your Password</h2>
        <p style="margin-bottom: 30px;">You have requested to reset your password. To proceed, click on the button below.</p>
        <a href="${resetUrl}" style="background-color: #F64CB7; color: white; padding: 14px 20px; margin: 30px 0 30px 0; border: none; cursor: pointer; width: 100%; text-align: center; text-decoration: none; border-radius: 12px;">
         Reset Password
        </a>
       <p style="margin-top: 30px;">Or copy and paste this link into your browser:</p>
       <p>${resetUrl}</p>
      </div>
      <footer style="background-color: #f2f2f2; color: grey; padding: 10px; text-align: center;">
        <p>If you did not request a password reset, you can safely ignore this email.</p>
      </footer>
    </div>`,
    trackingSettings: {
      clickTracking: {
        enable: true,
      },
    },
  };

  console.log('About to send email...');  // Added for debugging
  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');  // Added for debugging
    return { success: true, message: 'Reset email sent successfully.' };
  } catch (error) {
    console.log('Error occurred while sending email:', error.message);  // Added for debugging
    return { success: false, message: `Error sending reset email: ${error.message}` };
  }
};

// Main function for API route
export default async (req, res) => {
  console.log('Entered sendResetEmail API');  // Added for debugging
  const { email, token } = req.body;
  console.log(`Received email and token: ${email}, ${token}`);  // Added for debugging
  console.log("About to send reset email");
  const result = await sendResetEmail(email, token);
  console.log("Finished sending reset email");

  console.log(`Email sending result: ${JSON.stringify(result)}`);  // Added for debugging

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

export const config = {
  api: {
    bodyParser: true,
  },
};
