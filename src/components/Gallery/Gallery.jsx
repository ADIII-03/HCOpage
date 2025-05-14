import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const Gallery = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [projects, setProjects] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Slideshow auto-play effect
  useEffect(() => {
    let interval;
    if (isPlaying && showSlideshow) {
      interval = setInterval(() => {
        const currentProject = projects[currentProjectIndex];
        if (currentImageIndex < currentProject.images.length - 1) {
          setCurrentImageIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 3000); // Change slide every 3 seconds
    }
    return () => clearInterval(interval);
  }, [isPlaying, showSlideshow, currentImageIndex, currentProjectIndex, projects]);

  const fetchProjects = async (retry = false) => {
    try {
      setError(null);
      const response = await axiosInstance.get('/gallery/projects');
      if (response.data?.projects) {
        setProjects(response.data.projects);
        setRetryCount(0); // Reset retry count on success
      }
    } catch (error) {
      console.error('Fetch error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status
      });

      // Set default projects if server is not responding
      setProjects([
        { title: 'Project Shakti', description: 'Women empowerment drives and awareness workshops.', images: [] },
        { title: 'Workshops', description: 'Interactive educational and hygiene workshops.', images: [] },
        { title: 'Project Taleem', description: 'Free educational programs for underprivileged children.', images: [] },
        { title: 'Project Manavta', description: 'Environmental initiatives and plantation drives.', images: [] },
        { title: 'Project Ehsaas', description: 'Visits to old age homes and orphanages.', images: [] },
        { title: 'Project Ahaar', description: 'Food distribution to those in need.', images: [] },
      ]);

      // Show appropriate error message
      if (error.code === 'ERR_NETWORK') {
        setError(
          "Cannot connect to server. Please ensure the backend server is running on port 8000. " +
          (retryCount < 3 ? "Retrying..." : "Please refresh the page to try again.")
        );
        
        // Implement retry logic
        if (retryCount < 3 && !retry) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => fetchProjects(true), 3000); // Retry after 3 seconds
        }
      } else {
        setError(error.message || "Failed to load gallery projects. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (e, projectIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    const project = projects[projectIndex];
    if (!project) {
        console.error('Project not found for index:', projectIndex);
        setError("Project not found");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("projectIndex", String(projectIndex));
    formData.append("projectTitle", project.title);
    formData.append("description", project.description || '');

    try {
      setUploading(true);
      setError(null);

      console.log('Uploading image:', {
        projectIndex,
        projectTitle: project.title,
        fileName: file.name
      });

      const response = await axiosInstance.post('/gallery/upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('Upload response:', response.data);

      if (response.data?.success && response.data?.image) {
        setProjects(prevProjects => {
          const newProjects = [...prevProjects];
          newProjects[projectIndex] = {
            ...newProjects[projectIndex],
            images: [...newProjects[projectIndex].images, {
              url: response.data.image.url,
              publicId: response.data.image.publicId,
              description: response.data.image.description
            }]
          };
          return newProjects;
        });
      }
    } catch (error) {
      console.error('Upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.response?.data?.error || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (projectIndex, imageIndex, forceDelete = false) => {
    const confirm = window.confirm(
      forceDelete 
        ? "This will force delete the image from the database. Are you sure?"
        : "Are you sure you want to delete this image?"
    );
    if (!confirm) return;

    const imageToDelete = projects[projectIndex].images[imageIndex];
    
    console.log('Attempting to delete image:', {
      projectIndex,
      imageIndex,
      imageToDelete,
      forceDelete
    });

    try {
      setDeleting(true);
      setError(null);

      const response = await axiosInstance.delete('/gallery/delete', {
        data: {
          projectIndex,
          publicId: imageToDelete.publicId,
          forceDelete
        }
      });

      console.log('Delete response:', response.data);

      if (response.data?.success) {
        setProjects(prevProjects => {
          const newProjects = [...prevProjects];
          newProjects[projectIndex] = {
            ...newProjects[projectIndex],
            images: newProjects[projectIndex].images.filter((_, idx) => idx !== imageIndex)
          };
          return newProjects;
        });
      }
    } catch (error) {
      console.error('Delete error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });

      // If deletion fails and it wasn't a force delete attempt, offer force delete
      if (!forceDelete && error.response?.status === 500) {
        const retryWithForce = window.confirm(
          "Failed to delete from cloud storage. Would you like to force delete this image from the database?"
        );
        if (retryWithForce) {
          return handleDeleteImage(projectIndex, imageIndex, true);
        }
      }

      setError(error.response?.data?.error || "Failed to delete image. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const openSlideshow = (projectIndex, imageIndex) => {
    setCurrentProjectIndex(projectIndex);
    setCurrentImageIndex(imageIndex);
    setShowSlideshow(true);
    setIsPlaying(false);
  };

  const closeSlideshow = () => {
    setShowSlideshow(false);
    setIsPlaying(false);
  };

  const nextImage = () => {
    const currentProject = projects[currentProjectIndex];
    if (currentImageIndex < currentProject.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const renderImage = (project, projectIndex, imageIndex) => (
    <motion.div
      key={`${projectIndex}-${imageIndex}`}
      className="relative group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <img
        src={project.images[imageIndex].url}
        alt={`${project.title} image ${imageIndex + 1}`}
        className="w-full h-48 sm:h-64 object-cover rounded-lg cursor-pointer"
        onClick={() => openSlideshow(projectIndex, imageIndex)}
      />
      {isAdmin && (
        <button
          onClick={() => handleDeleteImage(projectIndex, imageIndex)}
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full transition-transform hover:scale-110"
          disabled={deleting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </motion.div>
  );

  // Slideshow component
  const renderSlideshow = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col touch-none"
    >
      <div className="relative flex-1 flex items-center justify-center p-4">
        {/* Close button - always visible */}
        <button
          onClick={closeSlideshow}
          className="fixed top-4 right-4 p-2 bg-white text-black rounded-full z-10 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Back button - visible on mobile */}
        <button
          onClick={closeSlideshow}
          className="fixed top-4 left-4 p-2 bg-white text-black rounded-full z-10 sm:hidden hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        {/* Navigation buttons - hidden on very small screens */}
        <button
          onClick={prevImage}
          className="hidden sm:block fixed left-4 p-2 bg-white text-black rounded-full transform -translate-y-1/2 top-1/2 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="w-full h-full flex items-center justify-center">
          <img
            src={projects[currentProjectIndex].images[currentImageIndex].url}
            alt={`${projects[currentProjectIndex].title} full view`}
            className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain"
          />
        </div>

        <button
          onClick={nextImage}
          className="hidden sm:block fixed right-4 p-2 bg-white text-black rounded-full transform -translate-y-1/2 top-1/2 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Play/Pause and image counter */}
      <div className="fixed bottom-0 inset-x-0 flex justify-center items-center p-4 bg-black bg-opacity-50">
        <button
          onClick={togglePlayPause}
          className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors mx-2"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
        <span className="text-white">
          {currentImageIndex + 1} / {projects[currentProjectIndex].images.length}
        </span>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-10">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-10 text-gray-800"
      >
        Our Projects Gallery
      </motion.h2>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-red-500 mb-6 bg-red-50 p-4 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-10">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h3 className="text-2xl font-semibold mb-4 text-indigo-700">{project.title}</h3>
            <p className="text-gray-600 mb-6">{project.description}</p>

            {/* Image Gallery Grid */}
            <div className="relative overflow-hidden rounded-lg">
              {project.images.length > 0 ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {project.images.map((image, imageIndex) => renderImage(project, index, imageIndex))}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <motion.div
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="space-y-3"
                  >
                    <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-base sm:text-lg">No images available yet</p>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Upload Button */}
            {isAdmin && (
              <motion.div 
                className="mt-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <label className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
                  {uploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Image
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAddImage(e, index)}
                    disabled={uploading}
                  />
                </label>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Slideshow Modal */}
      <AnimatePresence>
        {showSlideshow && renderSlideshow()}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
