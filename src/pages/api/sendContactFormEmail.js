import sgMail from '@sendgrid/mail';

// Setting the SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req, res) => {
  
  const { name, email, topic, location, message, referrer, pageURL } = req.body; // Adding the referrer field

  // Get the user's IP address directly from the request object
  const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Capture the user-agent to get details about user's browser, OS etc.
  const userAgent = req.headers['user-agent'];

  // Capture the date and time of form submission
  const submissionTime = new Date().toISOString();

  // Validate request body
  if (!name || !email || !message) {
    return res.status(400).send('Missing required fields');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email format');
  }

  const msg = {
    to: 'cs@injexi.com',
    from: 'cs@injexi.com',
    subject: `${topic || 'General Inquiry'} from ${name}`,
    html: `
      <strong>Name:</strong> ${name} <br>
      <strong>Email:</strong> ${email} <br>
      <strong>Topic:</strong> ${topic || 'Not Specified'} <br>
      <strong>Location:</strong> ${location || 'Not Specified'} <br>
      <strong>Message:</strong> <br>
      ${message} <br>
      <hr>
      <strong>Page URL:</strong> ${pageURL || 'Not Specified'} <br>
      <strong>Referring Page:</strong> ${referrer || 'Not Specified'} <br>
      <strong>IP Address:</strong> ${userIp} <br>
      <strong>User Agent:</strong> ${userAgent} <br>
      <strong>Submission Time:</strong> ${submissionTime}
    `,
    replyTo: email,
    trackingSettings: {
      clickTracking: {
        enable: false,
      },
    },
  };
  

  try {
    await sgMail.send(msg);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    res.status(500).send(`Error sending email: ${error.message}`);
  }
};

export const config = {
  api: {
    bodyParser: true,
  },
};
