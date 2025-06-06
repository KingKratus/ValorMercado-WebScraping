import React from 'react';
import { 
  BarChart3, 
  Search, 
  History, 
  Settings, 
  X,
  ShoppingCart 
} from 'lucide-react';
import { clsx } from 'clsx';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'search', label: 'Pesquisar Produtos', icon: Search },
  { id: 'history', label: 'Histórico', icon: History },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

function Sidebar({ currentPage, onPageChange, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={clsx(
        "fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Valor Mercado</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 pt-20 lg:pt-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onPageChange(item.id);
                        onClose();
                      }}
                      className={clsx(
                        "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200",
                        isActive 
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className={clsx(
                        "h-5 w-5",
                        isActive ? "text-blue-700" : "text-gray-500"
                      )} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Valor Mercado v1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;