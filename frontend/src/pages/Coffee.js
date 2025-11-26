import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Coffee = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [coffeeData, setCoffeeData] = useState({
    minCoffee: 1,
    maxCoffee: 10,
    coffeePrice: 50,
    currency: 'INR'
  });
  const [selectedCoffees, setSelectedCoffees] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [paymentData, setPaymentData] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [utr, setUtr] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    fetchCoffeeData();
    fetchProjects();
    fetchPaymentData();
    
    // Get project from URL params if available
    const params = new URLSearchParams(location.search);
    const projectId = params.get('projectId');
    if (projectId) {
      // Will set after projects are loaded
    }
  }, [location]);

  const fetchCoffeeData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/public/coffee');
      if (response.data) {
        setCoffeeData(response.data);
        setSelectedCoffees(response.data.minCoffee || 1);
      }
    } catch (error) {
      console.error('Error fetching coffee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/public/projects');
      setProjects(response.data);
      
      // Set selected project from URL params
      const params = new URLSearchParams(location.search);
      const projectId = params.get('projectId');
      if (projectId && response.data.length > 0) {
        const project = response.data.find(p => p._id === projectId);
        if (project) {
          setSelectedProject(project);
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchPaymentData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/public/payment');
      if (response.data) {
        setPaymentData(response.data);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  const handleCoffeeChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= coffeeData.minCoffee && value <= coffeeData.maxCoffee) {
      setSelectedCoffees(value);
    }
  };

  const handleBuyCoffee = async () => {
    if (!isAuthenticated) {
      setMessage({ type: 'error', text: 'Please login to buy coffee' });
      setTimeout(() => navigate('/register'), 2000);
      return;
    }

    if (!selectedProject) {
      setMessage({ type: 'error', text: 'Please select a project' });
      return;
    }

    setShowQRCode(true);
    setPaymentType('');
    setUtr('');
    setPaymentScreenshot(null);
    setScreenshotPreview('');
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size should be less than 5MB' });
        return;
      }
      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPayment = async () => {
    if (!isAuthenticated || !selectedProject) return;

    if (!paymentType) {
      setMessage({ type: 'error', text: 'Please select a payment type' });
      return;
    }

    if (paymentType === 'bank' && !utr.trim()) {
      setMessage({ type: 'error', text: 'Please enter UTR number' });
      return;
    }

    if (!screenshotPreview) {
      setMessage({ type: 'error', text: 'Please upload payment screenshot' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const totalAmount = selectedCoffees * coffeeData.coffeePrice;
      
      await axios.post(
        'http://localhost:5000/api/public/coffee-purchase',
        {
          projectId: selectedProject._id,
          numberOfCoffees: selectedCoffees,
          paymentProof: screenshotPreview,
          paymentType: paymentType,
          utr: utr.trim()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage({
        type: 'success',
        text: 'Purchase request submitted! Admin will review and approve your request.'
      });
      setShowQRCode(false);
      setPaymentType('');
      setUtr('');
      setPaymentScreenshot(null);
      setScreenshotPreview('');
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit purchase request'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-card-bg/80 backdrop-blur-md border border-primary/20 rounded-2xl p-8 shadow-2xl text-center">
          <div className="text-8xl mb-6">☕</div>
          <h1 className="text-4xl font-bold mb-4 text-text-primary">Buy Me a Coffee</h1>
          <p className="text-text-primary/70 mb-8 text-lg">
            If you found my projects helpful or interesting, consider buying me a coffee to support my work!
          </p>

          {!selectedProject && (
            <div className="bg-bg-dark/50 border border-primary/20 rounded-xl p-6 mb-6">
              <label className="block text-text-primary font-medium mb-4">
                Select Project
              </label>
              <select
                value={selectedProject?._id || ''}
                onChange={(e) => {
                  const project = projects.find(p => p._id === e.target.value);
                  setSelectedProject(project || null);
                }}
                className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none"
              >
                <option value="">-- Select a Project --</option>
                {projects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedProject && (
            <div className="bg-bg-dark/50 border border-primary/20 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-text-primary/70 text-sm">Selected Project</p>
                  <p className="text-text-primary font-semibold">{selectedProject.title}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-primary hover:text-blue-400 text-sm"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          <div className="bg-bg-dark/50 border border-primary/20 rounded-xl p-6 mb-6">
            <label className="block text-text-primary font-medium mb-4">
              Select Number of Coffees
            </label>
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => {
                  if (selectedCoffees > coffeeData.minCoffee) {
                    setSelectedCoffees(selectedCoffees - 1);
                  }
                }}
                disabled={selectedCoffees <= coffeeData.minCoffee}
                className="w-12 h-12 rounded-full bg-primary text-white font-bold text-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                -
              </button>
              <input
                type="number"
                min={coffeeData.minCoffee}
                max={coffeeData.maxCoffee}
                value={selectedCoffees}
                onChange={handleCoffeeChange}
                className="w-24 text-center text-3xl font-bold bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none py-2"
              />
              <button
                onClick={() => {
                  if (selectedCoffees < coffeeData.maxCoffee) {
                    setSelectedCoffees(selectedCoffees + 1);
                  }
                }}
                disabled={selectedCoffees >= coffeeData.maxCoffee}
                className="w-12 h-12 rounded-full bg-primary text-white font-bold text-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                +
              </button>
            </div>
            <p className="text-text-primary/60 text-sm mb-4">
              Range: {coffeeData.minCoffee} - {coffeeData.maxCoffee} coffees
            </p>
            <div className="text-2xl font-bold text-primary">
              ₹{(selectedCoffees * coffeeData.coffeePrice).toFixed(2)}
            </div>
            <p className="text-text-primary/60 text-sm mt-2">
              ₹{coffeeData.coffeePrice.toFixed(2)} per coffee
            </p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'info'
                ? 'bg-primary/20 text-primary border border-primary/50'
                : message.type === 'success'
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-red-500/20 text-red-400 border border-red-500/50'
            }`}>
              {message.text}
            </div>
          )}

          {!showQRCode ? (
            <button
              onClick={handleBuyCoffee}
              disabled={!selectedProject || !isAuthenticated}
              className="w-full px-8 py-4 bg-accent text-white rounded-full font-bold text-lg hover:bg-orange-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!isAuthenticated 
                ? 'Login to Buy Coffee'
                : !selectedProject
                ? 'Select a Project First'
                : `Buy ${selectedCoffees} Coffee${selectedCoffees > 1 ? 's' : ''} - ₹${(selectedCoffees * coffeeData.coffeePrice).toFixed(2)}`
              }
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-bg-dark/50 border border-primary/20 rounded-xl p-6">
                <label className="block text-text-primary font-medium mb-4">
                  Select Payment Type
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentType('upi')}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                      paymentType === 'upi'
                        ? 'bg-primary text-white'
                        : 'bg-bg-dark border-2 border-primary/20 text-text-primary hover:border-primary'
                    }`}
                  >
                    UPI
                  </button>
                  <button
                    onClick={() => setPaymentType('bank')}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                      paymentType === 'bank'
                        ? 'bg-primary text-white'
                        : 'bg-bg-dark border-2 border-primary/20 text-text-primary hover:border-primary'
                    }`}
                  >
                    Bank Transfer
                  </button>
                </div>
              </div>

              {paymentType === 'upi' && paymentData?.qrCode && (
                <div className="bg-bg-dark/50 border border-primary/20 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-bold text-text-primary mb-4">Scan QR Code to Pay</h3>
                  <div className="flex justify-center mb-4">
                    <img 
                      src={paymentData.qrCode} 
                      alt="Payment QR Code" 
                      className="max-w-xs border-2 border-primary/20 rounded-lg"
                    />
                  </div>
                  {paymentData.upiId && (
                    <p className="text-text-primary/70 mb-2">UPI ID: <span className="text-primary font-semibold">{paymentData.upiId}</span></p>
                  )}
                  <p className="text-2xl font-bold text-primary mb-4">
                    Amount: ₹{(selectedCoffees * coffeeData.coffeePrice).toFixed(2)}
                  </p>
                </div>
              )}
              
              {paymentType === 'bank' && paymentData?.bankAccount?.accountNumber && (
                <div className="bg-bg-dark/50 border border-primary/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-text-primary mb-4">Bank Account Details</h3>
                  <div className="space-y-2 text-sm mb-4">
                    <p className="text-text-primary/70">
                      Account Holder: <span className="text-text-primary font-semibold">{paymentData.bankAccount.accountHolderName}</span>
                    </p>
                    <p className="text-text-primary/70">
                      Account Number: <span className="text-text-primary font-semibold">{paymentData.bankAccount.accountNumber}</span>
                    </p>
                    <p className="text-text-primary/70">
                      IFSC Code: <span className="text-text-primary font-semibold">{paymentData.bankAccount.ifscCode}</span>
                    </p>
                    <p className="text-text-primary/70">
                      Bank Name: <span className="text-text-primary font-semibold">{paymentData.bankAccount.bankName}</span>
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-primary mb-4">
                    Amount: ₹{(selectedCoffees * coffeeData.coffeePrice).toFixed(2)}
                  </p>
                </div>
              )}

              {paymentType && (
                <>
                  {paymentType === 'bank' && (
                    <div className="bg-bg-dark/50 border border-primary/20 rounded-xl p-6">
                      <label className="block text-text-primary font-medium mb-2">
                        UTR Number
                      </label>
                      <input
                        type="text"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                        placeholder="Enter UTR/Transaction ID"
                        className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="bg-bg-dark/50 border border-primary/20 rounded-xl p-6">
                    <label className="block text-text-primary font-medium mb-2">
                      Upload Payment Screenshot
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary focus:border-primary focus:outline-none"
                    />
                    <p className="text-text-primary/60 text-sm mt-2">Upload screenshot of payment (Max 5MB)</p>
                    {screenshotPreview && (
                      <div className="mt-4 relative inline-block">
                        <img 
                          src={screenshotPreview} 
                          alt="Payment Screenshot Preview" 
                          className="max-w-xs border-2 border-primary/20 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentScreenshot(null);
                            setScreenshotPreview('');
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowQRCode(false);
                    setPaymentType('');
                    setUtr('');
                    setPaymentScreenshot(null);
                    setScreenshotPreview('');
                  }}
                  className="flex-1 px-6 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={submitting || !paymentType || !screenshotPreview || (paymentType === 'bank' && !utr.trim())}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Confirm Payment'}
                </button>
              </div>
            </div>
          )}

          <p className="text-text-primary/50 text-sm mt-6">
            Thank you for your support! 🙏
          </p>
        </div>
      </div>
    </div>
  );
};

export default Coffee;

