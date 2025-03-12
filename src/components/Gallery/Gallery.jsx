import React, { useState } from 'react';

const Gallery = () => {
  const projects = [
    {
      title: 'Project Shakti',
      images: [
        'https://via.placeholder.com/400',
        'https://via.placeholder.com/401',
        'https://via.placeholder.com/402',
      ],
    },
    {
      title: 'Workshops',
      images: [
        'https://via.placeholder.com/403',
        'https://via.placeholder.com/404',
        'https://via.placeholder.com/405',
      ],
    },
    {
      title: 'Project Taleem',
      images: [
        'https://via.placeholder.com/406',
        'https://via.placeholder.com/407',
        'https://via.placeholder.com/408',
      ],
    },
    {
      title: 'Project Manavta',
      images: [
        'https://via.placeholder.com/409',
        'https://via.placeholder.com/410',
        'https://via.placeholder.com/411',
      ],
    },
    {
      title: 'Project Ehsaas',
      images: [
        'https://via.placeholder.com/412',
        'https://via.placeholder.com/413',
        'https://via.placeholder.com/414',
      ],
    },
    {
      title: 'Project Ahaar',
      images: [
        'https://via.placeholder.com/415',
        'https://via.placeholder.com/416',
        'https://via.placeholder.com/417',
      ],
    },
  ];

  const [activeProject, setActiveProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleNextImage = (e, projectIndex) => {
    e.stopPropagation(); // Prevent event bubbling
    setActiveImageIndex((prevIndex) =>
      (prevIndex + 1) % projects[projectIndex].images.length
    );
  };

  const handlePrevImage = (e, projectIndex) => {
    e.stopPropagation(); // Prevent event bubbling
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0
        ? projects[projectIndex].images.length - 1
        : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="grid grid-cols-1 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`relative p-6 rounded-lg shadow-lg transition-all duration-300 ${
              activeProject !== null && activeProject !== index
                ? 'filter blur-sm'
                : ''
            }`}
            onMouseEnter={() => {
              setActiveProject(index);
              setActiveImageIndex(0); // Reset to the first image on hover
            }}
            onMouseLeave={() => setActiveProject(null)}
          >
            {/* Project Title */}
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{project.title}</h2>

            {/* Images Grid or Slideshow */}
            <div className="relative">
              <div
                className={`grid ${
                  activeProject === index
                    ? 'hidden' // Hide grid when slideshow is active
                    : 'grid-cols-3 gap-4'
                }`}
              >
                {project.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={image}
                    alt={`${project.title} - Image ${imgIndex + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>

              {/* Slideshow */}
              {activeProject === index && (
                <div className="relative w-full h-96 overflow-hidden rounded-lg">
                  <img
                    src={project.images[activeImageIndex]}
                    alt={`${project.title} - Image ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />

                  {/* Slideshow Controls */}
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <button
                      onClick={(e) => handlePrevImage(e, index)}
                      className="bg-white bg-opacity-75 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition"
                    >
                      &larr;
                    </button>
                    <button
                      onClick={(e) => handleNextImage(e, index)}
                      className="bg-white bg-opacity-75 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;