import React from 'react';

function FutureProjects() {
    return (
        <div className="py-20 bg-gray-50 min-h-screen">
            <div className="container m-auto px-6 text-gray-700 md:px-12 xl:px-24">
                
                {/* Future Projects Section */}
                <div 
                    className="text-center relative bg-cover bg-center py-20 rounded-lg overflow-hidden" 
                    style={{ backgroundImage: `url("https://img.freepik.com/free-photo/businessman-big-office_53876-144319.jpg?w=996")` }}
                    aria-label="Future Projects Section"
                >
                    <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark Overlay */}
                    <div className="relative z-10">
                        <h2 className="text-5xl font-extrabold text-white">Future Projects</h2>
                        <p className="mt-4 text-lg text-white">We are working on new initiatives to make a lasting impact. Join us in bringing these projects to life!</p>
                    </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: "🌱 Project Green Earth", description: "Large-scale tree plantation drives and environmental sustainability programs.", image: "https://img.freepik.com/premium-photo/earth-day-tree-green-earth-isolate-background-generate-ai_572887-943.jpg?w=740" },
                        { title: "📚 Digital Taleem", description: "Online education resources for underprivileged children.", image: "https://img.freepik.com/free-vector/geometric-science-education-background-vector-gradient-blue-digital-remix_53876-125993.jpg?w=996" },
                    ].map((project, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
                            <img src={project.image} alt={project.title} className="w-full h-64 object-cover rounded-lg" />
                            <h3 className="mt-4 text-2xl font-semibold text-gray-800">{project.title}</h3>
                            <p className="text-gray-600">{project.description}</p>
                        </div>
                    ))}
                </div>

                {/* Collaboration Opportunities */}
                <div 
                    className="mt-16 text-center relative bg-cover bg-center py-20 rounded-lg overflow-hidden" 
                    style={{ backgroundImage: `url("https://img.freepik.com/free-vector/team-goals-concept-illustration_114360-5175.jpg?w=900")` }}
                    aria-label="Collaboration Opportunities Section"
                >
                    <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark Overlay */}
                    <div className="relative z-10">
                        <h3 className="text-3xl font-semibold text-white">Collaboration Opportunities</h3>
                        <p className="mt-4 text-lg text-white">We invite individuals, corporates, and NGOs to collaborate with us.</p>
                    </div>
                </div>
                
                <div className="mt-6 text-left text-lg max-w-3xl mx-auto space-y-4">
                    <h4 className="text-xl font-bold text-gray-800">Short-Term Collaborations:</h4>
                    <ul className="list-disc pl-6 text-gray-700">
                        <li>Volunteer for single-day events like food drives and plantation campaigns.</li>
                        <li>Sponsor a workshop or awareness drive.</li>
                        <li>Conduct mentorship programs for youth.</li>
                    </ul>

                    <h4 className="text-xl font-bold text-gray-800 mt-6">Long-Term Collaborations:</h4>
                    <ul className="list-disc pl-6 text-gray-700">
                        <li>Become a corporate partner in our sustainable projects.</li>
                        <li>Fund and support the development of long-term community programs.</li>
                        <li>Engage in research and development for social impact innovations.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default FutureProjects;