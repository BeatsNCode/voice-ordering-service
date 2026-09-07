import express from 'express';
import loadMenu from './loadMenu.js';
import {transcribeAudio} from './speech/transcribeAudio.js';
import {interpretOrder} from './order/interpretOrder.js';
import {validateOrder} from './order/validateOrder.js';

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

    const contentType = req.headers['content-type']

    const transcript = await transcribeAudio(
        audioBuffer,
        contentType
    )

    const menu = await loadMenu()
    const requestedItems = await interpretOrder(transcript, menu)
    const { available, unavailable } = await validateOrder(transcript, menu)

    console.log('Requested items:', requestedItems)
    console.log('Available items:', available)
    console.log('Unavailable items:', unavailable)
    console.log('Transcript:', transcript)


    res.status(200).json({
        transcript,
        requestedItems: requestedItems,
        availableItems: available,
        unavailableItems: unavailable
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