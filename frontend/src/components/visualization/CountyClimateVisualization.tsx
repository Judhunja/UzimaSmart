import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon, TrendingUpIcon, CloudRainIcon, ThermometerIcon, SeedlingIcon } from 'lucide-react';

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

  const timeframeOptions = [
    { value: '3_months', label: '3 Months' },
    { value: '6_months', label: '6 Months' },
    { value: '12_months', label: '12 Months' },
    { value: '24_months', label: '24 Months' }
  ];

  const metricOptions = [
    { value: 'all', label: 'All Metrics' },
    { value: 'temperature', label: 'Temperature Only' },
    { value: 'rainfall', label: 'Rainfall Only' },
    { value: 'humidity', label: 'Humidity Only' },
    { value: 'ndvi', label: 'Vegetation (NDVI) Only' }
  ];

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

  const prepareChartData = () => {
    if (!climateData) return [];
    
    const chartData = climateData.dates.map((date, index) => ({
      date: new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        year: '2-digit' 
      }),
      temperature: climateData.temperature[index],
      rainfall: climateData.rainfall[index],
      humidity: climateData.humidity[index],
      ndvi: climateData.ndvi[index] * 100, // Scale NDVI for better visualization
      type: 'historical'
    }));
    
    // Add predictions if available
    if (climateData.predictions && includePredictions) {
      const predictionData = climateData.predictions.dates.map((date, index) => ({
        date: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          year: '2-digit' 
        }),
        temperature: climateData.predictions!.temperature[index],
        rainfall: climateData.predictions!.rainfall[index],
        humidity: climateData.predictions!.humidity[index],
        ndvi: climateData.predictions!.ndvi[index] * 100,
        confidence: climateData.predictions!.confidence[index],
        type: 'prediction'
      }));
      
      return [...chartData, ...predictionData];
    }
    
    return chartData;
  };

  const chartData = prepareChartData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold">Error Loading Data</p>
            <p className="text-sm mt-2">{error}</p>
            <Button onClick={fetchClimateData} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Climate Visualization Controls - {countyName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Timeframe:</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Metric:</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {metricOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            
            <Button onClick={fetchClimateData} size="sm">
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Temperature Chart */}
      {(selectedMetric === 'all' || selectedMetric === 'temperature') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThermometerIcon className="h-5 w-5 text-red-500" />
              Temperature Trends (°C)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => `Date: ${value}`}
                  formatter={(value, name) => [`${Number(value).toFixed(1)}°C`, 'Temperature']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                  connectNulls={false}
                />
                {includePredictions && (
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ef4444" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 2 }}
                    connectNulls={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Rainfall Chart */}
      {(selectedMetric === 'all' || selectedMetric === 'rainfall') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudRainIcon className="h-5 w-5 text-blue-500" />
              Rainfall Patterns (mm)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => `Date: ${value}`}
                  formatter={(value, name) => [`${Number(value).toFixed(1)}mm`, 'Rainfall']}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="rainfall" 
                  stroke="#3b82f6" 
                  fill="#3b82f680"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Humidity Chart */}
      {(selectedMetric === 'all' || selectedMetric === 'humidity') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5 text-purple-500" />
              Humidity Levels (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(value) => `Date: ${value}`}
                  formatter={(value, name) => [`${Number(value).toFixed(1)}%`, 'Humidity']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* NDVI/Vegetation Chart */}
      {(selectedMetric === 'all' || selectedMetric === 'ndvi') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SeedlingIcon className="h-5 w-5 text-green-500" />
              Vegetation Health (NDVI × 100)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(value) => `Date: ${value}`}
                  formatter={(value, name) => [`${Number(value).toFixed(1)}`, 'NDVI (×100)']}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="ndvi" 
                  stroke="#22c55e" 
                  fill="#22c55e40"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Combined Overview Chart */}
      {selectedMetric === 'all' && (
        <Card>
          <CardHeader>
            <CardTitle>Combined Climate Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="rainfall" fill="#3b82f680" name="Rainfall (mm)" />
                <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="Temperature (°C)" />
                <Line yAxisId="right" type="monotone" dataKey="ndvi" stroke="#22c55e" strokeWidth={2} name="NDVI (×100)" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CountyClimateVisualization;
