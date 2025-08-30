import React, { useState, useEffect } from 'react';

interface DroughtRiskData {
  county_id: number;
  county_name: string;
  drought_risk_score: number;
  risk_level: string;
  vegetation_stress: number;
  rainfall_deficit: number;
  temperature_stress: number;
  recommendations: string[];
  climate_zone: string;
}

interface DroughtAssessmentProps {
  monthsAhead?: number;
}

const DroughtRiskAssessment: React.FC<DroughtAssessmentProps> = ({ 
  monthsAhead = 3 
}) => {
  const [droughtData, setDroughtData] = useState<DroughtRiskData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState(monthsAhead);
  const [sortBy, setSortBy] = useState<'risk' | 'name' | 'zone'>('risk');

  const fetchDroughtAssessment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/climate/drought-risk/assessment?months_ahead=${selectedTimeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch drought assessment');
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Transform the data
      const assessments: DroughtRiskData[] = [];
      const countyAssessments = result.county_assessments || {};
      
      Object.entries(countyAssessments).forEach(([countyId, data]: [string, any]) => {
        assessments.push({
          county_id: parseInt(countyId),
          county_name: data.county_name || `County ${countyId}`,
          drought_risk_score: data.drought_risk_score || 0,
          risk_level: data.risk_level || 'unknown',
          vegetation_stress: data.vegetation_stress || 0,
          rainfall_deficit: data.rainfall_deficit || 0,
          temperature_stress: data.temperature_stress || 0,
          recommendations: data.recommendations || [],
          climate_zone: data.climate_zone || 'Unknown'
        });
      });
      
      setDroughtData(assessments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDroughtAssessment();
  }, [selectedTimeframe]);

  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel.toLowerCase()) {
      case 'very high':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-red-400 text-white';
      case 'moderate':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStressColor = (stress: number): string => {
    if (stress >= 0.8) return 'bg-red-500';
    if (stress >= 0.6) return 'bg-orange-500';
    if (stress >= 0.4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const sortedData = React.useMemo(() => {
    const sorted = [...droughtData];
    switch (sortBy) {
      case 'risk':
        return sorted.sort((a, b) => b.drought_risk_score - a.drought_risk_score);
      case 'name':
        return sorted.sort((a, b) => a.county_name.localeCompare(b.county_name));
      case 'zone':
        return sorted.sort((a, b) => a.climate_zone.localeCompare(b.climate_zone));
      default:
        return sorted;
    }
  }, [droughtData, sortBy]);

  const getStatistics = () => {
    if (droughtData.length === 0) return null;
    
    const riskCounts = droughtData.reduce((acc, county) => {
      acc[county.risk_level] = (acc[county.risk_level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const avgRisk = droughtData.reduce((sum, county) => sum + county.drought_risk_score, 0) / droughtData.length;
    
    return { riskCounts, avgRisk };
  };

  const stats = getStatistics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Drought Risk Assessment - Kenya Counties
        </h1>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Assessment Period:</label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(Number(e.target.value))}
              className="border rounded px-3 py-1"
            >
              <option value={1}>1 Month Ahead</option>
              <option value={2}>2 Months Ahead</option>
              <option value={3}>3 Months Ahead</option>
              <option value={6}>6 Months Ahead</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'risk' | 'name' | 'zone')}
              className="border rounded px-3 py-1"
            >
              <option value="risk">Risk Level</option>
              <option value="name">County Name</option>
              <option value="zone">Climate Zone</option>
            </select>
          </div>
          
          <button
            onClick={fetchDroughtAssessment}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Statistics Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-blue-700">Total Counties</h3>
              <p className="text-2xl font-bold text-blue-900">{droughtData.length}</p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-red-700">High Risk Counties</h3>
              <p className="text-2xl font-bold text-red-900">
                {(stats.riskCounts['high'] || 0) + (stats.riskCounts['very high'] || 0)}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-yellow-700">Moderate Risk Counties</h3>
              <p className="text-2xl font-bold text-yellow-900">
                {stats.riskCounts['moderate'] || 0}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h3 className="text-sm font-semibold text-green-700">Average Risk Score</h3>
              <p className="text-2xl font-bold text-green-900">
                {stats.avgRisk.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Risk Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedData.map((county) => (
          <div key={county.county_id} className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{county.county_name}</h3>
                <p className="text-sm text-gray-600">{county.climate_zone}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(county.risk_level)}`}>
                {county.risk_level}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Drought Risk Score</span>
                  <span className="font-semibold">{(county.drought_risk_score * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getStressColor(county.drought_risk_score)}`}
                    style={{ width: `${county.drought_risk_score * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Vegetation Stress</span>
                  <span className="font-semibold">{(county.vegetation_stress * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getStressColor(county.vegetation_stress)}`}
                    style={{ width: `${county.vegetation_stress * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Rainfall Deficit</span>
                  <span className="font-semibold">{(county.rainfall_deficit * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getStressColor(county.rainfall_deficit)}`}
                    style={{ width: `${county.rainfall_deficit * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Temperature Stress</span>
                  <span className="font-semibold">{(county.temperature_stress * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getStressColor(county.temperature_stress)}`}
                    style={{ width: `${county.temperature_stress * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {county.recommendations.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommendations:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {county.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {droughtData.length === 0 && !loading && (
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <p className="text-gray-600 text-lg">
            No drought assessment data available. Please try refreshing or selecting a different timeframe.
          </p>
        </div>
      )}
    </div>
  );
};

export default DroughtRiskAssessment;
