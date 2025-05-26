require('dotenv').config();
import express, { json } from 'express';
import { config, Lambda } from 'aws-sdk';

const app = express();
app.use(json());

config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const lambda = new Lambda();

app.post('/event', async (req, res) => {
  try {
    const payload = {
      FunctionName: process.env.LAMBDA_NAME,
      InvocationType: 'Event',
      Payload: JSON.stringify(req.body),
    };

    console.log('Sending event to Lambda:', req.body);
    
    await lambda.invoke(payload).promise();

    console.log('Event sent to Lambda:', req.body);
    res.status(200).json({ message: 'Event sent to Lambda' });
  } catch (err) {
    console.error('Lambda invoke error:', err);
    res.status(500).json({ error: 'Failed to send event to Lambda' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Producer service running on port ${PORT}`);
});
