import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProjects from '../components/admin/AddProjects';
import ContactQueries from '../components/admin/ContactQueries';
import SocialLinks from '../components/admin/SocialLinks';
import AboutManage from '../components/admin/AboutManage';
import ManageUsers from '../components/admin/ManageUsers';
import AddResume from '../components/admin/AddResume';
import ManageSkills from '../components/admin/ManageSkills';
import CoffeeManage from '../components/admin/CoffeeManage';
import PaymentManage from '../components/admin/PaymentManage';
import CoffeePurchases from '../components/admin/CoffeePurchases';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const navigate = useNavigate();

  const tabs = [
    { id: 'projects', label: 'Add Projects', icon: '📁' },
    { id: 'queries', label: 'Contact Queries', icon: '📧' },
    { id: 'social', label: 'Social Links', icon: '🔗' },
    { id: 'about', label: 'About', icon: '👤' },
    { id: 'users', label: 'Manage Users', icon: '👥' },
    { id: 'resume', label: 'Add Resume', icon: '📄' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'coffee', label: 'Coffee Prices', icon: '☕' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'coffee-purchases', label: 'Bought Coffee', icon: '🛒' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'projects':
        return <AddProjects />;
      case 'queries':
        return <ContactQueries />;
      case 'social':
        return <SocialLinks />;
      case 'about':
        return <AboutManage />;
      case 'users':
        return <ManageUsers />;
      case 'resume':
        return <AddResume />;
      case 'skills':
        return <ManageSkills />;
      case 'coffee':
        return <CoffeeManage />;
      case 'payment':
        return <PaymentManage />;
      case 'coffee-purchases':
        return <CoffeePurchases />;
      default:
        return <AddProjects />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-card-bg/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
              <p className="text-text-primary/70">Manage your portfolio content</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-orange-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card-bg/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/40'
                    : 'bg-bg-dark text-text-primary hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-card-bg/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

