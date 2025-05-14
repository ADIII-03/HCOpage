import { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            const response = await axios.post('http://localhost:8000/api/contact/send', formData);
            
            if (response.data.success) {
                setStatus({
                    loading: false,
                    success: true,
                    error: null
                });
                setFormData({ name: '', email: '', message: '' });
            }
        } catch (error) {
            setStatus({
                loading: false,
                success: false,
                error: error.response?.data?.message || 'Failed to send message'
            });
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Contact Us</h2>
            
            {status.success && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    Message sent successfully! We'll get back to you soon.
                </div>
            )}
            
            {status.error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {status.error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={status.loading}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        status.loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                >
                    {status.loading ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
};

export default ContactForm; 
import axios from 'axios';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            const response = await axios.post('http://localhost:8000/api/contact/send', formData);
            
            if (response.data.success) {
                setStatus({
                    loading: false,
                    success: true,
                    error: null
                });
                setFormData({ name: '', email: '', message: '' });
            }
        } catch (error) {
            setStatus({
                loading: false,
                success: false,
                error: error.response?.data?.message || 'Failed to send message'
            });
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Contact Us</h2>
            
            {status.success && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                    Message sent successfully! We'll get back to you soon.
                </div>
            )}
            
            {status.error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {status.error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={status.loading}
                    className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        status.loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                >
                    {status.loading ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
};

export default ContactForm; 