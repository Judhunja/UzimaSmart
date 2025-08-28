import React, { useState } from 'react';
import CountyDashboard from './components/dashboard/CountyDashboard';
import DroughtRiskAssessment from './components/assessment/DroughtRiskAssessment';

type ViewMode = 'dashboard' | 'drought-assessment' | 'county-comparison';

interface AppState {
  currentView: ViewMode;
  selectedCounties: number[];
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'dashboard',
    selectedCounties: [1, 2, 3] // Default to first 3 counties
  });

  const navigationItems = [
    {
      id: 'dashboard' as ViewMode,
      label: 'Climate Dashboard',
      description: 'View detailed climate data and predictions for selected counties',
      icon: '🌤️'
    },
    {
      id: 'drought-assessment' as ViewMode,
      label: 'Drought Risk Assessment',
      description: 'Monitor drought conditions and risk levels across all counties',
      icon: '🚨'
    }
  ];

  const renderCurrentView = () => {
    switch (appState.currentView) {
      case 'dashboard':
        return (
          <CountyDashboard 
            selectedCounties={appState.selectedCounties}
          />
        );
      case 'drought-assessment':
        return <DroughtRiskAssessment />;
      default:
        return <CountyDashboard selectedCounties={appState.selectedCounties} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🌍 UzimaSmart Climate Monitoring
              </h1>
              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                All 47 Kenya Counties
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Real-time Climate Data & Predictions
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setAppState({ ...appState, currentView: item.id })}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  appState.currentView === item.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* View Description */}
          <div className="mb-6">
            {navigationItems.map((item) => (
              appState.currentView === item.id && (
                <div key={item.id} className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-blue-800">
                        {item.label}
                      </h3>
                      <p className="text-blue-700 text-sm mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Current View Content */}
          {renderCurrentView()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Data Sources:</span>
                <span className="ml-2">NASA GIBS • Enhanced Climate Service</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
              <div className="text-sm text-gray-500">
                Last Updated: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">47</div>
                <div className="text-sm text-gray-600">Counties Monitored</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">6</div>
                <div className="text-sm text-gray-600">Climate Zones</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Monitoring</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">6 Mo</div>
                <div className="text-sm text-gray-600">Predictions</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
