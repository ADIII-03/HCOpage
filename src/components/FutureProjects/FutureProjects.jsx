import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FutureProjects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Updated future projects data with new timelines and AI image URLs
  const futureProjects = [
    {
      id: 1,
      title: "Project Shakti 2.0",
      subtitle: "Women Empowerment Initiative",
      description: "An enhanced version of our successful women empowerment program, focusing on digital literacy and entrepreneurship skills for rural women.",
      timeline: "2029-2030",
      impact: "Target to empower 1,000+ women",
      features: [
        "Digital Skills Training",
        "Micro-entrepreneurship Support",
        "Financial Literacy Programs",
        "Health & Wellness Workshops"
      ],
      status: "Planning Phase",
      imageUrl: "https://img.freepik.com/free-photo/medium-shot-women-working-together_23-2150096782.jpg",
    },
    {
      id: 2,
      title: "EcoHarmony Initiative",
      subtitle: "Environmental Sustainability Project",
      description: "A comprehensive environmental project combining tree plantation, waste management, and community awareness programs.",
      timeline: "2029-2031",
      impact: "10,000 trees & 20 clean communities",
      features: [
        "Mass Tree Plantation",
        "Waste Management Systems",
        "Environmental Education",
        "Community Clean-up Drives"
      ],
      status: "Initial Planning",
      imageUrl: "https://img.freepik.com/premium-photo/environmental-conservation-sustainability-concept-with-green-earth-tree-generated-by-ai_905417-5716.jpg",
    },
    {
      id: 3,
      title: "TechEd Revolution",
      subtitle: "Digital Education Access",
      description: "Bringing advanced technology education to underprivileged students through mobile learning labs and digital classrooms.",
      timeline: "2029-2030",
      impact: "Reach 2,500 students",
      features: [
        "Mobile Learning Labs",
        "Digital Classroom Setup",
        "Coding Workshops",
        "STEM Education Programs"
      ],
      status: "Resource Planning",
      imageUrl: "https://img.freepik.com/premium-photo/futuristic-classroom-with-holographic-screens-ai-generated_670147-12285.jpg",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-16 px-6 sm:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
            Future Initiatives
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Explore our upcoming projects that aim to create lasting positive impact in our communities.
            Join us in shaping a better tomorrow.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid gap-12"
        >
          {futureProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative group overflow-hidden">
                  <motion.img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover min-h-[300px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-indigo-700">{project.title}</h3>
                    <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-500 mb-2">{project.subtitle}</p>
                  <p className="text-gray-600 mb-6">{project.description}</p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">TIMELINE</h4>
                      <p className="text-indigo-600 font-medium">{project.timeline}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">EXPECTED IMPACT</h4>
                      <p className="text-indigo-600 font-medium">{project.impact}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">KEY FEATURES</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {project.features.map((feature, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-600"
                          >
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedProject(project)}
                      className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Learn More
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Detailed Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-indigo-700">{selectedProject.title}</h2>
                  <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {selectedProject.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-8">{selectedProject.description}</p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Project Details</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500">TIMELINE</h4>
                        <p className="text-gray-800">{selectedProject.timeline}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500">EXPECTED IMPACT</h4>
                        <p className="text-gray-800">{selectedProject.impact}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                    <div className="space-y-2">
                      {selectedProject.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-gray-700"
                        >
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FutureProjects;