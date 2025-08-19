import React from 'react';
import { useQuery } from 'react-query';
import { 
  TrendingUp, 
  ShoppingCart, 
  Clock, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Search
} from 'lucide-react';
import StatsCard from '../ui/StatsCard';
import RecentSearches from '../dashboard/RecentSearches';
import PriceChart from '../dashboard/PriceChart';
import TopProducts from '../dashboard/TopProducts';

function Dashboard() {
  const { data: statsResponse, isLoading } = useQuery('dashboard-stats', async () => {
    const response = await fetch('/api/dashboard-stats');
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    return response.json();
  });

  const stats = statsResponse?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const formatLastUpdate = (dateString) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Há poucos minutos';
    if (diffInHours < 24) return `Há ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Há ${diffInDays} dias`;
  };

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
          value={formatLastUpdate(stats?.lastUpdate)}
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