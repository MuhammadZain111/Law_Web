import React, { useState, useEffect } from 'react';
import { api } from '@/shared/api';

export function UpgradeProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Payment method form data
  const [paymentMethods, setPaymentMethods] = useState({
    jazzcash: {
      accountNumber: '',
      accountName: '',
      enabled: false
    },
    easypaisa: {
      accountNumber: '',
      accountName: '',
      enabled: false
    },
    bankTransfer: {
      bankName: '',
      accountNumber: '',
      accountName: '',
      iban: '',
      enabled: false
    }
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }

      const response = await api.get('/user/profile');
      setUser(response.data?.user || response.data);
      
      // Load existing payment methods if any
      if (response.data?.user?.paymentMethods) {
        setPaymentMethods(response.data.user.paymentMethods);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (method, field, value) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value
      }
    }));
  };

  const handleSavePaymentMethods = async () => {
    try {
      setSaving(true);
      setError('');
      setMessage('');

      const response = await api.put('/user/payment-methods', {
        paymentMethods
      });

      setMessage('Payment methods updated successfully!');
      console.log('Payment methods saved:', response.data);
    } catch (error) {
      console.error('Error saving payment methods:', error);
      setError('Failed to save payment methods. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upgrade Profile</h1>
        <p className="text-gray-600">
          Add your payment methods to receive payments from clients. This information will be used when clients book appointments with you.
        </p>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-green-800 font-medium">{message}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">✗</span>
            </div>
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Payment Methods Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="mr-3">💳</span>
          Payment Methods
        </h2>

        {/* JazzCash */}
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📱</span>
              JazzCash
            </h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={paymentMethods.jazzcash.enabled}
                onChange={(e) => handlePaymentMethodChange('jazzcash', 'enabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable JazzCash</span>
            </label>
          </div>

          {paymentMethods.jazzcash.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JazzCash Number *
                </label>
                <input
                  type="text"
                  value={paymentMethods.jazzcash.accountNumber}
                  onChange={(e) => handlePaymentMethodChange('jazzcash', 'accountNumber', e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name *
                </label>
                <input
                  type="text"
                  value={paymentMethods.jazzcash.accountName}
                  onChange={(e) => handlePaymentMethodChange('jazzcash', 'accountName', e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* EasyPaisa */}
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">💳</span>
              EasyPaisa
            </h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={paymentMethods.easypaisa.enabled}
                onChange={(e) => handlePaymentMethodChange('easypaisa', 'enabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable EasyPaisa</span>
            </label>
          </div>

          {paymentMethods.easypaisa.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EasyPaisa Number *
                </label>
                <input
                  type="text"
                  value={paymentMethods.easypaisa.accountNumber}
                  onChange={(e) => handlePaymentMethodChange('easypaisa', 'accountNumber', e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name *
                </label>
                <input
                  type="text"
                  value={paymentMethods.easypaisa.accountName}
                  onChange={(e) => handlePaymentMethodChange('easypaisa', 'accountName', e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bank Transfer */}
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">🏦</span>
              Bank Transfer
            </h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={paymentMethods.bankTransfer.enabled}
                onChange={(e) => handlePaymentMethodChange('bankTransfer', 'enabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Bank Transfer</span>
            </label>
          </div>

          {paymentMethods.bankTransfer.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={paymentMethods.bankTransfer.bankName}
                  onChange={(e) => handlePaymentMethodChange('bankTransfer', 'bankName', e.target.value)}
                  placeholder="e.g., HBL, UBL, MCB"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={paymentMethods.bankTransfer.accountNumber}
                  onChange={(e) => handlePaymentMethodChange('bankTransfer', 'accountNumber', e.target.value)}
                  placeholder="Account number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={paymentMethods.bankTransfer.accountName}
                  onChange={(e) => handlePaymentMethodChange('bankTransfer', 'accountName', e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IBAN (Optional)
                </label>
                <input
                  type="text"
                  value={paymentMethods.bankTransfer.iban}
                  onChange={(e) => handlePaymentMethodChange('bankTransfer', 'iban', e.target.value)}
                  placeholder="PK36SCBL0000001123456702"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSavePaymentMethods}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <span className="mr-2">💾</span>
                Save Payment Methods
              </>
            )}
          </button>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <span className="mr-2">ℹ️</span>
          Important Information
        </h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>• Your payment methods will be shown to clients when they book appointments</li>
          <li>• Clients will send payments to these accounts and upload screenshots</li>
          <li>• You can enable/disable payment methods anytime</li>
          <li>• Make sure account details are correct to avoid payment issues</li>
          <li>• You can update this information anytime from your dashboard</li>
        </ul>
      </div>
    </div>
  );
}
