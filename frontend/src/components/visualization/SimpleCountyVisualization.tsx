import React, { useState, useEffect } from 'react';

interface CountyVisualizationProps {
  countyId: number;
  countyName: string;
}

interface ClimateData {
  dates: string[];
  temperature: number[];
  rainfall: number[];
  humidity: number[];
  ndvi: number[];
  predictions?: {
    dates: string[];
    temperature: number[];
    rainfall: number[];
    humidity: number[];
    ndvi: number[];
    confidence: number[];
  };
}

const CountyClimateVisualization: React.FC<CountyVisualizationProps> = ({ 
  countyId, 
  countyName 
}) => {
  const [timeframe, setTimeframe] = useState('12_months');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [includePredictions, setIncludePredictions] = useState(true);
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClimateData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/climate/counties/${countyId}/visualization-data?timeframe=${timeframe}&include_predictions=${includePredictions}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch climate data');
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Transform the data for visualization
      const transformedData: ClimateData = {
        dates: result.historical.time_series.dates || [],
        temperature: result.historical.time_series.temperature || [],
        rainfall: result.historical.time_series.rainfall || [],
        humidity: result.historical.time_series.humidity || [],
        ndvi: result.historical.time_series.ndvi || []
      };
      
      // Add predictions if available
      if (result.predictions && result.predictions.time_series) {
        transformedData.predictions = {
          dates: result.predictions.time_series.dates || [],
          temperature: result.predictions.time_series.temperature || [],
          rainfall: result.predictions.time_series.rainfall || [],
          humidity: result.predictions.time_series.humidity || [],
          ndvi: result.predictions.time_series.ndvi || [],
          confidence: result.predictions.time_series.confidence || []
        };
      }
      
      setClimateData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClimateData();
  }, [countyId, timeframe, includePredictions]);

  const createSimpleChart = (data: number[], label: string, color: string) => {
    if (!data || data.length === 0) return null;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">{label}</h4>
        <div className="h-32 flex items-end space-x-1 bg-gray-50 p-2 rounded">
          {data.slice(-20).map((value, index) => {
            const height = range > 0 ? ((value - min) / range) * 100 : 50;
            return (
              <div
                key={index}
                className="flex-1 rounded-t"
                style={{
                  height: `${height}%`,
                  backgroundColor: color,
                  minHeight: '2px'
                }}
                title={`${value.toFixed(2)}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>Min: {min.toFixed(2)}</span>
          <span>Max: {max.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Data</p>
          <p className="text-sm mt-2">{error}</p>
          <button 
            onClick={fetchClimateData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          🌤️ Climate Visualization - {countyName}
        </h3>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Timeframe:</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="3_months">3 Months</option>
              <option value="6_months">6 Months</option>
              <option value="12_months">12 Months</option>
              <option value="24_months">24 Months</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Metric:</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="all">All Metrics</option>
              <option value="temperature">Temperature Only</option>
              <option value="rainfall">Rainfall Only</option>
              <option value="humidity">Humidity Only</option>
              <option value="ndvi">Vegetation (NDVI) Only</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="predictions"
              checked={includePredictions}
              onChange={(e) => setIncludePredictions(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="predictions" className="text-sm font-medium">
              Include Predictions
            </label>
          </div>
          
          <button 
            onClick={fetchClimateData}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Charts */}
      {climateData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(selectedMetric === 'all' || selectedMetric === 'temperature') && (
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                🌡️ Temperature (°C)
              </h4>
              {createSimpleChart(climateData.temperature, 'Temperature Trend', '#ef4444')}
              <div className="mt-2 text-sm text-gray-600">
                <span>Latest: {climateData.temperature[climateData.temperature.length - 1]?.toFixed(1)}°C</span>
              </div>
            </div>
          )}

          {(selectedMetric === 'all' || selectedMetric === 'rainfall') && (
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
                🌧️ Rainfall (mm)
              </h4>
              {createSimpleChart(climateData.rainfall, 'Rainfall Pattern', '#3b82f6')}
              <div className="mt-2 text-sm text-gray-600">
                <span>Latest: {climateData.rainfall[climateData.rainfall.length - 1]?.toFixed(1)}mm</span>
              </div>
            </div>
          )}

          {(selectedMetric === 'all' || selectedMetric === 'humidity') && (
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-purple-600 flex items-center gap-2">
                💧 Humidity (%)
              </h4>
              {createSimpleChart(climateData.humidity, 'Humidity Levels', '#8b5cf6')}
              <div className="mt-2 text-sm text-gray-600">
                <span>Latest: {climateData.humidity[climateData.humidity.length - 1]?.toFixed(1)}%</span>
              </div>
            </div>
          )}

          {(selectedMetric === 'all' || selectedMetric === 'ndvi') && (
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                🌱 Vegetation Health (NDVI)
              </h4>
              {createSimpleChart(climateData.ndvi.map(v => v * 100), 'NDVI (×100)', '#22c55e')}
              <div className="mt-2 text-sm text-gray-600">
                <span>Latest: {(climateData.ndvi[climateData.ndvi.length - 1] * 100)?.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Predictions Info */}
      {climateData && climateData.predictions && includePredictions && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-600">🔮</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Predictions Available
              </h3>
              <p className="text-blue-700 text-sm mt-1">
                Showing {climateData.predictions.dates.length} months of predictions 
                (confidence: {(climateData.predictions.confidence.reduce((a, b) => a + b, 0) / climateData.predictions.confidence.length * 100).toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountyClimateVisualization;
