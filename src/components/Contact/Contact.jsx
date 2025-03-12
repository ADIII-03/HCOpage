import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.message) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate form submission
      setTimeout(() => {
        alert(JSON.stringify(formData, null, 2));
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="container m-auto px-6 text-gray-700 md:px-12 xl:px-24">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold text-gray-900">Get in Touch</h2>
          <p className="mt-4 text-lg text-gray-600">
            We’d love to hear from you! Whether you have questions, want to collaborate, or need more details about our initiatives, feel free to reach out.
          </p>
        </div>

        {/* Contact Form */}
        <div className="mt-12 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                className={`w-full mt-2 p-4 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                className={`w-full mt-2 p-4 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea
                name="message"
                className={`w-full mt-2 p-4 border ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                rows="5"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && <div className="text-red-500 text-sm mt-1">{errors.message}</div>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-semibold text-gray-800">Our Contact Information</h3>
          <p className="mt-4 text-lg text-gray-600">We are available via email, phone, or you can visit our office.</p>
          <div className="mt-6 space-y-3">
            <p className="text-gray-700 text-lg font-medium">📧 Email: <a href="mailto:contact@hco.org" className="text-blue-600 hover:underline">contact@hco.org</a></p>
            <p className="text-gray-700 text-lg font-medium">📞 Phone: <a href="tel:+911234567890" className="text-blue-600 hover:underline">+91 12345 67890</a></p>
            <p className="text-gray-700 text-lg font-medium">📍 Address: 123, Humanity Street, Delhi, India</p>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-semibold text-gray-800">Follow Us</h3>
          <p className="mt-4 text-lg text-gray-600">Stay updated with our latest activities and events.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Instagram Feed via LightWidget */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold mb-4">Instagram Feed</h4>
              <iframe 
                src="https://www.instagram.com/humanity.club_organization/embed"
                width="100%" 
                height="400" 
                scrolling="no" 
                frameBorder="0" 
                allowTransparency="true" 
                allow="encrypted-media"
                title="Instagram Feed"
              />
            </div>

            {/* LinkedIn Follow Button */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold mb-4">LinkedIn Updates</h4>
              <div className="linkedin-badge">
                <a href="https://www.linkedin.com/company/humanity-club-organization/" 
                   className="text-blue-600 hover:underline text-lg font-semibold"
                   target="_blank" 
                   rel="noopener noreferrer"
                   aria-label="Follow us on LinkedIn"
                >
                  Follow Us on LinkedIn
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;