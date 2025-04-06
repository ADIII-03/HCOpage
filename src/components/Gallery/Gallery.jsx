import React, { useState, useEffect } from 'react';

const Gallery = () => {
  const projects = [
    {
      title: 'Project Shakti',
      description: 'Women empowerment drives and awareness workshops.',
      images: [
        'https://source.unsplash.com/featured/?women,empowerment',
        'https://source.unsplash.com/featured/?ngo,women',
        'https://source.unsplash.com/featured/?education,women',
      ],
    },
    {
      title: 'Workshops',
      description: 'Interactive educational and hygiene workshops.',
      images: [
        'https://source.unsplash.com/featured/?workshop,education',
        'https://source.unsplash.com/featured/?students,learning',
        'https://source.unsplash.com/featured/?presentation,classroom',
      ],
    },
    {
      title: 'Project Taleem',
      description: 'Free educational programs for underprivileged children.',
      images: [
        'https://source.unsplash.com/featured/?children,school',
        'https://source.unsplash.com/featured/?education,books',
        'https://source.unsplash.com/featured/?students,teaching',
      ],
    },
    {
      title: 'Project Manavta',
      description: 'Environmental initiatives and plantation drives.',
      images: [
        'https://source.unsplash.com/featured/?plantation,earth',
        'https://source.unsplash.com/featured/?green,trees',
        'https://source.unsplash.com/featured/?volunteers,environment',
      ],
    },
    {
      title: 'Project Ehsaas',
      description: 'Visits to old age homes and orphanages.',
      images: [
        'https://source.unsplash.com/featured/?orphanage,care',
        'https://source.unsplash.com/featured/?elderly,smile',
        'https://source.unsplash.com/featured/?ngo,volunteer',
      ],
    },
    {
      title: 'Project Ahaar',
      description: 'Food distribution to those in need.',
      images: [
        'https://source.unsplash.com/featured/?food,charity',
        'https://source.unsplash.com/featured/?volunteer,food',
        'https://source.unsplash.com/featured/?meals,help',
      ],
    },
  ];

  const [activeProject, setActiveProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleNextImage = (e, projectIndex) => {
    e?.stopPropagation();
    setActiveImageIndex((prevIndex) =>
      (prevIndex + 1) % projects[projectIndex].images.length
    );
  };

  const handlePrevImage = (e, projectIndex) => {
    e?.stopPropagation();
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0
        ? projects[projectIndex].images.length - 1
        : prevIndex - 1
    );
  };

  const exitSlideshow = () => {
    setActiveProject(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeProject !== null) {
        if (e.key === 'ArrowRight') handleNextImage(null, activeProject);
        if (e.key === 'ArrowLeft') handlePrevImage(null, activeProject);
        if (e.key === 'Escape') exitSlideshow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10">Our Projects Gallery</h2>
      <div className="grid grid-cols-1 gap-10">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`relative p-5 rounded-xl bg-white shadow-md transition duration-300 ${
              activeProject !== null && activeProject !== index
                ? 'blur-sm pointer-events-none'
                : 'hover:shadow-lg'
            }`}
            onMouseEnter={() => {
              setActiveProject(index);
              setActiveImageIndex(0);
            }}
            onMouseLeave={() => setActiveProject(null)}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">{project.title}</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">{project.description}</p>

            {/* Grid View */}
            <div
              className={`grid ${
                activeProject === index
                  ? 'hidden'
                  : 'grid-cols-2 sm:grid-cols-3 gap-4'
              }`}
            >
              {project.images.map((image, imgIndex) => (
                <img
                  key={imgIndex}
                  src={image}
                  alt={`${project.title} - ${imgIndex + 1}`}
                  className="w-full h-40 sm:h-48 object-cover rounded-lg"
                />
              ))}
            </div>

            {/* Slideshow View */}
            {activeProject === index && (
              <div className="relative w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden">
                <img
                  src={project.images[activeImageIndex]}
                  alt={`${project.title} - Slide ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
                {/* Navigation Controls */}
                <div className="absolute inset-0 flex items-center justify-between p-3 sm:p-4">
                  <button
                    onClick={(e) => handlePrevImage(e, index)}
                    className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md text-xl"
                    aria-label="Previous"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={(e) => handleNextImage(e, index)}
                    className="bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md text-xl"
                    aria-label="Next"
                  >
                    &#8594;
                  </button>
                </div>
                {/* Exit Slideshow (Mobile Friendly) */}
                <button
                  onClick={exitSlideshow}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-sm px-2 py-1 rounded"
                >
                  Exit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
