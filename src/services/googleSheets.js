const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

async function syncToGoogleSheets(data) {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  // Validate required environment variables
  if (!process.env.GOOGLE_SHEET_ID) {
    throw new Error('GOOGLE_SHEET_ID environment variable is required');
  }
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is required');
  }
  if (!process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('GOOGLE_PRIVATE_KEY environment variable is required');
  }

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  });

  await doc.loadInfo();
  
  // Get or create the first sheet
  let sheet = doc.sheetsByIndex[0];
  
  // If no sheets exist, create one
  if (!sheet) {
    sheet = await doc.addSheet({ 
      title: 'Produtos Pesquisados',
      headerValues: ['Data', 'Termo Pesquisado', 'Produto', 'Marca', 'Preço', 'Unidade', 'Valor Unidade', 'Mercado']
    });
  } else {
    // Ensure headers exist
    await sheet.loadHeaderRow();
    if (!sheet.headerValues || sheet.headerValues.length === 0) {
      await sheet.setHeaderRow(['Data', 'Termo Pesquisado', 'Produto', 'Marca', 'Preço', 'Unidade', 'Valor Unidade', 'Mercado']);
    }
  }

  const rows = data.map(item => ({
    Data: new Date().toLocaleDateString(),
    'Termo Pesquisado': item.searchedTerm || '',
    Produto: item.titulo,
    Marca: item.produto?.marca || '',
    Preço: item.produto?.preco || 0,
    Unidade: item.produto?.unidade || '',
    'Valor Unidade': item.produto?.valorUnidade || '',
    Mercado: item.mercado,
  }));

  await sheet.addRows(rows);
  
  console.log(`✅ Successfully added ${rows.length} rows to Google Sheets`);
  return { success: true, rowsAdded: rows.length };
}

module.exports = {
  syncToGoogleSheets
};