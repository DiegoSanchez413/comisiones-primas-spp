// scraper.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.sbs.gob.pe/app/spp/empleadores/comision_prima.asp', {
    waitUntil: 'domcontentloaded'
  });

  const data = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#tcomi tbody tr'));
    return rows.map(row => {
      const cells = row.querySelectorAll('td');
      return {
        afp: cells[0]?.innerText.trim(),
        tipoComision: cells[1]?.innerText.trim(),
        comisionFlujo: cells[2]?.innerText.trim(),
        comisionMixta: cells[3]?.innerText.trim(),
        prima: cells[4]?.innerText.trim(),
        aporte: cells[5]?.innerText.trim(),
        seguro: cells[6]?.innerText.trim(),
        total: cells[7]?.innerText.trim()
      };
    });
  });

  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const filename = `data/${yearMonth}.json`;

  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));

  console.log(`Saved ${filename}`);

  await browser.close();
})();
