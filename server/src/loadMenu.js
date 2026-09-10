import csv from 'csv-parser';
import { createReadStream } from 'fs';

const loadMenu = () => {
  const results = []

  return new Promise((resolve, reject) => {
    createReadStream(new URL('../data/menu.csv', import.meta.url))
      .pipe(csv())
      .on('data', (data) => {
          results.push({
              ...data,
              price: Number(data.price),
              available: data.available === 'TRUE'
          })
      })
      .on('end', () => resolve(results))
      .on('error', reject)
  })
}

export default loadMenu;