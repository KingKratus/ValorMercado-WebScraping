import { GoogleSpreadsheet } from 'google-spreadsheet';
import dotenv from 'dotenv';

dotenv.config();

export async function syncToGoogleSheets(data) {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  const rows = data.map(item => ({
    Data: new Date().toLocaleDateString(),
    Produto: item.titulo,
    Marca: item.produto.marca,
    Preço: item.produto.preco,
    Mercado: item.mercado,
  }));

  await sheet.addRows(rows);
}