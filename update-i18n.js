const fs = require('fs');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const GOOGLE_DOCUMENT_ID = process.env.GOOGLE_DOCUMENT_ID;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;

(async () => {
  try {
    console.log('Start processing...');

    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet(GOOGLE_DOCUMENT_ID);
    doc.useApiKey(GOOGLE_API_KEY);

    await doc.loadInfo(); // loads document properties and worksheets

    const sheet = doc.sheetsById[GOOGLE_SHEETS_ID];
    // or
    // const sheet = doc.sheetsByTitle['attestat'];

    sheet.loadHeaderRow();

    // getting all rows
    const rows = await sheet.getRows();

    // getting languages from sheet.headerValues (array of keys)
    const langs = [...sheet.headerValues].filter((value) => value !== 'key');

    // init of new object with lang codes
    const result = langs.reduce((acc, curr) => ((acc[curr] = {}), acc), {});

    // filling translates in object, separated by language
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      langs.forEach((lang) => {
        result[lang][row.key] = row[lang];
      });
    }

    // create folder 'locales' if doesn't exist
    if (!fs.existsSync(`./public/locales`)) fs.mkdirSync(`./public/locales`);

    // create folder for each language if doesn't exist and create file with translates inside this folder
    langs.forEach((lang) => {
      if (!fs.existsSync(`./public/locales/${lang}`)) fs.mkdirSync(`./public/locales/${lang}`);
      fs.writeFile(
        `./public/locales/${lang}/common.json`,
        JSON.stringify(result[lang], null, 2),
        function (err) {
          if (err) return console.log('Error: ', err);
          console.log(`/public/locales/${lang}/common.json - updated`);
        }
      );
    });
  } catch (error) {
    console.error(' ⚠️ ', error);
  }
})();
