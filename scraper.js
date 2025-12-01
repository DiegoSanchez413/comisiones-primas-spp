const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

    // Leer parámetro opcional
    const periodo = process.argv[2]; // ej: "2025-09"

    const browser = await puppeteer.launch({
        headless: 'new',
        // headless: false,
        slowMo: 50,
        defaultViewport: null,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(
        'https://www.sbs.gob.pe/app/spp/empleadores/comisiones_spp/paginas/comision_prima.aspx',
        { waitUntil: 'domcontentloaded' }
    );

    // Si se envió un periodo -> seleccionarlo
    if (periodo) {
        console.log(`📌 Seleccionando periodo enviado: ${periodo}`);

        await page.waitForSelector('#cboPeriodo');

        // Validar que exista opción en el select
        const existePeriodo = await page.evaluate((p) => {
            const opt = document.querySelector(`#cboPeriodo option[value="${p}"]`);
            return Boolean(opt);
        }, periodo);

        if (!existePeriodo) {
            console.error(`❌ El periodo ${periodo} no existe en el select`);
            await browser.close();
            process.exit(1);
        }

        await page.select('#cboPeriodo', periodo);

        await page.click('#btnConsultar');
        await page.waitForTimeout(700); // esperar que refresque tabla
    }

    // Ahora leer datos (sea con parámetro o sin parámetro)
    await page.waitForSelector('#lblMes1');

    const data = await page.evaluate(() => {
        const mes = document.querySelector('#lblMes1')?.innerText.trim();

        const rows = Array.from(document.querySelectorAll('tr.JER_filaContenido'));

        const result = rows.map(row => {
            const cells = row.querySelectorAll('td');
            return {
                afp: cells[0]?.innerText.trim(),
                comision_flujo: cells[1]?.innerText.trim(),
                comision_saldo: cells[2]?.innerText.trim(),
                prima_seguro: cells[3]?.innerText.trim(),
                aporte_obligatorio: cells[4]?.innerText.trim(),
                remuneracion_maxima: cells[5]?.innerText.trim(),
            };
        });

        return {
            periodo: mes,
            datos: result
        };
    });

    // Crear carpeta data si no existe
    if (!fs.existsSync('data')) {
        fs.mkdirSync('data');
    }

    fs.writeFileSync(`data/${data.periodo}.json`, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Datos guardados en data/${data.periodo}.json`);

    await browser.close();
})();
