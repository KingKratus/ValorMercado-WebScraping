const express = require('express');
const cors = require('cors');
const { syncToGoogleSheets } = require('./src/services/googleSheets');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/sync-sheets', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ 
        error: 'Invalid data format. Expected an array of products.' 
      });
    }

    if (data.length === 0) {
      return res.status(400).json({ 
        error: 'No data provided to sync.' 
      });
    }

    // Flatten the data structure to match the expected format
    const flattenedData = [];
    
    data.forEach(mercado => {
      if (mercado.produtos) {
        mercado.produtos.forEach(produto => {
          if (produto.results) {
            produto.results.forEach(result => {
              flattenedData.push({
                ...result,
                mercado: mercado.mercado,
                searchedTerm: produto.searchedTerm
              });
            });
          }
        });
      }
    });

    await syncToGoogleSheets(flattenedData);
    
    res.json({ 
      success: true, 
      message: `Successfully synced ${flattenedData.length} products to Google Sheets.`,
      syncedCount: flattenedData.length
    });
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error);
    res.status(500).json({ 
      error: 'Failed to sync data to Google Sheets',
      details: error.message 
    });
  }
});

// Search products endpoint (integrates with existing scraping functionality)
app.post('/api/search', async (req, res) => {
  try {
    const { terms } = req.body;
    
    if (!terms || typeof terms !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid search terms. Expected a string.' 
      });
    }

    // Convert terms string to array (split by lines and filter empty)
    const searchArray = terms.split('\n')
      .map(term => term.trim())
      .filter(term => term.length > 0);

    if (searchArray.length === 0) {
      return res.status(400).json({ 
        error: 'No valid search terms provided.' 
      });
    }

    // Use existing scraping functionality
    const { pesquisa } = require('./src/pesquisar');
    
    // Temporarily override the search terms
    const fs = require('fs');
    const path = require('path');
    const originalSearchFile = path.join(__dirname, 'docs/searchFor/searchFor.txt');
    const backupContent = fs.readFileSync(originalSearchFile, 'utf-8');
    
    // Write new search terms
    fs.writeFileSync(originalSearchFile, searchArray.join(',\n'));
    
    try {
      const results = await pesquisa();
      
      // Restore original search file
      fs.writeFileSync(originalSearchFile, backupContent);
      
      res.json(results);
    } catch (searchError) {
      // Restore original search file even if search fails
      fs.writeFileSync(originalSearchFile, backupContent);
      throw searchError;
    }
    
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ 
      error: 'Failed to search products',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'ValorMercado API'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ValorMercado API server running on http://localhost:${PORT}`);
  console.log(`📊 Google Sheets integration ready`);
  console.log(`🔍 Product search API available`);
});

module.exports = app;