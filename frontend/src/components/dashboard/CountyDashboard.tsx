import React, { useState, useEffect } from 'react';
import CountyClimateVisualization from './CountyClimateVisualization';

interface County {
  id: number;
  name: string;
  capital: string;
  climate_zone: string;
  population: number;
  area_km2: number;
  elevation_m: number;
}

interface CountyComparisonData {
  county_id: number;
  county_name: string;
  averages: {
    temperature: number;
    rainfall: number;
    humidity: number;
    ndvi: number;
  };
  trends: {
    temperature: string;
    rainfall: string;
    ndvi: string;
  };
  drought_risk: number;
}

interface CountyDashboardProps {
  selectedCounties?: number[];
}

const CountyDashboard: React.FC<CountyDashboardProps> = ({ 
  selectedCounties = [1, 2, 3] // Default to first 3 counties
}) => {
  const [allCounties, setAllCounties] = useState<County[]>([]);
  const [selectedCountyIds, setSelectedCountyIds] = useState<number[]>(selectedCounties);
  const [comparisonData, setComparisonData] = useState<CountyComparisonData[]>([]);
  const [viewMode, setViewMode] = useState<'individual' | 'comparison'>('individual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all counties on component mount
  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const response = await fetch('/api/climate/counties');
        if (!response.ok) throw new Error('Failed to fetch counties');
        const data = await response.json();
        setAllCounties(data.counties || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load counties');
      }
    };
    
    fetchCounties();
  }, []);

  // Fetch comparison data when counties are selected
  useEffect(() => {
    if (selectedCountyIds.length > 0) {
      fetchComparisonData();
    }
  }, [selectedCountyIds]);

  const fetchComparisonData = async () => {
    if (selectedCountyIds.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const countyIdsStr = selectedCountyIds.join(',');
      const response = await fetch(`/api/climate/comparison?county_ids=${countyIdsStr}&months=12`);
      
      if (!response.ok) throw new Error('Failed to fetch comparison data');
      
      const data = await response.json();
      setComparisonData(data.comparison_data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comparison data');
    } finally {
      setLoading(false);
    }
  };

  const handleCountySelection = (countyId: number, selected: boolean) => {
    if (selected) {
      if (selectedCountyIds.length < 5) { // Limit to 5 counties for performance
        setSelectedCountyIds([...selectedCountyIds, countyId]);
      }
    } else {
      setSelectedCountyIds(selectedCountyIds.filter(id => id !== countyId));
    }
  };

  const getSelectedCounties = () => {
    return allCounties.filter(county => selectedCountyIds.includes(county.id));
  };

  const getRiskLevelColor = (riskLevel: number): string => {
    if (riskLevel >= 0.8) return 'text-red-600 bg-red-100';
    if (riskLevel >= 0.6) return 'text-orange-600 bg-orange-100';
    if (riskLevel >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getRiskLevelText = (riskLevel: number): string => {
    if (riskLevel >= 0.8) return 'Very High';
    if (riskLevel >= 0.6) return 'High';
    if (riskLevel >= 0.4) return 'Moderate';
    return 'Low';
  };

  if (loading && comparisonData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Kenya Climate Monitoring Dashboard
        </h1>
        
        {/* County Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Counties to Monitor</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto border rounded p-4">
            {allCounties.map(county => (
              <label key={county.id} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCountyIds.includes(county.id)}
                  onChange={(e) => handleCountySelection(county.id, e.target.checked)}
                  className="rounded"
                />
                <span className="truncate">{county.name}</span>
                <span className="text-gray-500 text-xs">({county.climate_zone})</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Selected: {selectedCountyIds.length}/5 counties
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('individual')}
              className={`px-4 py-2 rounded ${
                viewMode === 'individual' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Individual Views
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-4 py-2 rounded ${
                viewMode === 'comparison' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Comparison View
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Comparison Overview */}
      {viewMode === 'comparison' && comparisonData.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">County Comparison Overview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">County</th>
                  <th className="px-4 py-2 text-left">Climate Zone</th>
                  <th className="px-4 py-2 text-left">Avg Temp (°C)</th>
                  <th className="px-4 py-2 text-left">Avg Rainfall (mm)</th>
                  <th className="px-4 py-2 text-left">Avg NDVI</th>
                  <th className="px-4 py-2 text-left">Drought Risk</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((county, index) => {
                  const countyInfo = allCounties.find(c => c.id === county.county_id);
                  return (
                    <tr key={county.county_id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-2 font-semibold">{county.county_name}</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {countyInfo?.climate_zone || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-2">{county.averages.temperature.toFixed(1)}</td>
                      <td className="px-4 py-2">{county.averages.rainfall.toFixed(1)}</td>
                      <td className="px-4 py-2">{county.averages.ndvi.toFixed(3)}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${getRiskLevelColor(county.drought_risk)}`}>
                          {getRiskLevelText(county.drought_risk)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Individual County Views */}
      {viewMode === 'individual' && (
        <div className="space-y-8">
          {getSelectedCounties().map(county => (
            <div key={county.id} className="bg-white shadow-lg rounded-lg p-6">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{county.name} County</h2>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <span><strong>Capital:</strong> {county.capital}</span>
                  <span><strong>Climate Zone:</strong> {county.climate_zone}</span>
                  <span><strong>Population:</strong> {county.population.toLocaleString()}</span>
                  <span><strong>Area:</strong> {county.area_km2.toLocaleString()} km²</span>
                  <span><strong>Elevation:</strong> {county.elevation_m.toLocaleString()} m</span>
                </div>
              </div>
              
              <CountyClimateVisualization 
                countyId={county.id} 
                countyName={county.name}
              />
            </div>
          ))}
          
          {selectedCountyIds.length === 0 && (
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <p className="text-gray-600 text-lg">
                Please select counties from the list above to view their climate data.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats Summary */}
      {selectedCountyIds.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-blue-700">Counties Monitored</h3>
              <p className="text-2xl font-bold text-blue-900">{selectedCountyIds.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-green-700">Climate Zones</h3>
              <p className="text-2xl font-bold text-green-900">
                {new Set(getSelectedCounties().map(c => c.climate_zone)).size}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-yellow-700">Total Population</h3>
              <p className="text-2xl font-bold text-yellow-900">
                {getSelectedCounties().reduce((sum, c) => sum + c.population, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-purple-700">Total Area</h3>
              <p className="text-2xl font-bold text-purple-900">
                {getSelectedCounties().reduce((sum, c) => sum + c.area_km2, 0).toLocaleString()} km²
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountyDashboard;
