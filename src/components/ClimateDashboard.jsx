
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cloud, Thermometer, Droplets, Wind, Zap, Leaf } from 'lucide-react';

const ClimateDashboard = () => {
  const [climateData, setClimateData] = useState({
    temperature: 24.5,
    humidity: 68,
    rainfall: 12.3,
    windSpeed: 8.2,
    solarIrradiance: 850,
    co2Level: 415
  });

  const [energyData, setEnergyData] = useState([
    { time: '00:00', solar: 0, wind: 45, hydro: 320, geothermal: 985 },
    { time: '06:00', solar: 120, wind: 52, hydro: 315, geothermal: 985 },
    { time: '12:00', solar: 680, wind: 38, hydro: 310, geothermal: 985 },
    { time: '18:00', solar: 180, wind: 42, hydro: 325, geothermal: 985 },
    { time: '24:00', solar: 0, wind: 48, hydro: 320, geothermal: 985 }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'drought', severity: 'medium', location: 'Turkana County', confidence: 0.78 },
    { id: 2, type: 'flood', severity: 'high', location: 'Nairobi Basin', confidence: 0.92 },
    { id: 3, type: 'pest', severity: 'low', location: 'Central Kenya', confidence: 0.65 }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            Kenya Climate Intelligence Platform
          </h1>
          <p className="text-gray-600">
            AI-Powered Solutions for Climate Resilience and Sustainable Development
          </p>
        </header>

        {/* Real-time Climate Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <ClimateCard 
            icon={<Thermometer className="w-8 h-8" />}
            title="Temperature"
            value={`${climateData.temperature}°C`}
            color="text-red-600"
            bgColor="bg-red-50"
          />
          <ClimateCard 
            icon={<Droplets className="w-8 h-8" />}
            title="Humidity"
            value={`${climateData.humidity}%`}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <ClimateCard 
            icon={<Cloud className="w-8 h-8" />}
            title="Rainfall"
            value={`${climateData.rainfall}mm`}
            color="text-indigo-600"
            bgColor="bg-indigo-50"
          />
          <ClimateCard 
            icon={<Wind className="w-8 h-8" />}
            title="Wind Speed"
            value={`${climateData.windSpeed} m/s`}
            color="text-gray-600"
            bgColor="bg-gray-50"
          />
          <ClimateCard 
            icon={<Zap className="w-8 h-8" />}
            title="Solar Power"
            value={`${climateData.solarIrradiance}W/m²`}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
          />
          <ClimateCard 
            icon={<Leaf className="w-8 h-8" />}
            title="CO₂ Level"
            value={`${climateData.co2Level}ppm`}
            color="text-green-600"
            bgColor="bg-green-50"
          />
        </div>

        {/* Energy Generation Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Kenya Renewable Energy Generation (MW)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="solar" stroke="#FCD34D" strokeWidth={3} name="Solar" />
              <Line type="monotone" dataKey="wind" stroke="#60A5FA" strokeWidth={3} name="Wind" />
              <Line type="monotone" dataKey="hydro" stroke="#34D399" strokeWidth={3} name="Hydro" />
              <Line type="monotone" dataKey="geothermal" stroke="#F87171" strokeWidth={3} name="Geothermal" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Climate Alerts */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">AI Climate Alerts</h3>
          <div className="space-y-3">
            {alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClimateCard = ({ icon, title, value, color, bgColor }) => (
  <div className={`${bgColor} rounded-lg p-4 border border-gray-200`}>
    <div className={`${color} mb-2`}>{icon}</div>
    <div className="text-sm text-gray-600 mb-1">{title}</div>
    <div className="text-lg font-semibold text-gray-800">{value}</div>
  </div>
);

const AlertCard = ({ alert }) => {
  const severityColors = {
    low: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    medium: 'bg-orange-50 border-orange-200 text-orange-800',
    high: 'bg-red-50 border-red-200 text-red-800'
  };

  return (
    <div className={`p-4 rounded-lg border ${severityColors[alert.severity]}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold capitalize">{alert.type} Risk - {alert.location}</h4>
          <p className="text-sm mt-1">AI Confidence: {(alert.confidence * 100).toFixed(0)}%</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${severityColors[alert.severity]}`}>
          {alert.severity.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default ClimateDashboard;