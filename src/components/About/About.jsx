import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

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
          </div>
        </div>

        {/* Our Initiatives Section */}
        <div className="max-w-6xl mx-auto mt-16 p-6 bg-gray-50 shadow-lg rounded-xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-gray-800">{project.title}</h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Introduction Section with Animations */}
        <motion.div
          className="max-w-6xl mx-auto mt-16 p-6 bg-white shadow-lg rounded-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Core Team</h2>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            navigation
            autoplay={{ delay: 3000 }}
            className="pb-10"
          >
            {teamMembers.map((member, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-blue-300 shadow-md hover:shadow-lg">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.designation}</p>
                  <motion.p
                    className="mt-2 text-sm text-gray-600 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {member.details}
                  </motion.p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </div>
  );
}

const projects = [
  { title: "Project Shakti", description: "Empowering women through skill-building, education, and leadership programs." },
  { title: "Workshops", description: "Conducting awareness campaigns and interactive sessions in schools and colleges." },
  { title: "Project Taleem", description: "Ensuring children receive quality education and support." },
  { title: "Project Manavta", description: "Promoting social equality and environmental sustainability." },
  { title: "Project Ehsaas", description: "Bringing love and care to orphanages and old age homes." },
  { title: "Project Ahaar", description: "Providing food to those in need and tackling hunger issues." }
];

const teamMembers = [
    { name: "John Doe", designation: "Founder", image: "https://via.placeholder.com/150" },
    { name: "Jane Smith", designation: "Co-Founder", image: "https://via.placeholder.com/151" },
    { name: "Alice Johnson", designation: "Executive Head", image: "https://via.placeholder.com/152" },
    { name: "Bob Brown", designation: "PR Head", image: "https://via.placeholder.com/153" },
    { name: "Charlie Davis", designation: "HR Head", image: "https://via.placeholder.com/154" },
    { name: "Diana Evans", designation: "Interns Head", image: "https://via.placeholder.com/155" },
    { name: "Eve Green", designation: "S&P Head", image: "https://via.placeholder.com/156" },
    { name: "Frank Harris", designation: "Social Media Head", image: "https://via.placeholder.com/157" },
];
