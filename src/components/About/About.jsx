import React from "react";
import { motion } from "framer-motion";
import { FaHandHoldingHeart, FaUsers, FaGlobeAsia, FaLightbulb } from 'react-icons/fa';
import FounderMessage from "../FounderMessage";

export default function About() {
  // Function to get the correct public URL for images
  const getImageUrl = (imageName) => {
    return new URL(`/public/${imageName}`, import.meta.url).href;
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About HCO</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Empowering communities, transforming lives, and building a better tomorrow through compassion and action.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src={getImageUrl("11zon_cropped.png")}
              alt="About Humanity Club Organization"
              className="w-full h-auto rounded-2xl shadow-2xl"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = "/11zon_cropped.png"; // Fallback to direct public path
                console.log("Image load failed, using fallback path");
              }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission & Vision</h2>
            <p className="text-gray-600 mb-6 text-lg">
              The Humanity Club Organization (HCO) is dedicated to fostering compassion, inclusivity, and social change. 
              We aim to uplift communities and empower individuals through awareness, education, and support.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <FaHandHoldingHeart className="text-4xl text-blue-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Compassion</h3>
                <p className="text-gray-600">Spreading kindness and empathy in every action</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <FaUsers className="text-4xl text-purple-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600">Building stronger, united communities</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-gray-800 mb-12"
          >
            Our Core Values
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaHandHoldingHeart className="text-5xl text-blue-600" />,
                title: "Compassion",
                description: "Leading with empathy and understanding in all our initiatives"
              },
              {
                icon: <FaUsers className="text-5xl text-purple-600" />,
                title: "Unity",
                description: "Bringing people together for positive social change"
              },
              {
                icon: <FaGlobeAsia className="text-5xl text-green-600" />,
                title: "Sustainability",
                description: "Creating lasting impact through sustainable solutions"
              },
              {
                icon: <FaLightbulb className="text-5xl text-yellow-600" />,
                title: "Innovation",
                description: "Finding creative solutions to community challenges"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg text-center hover:transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Initiatives Section */}
      <div className="container mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center text-gray-800 mb-12"
        >
          Our Initiatives
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{project.title}</h3>
              <p className="text-gray-600">{project.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Founder's Message Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Message from Our Founder</h2>
            <FounderMessage />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const projects = [
  {
    title: "Project Shakti",
    description: "Empowering women through skill development workshops, financial literacy programs, and entrepreneurship training."
  },
  {
    title: "Workshops",
    description: "Interactive educational workshops focusing on personal development, digital literacy, and environmental consciousness."
  },
  {
    title: "Project Taleem",
    description: "A comprehensive education initiative providing quality learning opportunities to underprivileged children."
  },
  {
    title: "Project Manavta",
    description: "Environmental conservation and community development program focusing on sustainable practices."
  },
  {
    title: "Project Ehsaas",
    description: "Supporting elderly care homes and orphanages through regular visits and healthcare assistance."
  },
  {
    title: "Project Ahaar",
    description: "Addressing food insecurity through sustainable food distribution networks and nutrition awareness."
  }
];
