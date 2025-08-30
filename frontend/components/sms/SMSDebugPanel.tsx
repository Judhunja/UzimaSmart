'use client';

import { useState } from 'react';

export default function SMSDebugPanel() {
  const [phoneNumber, setPhoneNumber] = useState('+254793322831');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const testSubscribe = async () => {
    setLoading(true);
    setResult('Testing subscription...');
    
    try {
      const response = await fetch('/api/sms/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          weatherAlerts: true,
          emergencyAlerts: true,
          reportConfirmations: true
        }),
      });
      
      const data = await response.json();
      setResult(`Subscribe Result: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Subscribe Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testUnsubscribe = async () => {
    setLoading(true);
    setResult('Testing unsubscribe...');
    
    try {
      const response = await fetch('/api/sms/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      
      const data = await response.json();
      setResult(`Unsubscribe Result: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Unsubscribe Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testStatus = async () => {
    setLoading(true);
    setResult('Checking status...');
    
    try {
      const response = await fetch(`/api/sms/status?phoneNumber=${encodeURIComponent(phoneNumber)}`);
      const data = await response.json();
      setResult(`Status Result: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Status Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSend = async () => {
    setLoading(true);
    setResult('Testing direct SMS send...');
    
    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: [phoneNumber],
          message: 'Debug test SMS from UzimaSmart'
        }),
      });
      
      const data = await response.json();
      setResult(`Send Result: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Send Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
      <h3 className="font-bold text-red-900 mb-4">🐛 SMS Debug Panel</h3>
      
      <div className="mb-4">
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-3 py-2 border border-red-300 rounded-md"
          placeholder="Phone number"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={testSubscribe}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Test Subscribe
        </button>
        <button
          onClick={testUnsubscribe}
          disabled={loading}
          className="bg-red-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Test Unsubscribe
        </button>
        <button
          onClick={testStatus}
          disabled={loading}
          className="bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Test Status
        </button>
        <button
          onClick={testSend}
          disabled={loading}
          className="bg-purple-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Test Send SMS
        </button>
      </div>

      <div className="bg-gray-100 p-3 rounded text-sm">
        <pre className="whitespace-pre-wrap">{result || 'Click a button to test...'}</pre>
      </div>
    </div>
  );
}
