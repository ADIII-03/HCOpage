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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {project.images.map((image, imageIndex) => (
                    <motion.div
                      key={imageIndex}
                      whileHover={{ scale: 1.02 }}
                      className="relative group rounded-lg overflow-hidden h-64"
                    >
                      <img
                        src={image.url}
                        alt={`${project.title} - Image ${imageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={() => openSlideshow(index, imageIndex)}
                            className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          >
                            <svg className="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 4v3m4-3v3m0-6v3" />
                            </svg>
                            View Fullscreen
                          </button>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteImage(index, imageIndex)}
                          disabled={deleting}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <motion.div
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="space-y-3"
                  >
                    <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg">No images available yet</p>
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
        {showSlideshow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={closeSlideshow}
          >
            <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                src={projects[currentProjectIndex].images[currentImageIndex].url}
                alt={`${projects[currentProjectIndex].title} - Fullscreen`}
                className="max-w-[90%] max-h-[90vh] object-contain"
              />

              {/* Controls Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-0 hover:opacity-100 transition-opacity duration-300">
                {/* Top Bar */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-b from-black/70 to-transparent">
                  <h3 className="text-white text-xl font-semibold">
                    {projects[currentProjectIndex].title}
                  </h3>
                  <button
                    onClick={closeSlideshow}
                    className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Bottom Bar */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlayPause}
                      className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                      {isPlaying ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                      )}
                    </button>
                    <span className="text-white">
                      {currentImageIndex + 1} / {projects[currentProjectIndex].images.length}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                      className={`p-2 rounded-full ${currentImageIndex === 0 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-white/20'} transition-colors`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      disabled={currentImageIndex === projects[currentProjectIndex].images.length - 1}
                      className={`p-2 rounded-full ${currentImageIndex === projects[currentProjectIndex].images.length - 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-white/20'} transition-colors`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
