import { DeepgramClient } from '@deepgram/sdk';
import dotenv from 'dotenv';

dotenv.config();

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

if (!DEEPGRAM_API_KEY) {
  throw new Error('DEEPGRAM_API_KEY is not defined');
}

export const createDeepgramConnection = async () => {
  const deepgram = new DeepgramClient({
    apiKey: DEEPGRAM_API_KEY,
  });

  const socket = await deepgram.listen.v1.createConnection({
    model: 'nova-3',
    language: 'en',
    smart_format: true,
    interim_results: true,
    endpointing: 10,
  });

  socket.on('message', (data) => {
    if (data.type === 'Results' && data.channel?.alternatives?.[0]) {
      const transcript = data.channel.alternatives[0].transcript;
      const prefix = data.is_final ? '[FINAL]' : '[Interim]';

      if (transcript) {
        console.log(`${prefix} ${transcript}`);
      }
    }
  });

  socket.on('close', () => {
    console.log('Deepgram connection closed.');
  });

  socket.on('error', (err) => {
    console.error('Deepgram error:', err);
  });

  socket.connect();

  await socket.waitForOpen();

  console.log('Deepgram connection opened.');

  return socket;
};