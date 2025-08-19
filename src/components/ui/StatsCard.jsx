import React from 'react';
import { clsx } from 'clsx';

function StatsCard({ title, value, icon, trend, trendIcon: TrendIcon, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  const trendColorClasses = trend > 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend !== undefined && TrendIcon && (
            <div className={clsx('flex items-center mt-2 text-sm', trendColorClasses)}>
              <TrendIcon className="h-4 w-4 mr-1" />
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={clsx('p-3 rounded-lg', colorClasses[color])}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;