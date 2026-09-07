import express from 'express';
import loadMenu from './loadMenu.js';
import {transcribeAudio} from './speech/transcribeAudio.js';
import {interpretOrder} from './order/interpretOrder.js';
import {validateOrder} from './order/validateOrder.js';
import {textToSpeech} from './speech/textToSpeech.js';

const app = express();
const port = 3000;
const host = "127.0.0.1";

app.use(express.json());

app.post('/api/speak', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required'
      });
    }

    const audioStream = await textToSpeech(text);

    const reader = audioStream.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
    }

    const audioBuffer = Buffer.concat(
      chunks.map(chunk => Buffer.from(chunk))
    );

    res.setHeader('Content-Type', 'audio/wav');
    res.send(audioBuffer);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to generate speech'
    });
  }
});

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

    const contentType = req.headers['content-type']

    const transcript = await transcribeAudio(
        audioBuffer,
        contentType
    )

    const menu = await loadMenu()
    const requestedItems = await interpretOrder(transcript, menu)
    const { available, unavailable, invalid } = await validateOrder(transcript, menu)

    console.log('Requested items:', requestedItems)
    console.log('Available items:', available)
    console.log('Unavailable items:', unavailable)
    console.log('Invalid items:', invalid)
    console.log('Transcript:', transcript)


    res.status(200).json({
        transcript,
        requestedItems: requestedItems,
        availableItems: available,
        unavailableItems: unavailable,
        invalidItems: invalid
    })

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