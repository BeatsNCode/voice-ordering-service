import csv from 'csv-parser';
import { createReadStream } from 'fs';

const loadMenu = () => {
  const results = []

  return new Promise((resolve, reject) => {
    createReadStream('../../data/menu.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject)
  })
}

export default loadMenu;