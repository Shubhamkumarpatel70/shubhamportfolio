import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [aboutData, setAboutData] = useState({
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA'
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/public/about');
      if (response.data) {
        setAboutData(response.data);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      setStatus({ type: 'success', message: response.data.message || 'Message sent successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* Glowing background accents */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-primary/15 rounded-full blur-3xl"></div>

      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-text-primary">Get In Touch</h1>
            <p className="text-xl text-text-primary/80">I'd love to hear from you</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary">Let's Connect</h2>
              <p className="text-lg text-text-primary/80 leading-relaxed mb-8">
                Whether you have a project in mind, want to collaborate, or just
                want to say hello, feel free to reach out. I'm always open to
                discussing new opportunities.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl w-14 h-14 flex items-center justify-center bg-card-bg rounded-xl flex-shrink-0 border border-primary/20">
                    📧
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 text-text-primary">Email</h4>
                    <p className="text-text-primary/70">{aboutData.email || 'john.doe@example.com'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl w-14 h-14 flex items-center justify-center bg-card-bg rounded-xl flex-shrink-0 border border-primary/20">
                    📱
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 text-text-primary">Phone</h4>
                    <p className="text-text-primary/70">{aboutData.phone || '+1 (555) 123-4567'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl w-14 h-14 flex items-center justify-center bg-card-bg rounded-xl flex-shrink-0 border border-primary/20">
                    📍
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 text-text-primary">Location</h4>
                    <p className="text-text-primary/70">{aboutData.location || 'New York, USA'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card-bg/50 backdrop-blur-sm border border-primary/20 p-8 rounded-2xl shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {status.message && (
                  <div className={`p-4 rounded-lg font-medium ${
                    status.type === 'success' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}>
                    {status.message}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block font-medium mb-2 text-text-primary">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-medium mb-2 text-text-primary">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block font-medium mb-2 text-text-primary">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Subject"
                    className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-medium mb-2 text-text-primary">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Your message here..."
                    className="w-full px-4 py-3 bg-bg-dark border-2 border-primary/20 rounded-lg text-text-primary placeholder-text-primary/50 focus:border-primary focus:outline-none transition-colors resize-y min-h-[120px]"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
