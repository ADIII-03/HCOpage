import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from 'react-toastify';
import "../../styles/animations.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ReadMore component
const ReadMore = ({ children, maxLength = 150 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const text = children;

    if (text.length <= maxLength) {
        return <p className="text-gray-600">{text}</p>;
    }

    return (
        <div>
            <p className="text-gray-600">
                {isExpanded ? text : `${text.slice(0, maxLength)}...`}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                    {isExpanded ? 'Read Less' : 'Read More'}
                </button>
            </p>
        </div>
    );
};

const projects = [
    {
        title: "Project Shakti",
        description: "Empowering women through skill development workshops, financial literacy programs, and entrepreneurship training. We conduct regular sessions on self-defense, health awareness, and career guidance to help women become self-reliant and confident leaders in their communities.",
        image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Workshops",
        description: "Interactive educational workshops focusing on personal development, digital literacy, and environmental consciousness. Our expert-led sessions cover topics from basic computer skills to advanced sustainability practices, making learning accessible and engaging for all.",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Project Taleem",
        description: "A comprehensive education initiative providing quality learning opportunities to underprivileged children. We offer free tutoring, educational materials, and mentorship programs to ensure every child has access to the resources they need for academic success.",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Project Manavta",
        description: "Environmental conservation and community development program focusing on tree plantation, waste management, and sustainable living practices. We organize regular clean-up drives and awareness campaigns to promote environmental responsibility.",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Project Ehsaas",
        description: "Supporting elderly care homes and orphanages through regular visits, healthcare assistance, and emotional support programs. We organize cultural activities, medical camps, and recreational events to bring joy and comfort to our elderly and young residents.",
        image: "https://images.unsplash.com/photo-1526662092594-e98c1e356d6a?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Project Ahaar",
        description: "Addressing food insecurity through sustainable food distribution networks and nutrition awareness programs. We work with local communities to ensure regular meals reach those in need while promoting healthy eating habits and reducing food waste.",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
    }
];

export default function HomePage() {
    const { user } = useAuth();
    const location = useLocation();
    const isAdmin = user?.role === 'admin';
    const [donationDetails, setDonationDetails] = useState(() => {
        // Initialize from localStorage or use default values
        const savedDetails = localStorage.getItem('donationDetails');
        if (savedDetails) {
            return JSON.parse(savedDetails);
        }
        return {
            upiId: 'hco@upi',
            qrCodeImage: '/qr-placeholder.png', // Default local placeholder
            accountName: 'Humanity Club Organization',
            accountNumber: '1234567890',
            ifscCode: 'ABCD0123456',
            bankName: 'Example Bank'
        };
    });
    const [isEditingUpi, setIsEditingUpi] = useState(false);
    const [isEditingBank, setIsEditingBank] = useState(false);
    const [qrError, setQrError] = useState(false);
    const [isUploadingQr, setIsUploadingQr] = useState(false);

    // Statistics state
    const [stats] = useState({
        peopleHelped: "10,000+",
        projectsCompleted: "50+",
        volunteersActive: "200+",
        communitiesServed: "25+"
    });

    // Load donation details from backend on mount
    useEffect(() => {
        const fetchDonationDetails = async () => {
            try {
                const response = await axiosInstance.get('/donation-details');
                if (response.data?.data) {
                    const newDetails = response.data.data;
                    setDonationDetails(newDetails);
                    localStorage.setItem('donationDetails', JSON.stringify(newDetails));
                }
            } catch (error) {
                console.error('Error fetching donation details:', error);
                // Keep using localStorage data if fetch fails
            }
        };
        fetchDonationDetails();
    }, []);

    // Handle scroll to donation section when navigating from other pages
    useEffect(() => {
        if (location.state?.scrollToDonation) {
            const donationSection = document.getElementById('donation-section');
            if (donationSection) {
                donationSection.scrollIntoView({ behavior: 'smooth' });
                window.history.replaceState({}, document.title);
            }
        }
    }, [location]);

    const handleImageUpload = async (file, type) => {
        if (type === 'qr') {
            // Validate file size and type
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                alert('Only image files are allowed');
                return;
            }

            setIsUploadingQr(true);
            try {
                const formData = new FormData();
                formData.append('image', file);

                const response = await axiosInstance.post('/donation-details/qr', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data?.success && response.data?.data) {
                    const newDetails = response.data.data;
                    setDonationDetails(newDetails);
                    localStorage.setItem('donationDetails', JSON.stringify(newDetails));
                    setQrError(false);
                    toast.success('QR code updated successfully!');
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (error) {
                console.error('Error uploading QR:', error);
                setQrError(true);
                alert('Failed to upload QR code. Please try again.');
            } finally {
                setIsUploadingQr(false);
            }
        }
    };

    const handleDonationDetailsUpdate = async (updatedDetails) => {
        try {
            const response = await axiosInstance.put('/donation-details', updatedDetails);
            if (response.data?.data) {
                const newDetails = response.data.data;
                setDonationDetails(newDetails);
                localStorage.setItem('donationDetails', JSON.stringify(newDetails));
                setIsEditingUpi(false);
                setIsEditingBank(false);
            }
        } catch (error) {
            console.error('Error updating donation details:', error);
            alert('Failed to update donation details. Please try again.');
        }
    };

    const handleUpiUpdate = async () => {
        try {
            await handleDonationDetailsUpdate({ ...donationDetails });
            setIsEditingUpi(false);
        } catch (error) {
            alert(`Failed to update UPI details: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleBankUpdate = async () => {
        try {
            await handleDonationDetailsUpdate({ ...donationDetails });
            setIsEditingBank(false);
        } catch (error) {
            alert(`Failed to update bank details: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Hero Section */}
            <div className="relative min-h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center text-center overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    marginTop: '0'
                }}>
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -left-10 -top-10 w-48 md:w-72 h-48 md:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -right-10 -top-10 w-48 md:w-72 h-48 md:h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-10 left-20 w-48 md:w-72 h-48 md:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                {/* Background Logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] relative animate-float opacity-20">
                        <img
                            src="/11zon_cropped.png"
                            alt="Background Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Content Container */}
                <div className="relative z-20">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 opacity-0 animate-fadeIn drop-shadow-lg">
                            One Step Towards Humanity
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto opacity-0 animate-fadeIn animation-delay-500 drop-shadow-lg">
                            The Humanity Club Organization (HCO) is dedicated to fostering compassion, inclusivity, and positive social change through sustainable community development initiatives.
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="bg-white shadow-md">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 py-8">
                        {Object.entries(stats).map(([key, value]) => (
                            <div key={key} className="text-center">
                                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">{value}</div>
                                <div className="text-sm md:text-base lg:text-lg text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects Section */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Our Projects</h2>
                <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                    Through our diverse range of projects, we strive to create lasting positive impact in communities across the region. Each initiative is carefully designed to address specific social challenges while promoting sustainable development.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div key={index} 
                             className="relative group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            <div className="relative h-64">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">{project.title}</h3>
                                <ReadMore>{project.description}</ReadMore>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Donation Section */}
            <div id="donation-section" className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8">Support Our Cause</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* UPI and QR Code Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-2xl font-semibold text-gray-800">Donate via UPI</h3>
                            <p className="mt-2 text-gray-600">Scan the QR code or use the UPI ID below:</p>
                            <div className="mt-4 relative bg-gray-50 p-4 rounded-lg">
                                <div className="w-72 h-72 mx-auto relative">
                                    {isUploadingQr ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                                            <div className="flex flex-col items-center">
                                                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    ) : donationDetails.qrCodeImage ? (
                                        <div className="relative group">
                                            <div className="w-full h-full bg-white rounded-lg p-4 shadow-sm">
                                                <img
                                                    src={donationDetails.qrCodeImage}
                                                    alt="Donation QR Code"
                                                    className="w-full h-full object-contain"
                                                    onError={() => {
                                                        const updatedDetails = {
                                                            ...donationDetails,
                                                            qrCodeImage: null
                                                        };
                                                        setDonationDetails(updatedDetails);
                                                        localStorage.setItem('donationDetails', JSON.stringify(updatedDetails));
                                                    }}
                                                />
                                            </div>
                                            {isAdmin && (
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm('Are you sure you want to delete this QR code?')) {
                                                                setIsUploadingQr(true);
                                                                try {
                                                                    const publicId = donationDetails.qrPublicId;
                                                                    if (!publicId) {
                                                                        throw new Error('No QR code to delete');
                                                                    }
                                                                    const filename = publicId.replace('hco/qr-codes/', '');
                                                                    await axiosInstance.delete(`/donation-details/qr/${filename}`);
                                                                    const updatedDetails = {
                                                                        ...donationDetails,
                                                                        qrCodeImage: null,
                                                                        qrPublicId: null
                                                                    };
                                                                    setDonationDetails(updatedDetails);
                                                                    localStorage.setItem('donationDetails', JSON.stringify(updatedDetails));
                                                                } catch (error) {
                                                                    console.error('Error deleting QR:', error);
                                                                } finally {
                                                                    setIsUploadingQr(false);
                                                                }
                                                            }
                                                        }}
                                                        className="text-white bg-red-600 p-3 rounded-full hover:bg-red-700 transition-colors"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6">
                                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    {isAdmin && (
                                        <label className={`absolute top-4 right-4 ${isUploadingQr ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'} text-white px-4 py-2 rounded-lg transition text-lg`}>
                                            {isUploadingQr ? 'Uploading...' : 'Change QR'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        handleImageUpload(file, 'qr');
                                                        e.target.value = ''; // Reset input
                                                    }
                                                }}
                                                disabled={isUploadingQr}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                            {isAdmin && isEditingUpi ? (
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        value={donationDetails.upiId}
                                        onChange={(e) => setDonationDetails({...donationDetails, upiId: e.target.value})}
                                        className="w-full p-2 border rounded mb-2"
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={handleUpiUpdate}
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditingUpi(false)}
                                            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="mt-4 text-lg font-semibold text-gray-800">UPI ID: <span className="text-blue-600">{donationDetails.upiId}</span></p>
                                    {isAdmin && (
                                        <button
                                            onClick={() => setIsEditingUpi(true)}
                                            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                        >
                                            Edit UPI ID
                                        </button>
                                    )}
                                </>
                            )}
                            <p className="mt-2 text-sm text-gray-600">Fast, secure, and easy!</p>
                        </div>

                        {/* Bank Account Details Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-2xl font-semibold text-gray-800">Bank Transfer</h3>
                            <div className="mt-4 text-left">
                                {isAdmin && isEditingBank ? (
                                    <>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={donationDetails.accountName}
                                                onChange={(e) => setDonationDetails({...donationDetails, accountName: e.target.value})}
                                                className="w-full p-2 border rounded"
                                                placeholder="Account Name"
                                            />
                                            <input
                                                type="text"
                                                value={donationDetails.accountNumber}
                                                onChange={(e) => setDonationDetails({...donationDetails, accountNumber: e.target.value})}
                                                className="w-full p-2 border rounded"
                                                placeholder="Account Number"
                                            />
                                            <input
                                                type="text"
                                                value={donationDetails.ifscCode}
                                                onChange={(e) => setDonationDetails({...donationDetails, ifscCode: e.target.value})}
                                                className="w-full p-2 border rounded"
                                                placeholder="IFSC Code"
                                            />
                                            <input
                                                type="text"
                                                value={donationDetails.bankName}
                                                onChange={(e) => setDonationDetails({...donationDetails, bankName: e.target.value})}
                                                className="w-full p-2 border rounded"
                                                placeholder="Bank Name"
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-end space-x-2">
                                            <button
                                                onClick={handleBankUpdate}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setIsEditingBank(false)}
                                                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-600"><span className="font-semibold">Account Name:</span> {donationDetails.accountName}</p>
                                        <p className="text-gray-600"><span className="font-semibold">Account Number:</span> {donationDetails.accountNumber}</p>
                                        <p className="text-gray-600"><span className="font-semibold">IFSC Code:</span> {donationDetails.ifscCode}</p>
                                        <p className="text-gray-600"><span className="font-semibold">Bank Name:</span> {donationDetails.bankName}</p>
                                        {isAdmin && (
                                            <button
                                                onClick={() => setIsEditingBank(true)}
                                                className="mt-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                            >
                                                Edit Bank Details
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                            <p className="mt-8 text-base text-gray-700 bg-blue-50 rounded-lg p-6 flex flex-col items-center shadow-sm">
                                <span className="mb-2">
                                    For international transfers, please contact us.
                                </span>
                                <a
                                    href="/contact"
                                    className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition font-semibold"
                                    style={{ minWidth: 160, textAlign: "center" }}
                                >
                                    More Contact
                                </a>
                            </p>
                        </div>

                        {/* Why Donate Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-2xl font-semibold text-gray-800">Why Donate?</h3>
                            <p className="mt-4 text-gray-600">
                                Your contribution helps us continue our mission of fostering compassion, inclusivity, and social change. Every donation makes a difference!
                            </p>
                            <ul className="mt-4 text-left text-gray-600 list-disc list-inside">
                                <li>Support education for underprivileged children.</li>
                                <li>Provide food and shelter to those in need.</li>
                                <li>Empower women through skill development.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer 
                position="top-right" 
                autoClose={3000} 
                limit={1}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Add required styles */}
            <style jsx>{`
                @keyframes border-rotate {
                    0%, 100% {
                        transform: rotate(0deg);
                    }
                    50% {
                        transform: rotate(180deg);
                    }
                }
                .animate-border {
                    animation: border-rotate 8s linear infinite;
                }
            `}</style>
        </div>
    );
}