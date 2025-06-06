import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import ProductSearch from './components/ProductSearch';
import ResultsTable from './components/ResultsTable';
import GoogleSheetSync from './components/GoogleSheetSync';

const queryClient = new QueryClient();

function App() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Valor Mercado</h1>
        <div className="max-w-7xl mx-auto">
          <ProductSearch onResults={setSearchResults} />
          <div className="mt-8">
            <ResultsTable results={searchResults} />
          </div>
          <div className="mt-8">
            <GoogleSheetSync data={searchResults} />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;