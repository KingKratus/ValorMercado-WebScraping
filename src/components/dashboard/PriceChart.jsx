import React from 'react';
import { TrendingUp } from 'lucide-react';

function PriceChart() {
  // Placeholder chart component - you can integrate with a charting library like Chart.js or Recharts
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Evolução de Preços</h3>
        <TrendingUp className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Gráfico de evolução de preços
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Integre com uma biblioteca de gráficos para visualizar dados
          </p>
        </div>
      </div>
    </div>
  );
}

export default PriceChart;