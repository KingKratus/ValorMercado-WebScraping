import React, { useState } from 'react';
import { useMutation } from 'react-query';

function ProductSearch({ onResults }) {
  const [searchTerms, setSearchTerms] = useState('');

  const searchMutation = useMutation(async (terms) => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ terms }),
    });
    return response.json();
  }, {
    onSuccess: (data) => {
      onResults(data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    searchMutation.mutate(searchTerms);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Produtos para pesquisar
          </label>
          <textarea
            id="search"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="4"
            value={searchTerms}
            onChange={(e) => setSearchTerms(e.target.value)}
            placeholder="Digite os produtos, um por linha"
          />
        </div>
        <button
          type="submit"
          disabled={searchMutation.isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {searchMutation.isLoading ? 'Pesquisando...' : 'Pesquisar'}
        </button>
      </form>
    </div>
  );
}

export default ProductSearch;