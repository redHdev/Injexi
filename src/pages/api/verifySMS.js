const accountSid = "AC35140c2aae22079cd111a56ab94a8484";
const authToken = "5c45fe4aaca4ded5e5f877b4f44d659a";
const verifySid = "VA1c88375001998e2ca40c786157937b56";
const client = require('twilio')(accountSid, authToken);

export default async (req, res) => {
  if (req.method === 'POST') {
    const { phoneNumber } = req.body;

    try {
      const verification = await client.verify.v2.services(verifySid)
        .verifications
        .create({ to: phoneNumber, channel: 'sms' });

      res.status(200).send({ status: verification.status });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  } else if (req.method === 'GET') {
    const { phoneNumber, code } = req.query;

    if (!code) {
      return res.status(400).send({ error: 'Missing required parameter: code' });
    }

    try {
      const verificationCheck = await client.verify.v2.services(verifySid)
        .verificationChecks
        .create({ to: phoneNumber, code });

      res.status(200).send({ status: verificationCheck.status });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  } else {
    res.status(405).send({ error: 'Only POST and GET methods are allowed' });
  }
};
