'use client';

import { useState } from 'react';

interface SMSManagerProps {
  phoneNumber?: string;
  onSubscriptionChange?: (isSubscribed: boolean) => void;
}

export default function SMSManager({ phoneNumber = '', onSubscriptionChange }: SMSManagerProps) {
  const [phone, setPhone] = useState(phoneNumber);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleQuickSubscribe = async () => {
    if (!phone) {
      setMessage('Please enter a phone number');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/sms/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phone,
          weatherAlerts: true,
          emergencyAlerts: true,
          reportConfirmations: true,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Subscribed! Check your phone for confirmation.');
        onSubscriptionChange?.(true);
      } else {
        setMessage('❌ Subscription failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      setMessage('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickUnsubscribe = async () => {
    if (!phone) {
      setMessage('Please enter a phone number');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/sms/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Unsubscribed! Check your phone for confirmation.');
        onSubscriptionChange?.(false);
      } else {
        setMessage('❌ Unsubscribe failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      setMessage('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-medium text-blue-900 mb-3">📱 SMS Alerts</h3>
      
      <div className="space-y-3">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+254793322831"
          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        
        <div className="flex gap-2">
          <button
            onClick={handleQuickSubscribe}
            disabled={loading || !phone}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            {loading ? 'Loading...' : 'Subscribe'}
          </button>
          <button
            onClick={handleQuickUnsubscribe}
            disabled={loading || !phone}
            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
          >
            {loading ? 'Loading...' : 'Unsubscribe'}
          </button>
        </div>
        
        {message && (
          <p className="text-sm text-blue-800 mt-2">{message}</p>
        )}
      </div>
    </div>
  );
}
