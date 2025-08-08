import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  CreditCardIcon,
  CalculatorIcon,
  DocumentMagnifyingGlassIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { servicesAPI } from '../../services/api';
import { LoadingSpinner } from '../../components/UI/SocialIcons';
import hero from "../../images/service.png";

const GetFinancialHelp = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({}); // Track image loading errors

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      setLoading(false);
      setSelectedService(services[0]);
    }
  }, [services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesAPI.getAll({ limit: 1000 }); // Get all services
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setError('Failed to load services. Please refresh the page.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (serviceId) => {
    setImageErrors(prev => ({ ...prev, [serviceId]: true }));
  };

  const getImageUrl = (service) => {
    const imageUrl = service.image_url || service.imageUrl;
    if (!imageUrl) return null;
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Use the same API base URL as the API service
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';
    
    // If imageUrl starts with /uploads/, replace it with the API route
    if (imageUrl.startsWith('/uploads/')) {
      return `${baseUrl}${imageUrl}`;
    }
    
    // Otherwise, prepend the base URL
    return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'tax_preparation':
        return DocumentTextIcon;
      case 'financial_planning':
        return CreditCardIcon;
      case 'consultation':
        return CalculatorIcon;
      case 'business_advisory':
        return DocumentMagnifyingGlassIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getServiceColor = (serviceType) => {
    switch (serviceType) {
      case 'tax_preparation':
        return 'from-[#93268f] via-purple-700 to-[#93268f]/80';
      case 'financial_planning':
        return 'from-emerald-600 via-green-700 to-teal-700';
      case 'consultation':
        return 'from-[#f4b342] via-orange-600 to-amber-700';
      case 'business_advisory':
        return 'from-orange-600 via-amber-700 to-red-600';
      default:
        return 'from-[#93268f] via-purple-700 to-[#93268f]/80';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
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
              💰 Trusted by 15,000+ clients
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-7xl font-black mb-8 text-white leading-tight"
            >
              Elevate Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#f4b342] to-yellow-300">
                Financial Future
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl mb-12 text-white/90 font-light max-w-4xl mx-auto leading-relaxed"
            >
              Achieve your financial goals with our expert-led services, from tax optimization to strategic wealth planning.
            </motion.p>
            
        
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

      {/* Services Section */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-200 to-[#93268f]/20 dark:from-purple-950 dark:to-[#93268f]/20 border border-purple-300 dark:border-purple-900 rounded-full text-[#93268f] dark:text-purple-300 text-sm font-semibold mb-8">
              <SparklesIcon className="w-5 h-5 mr-2" />
              Our Expertise
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-[#93268f] to-purple-900 dark:from-white dark:via-purple-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
              Premium Financial Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light">
              Tailored solutions to secure your wealth and empower your financial journey.
            </p>
          </motion.div>

          {/* Services Content */}
          {loading ? (
            <div className="flex justify-center py-24">
              <LoadingSpinner size="w-20 h-20" />
            </div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-red-100 dark:bg-red-950 dark:bg-opacity-20 rounded-xl border border-red-200 dark:border-red-900"
            >
              <div className="w-16 h-16 bg-red-200 dark:bg-red-900 dark:bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-red-700 dark:text-red-300 mb-8 text-lg font-medium">{error}</p>
              <button
                onClick={fetchServices}
                className="px-10 py-4 bg-gradient-to-r from-red-600 to-pink-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Retry
              </button>
            </motion.div>
          ) : services.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-gradient-to-br from-gray-100 to-purple-100 dark:from-gray-900 dark:to-purple-900 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <div className="w-16 h-16 bg-purple-200 dark:bg-purple-950 dark:bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <SparklesIcon className="w-10 h-10 text-[#93268f]" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No services available at the moment.
              </p>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Service List */}
              <div className="space-y-4">
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center">
                  <div className="w-1 h-10 bg-gradient-to-b from-[#93268f] to-[#93268f] rounded-full mr-4"></div>
                  Available Services
                </h3>
                {services.map((service, index) => {
                  const IconComponent = getServiceIcon(service.service_type || service.serviceType);
                  const imageUrl = getImageUrl(service);
                  const hasImageError = imageErrors[service.id];
                  const shouldShowImage = imageUrl && !hasImageError;
                  
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      onClick={() => setSelectedService(service)}
                      className={`group relative overflow-hidden p-4 rounded-xl cursor-pointer transition-all duration-500 border-2 ${
                        selectedService?.id === service.id
                          ? 'bg-gradient-to-r from-purple-100 to-[#93268f]/10 dark:from-purple-950 dark:to-purple-950 border-[#93268f] dark:border-purple-700 shadow-lg transform scale-105'
                          : 'bg-white dark:bg-gray-900 backdrop-blur-md border-gray-200 dark:border-gray-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-[#93268f]/5 dark:hover:from-purple-950 dark:hover:to-purple-950 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-105 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Image or Icon Container */}
                        <div className="relative">
                          {shouldShowImage ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md">
                              <img
                                src={imageUrl}
                                alt={service.name}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(service.id)}
                              />
                            </div>
                          ) : (
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${getServiceColor(service.service_type || service.serviceType)} shadow-md`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                        <h4 className={`text-base font-bold transition-colors duration-200 ${
                          selectedService?.id === service.id 
                            ? 'text-[#93268f] dark:text-purple-300' 
                            : 'text-gray-900 dark:text-white group-hover:text-[#93268f] dark:group-hover:text-purple-400'
                        }`}>
                          {service.name}
                        </h4>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Side - Service Card */}
              <div className="lg:sticky lg:top-8">
                {selectedService ? (
                  <motion.div
                    key={selectedService.id}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="group relative overflow-hidden bg-white dark:bg-gray-900 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Service Header */}
                    <div className="relative h-56 overflow-hidden">
                      {(() => {
                        const imageUrl = getImageUrl(selectedService);
                        const hasImageError = imageErrors[selectedService.id];
                        const shouldShowImage = imageUrl && !hasImageError;
                        
                        if (shouldShowImage) {
                          return (
                            <img
                              src={imageUrl}
                              alt={selectedService.name}
                              className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700"
                              onError={() => handleImageError(selectedService.id)}
                            />
                          );
                        } else {
                          // Fallback to gradient background with icon
                          const IconComponent = getServiceIcon(selectedService.service_type || selectedService.serviceType);
                          return (
                            <div className={`absolute inset-0 bg-gradient-to-br ${getServiceColor(selectedService.service_type || selectedService.serviceType)} flex items-center justify-center`}>
                              <div className="relative">
                                <IconComponent className="w-24 h-24 text-white opacity-80" />
                              </div>
                            </div>
                          );
                        }
                      })()}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-[#f4b342] to-[#f4b342]  text-white rounded-xl px-4 py-2 shadow-md backdrop-blur-sm border border-white/20">
                        <div className="text-xl font-bold flex items-center">
                          <CurrencyDollarIcon className="w-5 h-5 mr-1" />
                          {selectedService.price}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-6">
                        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-gray-900 to-[#93268f] dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
                          {selectedService.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
                          <div className="flex items-center bg-purple-100 dark:bg-purple-950 dark:bg-opacity-20 px-3 py-1.5 rounded-lg">
                            <ClockIcon className="w-4 h-4 mr-2 text-[#93268f]" />
                            <span className="font-medium">{selectedService.duration_minutes || selectedService.durationMinutes} minutes</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-sm">
                        {selectedService.name === "Tax Preparation" && "Professional tax filing services to maximize your refunds and ensure compliance."}
                        {selectedService.name === "Credit Repair" && "Expert credit restoration to improve your financial standing and opportunities."}
                        {selectedService.name === "Business Consulting" && "Strategic business guidance to grow and optimize your operations."}
                        {selectedService.name === "Financial Planning" && "Comprehensive financial strategies for your long-term wealth building."}
                        {!["Tax Preparation", "Credit Repair", "Business Consulting", "Financial Planning"].includes(selectedService.name) && "Professional financial services tailored to your specific needs."}
                      </p>

                      <div className="flex flex-col space-y-3">
                        <Link
                          to={`/buy-service/${selectedService.id}`}
                          className="group relative overflow-hidden w-full bg-gradient-to-r from-[#93268f]  to-[#93268f]/80 text-white font-bold py-4 px-8 rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
                        >
                          <div className="flex items-center justify-center">
                            <span className="text-lg">Book Service</span>
                            <ArrowRightIcon className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-200" />
                          </div>
                        </Link>
                        <Link
                          to="/contact"
                          className="w-full border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-4 px-8 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-[#93268f]/5 dark:hover:from-purple-950 dark:hover:to-purple-950 hover:border-purple-400 dark:hover:border-purple-700 transition-all duration-300 text-center"
                        >
                          <span className="text-lg">Ask a Question</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-900 backdrop-blur-xl border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                      <DocumentTextIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-3">
                      Select a Service
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-base">
                      Choose a service to view details and book your consultation
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 overflow-hidden bg-gradient-to-br from-[#93268f] via-purple-900 to-[#93268f]/80">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <div className="inline-flex items-center px-5 py-2.5 bg-white bg-opacity-15 backdrop-blur-md border border-white border-opacity-30 rounded-full text-white opacity-90 text-sm font-semibold mb-8">
              <SparklesIcon className="w-5 h-5 mr-2 text-[#f4b342]" />
              Exclusive Offer
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-white leading-tight tracking-tight">
              Shape Your
              <span className="block bg-gradient-to-r from-[#f4b342] to-yellow-400 bg-clip-text text-transparent">
                Financial Destiny
              </span>
            </h2>
            <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Join our community of successful clients and unlock your financial potential with expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/book-now"
                className="group relative overflow-hidden px-12 py-5 bg-gradient-to-r from-[#f4b342] to-[#f4b342] text-gray-900 font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative flex items-center">
                  Begin Now
                  <ArrowRightIcon className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-200" />
                </span>
              </Link>
              <Link
                to="/contact"
                className="px-12 py-5 border-2 border-white border-opacity-40 text-white font-semibold text-lg rounded-xl hover:bg-white hover:bg-opacity-15 backdrop-blur-md transition-all duration-300 hover:border-white hover:border-opacity-60"
              >
                Free Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GetFinancialHelp;