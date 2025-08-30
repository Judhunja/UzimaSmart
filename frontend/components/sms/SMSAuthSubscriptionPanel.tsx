'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellOff, User, LogOut, Settings, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import AuthModalNew from '../auth/AuthModalNew';

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

interface SubscriptionPreferences {
  weatherAlerts: boolean;
  emergencyAlerts: boolean;
  reportConfirmations: boolean;
}

const SMSAuthSubscriptionPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  
  const [preferences, setPreferences] = useState<SubscriptionPreferences>({
    weatherAlerts: true,
    emergencyAlerts: true,
    reportConfirmations: true
  });

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('uzima_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        checkSubscriptionStatus(userData.phoneNumber);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('uzima_user');
      }
    }
  }, []);

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('uzima_user', JSON.stringify(userData));
    setShowAuthModal(false);
    showMessage('success', `Welcome back, ${userData.name}! 🎉`);
    
    // Check subscription status after login
    if (userData.phoneNumber) {
      checkSubscriptionStatus(userData.phoneNumber);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSubscriptionStatus(null);
    localStorage.removeItem('uzima_user');
    showMessage('info', 'You have been logged out. Come back soon! 👋');
  };

  const checkSubscriptionStatus = async (phoneNumber: string) => {
    try {
      const response = await fetch('/api/sms/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();
      if (data.success && data.subscription) {
        setSubscriptionStatus(data.subscription);
        setPreferences({
          weatherAlerts: data.subscription.weather_alerts || false,
          emergencyAlerts: data.subscription.emergency_alerts || false,
          reportConfirmations: data.subscription.report_confirmations || false
        });
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!user?.phoneNumber) {
      showMessage('error', 'Phone number is required for SMS subscriptions');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/sms/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: user.phoneNumber,
          userId: user.id,
          ...preferences
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('success', '🎉 Successfully subscribed to SMS notifications!');
        await checkSubscriptionStatus(user.phoneNumber);
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
    if (!user?.phoneNumber) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/sms/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber: user.phoneNumber,
          userId: user.id 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('success', '✅ Successfully unsubscribed from SMS notifications');
        setSubscriptionStatus(null);
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

  const handlePreferenceChange = (key: keyof SubscriptionPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const sendTestAlert = async () => {
    if (!user?.phoneNumber) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: user.phoneNumber,
          message: `🧪 Test Alert from UzimaSmart!\n\nHi ${user.name}, this is a test SMS to verify your subscription is working correctly.\n\nTime: ${new Date().toLocaleString()}\n\n✅ Your SMS alerts are active!`
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

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="text-blue-600" size={32} />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            SMS Climate Alerts
          </h3>
          
          <p className="text-gray-600 mb-6">
            Get real-time weather updates, emergency alerts, and report confirmations sent directly to your phone.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-start text-sm text-gray-600">
              <CheckCircle className="text-green-500 mr-2" size={16} />
              Real-time weather alerts
            </div>
            <div className="flex items-center justify-start text-sm text-gray-600">
              <CheckCircle className="text-green-500 mr-2" size={16} />
              Emergency climate warnings
            </div>
            <div className="flex items-center justify-start text-sm text-gray-600">
              <CheckCircle className="text-green-500 mr-2" size={16} />
              Report confirmations
            </div>
          </div>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 font-medium"
          >
            🔐 Login for SMS Alerts
          </button>
        </div>

        <AuthModalNew 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  const isSubscribed = subscriptionStatus?.is_active;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      {/* User Info Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-full w-10 h-10 flex items-center justify-center">
            <User className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.phoneNumber}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
          message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' :
          'bg-blue-50 border border-blue-200 text-blue-700'
        }`}>
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Subscription Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
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

        {/* Subscription Preferences */}
        {isSubscribed && (
          <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 flex items-center">
              <Settings className="mr-2" size={16} />
              Current Preferences
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">🌦️ Weather Alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.weatherAlerts}
                  onChange={() => handlePreferenceChange('weatherAlerts')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">🚨 Emergency Alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.emergencyAlerts}
                  onChange={() => handlePreferenceChange('emergencyAlerts')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">✅ Report Confirmations</span>
                <input
                  type="checkbox"
                  checked={preferences.reportConfirmations}
                  onChange={() => handlePreferenceChange('reportConfirmations')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
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

      {/* Info Footer */}
      <div className="mt-6 pt-4 border-t">
        <p className="text-xs text-gray-500 text-center">
          📱 SMS alerts sent to {user.phoneNumber}
          <br />
          Standard message rates may apply
        </p>
      </div>
    </div>
  );
};

export default SMSAuthSubscriptionPanel;
