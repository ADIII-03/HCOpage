import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../utils/axiosInstance';
import logoImage from '/11zon_cropped.png';
import qrCodeImage from '/WhatsApp Image 2025-02-13 at 22.15.48_b1c1058e.jpg';

function Contact() {
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const savedData = localStorage.getItem('contactFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach((key) => {
          setValue(key, parsedData[key]);
        });
      } catch (error) {
        console.error('Error parsing saved form data:', error);
        localStorage.removeItem('contactFormData');
      }
    }
  }, [setValue]);

  // Clear form data from localStorage when component mounts
  useEffect(() => {
    localStorage.removeItem('contactFormData');
  }, []);

  const onSubmit = async (data) => {
    try {
      setSubmitStatus({ type: 'loading', message: 'Sending message...' });

      // Log the request being made
      // console.log('Sending contact form to:', '/contact/send', {
      //   data,
      //   method: 'POST'
      // });

      const response = await axiosInstance.post('/contact/send', {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        message: data.message.trim()
      });

      // console.log('Contact form response:', response.data);

      if (response.data?.success) {
        setSubmitStatus({
          type: 'success',
          message: response.data.message || 'Message sent successfully! We will get back to you soon.'
        });
        
        // Clear form and localStorage
        reset();
        localStorage.removeItem('contactFormData');

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSubmitStatus({ type: '', message: '' });
        }, 3000);
      } else {
        throw new Error(response.data?.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form submission error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: '/contact/send'
      });

      let errorMessage = 'Failed to send message. ';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (error.response?.status === 429) {
        errorMessage += 'Too many attempts. Please try again later.';
      } else if (error.response?.status === 404) {
        errorMessage += 'Service temporarily unavailable. Please try again later.';
      } else if (error.response?.status >= 500) {
        errorMessage += 'An unexpected error occurred. Please try again later.';
      } else {
        errorMessage += error.response?.data?.message || 'Please try again.';
      }

      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });

      // Clear error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: '', message: '' });
      }, 5000);
    }
  };

  return (
    <div className="relative py-20 bg-gray-50 min-h-screen overflow-hidden">
      <img
        src={logoImage}
        alt="HCO Logo"
        className="absolute inset-0 w-full h-full object-contain opacity-10 animate-pulse"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/11zon_cropped.png';
        }}
      />
      <div className="container m-auto px-6 text-gray-700 md:px-12 xl:px-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 animate-fade-in">Get in Touch</h2>
          <p className="mt-4 text-lg text-gray-600 animate-fade-in-delay">
            We'd love to hear from you! Whether you have questions, want to collaborate, or need more details about our initiatives, feel free to reach out.
          </p>
        </div>

        {/* Contact Form */}
        <div className="mt-12 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md animate-slide-in">
          {submitStatus.message && (
            <div 
              className={`mb-6 p-4 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-100 text-green-700' 
                  : submitStatus.type === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium">Full Name</label>
              <input
                {...register('name', { 
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                className={`w-full mt-2 p-4 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                placeholder="John Doe"
              />
              {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name.message}</div>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email Address</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { 
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                    message: 'Invalid email address' 
                  },
                })}
                className={`w-full mt-2 p-4 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                placeholder="you@example.com"
              />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea
                {...register('message', { 
                  required: 'Message is required',
                  minLength: { value: 10, message: 'Message must be at least 10 characters' }
                })}
                className={`w-full mt-2 p-4 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                rows="5"
                placeholder="Write your message here..."
              />
              {errors.message && <div className="text-red-500 text-sm mt-1">{errors.message.message}</div>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${
                isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
              } text-white py-4 rounded-lg font-semibold text-lg transition`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>

        {/* Join Us & QR Code Section */}
        <div   className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Join Us Section */}
          <div className="bg-white p-10 rounded-lg shadow-lg text-center flex flex-col justify-between animate-fade-in md:h-[300px]">
            <h3 className="text-4xl font-bold text-gray-900">🌟 Join Us</h3>
            <p className="mt-4 text-lg text-gray-700 leading-relaxed">
              Be a part of our mission! Register through our official Google form
              and contribute towards creating meaningful change.
            </p>
            <a
              href="https://forms.gle/L8PMpknuJmoMUbBs6"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-300"
            >
              ✨ Register Now
            </a>
          </div>

          {/* QR Code Section */}
          <div className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center justify-center animate-fade-in md:h-[300px]">
            <h3 className="text-4xl font-bold text-gray-900">🔗 Connect With Us</h3>
            <p className="mt-4 text-lg text-gray-700 leading-relaxed text-center">
              Scan the QR code or click the link below to discover more about HCO and our initiatives.
            </p>
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="relative w-full max-w-[150px] aspect-square">
                <img
                  src={qrCodeImage}
                  alt="HCO Linktree QR Code"
                  className="absolute inset-0 w-full h-full object-contain rounded-lg shadow-md bg-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/WhatsApp Image 2025-02-13 at 22.15.48_b1c1058e.jpg';
                  }}
                />
              </div>
              <a
                href="https://linktr.ee/humanitycluborganization?utm_source=qr_code"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                <span>Visit our Linktree</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Instagram Live Feed */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-semibold text-gray-800">Follow Us on Instagram</h3>
          <p className="mt-4 text-lg text-gray-600">Stay updated with our latest activities and events.</p>
          <div className="mt-8">
            <iframe 
              src="https://www.instagram.com/humanity.club_organization/embed"
              width="100%" 
              height="400" 
              scrolling="no" 
              frameBorder="0" 
              allowtransparency="true" 
              allow="encrypted-media"
              title="Instagram Feed"
              className="bg-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
