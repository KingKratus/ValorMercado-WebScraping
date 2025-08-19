import React from 'react';
import { useQuery } from 'react-query';
import { Clock, Search } from 'lucide-react';

function RecentSearches() {
  const { data: historyData, isLoading } = useQuery(
    'recent-searches',
    async () => {
      const response = await fetch('/api/history?limit=5');
      if (!response.ok) {
        throw new Error('Failed to fetch recent searches');
      }
      return response.json();
    }
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatPrice = (price) => {
    return price ? `R$ ${parseFloat(price).toFixed(2)}` : 'N/A';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pesquisas Recentes</h3>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const recentSearches = historyData?.data?.data || [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Pesquisas Recentes</h3>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
      
      {recentSearches.length === 0 ? (
        <div className="text-center py-8">
          <Search className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Nenhuma pesquisa realizada ainda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentSearches.map((search) => (
            <div key={search.id_historico} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Search className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {search.produto_completo}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{search.mercado}</span>
                  <span>•</span>
                  <span>{formatPrice(search.preco)}</span>
                  <span>•</span>
                  <span>{formatDate(search.data)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentSearches;