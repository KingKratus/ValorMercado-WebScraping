import React from 'react';
import { useMutation } from 'react-query';
import { Database } from 'lucide-react';

function DatabaseSync({ data }) {
  const saveMutation = useMutation(async () => {
    const response = await fetch('/api/save-results-to-db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save to database');
    }
    
    return response.json();
  });

  return (
    <div className="flex justify-end">
      <button
        onClick={() => saveMutation.mutate()}
        disabled={!data.length || saveMutation.isLoading}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 flex items-center space-x-2"
      >
        <Database className="h-4 w-4" />
        <span>
          {saveMutation.isLoading ? 'Salvando...' : 'Salvar no Banco de Dados'}
        </span>
      </button>
      
      {saveMutation.isSuccess && (
        <div className="ml-4 text-green-600 text-sm flex items-center">
          ✓ Dados salvos com sucesso!
        </div>
      )}
      
      {saveMutation.isError && (
        <div className="ml-4 text-red-600 text-sm flex items-center">
          ✗ Erro ao salvar: {saveMutation.error?.message}
        </div>
      )}
    </div>
  );
}

export default DatabaseSync;