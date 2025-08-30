'use client';

import React, { useState } from 'react';
import { Bell, BellOff, Phone, Settings, CheckCircle, AlertTriangle, MessageSquare, Search } from 'lucide-react';

interface SubscriptionPreferences {
  weatherAlerts: boolean;
  emergencyAlerts: boolean;
  reportConfirmations: boolean;
}

const SimplePhoneSMSPanel: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  
  const [preferences, setPreferences] = useState<SubscriptionPreferences>({
    weatherAlerts: true,
    emergencyAlerts: true,
    reportConfirmations: true
  });

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 254, use as is
    if (cleaned.startsWith('254')) {
      return `+${cleaned}`;
    }
    
    // If it starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      return `+254${cleaned.substring(1)}`;
    }
    
    // If it starts with 7, add 254
    if (cleaned.startsWith('7') && cleaned.length === 9) {
      return `+254${cleaned}`;
    }
    
    return phone.startsWith('+') ? phone : `+${phone}`;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const formatted = formatPhoneNumber(phone);
    const phoneRegex = /^\+254[0-9]{9}$/;
    return phoneRegex.test(formatted);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setSubscriptionStatus(null);
    setShowPreferences(false);
  };

  const checkSubscriptionStatus = async () => {
    if (!phoneNumber.trim()) {
      showMessage('error', 'Please enter a phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      showMessage('error', 'Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    setIsLoading(true);
    const formattedPhone = formatPhoneNumber(phoneNumber);

    try {
      const response = await fetch('/api/sms/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formattedPhone })
      });

      const data = await response.json();
      
      if (data.success) {
        setSubscriptionStatus(data.subscription);
        if (data.subscription && data.subscription.is_active) {
          setPreferences({
            weatherAlerts: data.subscription.weather_alerts || false,
            emergencyAlerts: data.subscription.emergency_alerts || false,
            reportConfirmations: data.subscription.report_confirmations || false
          });
          setShowPreferences(true);
          showMessage('success', `Found active subscription for ${formattedPhone} 📱`);
        } else {
          setShowPreferences(true);
          showMessage('info', `No active subscription found for ${formattedPhone}. You can subscribe below! 📝`);
        }
      } else {
        showMessage('error', data.error || 'Failed to check subscription status');
      }
    } catch (error) {
      console.error('Status check error:', error);
      showMessage('error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    setIsLoading(true);

    try {
      const response = await fetch('/api/sms/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          ...preferences
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('success', '🎉 Successfully subscribed to SMS alerts!');
        await checkSubscriptionStatus();
      } else {
        showMessage('error', data.error || 'Failed to subscribe to SMS notifications');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      showMessage('error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    setIsLoading(true);

    try {
      const response = await fetch('/api/sms/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formattedPhone })
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('success', '✅ Successfully unsubscribed from SMS notifications');
        setSubscriptionStatus(null);
        setShowPreferences(false);
      } else {
        showMessage('error', data.error || 'Failed to unsubscribe');
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      showMessage('error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestAlert = async () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    setIsLoading(true);

    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          message: `🧪 Test Alert from UzimaSmart!\n\nThis is a test SMS to verify your subscription is working correctly.\n\nTime: ${new Date().toLocaleString()}\n\n✅ Your SMS alerts are active!`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('success', '📱 Test SMS sent! Check your phone.');
      } else {
        showMessage('error', data.error || 'Failed to send test SMS');
      }
    } catch (error) {
      console.error('Test SMS error:', error);
      showMessage('error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof SubscriptionPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isSubscribed = subscriptionStatus?.is_active;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="text-blue-600" size={32} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          SMS Climate Alerts
        </h3>
        
        <p className="text-gray-600 text-sm">
          Get real-time weather updates, emergency alerts, and report confirmations sent directly to your phone.
        </p>
      </div>

      {/* Phone Number Input */}
      <div className="space-y-4">
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            📱 Enter Your Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0712345678 or +254712345678"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Kenyan phone numbers only
          </p>
        </div>

        {/* Check Status Button */}
        <button
          onClick={checkSubscriptionStatus}
          disabled={isLoading || !phoneNumber.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking...
            </span>
          ) : (
            <>
              <Search className="mr-2" size={18} />
              Check Subscription Status
            </>
          )}
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
          message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' :
          'bg-blue-50 border border-blue-200 text-blue-700'
        }`}>
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Subscription Status & Preferences */}
      {showPreferences && (
        <div className="mt-6 space-y-4">
          {/* Current Status */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            {isSubscribed ? (
              <>
                <Bell className="text-green-500" size={20} />
                <span className="text-green-700 font-medium">SMS Alerts Active</span>
              </>
            ) : (
              <>
                <BellOff className="text-gray-400" size={20} />
                <span className="text-gray-600">SMS Alerts Inactive</span>
              </>
            )}
          </div>

          {/* Preferences Panel */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 flex items-center mb-3">
              <Settings className="mr-2" size={16} />
              Alert Preferences
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🌦️</span>
                  <span className="text-sm text-gray-700">Weather Updates</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.weatherAlerts}
                  onChange={() => handlePreferenceChange('weatherAlerts')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🚨</span>
                  <span className="text-sm text-gray-700">Emergency Alerts</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.emergencyAlerts}
                  onChange={() => handlePreferenceChange('emergencyAlerts')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">✅</span>
                  <span className="text-sm text-gray-700">Report Confirmations</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.reportConfirmations}
                  onChange={() => handlePreferenceChange('reportConfirmations')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {isSubscribed ? (
              <>
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Updating...' : '📝 Update Preferences'}
                </button>
                
                <button
                  onClick={sendTestAlert}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Sending...' : '🧪 Send Test SMS'}
                </button>
                
                <button
                  onClick={handleUnsubscribe}
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Processing...' : '🔕 Unsubscribe'}
                </button>
              </>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 disabled:opacity-50 transition-all duration-200 font-medium"
              >
                {isLoading ? 'Subscribing...' : '🔔 Subscribe to SMS Alerts'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Benefits Section */}
      {!showPreferences && (
        <div className="mt-6 space-y-3">
          <h4 className="font-medium text-gray-900">📱 SMS Benefits:</h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="text-green-500 mr-2" size={16} />
              Real-time weather alerts
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="text-green-500 mr-2" size={16} />
              Emergency climate warnings
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="text-green-500 mr-2" size={16} />
              Report confirmations
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="text-green-500 mr-2" size={16} />
              Personalized climate insights
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t text-center">
        <p className="text-xs text-gray-500">
          📱 Free SMS service for climate alerts
          <br />
          Standard message rates may apply • Reply STOP to unsubscribe
        </p>
      </div>
    </div>
  );
};

export default SimplePhoneSMSPanel;
