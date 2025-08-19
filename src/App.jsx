import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/pages/Dashboard';
import ProductSearchPage from './components/pages/ProductSearchPage';
import HistoryPage from './components/pages/HistoryPage';

const queryClient = new QueryClient();

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'search':
        return <ProductSearchPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
            <p className="text-gray-600 mt-2">Em desenvolvimento...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        <div className="flex">
          <Sidebar
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          <main className="flex-1 lg:ml-64 pt-16">
            <div className="p-6">
              {renderCurrentPage()}
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;

          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;