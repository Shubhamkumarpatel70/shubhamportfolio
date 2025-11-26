import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';

const CoffeePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [projectLink, setProjectLink] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [viewingPayment, setViewingPayment] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/coffee-purchases`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!projectLink.trim()) {
      setMessage({ type: 'error', text: 'Please enter project link' });
      return;
    }

    setApprovingId(id);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/admin/coffee-purchases/${id}/approve`,
        { projectLink },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessage({ type: 'success', text: 'Purchase approved successfully!' });
      setProjectLink('');
      setApprovingId(null);
      fetchPurchases();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Approval failed' });
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      setMessage({ type: 'error', text: 'Please enter rejection reason' });
      return;
    }

    setRejectingId(id);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/admin/coffee-purchases/${id}/reject`,
        { rejectionReason },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessage({ type: 'success', text: 'Purchase rejected' });
      setRejectionReason('');
      setRejectingId(null);
      fetchPurchases();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Rejection failed' });
    } finally {
      setRejectingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  if (loading) {
    return <div className="text-text-primary">Loading purchases...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Coffee Purchases</h2>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success'
            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
            : 'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {message.text}
        </div>
      )}

      {purchases.length === 0 ? (
        <div className="text-center text-text-primary/70 py-8">No coffee purchases yet.</div>
      ) : (
        <div className="space-y-4">
          {purchases.map(purchase => (
            <div
              key={purchase._id}
              className="bg-card-bg/50 border border-primary/20 rounded-lg p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {purchase.projectTitle}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(purchase.status)}`}>
                      {purchase.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-text-primary/70">
                    <p>
                      <span className="font-medium">User:</span> {purchase.userId?.name || 'N/A'} ({purchase.userId?.email || 'N/A'})
                    </p>
                    <p>
                      <span className="font-medium">Coffees:</span> {purchase.numberOfCoffees}
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span> ₹{purchase.totalAmount.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Payment Type:</span> {purchase.paymentType === 'upi' ? 'UPI' : 'Bank Transfer'}
                    </p>
                    {purchase.utr && (
                      <p>
                        <span className="font-medium">UTR:</span> {purchase.utr}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Date:</span> {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>
                    {purchase.projectLink && (
                      <p>
                        <span className="font-medium">Project Link:</span>{' '}
                        <a
                          href={purchase.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {purchase.projectLink}
                        </a>
                      </p>
                    )}
                    {purchase.rejectionReason && (
                      <p>
                        <span className="font-medium">Rejection Reason:</span> {purchase.rejectionReason}
                      </p>
                    )}
                  </div>
                  {purchase.paymentProof && (
                    <div className="mt-4">
                      <button
                        onClick={() => setViewingPayment(purchase.paymentProof)}
                        className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-500 transition-all text-sm"
                      >
                        📷 View Payment
                      </button>
                    </div>
                  )}
                </div>

                {purchase.status === 'pending' && (
                  <div className="flex flex-col gap-3 md:w-80">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Project Link (for approval)
                      </label>
                      <input
                        type="url"
                        value={projectLink}
                        onChange={(e) => setProjectLink(e.target.value)}
                        placeholder="https://example.com/project"
                        className="w-full px-3 py-2 bg-bg-dark border border-primary/20 rounded-lg text-text-primary text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Rejection Reason (for rejection)
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter reason for rejection"
                        rows="2"
                        className="w-full px-3 py-2 bg-bg-dark border border-primary/20 rounded-lg text-text-primary text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(purchase._id)}
                        disabled={approvingId === purchase._id}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all disabled:opacity-50"
                      >
                        {approvingId === purchase._id ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(purchase._id)}
                        disabled={rejectingId === purchase._id}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all disabled:opacity-50"
                      >
                        {rejectingId === purchase._id ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Screenshot Modal */}
      {viewingPayment && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setViewingPayment(null)}
        >
          <div 
            className="bg-card-bg border border-primary/20 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text-primary">Payment Screenshot</h3>
              <button
                onClick={() => setViewingPayment(null)}
                className="text-text-primary/70 hover:text-text-primary text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
            <div className="flex justify-center">
              <img 
                src={viewingPayment} 
                alt="Payment Screenshot" 
                className="max-w-full h-auto rounded-lg border-2 border-primary/20"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setViewingPayment(null)}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-500 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoffeePurchases;

