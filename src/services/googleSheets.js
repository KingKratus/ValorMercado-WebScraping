import { GoogleSpreadsheet } from 'google-spreadsheet';
import dotenv from 'dotenv';

dotenv.config();

export async function syncToGoogleSheets(data) {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    // Ensure private key is properly formatted
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    });

    await doc.loadInfo();
    // Consider making sheet name/index configurable if necessary
    const sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      throw new Error('Google Sheet not found (index 0).');
    }

    const rows = data.map(item => ({
      Data: new Date().toLocaleDateString(),
      Produto: item.titulo,
      // Ensure nested properties exist or handle potential errors
      Marca: item.produto ? item.produto.marca : 'N/A',
      Preço: item.produto ? item.produto.preco : 'N/A',
      Mercado: item.mercado,
    }));

    await sheet.addRows(rows);
    console.log('Data successfully synced to Google Sheets.');
    return { success: true, message: 'Data synced successfully.' };
  } catch (error) {
    console.error('Failed to sync data to Google Sheets:', error);
    // Rethrow or return a structured error object
    throw new Error(`Google Sheets sync failed: ${error.message}`);
  }
}