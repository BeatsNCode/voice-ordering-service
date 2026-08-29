import express from 'express';
import loadMenu from './loadMenu.js';

const app = express();
const port = 3000;
const host = "127.0.0.1";

app.get('/', async (req, res) => {
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