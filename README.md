# comisiones-primas-spp

Web scraping automatizado de comisiones y primas del SPP (SBS Perú). Los datos se actualizan por periodo y se almacenan en formato JSON para su uso en otras aplicaciones. Automatizado con GitHub Actions, sin necesidad de servidor externo.

## 🔗 Cómo consultar los datos

Puedes acceder directamente a los datos en formato JSON usando la siguiente URL:

https://raw.githubusercontent.com/DiegoSanchez413/comisiones-primas-spp/main/data/2025-07.json

Solo necesitas cambiar el periodo (`2025-07`) por el año y mes deseado en formato `YYYY-MM`.

> ⚠️ **Nota**: Los datos están disponibles a partir de **julio 2025** (`2025-07`). Periodos anteriores no están soportados.

🔄 Frecuencia de actualización
Los datos se actualizan automáticamente todos los días a la 1:00 a.m. hora de Perú mediante un proceso de web scraping automatizado con GitHub Actions.

Esto garantiza que siempre tengas acceso a la información más reciente publicada por la SBS.

## 🛠️ Ejemplo de uso manual

Puedes ejecutar el scraper manualmente para una fecha específica (formato DD/MM/YYYY):

npm run scrape 2025-10

Si no proporcionas una fecha, el bot usará automáticamente la fecha del día actual.