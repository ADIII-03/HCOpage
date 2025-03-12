import React from 'react';

export default function About() {
    return (
        <div className="py-16 bg-white">
            <div className="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
                {/* About Section */}
                <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
                    <div className="md:w-5/12 lg:w-5/12">
                        <img
                            src="/11zon_cropped.png"
                            alt="About Humanity Club Organization"
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="md:w-7/12 lg:w-6/12">
                        <h2 className="text-2xl text-gray-900 font-bold md:text-4xl">
                            One Step Towards Humanity – Making a Difference Together
                        </h2>
                        <p className="mt-6 text-gray-600">
                            The Humanity Club Organization (HCO) is a non-profit organization dedicated to
                            fostering compassion, inclusivity, and social change. We aim to uplift communities and
                            empower individuals through awareness, education, and support.
                        </p>
                        <p className="mt-4 text-gray-600">
                            Our mission is to create a world where kindness and equality flourish. By working with
                            communities, we provide support in areas of need, ensuring no one is left behind.
                        </p>
                    </div>
                </div>

                {/* Project Details Section */}
                <div className="max-w-6xl mx-auto mt-16 p-6 bg-gray-50 shadow-lg rounded-xl">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Initiatives</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <h3 className="text-2xl font-semibold text-gray-800">{project.title}</h3>
                                <p className="text-gray-600 mt-2">{project.description}</p>
                                <ul className="list-disc list-inside text-gray-600 mt-4">
                                    {project.pastDrives.map((drive, i) => (
                                        <li key={i}>{drive}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Introduction Section */}
                <div className="max-w-6xl mx-auto mt-16 p-6 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg rounded-xl">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Core Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
                            >
                                {/* Circular Image */}
                                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-blue-100">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Name and Designation */}
                                <h3 className="mt-4 text-xl font-semibold text-gray-800">{member.name}</h3>
                                <p className="text-sm text-gray-600">{member.designation}</p>

                                {/* Additional Details (Shown on Hover) */}
                                <p className="mt-2 text-sm text-gray-600 opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    {member.details}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const projects = [
    { title: "Project Shakti", description: "Empowering women through skill-building, education, and leadership programs.", pastDrives: ["Skill Development Workshop (2023)", "Women Empowerment Summit (2022)", "Sanitary Pads Distribution Drive (2021)"] },
    { title: "Workshops", description: "Conducting awareness campaigns and interactive sessions in schools and colleges.", pastDrives: ["Mental Health Awareness Workshop (2023)", "Education for All Campaign (2022)", "Youth Leadership Seminar (2021)"] },
    { title: "Project Taleem", description: "Ensuring children receive quality education and support.", pastDrives: ["School Supplies Drive (2023)", "Online Tutoring Initiative (2022)", "Education Rights Awareness (2021)"] },
    { title: "Project Manavta", description: "Promoting social equality and environmental sustainability.", pastDrives: ["Tree Plantation Drive (2023)", "Climate Change Awareness Program (2022)", "Community Clean-Up Drive (2021)"] },
    { title: "Project Ehsaas", description: "Bringing love and care to orphanages and old age homes.", pastDrives: ["Festival Celebrations in Orphanages (2023)", "Elderly Support Program (2022)", "Winter Blanket Distribution (2021)"] },
    { title: "Project Ahaar", description: "Providing food to those in need and tackling hunger issues.", pastDrives: ["Food Distribution Drive (2023)", "Community Kitchen Initiative (2022)", "Pandemic Relief Meal Program (2021)"] }
];

const teamMembers = [
    {
        name: "John Doe",
        designation: "Founder",
        image: "https://via.placeholder.com/150",
        details: "John is the visionary behind HCO, with a passion for social change and community development.",
    },
    {
        name: "Jane Smith",
        designation: "Co-Founder",
        image: "https://via.placeholder.com/151",
        details: "Jane brings strategic leadership and a wealth of experience in non-profit management.",
    },
    {
        name: "Alice Johnson",
        designation: "Executive Head",
        image: "https://via.placeholder.com/152",
        details: "Alice oversees the execution of all projects and ensures operational excellence.",
    },
    {
        name: "Bob Brown",
        designation: "PR Head",
        image: "https://via.placeholder.com/153",
        details: "Bob manages public relations and ensures effective communication with stakeholders.",
    },
    {
        name: "Charlie Davis",
        designation: "HR Head",
        image: "https://via.placeholder.com/154",
        details: "Charlie leads the HR team, focusing on talent acquisition and team development.",
    },
    {
        name: "Diana Evans",
        designation: "Interns Head",
        image: "https://via.placeholder.com/155",
        details: "Diana manages the internship program, mentoring young talent and fostering growth.",
    },
    {
        name: "Eve Green",
        designation: "S&P Head",
        image: "https://via.placeholder.com/156",
        details: "Eve oversees strategy and partnerships, driving collaborations and long-term goals.",
    },
    {
        name: "Frank Harris",
        designation: "Social Media Head",
        image: "https://via.placeholder.com/157",
        details: "Frank manages HCO's social media presence, engaging with the community online.",
    },
];