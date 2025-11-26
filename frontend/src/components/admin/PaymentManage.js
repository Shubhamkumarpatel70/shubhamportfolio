import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentManage = () => {
  const [paymentData, setPaymentData] = useState({
    upiId: '',
    bankAccount: {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      accountHolderName: ''
    },
    qrCode: ''
  });
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [qrCodePreview, setQrCodePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/payment', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setPaymentData(response.data);
        if (response.data.qrCode) {
          setQrCodePreview(response.data.qrCode);
        }
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('bankAccount.')) {
      const field = name.split('.')[1];
      setPaymentData({
        ...paymentData,
        bankAccount: {
          ...paymentData.bankAccount,
          [field]: value
        }
      });
    } else {
      setPaymentData({
        ...paymentData,
        [name]: value
      });
    }
  };

  const handleQRCodeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size should be less than 5MB' });
        return;
      }
      setQrCodeFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveQRCode = () => {
    setQrCodeFile(null);
    setQrCodePreview('');
    setPaymentData({
      ...paymentData,
      qrCode: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const dataToSend = {
        ...paymentData,
        qrCode: qrCodePreview || paymentData.qrCode
      };

      await axios.post('http://localhost:5000/api/admin/payment', dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Payment settings updated successfully!' });
      setQrCodeFile(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Manage Payment Settings</h2>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success'
            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
            : 'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2 text-text-primary">
            UPI ID
          </label>
          <input
            type="text"
            name="upiId"
            value={paymentData.upiId}
            onChange={handleChange}
            placeholder="yourname@upi"
            className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
          />
          <p className="text-text-primary/60 text-sm mt-2">Your UPI ID for payments</p>
        </div>

        <div className="border-t border-primary/20 pt-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Bank Account Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2 text-text-primary">
                Account Holder Name
              </label>
              <input
                type="text"
                name="bankAccount.accountHolderName"
                value={paymentData.bankAccount.accountHolderName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-text-primary">
                Account Number
              </label>
              <input
                type="text"
                name="bankAccount.accountNumber"
                value={paymentData.bankAccount.accountNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-text-primary">
                IFSC Code
              </label>
              <input
                type="text"
                name="bankAccount.ifscCode"
                value={paymentData.bankAccount.ifscCode}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-text-primary">
                Bank Name
              </label>
              <input
                type="text"
                name="bankAccount.bankName"
                value={paymentData.bankAccount.bankName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-primary/20 pt-6">
          <label className="block font-medium mb-2 text-text-primary">
            Payment QR Code
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleQRCodeChange}
            className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none"
          />
          <p className="text-text-primary/60 text-sm mt-2">Upload QR code image (Max 5MB)</p>
          
          {qrCodePreview && (
            <div className="mt-4 relative inline-block">
              <img 
                src={qrCodePreview} 
                alt="QR Code Preview" 
                className="max-w-xs border-2 border-primary/20 rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveQRCode}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-500 transition-all disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Update Payment Settings'}
        </button>
      </form>
    </div>
  );
};

export default PaymentManage;

