import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { servicesAPI, coursesAPI } from "../../services/api";
import homeImage from "../../images/home.jpg";
import elyseImage from "../../images/Elyse.jpg"; 
import about from "../../images/about.jpg";      

const Home = () => {
  const [services, setServices] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [servicesRes, coursesRes] = await Promise.all([
          servicesAPI.getAll({ limit: 1000 }), // Get all services
          coursesAPI.getAll({ limit: 1000 }), // Get all courses
        ]);

        console.log('Courses response:', coursesRes.data);
        console.log('Services response:', servicesRes.data);

        setServices(servicesRes.data.data || []);
        setCourses(coursesRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load content. Please refresh the page.");
        setServices([]);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
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
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'financial_planning':
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1" />
          </svg>
        );
      case 'consultation':
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case 'business_advisory':
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Enhanced with Glassmorphism */}
      <section className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: `url(${homeImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0000]/60  to-[#000]/50" />
        
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
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-radial from-[#f4b342]/20 to-transparent rounded-full"
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
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-radial from-[#93268f]/20 to-transparent rounded-full"
          />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-6xl"
          >
            {/* Glassmorphism Card */}
            <div className="w-full">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white leading-tight"
              >
                Empowering People Through
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93268f] to-[#93268f]/80 block">
                  Finance & Tax Education
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl md:text-2xl mb-12 text-white/90 font-light max-w-4xl mx-auto leading-relaxed"
              >
                Unlock expert help or become a certified tax professional – all in one place with industry-leading education and support.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <motion.a
                  href="/financial-help"  // Changed from "/services"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative overflow-hidden bg-gradient-to-r from-[#93268f] to-[#93268f]/80 text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  <span className="relative z-10">Get Financial Help</span>
                  <svg className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.a>
                
                <motion.a
                  href="/tax-professional"  // Changed from "/courses"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 hover:bg-white/20"
                >
                  <span className="relative z-10">Become a Tax Pro</span>
                  <svg className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.a>
              </motion.div>
            </div>
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
 {/* about us */}
       <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#93268f]/5 to-[#f4b342]/5">
     
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute bg-[#93268f]/10 backdrop-blur 
              ${i === 0 ? 'w-[100px] h-[100px] top-[15%] left-[10%]' : 
                i === 1 ? 'w-[80px] h-[120px] top-[60%] right-[15%]' :
                i === 2 ? 'w-[60px] h-[90px] bottom-[20%] left-[20%]' :
                'w-[140px] h-[80px] top-[30%] right-[25%]'}
              ${i === 0 ? 'rounded-[30%_70%_70%_30%/30%_30%_70%_70%]' :
                i === 1 ? 'rounded-[50%_20%_80%_40%]' :
                i === 2 ? 'rounded-[40%_60%_30%_70%/60%_30%_70%_40%]' :
                'rounded-[20%_80%_60%_40%/70%_30%_70%_30%]'}`}
            animate={{
              y: [0, -30, 10],
              rotate: [0, 120, 240],
              scale: [1, 1.1, 0.9]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 text-center px-4 mb-16 pt-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-black text-[#93268f] mb-6"
        >
          Welcome to Our World
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-x md:text-xl text-[#93268f]/90 max-w-3xl mx-auto"
        >
          Where financial expertise meets innovation, and dreams become reality through passionate guidance
        </motion.p>
      </div>

      {/* About Container */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative bg-[#93268f]/10 backdrop-blur-[20px] border border-[#93268f]/20 rounded-[50px] overflow-hidden shadow-2xl transform perspective-1000 hover:scale-[1.02] transition-all duration-500"
        >
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Image Section */}
            <div className="relative overflow-hidden flex items-center justify-center p-12 
                        bg-gradient-to-br from-[#93268f]/20 to-[#f4b342]/20">
              <motion.div
                whileHover={{ 
                  scale: 1.15,
                  rotate: 5
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="relative"
              >
                <div className="relative group">
                  <img 
                    src={about}
                    alt="Money Solution Cafe Team"
                    className="w-[350px] h-[350px] object-cover rounded-full border-6 border-black/30
                           shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_0_20px_rgba(255,255,255,0.05),0_0_0_40px_rgba(255,255,255,0.02)]
                           transition-all duration-500 group-hover:rounded-[40%_60%_30%_70%/60%_30%_70%_40%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-full
                            group-hover:rounded-[40%_60%_30%_70%/60%_30%_70%_40%] transition-all duration-500" />
                </div>
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="p-12 flex flex-col justify-center relative">
              <div className="absolute inset-[20px] border-2 border-transparent rounded-[40px] bg-gradient-to-br from-[#93268f]/30 via-[#764ba2]/30 to-[#f093fb]/30 opacity-30 animate-pulse" />
              
              <div className="relative space-y-6">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-5xl font-black text-black mb-8 bg-gradient-to-r from-black to-black/80 bg-clip-text text-transparent"
                >
                  About Us
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg text-black/90 leading-relaxed first-letter:text-4xl first-letter:font-bold 
                          first-letter:mr-1 first-letter:float-left first-letter:text-black"
                >
                  Money Solution Cafe is more than just a financial services brand — it&apos;s a movement built on empowerment, education, and results. 
                  Founded by Elyse Whisby, a seasoned expert with over 25 years of experience in tax preparation, credit restoration, and small 
                  business consulting, we are dedicated to helping everyday people take control of their financial future.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-lg text-black/90 leading-relaxed"
                >
                  We specialize in providing clear, actionable solutions for individuals and families navigating challenges 
                  like credit issues, debt, or confusing tax obligations. Our services are personal, practical, and rooted 
                  in real-life experiences.
                </motion.p>

                <div className="flex flex-wrap gap-4 pt-6">
                  {['Innovation', 'Excellence', 'Trust', 'Experience', 'Vision', 'Results'].map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`${index % 2 === 0 ? 'bg-[#93268f]/10 text-[#93268f] hover:bg-[#93268f]/20' : 
                        'bg-[#f4b342]/10 text-[#93268f] hover:bg-[#93268f]/20'} 
                        backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium 
                        border border-current/20 transition-all duration-300 hover:shadow-lg 
                        cursor-default relative overflow-hidden group`}
                    >
                      <span className="relative z-10">{tag}</span>
                      <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-full 
                                  transition-transform duration-500 bg-gradient-to-r from-transparent 
                                  ${index % 2 === 0 ? 'via-[#93268f]/10' : 'via-[#f4b342]/10'} to-transparent`} />
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

      {/* Mission & Vision - Modern Split Design with Enhanced Animations */}
      <section className="relative h-screen overflow-hidden">
        {/* Background with diagonal split and animated gradient */}
        <div className="absolute inset-0">
          {/* Purple Vision Side with Animated Gradient */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-gradient-to-br from-[#93268f] to-[#93268f]/90"
            style={{
              clipPath: 'polygon(0 0, 60% 0, 40% 100%, 0 100%)',
              background: 'linear-gradient(-45deg, #93268f, #b44fb0, #93268f, #721c6e)',
              backgroundSize: '400% 400%',
              animation: 'gradient 15s ease infinite',
            }}
          />
          {/* Gold Mission Side with Animated Gradient */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 60% 100%)',
              background: 'linear-gradient(-45deg, #f4b342, #ffcd6b, #f4b342, #d99628)',
              backgroundSize: '400% 400%',
              animation: 'gradient 15s ease infinite',
            }}
          />
          
          {/* Animated Floating Elements */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 left-20 w-32 h-32 border-4 border-white/10 rounded-full 
                       backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.3, 1],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-40 right-32 w-24 h-24 border-4 border-white/10 rounded-full 
                       backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          />
          
          {/* Additional Floating Elements */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-32 left-1/4 w-16 h-16 bg-white/5 rounded-full 
                       backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          />
          <motion.div
            animate={{
              y: [0, 30, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-32 right-1/4 w-20 h-20 bg-white/5 rounded-full 
                       backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          />
          
          {/* Animated Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{ 
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Animated Line Separator */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-white/0 via-white/20 to-white/0"
          style={{ transform: "translateX(-50%) rotate(15deg)" }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex">
          {/* Vision Section - Left Side */}
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-1/2 flex flex-col justify-center pl-16 pr-8 group"
          >
            {/* Vision Icon with Complex Animation */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 1,
                delay: 0.2,
                type: "spring",
                stiffness: 200
              }}
              className="mb-8 relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-white/10 rounded-full blur-xl"
              />
              <div className="w-24 h-24 bg-white bg-opacity-30 rounded-full flex items-center justify-center
                            backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]
                            transition-all duration-500 relative">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <svg className="w-12 h-12 text-white transform group-hover:scale-110 transition-transform duration-500" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Vision Title with Letter Animation */}
            <div className="overflow-hidden mb-8">
              <motion.h2 
                initial={{ y: 100 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-7xl font-black text-white leading-none tracking-tight relative"
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="block"
                >
                  OUR
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80"
                >
                  VISION
                </motion.span>
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-white/30"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </motion.h2>
            </div>
            
            {/* Vision Description with Stagger Animation */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-white text-xl leading-relaxed max-w-lg opacity-90 relative group"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
                className="block group-hover:text-white/100 transition-colors duration-300"
              >
                We aim to become the leading resource for tax professionals
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="block group-hover:text-white/100 transition-colors duration-300"
              >
                by delivering innovative solutions, reliable support,
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="block group-hover:text-white/100 transition-colors duration-300"
              >
                and unmatched opportunities for growth.
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Mission Section - Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-1/2 flex flex-col justify-center pl-20 pr-16 group"
          >
            {/* Mission Icon with Complex Animation */}
            <motion.div 
              initial={{ scale: 0, rotate: 180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 1,
                delay: 0.2,
                type: "spring",
                stiffness: 200
              }}
              className="mb-8 ml-auto relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -180, -360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-white/10 rounded-full blur-xl"
              />
              <div className="w-24 h-24 bg-white bg-opacity-30 rounded-full flex items-center justify-center
                            backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]
                            transition-all duration-500 relative">
                <motion.div
                  animate={{
                    rotate: [0, -360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <svg className="w-12 h-12 text-white transform group-hover:scale-110 transition-transform duration-500" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Mission Title with Letter Animation */}
            <div className="overflow-hidden mb-8">
              <motion.h2 
                initial={{ y: 100 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-7xl font-black text-white leading-none tracking-tight text-right relative"
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="block"
                >
                  OUR
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-white/80 to-white"
                >
                  MISSION
                </motion.span>
                <motion.div
                  className="absolute -bottom-2 right-0 w-full h-1 bg-white/30"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </motion.h2>
            </div>
            
            {/* Mission Description with Stagger Animation */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-white text-xl leading-relaxed max-w-lg ml-auto text-right relative group"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
                className="block group-hover:text-white/100 transition-colors duration-300"
              >
                Our mission as tax advisors has always been consistent:
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="block group-hover:text-white/100 transition-colors duration-300"
              >
                we strive to provide the best standard of preeminence in pursuit
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="block group-hover:text-white/100 transition-colors duration-300"
              >
                of conveying our accounting, tax, and business consulting services.
              </motion.span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Section - Enhanced Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#93268f]/10 to-[#f4b342]/10 text-[#93268f] rounded-full text-sm font-semibold mb-4">
              Our Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Financial Services We{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93268f] to-[#f4b342]">
                Offer
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive financial solutions designed to meet your unique needs and goals.
            </p>
            {loading && (
              <p className="text-gray-500 mt-4">Loading services...</p>
            )}
            {!loading && services.length === 0 && (
              <p className="text-gray-500 mt-4">No services available at this time.</p>
            )}
            {!loading && services.length > 0 && (
              <p className="text-gray-500 mt-4">{services.length} services available</p>
            )}
          </motion.div>
          
          {!loading && services.length > 0 && (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {services.slice(0, 6).map((service, index) => {
                  const imageUrl = getImageUrl(service);
                  const hasImageError = imageErrors[service.id];
                  const shouldShowImage = imageUrl && !hasImageError;
                  const serviceType = service.service_type || service.serviceType;
                  
                  return (
                    <motion.div
                      key={service.id}
                      variants={cardVariants}
                      className="group relative"
                    >
                      <div className="relative h-full bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
                        {/* Image or Icon Header */}
                        <div className="relative h-48 overflow-hidden">
                          {shouldShowImage ? (
                            <img
                              src={imageUrl}
                              alt={service.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={() => handleImageError(service.id)}
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${getServiceColor(serviceType)} flex items-center justify-center`}>
                              {getServiceIcon(serviceType)}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          
                          {/* Service Number Badge */}
                          <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-[#93268f] font-bold text-sm">{index + 1}</span>
                          </div>
                          
                          {/* Price Badge if available */}
                          {service.price && (
                            <div className="absolute bottom-4 left-4 bg-[#f4b342] text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-lg">
                              ${service.price}
                            </div>
                          )}
                        </div>
                        
                        {/* Card Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#93268f] transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                            {service.shortDescription || service.description}
                          </p>
                          
                          {/* Service Features */}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            {service.durationMinutes && (
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{service.durationMinutes} min</span>
                              </div>
                            )}
                            {service.featured && (
                              <div className="flex items-center gap-1 text-[#f4b342]">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>Featured</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Action Button */}
                          <a
                            href={`/buy-service/${service.id}`}
                            className="block w-full bg-gradient-to-r from-[#93268f] to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 group-hover:scale-105 text-center"
                          >
                            Learn More
                          </a>
                        </div>
                        
                        {/* Hover Effect Overlay */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#93268f] to-[#f4b342] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
              
              {/* See More Button for Services */}
              {services.length > 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-center mt-12"
                >
                  <Link
                    to="/financial-help"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#93268f] to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 group"
                  >
                    <span>See More Services</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
                      +{services.length - 6} more
                    </span>
                  </Link>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Courses Section - Premium Design */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#f4b342]/10 to-[#93268f]/10 text-[#93268f] rounded-full text-sm font-semibold mb-4">
              Education & Training
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tax Courses &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93268f] to-[#f4b342]">
                Training
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional development programs designed to launch your career in tax preparation and financial services.
            </p>
            {loading && (
              <p className="text-gray-500 mt-4">Loading courses...</p>
            )}
            {!loading && courses.length === 0 && (
              <p className="text-gray-500 mt-4">No courses available at this time.</p>
            )}
            {!loading && courses.length > 0 && (
              <p className="text-gray-500 mt-4">{courses.length} courses available</p>
            )}
          </motion.div>
          
          {!loading && courses.length > 0 && (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {courses.slice(0, 6).map((course, index) => {
                  const imageUrl = getImageUrl(course);
                  const hasImageError = imageErrors[course.id];
                  const shouldShowImage = imageUrl && !hasImageError;
                  
                  return (
                    <motion.div
                      key={course.id}
                      variants={cardVariants}
                      className="group relative"
                    >
                      <div className="relative h-full bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
                        {/* Image or Icon Header */}
                        <div className="relative h-48 overflow-hidden">
                          {shouldShowImage ? (
                            <img
                              src={imageUrl}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={() => handleImageError(course.id)}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#f4b342] via-orange-600 to-amber-700 flex items-center justify-center">
                              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          
                          {/* Course Number Badge */}
                          <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-[#f4b342] font-bold text-sm">{index + 1}</span>
                          </div>
                          
                          {/* Price Badge if available */}
                          {course.price && (
                            <div className="absolute bottom-4 left-4 bg-[#93268f] text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-lg">
                              {course.price}
                            </div>
                          )}
                          
                          {/* Duration Badge if available */}
                          {course.duration_hours && (
                            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium">
                              {course.duration_hours}h
                            </div>
                          )}
                        </div>
                        
                        {/* Card Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#f4b342] transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                            {course.short_description || course.description}
                          </p>
                          
                          {/* Course Features */}
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-4">
                              {course.duration_hours && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{course.duration_hours} hours</span>
                                </div>
                              )}
                              {course.level && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  <span className="capitalize">{course.level}</span>
                                </div>
                              )}
                            </div>
                            
                            {course.is_featured && (
                              <div className="flex items-center gap-1 text-[#f4b342]">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>Featured</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Action Button */}
                          <div className="flex justify-center">
                            <a
                              href={`/buy-course/${course.id}`}
                              className="block w-full bg-gradient-to-r from-[#f4b342] to-orange-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 group-hover:scale-105 text-center"
                            >
                              Enroll Now
                            </a>
                          </div>
                        </div>
                        
                        {/* Hover Effect Overlay */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f4b342] to-[#93268f] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
              
              {/* See More Button for Courses */}
              {courses.length > 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-center mt-12"
                >
                  <Link
                    to="/tax-professional"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f4b342] to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 group"
                  >
                    <span>See More Courses</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
                      +{courses.length - 6} more
                    </span>
                  </Link>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Meet the Founder - Modern White Design */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-24 bg-white relative overflow-hidden"
      >
        {/* Enhanced Decorative Background with Animations */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 right-0 w-96 h-96 bg-[#93268f]/5 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-[#f4b342]/5 rounded-full blur-3xl"
          />
          
          {/* Animated Pattern Background */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(#93268f10 1px, transparent 1px), radial-gradient(#f4b34210 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 20px 20px'
            }}
          />

          {/* Floating Elements */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-${Math.random() * 20 + 10} h-${Math.random() * 20 + 10} 
                         bg-gradient-to-br from-[#93268f]/5 to-[#f4b342]/5 rounded-full blur-lg`}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            {/* Left Column - Enhance Image Animations */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="relative"
              >
                {/* Main Image Container with Enhanced Animations */}
                <motion.div
                  initial={{ rotate: -5, scale: 0.9 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative z-20 rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#93268f] to-[#f4b342] p-2"
                >
                  <div className="relative rounded-[1.7rem] overflow-hidden">
                    <img
                      src={elyseImage}
                      alt="Elyse Whisby"
                      className="w-full h-[600px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Bottom Info Panel */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 border border-white/20">
                        <h3 className="text-3xl font-bold mb-2 text-white">Elyse Whisby</h3>
                        <p className="text-white/90">Founder & CEO</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced Stats Cards Animations */}
                <motion.div
                  initial={{ opacity: 0, x: -50, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="absolute -left-8 top-1/4 z-30"
                >
                  <div className="bg-white rounded-xl p-6 shadow-[0_20px_50px_rgba(147,38,143,0.2)] border border-[#93268f]/10">
                    <div className="text-5xl font-bold text-[#93268f]">25+</div>
                    <div className="text-sm text-gray-600 mt-1">Years Experience</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50, y: -20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="absolute -right-8 bottom-1/4 z-30"
                >
                  <div className="bg-white rounded-xl p-6 shadow-[0_20px_50px_rgba(244,179,66,0.2)] border border-[#f4b342]/10">
                    <div className="text-5xl font-bold text-[#f4b342]">1000+</div>
                    <div className="text-sm text-gray-600 mt-1">Clients Helped</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column - Enhanced Content Animations */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              {/* Section Title with Staggered Text Animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <span className="inline-block px-4 py-2 bg-[#93268f]/10 text-[#93268f] rounded-full text-sm font-semibold mb-4">
                  Meet Our Founder
                </span>
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#93268f] to-[#f4b342] bg-clip-text text-transparent">
                  Visionary Leadership
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-[#93268f] to-[#f4b342] rounded-full" />
              </motion.div>

              {/* Enhanced Content Cards with Stagger Effect */}
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2
                    }
                  }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Content Card Variants */}
                {['Journey', 'Mission', 'Impact'].map((type, index) => (
                  <motion.div
                    key={type}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-gradient-to-br ${
                      index % 2 === 0 
                        ? 'from-[#93268f]/5 to-[#f4b342]/5' 
                        : 'from-[#f4b342]/5 to-[#93268f]/5'
                    } rounded-2xl p-8 backdrop-blur-sm transition-all duration-300`}
                  >
                    <h3 className="text-xl font-semibold mb-4 text-[#93268f] capitalize">
                      The {type}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {type === 'Journey' && `From humble beginnings in Macon, Georgia, Elyse's journey is a testament to perseverance and dedication. As a mother of four and a devoted wife, she understands firsthand the financial challenges families face.`}
                      {type === 'Mission' && `With over 25 years in tax preparation, credit restoration, and business consulting, Elyse has dedicated her career to empowering others with financial knowledge and practical solutions.`}
                      {type === 'Impact' && `Today, as a trusted Small Business Specialist and Credit Expert, she continues to transform lives through education, empathy, and result-driven financial strategies.`}
                    </p>
                  </motion.div>
                ))}

                {/* Enhanced Expertise Tags Animation */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                  }}
                  className="flex flex-wrap gap-4 pt-6"
                >
                  {['Tax Expert', 'Business Consultant', 'Credit Specialist', 'Financial Educator'].map((tag, index) => (
                    <motion.span
                      key={tag}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                      }}
                      whileHover={{ 
                        y: -5, 
                        scale: 1.05,
                        transition: { type: "spring", stiffness: 300, damping: 10 }
                      }}
                      className={`px-6 py-3 rounded-xl text-sm font-medium border transition-all duration-300
                        ${index % 2 === 0 
                          ? 'bg-[#93268f]/10 text-[#93268f] border-[#93268f]/20 hover:shadow-[0_10px_20px_rgba(147,38,143,0.15)]' 
                          : 'bg-[#f4b342]/10 text-[#f4b342] border-[#f4b342]/20 hover:shadow-[0_10px_20px_rgba(244,179,66,0.15)]'
                        }`}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Reviews Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#93268f]/10 to-[#f4b342]/10 text-[#93268f] rounded-full text-sm font-semibold mb-4">
              Client Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93268f] to-[#f4b342]">
                Clients Say
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Read genuine feedback from our valued clients and their experiences with our services.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* Review Widget */}
            <div 
              className="w-full"
              dangerouslySetInnerHTML={{
                __html: `
                  <script type='text/javascript' src='https://reputationhub.site/reputation/assets/review-widget.js'></script>
                  <iframe 
                    class='lc_reviews_widget' 
                    src='https://reputationhub.site/reputation/widgets/review_widget/NYApyDzbavj6XMhd5VPP' 
                    frameborder='0' 
                    scrolling='no' 
                    style='min-width: 100%; width: 100%; min-height: 520px; height: 100%;'>
                  </iframe>
                `
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Call to Action - Premium CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#93268f] to-[#93268f]/90 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#f4b342]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#f4b342]/10 to-transparent" />
          
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
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Transform Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4b342] to-[#f4b342]/80">
                Financial Future?
              </span>
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-2xl mx-auto">
              Join thousands who have already started their journey to financial freedom and career success. 
              Your transformation begins with a single step.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.a
                href="/financial-help"  // Changed from "/services"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden bg-[#f4b342] text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 hover:shadow-[#f4b342]/25"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                <span className="relative z-10">Start Your Journey</span>
                <svg className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 hover:bg-white/20"
              >
                <span className="relative z-10">Schedule Consultation</span>
                <svg className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;