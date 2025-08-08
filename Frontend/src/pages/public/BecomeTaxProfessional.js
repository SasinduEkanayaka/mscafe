import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { coursesAPI } from '../../services/api';
import hero from "../../images/course.png";

const BecomeTaxProfessional = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await coursesAPI.getAll({ limit: 1000 }); // Get all courses
      console.log('Courses response:', response.data);
      
      const fetchedCourses = response.data.data || [];
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setError("Failed to load courses. Please try again later.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (courseId) => {
    setImageErrors(prev => ({ ...prev, [courseId]: true }));
  };

  const getImageUrl = (course) => {
    const imageUrl = course.image_url || course.imageUrl;
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';
    
    if (imageUrl.startsWith('/uploads/')) {
      return `${baseUrl}${imageUrl}`;
    }
    
    return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };



  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Modern Glass Design */}
      <section className="relative min-h-screen overflow-hidden flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${hero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#93268f]/90 via-[#93268f]/80 to-purple-900/90" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-radial from-[#f4b342]/30 to-transparent rounded-full"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-radial from-white/10 to-transparent rounded-full"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-semibold mb-8"
            >
              🎓 Professional Tax Training & Certification
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-7xl font-black mb-8 text-white leading-tight"
            >
              Become a 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#f4b342] to-yellow-300">
                Tax Professional
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl mb-12 text-white/90 font-light max-w-4xl mx-auto leading-relaxed"
            >
              Launch your rewarding career in tax services with comprehensive training, industry certifications, 
              and ongoing support. Join thousands who've built successful practices.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
         
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </section>

      {/* Courses Section - Premium Design */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#f4b342]/10 to-[#93268f]/10 text-[#93268f] rounded-full text-sm font-semibold mb-4">
              Training Programs
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93268f] to-[#f4b342]">
                Learning Path
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From beginner to expert, we have the perfect program to match your goals and experience level.
            </p>
          </motion.div>

          {/* Courses Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#93268f]/20 border-t-[#93268f] rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#f4b342] rounded-full animate-spin animation-delay-150"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">😟</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={fetchCourses}
                className="bg-gradient-to-r from-[#93268f] to-[#93268f] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Available</h3>
              <p className="text-gray-600">Check back soon for new training programs!</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-16"
            >
              {courses.map((course, index) => {
                const imageUrl = getImageUrl(course);
                const hasImageError = imageErrors[course.id];
                const shouldShowImage = imageUrl && !hasImageError;
                const isEven = index % 2 === 0;

                return (
                  <motion.section
                    key={course.id}
                    variants={cardVariants}
                    className="group relative"
                  >
                    <div className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}>
                      
                      {/* Image Section */}
                      <div className={`relative ${!isEven ? 'lg:col-start-2' : ''}`}>
                        <div className="relative h-80 lg:h-96 overflow-hidden rounded-3xl">
                          {shouldShowImage ? (
                            <img
                              src={imageUrl}
                              alt={course.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              onError={() => handleImageError(course.id)}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#93268f] via-[#93268f] to-[#93268f] flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
                              <div className="relative z-10 flex items-center justify-center">
                                <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
                                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          
                          {/* Floating Badges */}
                          <div className="absolute top-6 left-6">
                            <div className="flex items-center gap-3">
                              <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium">
                                Course #{index + 1}
                              </div>
                              {course.is_featured && (
                                <div className="px-4 py-2 bg-gradient-to-r from-yellow-400/90 to-orange-500/90 backdrop-blur-md rounded-full text-white text-sm font-medium border border-yellow-300/30">
                                  ✨ Featured
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Price Badge */}
                          {course.price && (
                            <div className="absolute bottom-6 right-6">
                              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                                <div className="text-white text-sm font-medium opacity-80">Starting at</div>
                                <div className="text-white text-2xl font-bold">{course.price}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className={`space-y-6 ${!isEven ? 'lg:col-start-1' : ''}`}>
                        
                        {/* Header */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#93268f] to-[#93268f] rounded-2xl flex items-center justify-center">
                              <span className="text-white font-bold text-lg">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#93268f] group-hover:to-[#93268f] transition-all duration-500">
                                {course.title}
                              </h3>
                            </div>
                          </div>
                          
                          <p className="text-lg text-gray-600 leading-relaxed">
                            {course.short_description || course.description}
                          </p>
                        </div>

                        {/* Course Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          {course.duration_hours && (
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200/50">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-[#93268f] rounded-full"></div>
                                <span className="text-xs font-medium text-[#93268f] uppercase tracking-wide">Duration</span>
                              </div>
                              <div className="text-xl font-bold text-[#93268f]">{course.duration_hours}h</div>
                            </div>
                          )}
                          
                          {course.max_students && (
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200/50">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-[#93268f] rounded-full"></div>
                                <span className="text-xs font-medium text-[#93268f] uppercase tracking-wide">Max Students</span>
                              </div>
                              <div className="text-xl font-bold text-[#93268f]">{course.max_students}</div>
                            </div>
                          )}
                          
                          {course.level && (
                            <div className={`bg-gradient-to-br rounded-xl p-4 border ${
                              course.level === 'beginner' ? 'from-green-50 to-green-100 border-green-200/50' :
                              course.level === 'intermediate' ? 'from-yellow-50 to-yellow-100 border-yellow-200/50' :
                              'from-red-50 to-red-100 border-red-200/50'
                            }`}>
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  course.level === 'beginner' ? 'bg-green-500' :
                                  course.level === 'intermediate' ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}></div>
                                <span className={`text-xs font-medium uppercase tracking-wide ${
                                  course.level === 'beginner' ? 'text-green-700' :
                                  course.level === 'intermediate' ? 'text-yellow-700' :
                                  'text-red-700'
                                }`}>Level</span>
                              </div>
                              <div className={`text-xl font-bold capitalize ${
                                course.level === 'beginner' ? 'text-green-900' :
                                course.level === 'intermediate' ? 'text-yellow-900' :
                                'text-red-900'
                              }`}>{course.level}</div>
                            </div>
                          )}
                        </div>

                        {/* Instructor Info */}
                        {course.instructor_name && (
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200/50">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#93268f] to-[#93268f] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {course.instructor_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Instructor</p>
                              <p className="text-lg font-semibold text-gray-900">{course.instructor_name}</p>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Link
                            to={`/buy-course/${course.id}`}
                            className="flex-1"
                          >
                            <motion.button
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full bg-gradient-to-r from-[#93268f] via-[#93268f] to-[#93268f] text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 group/btn"
                            >
                              <span className="flex items-center justify-center gap-3">
                                Enroll Now
                                <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </span>
                            </motion.button>
                          </Link>
                          
                          <motion.button
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 border-2 border-[#93268f] text-[#93268f] rounded-xl font-semibold text-lg transition-all duration-300 hover:border-purple-300 hover:bg-purple-50 group/btn2"
                          >
                            <span className="flex items-center justify-center gap-3">
                              Learn More
                              <svg className="w-5 h-5 transition-transform group-hover/btn2:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative Element */}
                    <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                      <div className="w-full h-full bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                  </motion.section>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

   
     
      {/* CTA Section - Modern Call to Action */}
      <section className="py-24 bg-gradient-to-r from-[#93268f] to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#f4b342]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-orange-500/10 to-transparent" />
          
          {/* Animated Background Elements */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-10 right-20 w-32 h-32 border-4 border-white/10 rounded-full"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-10 left-20 w-24 h-24 border-4 border-[#f4b342]/20 rounded-full"
          />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Start Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4b342] to-yellow-300">
                Tax Career Journey?
              </span>
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join thousands of successful graduates who transformed their careers and built profitable tax service businesses. 
              Your future in tax services starts today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden bg-gradient-to-r from-[#f4b342] to-orange-500 text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center">
                  Enroll Now - Special Offer
                  <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 hover:bg-white/20"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Schedule Free Consultation
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
              </motion.button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#f4b342] rounded-full" />
                <span className="text-sm">No Experience Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#f4b342] rounded-full" />
                <span className="text-sm">Flexible Payment Plans</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#f4b342] rounded-full" />
                <span className="text-sm">Job Placement Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BecomeTaxProfessional;
            