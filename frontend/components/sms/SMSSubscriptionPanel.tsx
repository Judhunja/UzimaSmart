'use client';

import { useState, useEffect } from 'react';

interface SubscriptionPreferences {
  phoneNumber: string;
  county: string;
  weatherAlerts: boolean;
  emergencyAlerts: boolean;
  reportConfirmations: boolean;
}

interface SubscriptionStatus {
  isSubscribed: boolean;
  subscription: any;
}

export default function SMSSubscriptionPanel() {
  const [preferences, setPreferences] = useState<SubscriptionPreferences>({
    phoneNumber: '',
    county: '',
    weatherAlerts: true,
    emergencyAlerts: true,
    reportConfirmations: true,
  });

  const [status, setStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    subscription: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Check subscription status when phone number changes
  useEffect(() => {
    if (preferences.phoneNumber && preferences.phoneNumber.length >= 10) {
      checkSubscriptionStatus();
    }
  }, [preferences.phoneNumber]);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch(`/api/sms/status?phoneNumber=${encodeURIComponent(preferences.phoneNumber)}`);
      const result = await response.json();
      
      if (result.success) {
        setStatus({
          isSubscribed: result.isSubscribed,
          subscription: result.subscription,
        });
        
        // Update preferences with existing subscription
        if (result.subscription) {
          setPreferences(prev => ({
            ...prev,
            county: result.subscription.county || '',
            weatherAlerts: result.subscription.weather_alerts,
            emergencyAlerts: result.subscription.emergency_alerts,
            reportConfirmations: result.subscription.report_confirmations,
          }));
        }
      }
    } catch (err) {
      console.error('Error checking subscription status:', err);
    }
  };

  const handleSubscribe = async () => {
    if (!preferences.phoneNumber) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('Sending subscription request...', preferences);
      
      const response = await fetch('/api/sms/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      console.log('Subscription response status:', response.status);
      const result = await response.json();
      console.log('Subscription result:', result);

      if (result.success) {
        setMessage('✅ Successfully subscribed to SMS notifications! Check your phone for confirmation.');
        setStatus({ isSubscribed: true, subscription: null });
        // Wait a moment then refresh status
        setTimeout(async () => {
          await checkSubscriptionStatus();
        }, 1000);
      } else {
        setError(`❌ ${result.error || 'Failed to subscribe'}`);
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!preferences.phoneNumber) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('Sending unsubscribe request for:', preferences.phoneNumber);
      
      const response = await fetch('/api/sms/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: preferences.phoneNumber }),
      });

      console.log('Unsubscribe response status:', response.status);
      const result = await response.json();
      console.log('Unsubscribe result:', result);

      if (result.success) {
        setMessage('✅ Successfully unsubscribed from SMS notifications. Check your phone for confirmation.');
        setStatus({ isSubscribed: false, subscription: null });
        // Wait a moment then refresh status
        setTimeout(async () => {
          await checkSubscriptionStatus();
        }, 1000);
      } else {
        setError(`❌ ${result.error || 'Failed to unsubscribe'}`);
      }
    } catch (err) {
      console.error('Unsubscribe error:', err);
      setError('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendTestAlert = async (alertType: 'weather' | 'emergency') => {
    setLoading(true);
    setError('');
    setMessage('');

    const testMessages = {
      weather: '🌦️ Test Weather Alert: Partly cloudy with chance of rain. Temperature: 20-25°C. This is a test message from UzimaSmart.',
      emergency: '🚨 Test Emergency Alert: This is a test emergency notification from UzimaSmart climate system. No action required.',
    };

    try {
      console.log(`Sending test ${alertType} alert...`);
      
      const response = await fetch('/api/sms/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testMessages[alertType],
          alertType: alertType,
        }),
      });

      console.log(`Test ${alertType} response status:`, response.status);
      const result = await response.json();
      console.log(`Test ${alertType} result:`, result);

      if (result.success) {
        setMessage(`✅ Test ${alertType} alert sent! Check your phone.`);
      } else {
        setError(`❌ Failed to send test ${alertType} alert: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(`Test ${alertType} error:`, err);
      setError('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h6a2 2 0 002-2V8M9 12h6" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">SMS Notifications</h2>
          <p className="text-gray-600">Get climate alerts and updates via SMS</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          status.isSubscribed 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {status.isSubscribed ? '✅ Subscribed' : '❌ Not Subscribed'}
        </span>
      </div>

      {/* Phone Number Input */}
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={preferences.phoneNumber}
          onChange={(e) => setPreferences(prev => ({ ...prev, phoneNumber: e.target.value }))}
          placeholder="+254793322831"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* County Input */}
      <div className="mb-4">
        <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-2">
          County (Optional)
        </label>
        <input
          type="text"
          id="county"
          value={preferences.county}
          onChange={(e) => setPreferences(prev => ({ ...prev, county: e.target.value }))}
          placeholder="Nairobi"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Subscription Preferences */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Alert Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.weatherAlerts}
              onChange={(e) => setPreferences(prev => ({ ...prev, weatherAlerts: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">🌦️ Weather Updates</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.emergencyAlerts}
              onChange={(e) => setPreferences(prev => ({ ...prev, emergencyAlerts: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">🚨 Emergency Alerts</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.reportConfirmations}
              onChange={(e) => setPreferences(prev => ({ ...prev, reportConfirmations: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">📋 Report Confirmations</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {!status.isSubscribed ? (
          <button
            onClick={handleSubscribe}
            disabled={loading || !preferences.phoneNumber}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Subscribing...' : 'Subscribe to SMS Alerts'}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Updating...' : 'Update Preferences'}
            </button>
            <button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Unsubscribing...' : 'Unsubscribe'}
            </button>
          </div>
        )}

        {/* Test Buttons - Only show if subscribed */}
        {status.isSubscribed && (
          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => sendTestAlert('weather')}
              disabled={loading}
              className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50 text-sm"
            >
              Test Weather Alert
            </button>
            <button
              onClick={() => sendTestAlert('emergency')}
              disabled={loading}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:opacity-50 text-sm"
            >
              Test Emergency Alert
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      {message && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md">
          <p className="text-green-800 text-sm">{message}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Usage Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Enter your Kenyan phone number (+254...)</li>
          <li>• Choose which types of alerts you want</li>
          <li>• You'll receive a confirmation SMS</li>
          <li>• Reply STOP to any SMS to unsubscribe</li>
        </ul>
      </div>
    </div>
  );
}
