import { useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
    const [loading, setLoading] = useState(true);

    return (
        
        <div className="bg-gray-100 min-h-screen">
    
            {/* Hero Section */}
            <div className="relative bg-cover bg-center h-[500px] flex items-center justify-center text-center" style={{ backgroundImage: "url('https://via.placeholder.com/1500')" }}>
                <div className="bg-black bg-opacity-50 p-10 rounded-xl max-w-4xl transition-transform duration-300 hover:scale-105">
                    <h1 className="text-5xl font-bold text-white mb-4">One Step Towards Humanity</h1>
                    <p className="text-lg text-white max-w-3xl mx-auto">
                        The Humanity Club Organization (HCO) is a non-profit organization dedicated to fostering compassion, inclusivity, and social change.
                    </p>
                </div>
            </div>

            {/* Projects Section */}
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-4">
                {projects.map((project, index) => (
                    <Link key={index} to={`/projects/${index}`} aria-label={`View ${project.title}`}>
                        <ProjectSection project={project} />
                    </Link>
                ))}
            </div>

            {/* Donation Section */}
            <div className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8">Support Our Cause</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* UPI and QR Code Section */}
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h3 className="text-2xl font-semibold text-gray-800">Donate via UPI</h3>
                            <p className="mt-2 text-gray-600">Scan the QR code or use the UPI ID below:</p>
                            <div className="mt-4">
                                <img
                                    src="https://via.placeholder.com/200" // Replace with your QR code image
                                    alt="Donation QR Code"
                                    className="w-48 h-48 mx-auto"
                                />
                            </div>
                            <p className="mt-4 text-lg font-semibold text-gray-800">UPI ID: <span className="text-blue-600">hco@upi</span></p>
                            <p className="mt-2 text-sm text-gray-600">Fast, secure, and easy!</p>
                        </div>

                        {/* Bank Account Details Section */}
                        <div
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
                            style={{
                                backgroundImage: "url('/11zon_cropped.png')", // Replace with your logo image
                                backgroundSize: "50%", // Adjust the size of the logo
                                backgroundPosition: "center", // Center the logo
                                backgroundRepeat: "no-repeat", // Prevent repeating the logo
                                backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white overlay
                                backgroundBlendMode: "overlay", // Blend the logo with the background
                            }}
                        >
                            <h3 className="text-2xl font-semibold text-gray-800">Bank Transfer</h3>
                            <div className="mt-4 text-left">
                                <p className="text-gray-600"><span className="font-semibold">Account Name:</span> Humanity Club Organization</p>
                                <p className="text-gray-600"><span className="font-semibold">Account Number:</span> 1234567890</p>
                                <p className="text-gray-600"><span className="font-semibold">IFSC Code:</span> ABCD0123456</p>
                                <p className="text-gray-600"><span className="font-semibold">Bank Name:</span> Example Bank</p>
                            </div>
                            <p className="mt-4 text-sm text-gray-600">For international transfers, please contact us.</p>
                        </div>

                        {/* Why Donate Section */}
                        <div
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
                            style={{
                                backgroundImage: "url('/11zon_cropped.png')", // Replace with your logo image
                                backgroundSize: "50%", // Adjust the size of the logo
                                backgroundPosition: "center", // Center the logo
                                backgroundRepeat: "no-repeat", // Prevent repeating the logo
                                backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white overlay
                                backgroundBlendMode: "overlay", // Blend the logo with the background
                            }}
                        >
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
        </div>
    );
}

function ProjectSection({ project }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="relative group overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <h2 className="text-xl font-semibold text-white mb-2">{project.title}</h2>
                    <p className="text-white text-center px-6">{project.description}</p>
                </div>
            </div>
        </div>
    );
}

const projects = [
    { title: "Project Shakti", description: "Empowering women through skill development and workshops.", image: "https://via.placeholder.com/400" },
    { title: "Workshops", description: "Awareness drives and educational workshops in schools and colleges.", image: "https://via.placeholder.com/400" },
    { title: "Project Taleem", description: "Ensuring children receive education, healthcare, and protection.", image: "https://via.placeholder.com/400" },
    { title: "Project Manavta", description: "Promoting equality and environmental responsibility.", image: "https://via.placeholder.com/400" },
    { title: "Project Ehsaas", description: "Providing love and care for orphanages and old age homes.", image: "https://via.placeholder.com/400" },
    { title: "Project Ahaar", description: "Fighting hunger and food insecurity in society.", image: "https://via.placeholder.com/400" }
];