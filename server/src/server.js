import express from 'express';
import loadMenu from './loadMenu.js';

const app = express();
const port = 3000;
const host = "127.0.0.1";

app.post('/api/audio', async (req, res) => {
  try {
    const audioBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on('data', (chunk) => {
        chunks.push(chunk);
      });
      req.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      req.on('error', (err) => {
        reject(err);
      });
    });

    // Process the audioBuffer here (e.g., send it to a speech-to-text service)
    console.log('Received audio data:', audioBuffer);
    console.log('Content-Type:', req.headers['content-type'])
    console.log('Audio bytes:', audioBuffer.length)

    res.status(200).json({ message: 'Audio received successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process audio' });
  }
});

app.get('/api', async (req, res) => {
  try {
    const menu = await loadMenu();

    res.json(menu);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Could not load menu'
    });
  }
});

app.listen(port, host, () => {
  console.log(`Voice Ordering Service listening on port ${port}`);
});