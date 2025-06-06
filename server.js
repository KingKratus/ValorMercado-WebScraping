const express = require('express');
const path = require('path'); // Added path module
const { pesquisa } = require('./src/pesquisar'); // Assuming pesquisar.js is in src
const { syncToGoogleSheets } = require('./src/services/googleSheets');
const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Original GET / route - can be removed if static serving index.html is preferred as default
// app.get('/', (req, res) => {
//   res.send('Server is running');
// });

// POST route for /api/search
app.post('/api/search', async (req, res) => {
  try {
    const { terms } = req.body;
    if (!terms || typeof terms !== 'string') {
      return res.status(400).json({ error: "Invalid input: 'terms' must be a string." });
    }
    const searchTerms = terms.split('\n').map(term => term.trim()).filter(term => term.length > 0);

    if (searchTerms.length === 0) {
      return res.status(400).json({ error: "Invalid input: No search terms provided." });
    }

    const results = await pesquisa(searchTerms);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error during /api/search:', error);
    res.status(500).json({ error: "Failed to scrape products", details: error.message });
  }
});

// POST route for /api/sync-sheets
app.post('/api/sync-sheets', async (req, res) => {
  try {
    const { data } = req.body;

    // Basic validation for data
    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid input: 'data' must be a non-empty array."
      });
    }

    const syncResult = await syncToGoogleSheets(data);
    res.status(200).json({
      success: true,
      message: "Data synced successfully to Google Sheets.",
      details: syncResult // Contains { success: true, message: 'Data synced successfully.' }
    });
  } catch (error) {
    console.error('Error during /api/sync-sheets:', error);
    res.status(500).json({
      success: false,
      error: "Failed to sync data to Google Sheets.",
      details: error.message
    });
  }
});

// Catch-all GET route to serve index.html for client-side routing
// This should be after all API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
