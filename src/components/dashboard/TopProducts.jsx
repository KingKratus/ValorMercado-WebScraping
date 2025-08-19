import React from 'react';
import { useQuery } from 'react-query';
import { Award, TrendingUp } from 'lucide-react';

function TopProducts() {
  const { data: topProductsData, isLoading } = useQuery(
    'top-products',
    async () => {
      // Get products with most searches (by product name frequency)
      const response = await fetch('/api/history?limit=10');
      if (!response.ok) {
        throw new Error('Failed to fetch top products');
      }
      return response.json();
    }
  );

  const formatPrice = (price) => {
    return price ? `R$ ${parseFloat(price).toFixed(2)}` : 'N/A';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Produtos Mais Pesquisados</h3>
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

  const topProducts = topProductsData?.data?.data?.slice(0, 5) || [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Produtos Mais Pesquisados</h3>
        <Award className="h-5 w-5 text-gray-400" />
      </div>
      
      {topProducts.length === 0 ? (
        <div className="text-center py-8">
          <TrendingUp className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Nenhum produto encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topProducts.map((product, index) => (
            <div key={product.id_historico} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-yellow-600">#{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.produto_completo}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{product.marca || 'Sem marca'}</span>
                  <span>•</span>
                  <span>{formatPrice(product.preco)}</span>
                  <span>•</span>
                  <span>{product.mercado}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TopProducts;