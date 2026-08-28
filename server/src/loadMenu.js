const csv = require('csv-parser')
const fs = require('fs')

const loadMenu = () => {
  const results = []

  return new Promise((resolve, reject) => {
    fs.createReadStream('../data/menu.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject)
  })
}

module.exports = loadMenu;