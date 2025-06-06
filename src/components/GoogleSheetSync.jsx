import React from 'react';
import { useMutation } from 'react-query';

function GoogleSheetSync({ data }) {
  const syncMutation = useMutation(async () => {
    const response = await fetch('/api/sync-sheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    return response.json();
  });

  return (
    <div className="flex justify-end">
      <button
        onClick={() => syncMutation.mutate()}
        disabled={!data.length || syncMutation.isLoading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {syncMutation.isLoading ? 'Sincronizando...' : 'Sincronizar com Google Sheets'}
      </button>
    </div>
  );
}

export default GoogleSheetSync;