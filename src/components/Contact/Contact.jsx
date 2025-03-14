import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

function Contact() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors,isSubmitting },
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
      }
    }
  }, [setValue]);

  const onSubmit = (data) => {
   
    const existingData = JSON.parse(localStorage.getItem("contactFormSubmissions")) || [];
  
    existingData.push(data);

    localStorage.setItem("contactFormSubmissions", JSON.stringify(existingData));
  
    alert("Form data saved successfully!");
    reset();
  };
  

  return (
    <div className="relative py-20 bg-gray-50 min-h-screen overflow-hidden">
      <img
        src="/11zon_cropped.png"
        alt="HCO Logo"
        className="absolute inset-0 w-full h-full object-contain opacity-10 animate-pulse"
      />
      <div className="container m-auto px-6 text-gray-700 md:px-12 xl:px-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 animate-fade-in">Get in Touch</h2>
          <p className="mt-4 text-lg text-gray-600 animate-fade-in-delay">
            We’d love to hear from you! Whether you have questions, want to collaborate, or need more details about our initiatives, feel free to reach out.
          </p>
        </div>

        {/* Contact Form */}
        <div className="mt-12 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md animate-slide-in">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium">Full Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
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
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' },
                })}
                className={`w-full mt-2 p-4 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                placeholder="you@example.com"
              />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email.message}</div>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea
                {...register('message', { required: 'Message is required' })}
                className={`w-full mt-2 p-4 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                rows="5"
                placeholder="Write your message here..."
              />
              {errors.message && <div className="text-red-500 text-sm mt-1">{errors.message.message}</div>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Join Us & QR Code Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
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
            <h3 className="text-4xl font-bold text-gray-900">🔗 Our Linktree</h3>
            <p className="mt-4 text-lg text-gray-700 leading-relaxed text-center">
              Discover more about HCO, our initiatives, and how you can be involved.
            </p>
            <div className="mt-6 flex justify-center w-full">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://linktr.ee/hco"
                alt="Linktree QR Code"
                className="rounded-lg shadow-md transition-transform transform hover:scale-110 duration-300 w-[150px] h-[150px]"
              />
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
              allowTransparency="true" 
              allow="encrypted-media"
              title="Instagram Feed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
