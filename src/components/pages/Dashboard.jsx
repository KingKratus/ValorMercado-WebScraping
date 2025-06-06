import React from 'react';
import { useQuery } from 'react-query';
import { 
  TrendingUp, 
  ShoppingCart, 
  Clock, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import StatsCard from '../ui/StatsCard';
import RecentSearches from '../dashboard/RecentSearches';
import PriceChart from '../dashboard/PriceChart';
import TopProducts from '../dashboard/TopProducts';

function Dashboard() {
  const { data: stats, isLoading } = useQuery('dashboard-stats', async () => {
    // Simulated API call - replace with actual endpoint
    return {
      totalSearches: 1247,
      totalProducts: 3456,
      avgPrice: 15.67,
      lastUpdate: new Date().toISOString(),
      searchesGrowth: 12.5,
      productsGrowth: -3.2,
      priceChange: 2.1
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Visão geral dos preços e pesquisas de produtos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Pesquisas"
          value={stats?.totalSearches?.toLocaleString() || '0'}
          icon={<Search className="h-6 w-6" />}
          trend={stats?.searchesGrowth}
          trendIcon={stats?.searchesGrowth > 0 ? ArrowUpRight : ArrowDownRight}
          color="blue"
        />
        
        <StatsCard
          title="Produtos Monitorados"
          value={stats?.totalProducts?.toLocaleString() || '0'}
          icon={<ShoppingCart className="h-6 w-6" />}
          trend={stats?.productsGrowth}
          trendIcon={stats?.productsGrowth > 0 ? ArrowUpRight : ArrowDownRight}
          color="green"
        />
        
        <StatsCard
          title="Preço Médio"
          value={`R$ ${stats?.avgPrice?.toFixed(2) || '0,00'}`}
          icon={<DollarSign className="h-6 w-6" />}
          trend={stats?.priceChange}
          trendIcon={stats?.priceChange > 0 ? ArrowUpRight : ArrowDownRight}
          color="purple"
        />
        
        <StatsCard
          title="Última Atualização"
          value="Há 2 horas"
          icon={<Clock className="h-6 w-6" />}
          color="orange"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceChart />
        <TopProducts />
      </div>

      {/* Recent Activity */}
      <RecentSearches />
    </div>
  );
}

export default Dashboard;