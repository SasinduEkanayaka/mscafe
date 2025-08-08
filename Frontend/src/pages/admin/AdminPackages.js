import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  CubeIcon,
  StarIcon,
  TagIcon,
  CalendarIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import AdminBreadcrumb from '../../components/Layout/AdminBreadcrumb';
import { coursesAPI } from '../../services/api';

// Form Modal Component - moved outside to prevent re-creation
const FormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  isEdit = false, 
  formData, 
  onInputChange, 
  onIncludesChange, 
  onAddInclude, 
  onRemoveInclude,
  onProcessChange,
  onAddProcess,
  onRemoveProcess
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Package Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={onInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="Enter package title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={onInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category ID
                </label>
                <input
                  type="number"
                  name="category"
                  value={formData.category}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="e.g., 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Revenue Share
                </label>
                <input
                  type="text"
                  name="revenueShare"
                  value={formData.revenueShare}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="e.g., 30%"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Package Image
                </label>
                <div className="space-y-3">
                  {/* Image Upload Area */}
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-violet-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          onInputChange({
                            target: {
                              name: 'imageFile',
                              value: file
                            }
                          });
                          // Create preview URL
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            onInputChange({
                              target: {
                                name: 'imagePreview',
                                value: e.target.result
                              }
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      {formData.imagePreview || formData.imageUrl ? (
                        <div className="relative">
                          <img
                            src={formData.imagePreview || formData.imageUrl}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg mb-2"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              onInputChange({
                                target: { name: 'imageFile', value: null }
                              });
                              onInputChange({
                                target: { name: 'imagePreview', value: '' }
                              });
                              onInputChange({
                                target: { name: 'imageUrl', value: '' }
                              });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            Click to upload an image
                          </p>
                          <p className="text-xs text-slate-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                  
                  {/* Alternative: Image URL */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Or use image URL</span>
                    </div>
                  </div>
                  
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={onInputChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  External Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="https://example.com/course"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="Enter detailed package description (optional)"
              />
            </div>

            {/* What's Included */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                What's Included
              </label>
              {formData.includes.map((include, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={include}
                    onChange={(e) => onIncludesChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="What's included in this package"
                  />
                  {formData.includes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveInclude(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={onAddInclude}
                className="mt-2 px-4 py-2 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors font-medium"
              >
                + Add Include
              </button>
            </div>

            {/* Process Steps */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Process Steps
              </label>
              {formData.process.map((step, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => onProcessChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Describe this step in the process"
                  />
                  {formData.process.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveProcess(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={onAddProcess}
                className="mt-2 px-4 py-2 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors font-medium"
              >
                + Add Process Step
              </button>
            </div>

            {/* Requirements Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="efinRequired"
                      checked={formData.efinRequired}
                      onChange={onInputChange}
                      className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500"
                    />
                    <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      EFIN Required
                    </span>
                  </label>
                </div>
                {formData.efinRequired && (
                  <input
                    type="text"
                    name="efinDescription"
                    value={formData.efinDescription}
                    onChange={onInputChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="EFIN requirement description"
                  />
                )}
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="ptinRequired"
                      checked={formData.ptinRequired}
                      onChange={onInputChange}
                      className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500"
                    />
                    <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      PTIN Required
                    </span>
                  </label>
                </div>
                {formData.ptinRequired && (
                  <input
                    type="text"
                    name="ptinDescription"
                    value={formData.ptinDescription}
                    onChange={onInputChange}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="PTIN requirement description"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Minimum Returns
                </label>
                <input
                  type="number"
                  name="minReturns"
                  value={formData.minReturns}
                  onChange={onInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Min Returns Description
                </label>
                <input
                  type="text"
                  name="minReturnsDescription"
                  value={formData.minReturnsDescription}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="Description of minimum returns requirement"
                />
              </div>
            </div>

            {/* Status and Visibility */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={onInputChange}
                  className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500"
                />
                <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Active
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={onInputChange}
                  className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500"
                />
                <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Featured
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
              >
                {isEdit ? 'Update Package' : 'Create Package'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    includes: [''],
    process: [''],
    category: '',
    revenueShare: '',
    imageUrl: '',
    imageFile: null,
    imagePreview: '',
    efinRequired: false,
    efinDescription: '',
    ptinRequired: false,
    ptinDescription: '',
    minReturns: 0,
    minReturnsDescription: '',
    link: '',
    isActive: true,
    featured: false
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      // Include inactive packages for admin view
      const response = await coursesAPI.getAll({ includeInactive: 'true', limit: 1000 }); // Get all courses
      console.log('Fetched packages response:', response.data);
      
      if (response.data && response.data.success) {
        const packagesData = response.data.data || [];
        console.log('Packages data:', packagesData.map(p => ({ id: p.id, title: p.title, isActive: p.isActive })));
        setPackages(packagesData);
      } else {
        setPackages([]);
        toast.info('No packages found');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      if (error.response?.status === 404) {
        setPackages([]);
        toast.info('No packages found');
      } else {
        toast.error('Failed to load packages');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleIncludesChange = useCallback((index, value) => {
    const newIncludes = [...formData.includes];
    newIncludes[index] = value;
    setFormData(prev => ({ ...prev, includes: newIncludes }));
  }, [formData.includes]);

  const addInclude = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      includes: [...prev.includes, '']
    }));
  }, []);

  const removeInclude = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  }, []);

  const handleProcessChange = useCallback((index, value) => {
    const newProcess = [...formData.process];
    newProcess[index] = value;
    setFormData(prev => ({ ...prev, process: newProcess }));
  }, [formData.process]);

  const addProcess = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      process: [...prev.process, '']
    }));
  }, []);

  const removeProcess = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      process: prev.process.filter((_, i) => i !== index)
    }));
  }, []);

  // Helper function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl; // Already full URL
    }
    return `http://localhost:5000${imageUrl}`; // Prepend backend URL
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;
    
    console.log('Uploading image file:', imageFile.name, imageFile.type, imageFile.size);
    
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      const adminToken = Cookies.get('adminToken');
      console.log('Admin token for upload:', !!adminToken);
      
      if (!adminToken) {
        toast.error('Authentication required for image upload');
        return null;
      }

      console.log('Starting image upload...');
      
      // Use adminApi instance that already handles authentication
      const response = await fetch('http://localhost:5000/api/v1/courses/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });
      
      console.log('Upload response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Image upload successful:', result);
        toast.success('Image uploaded successfully');
        return result.imageUrl;
      } else {
        const errorData = await response.json();
        console.error('Upload error response:', errorData);
        throw new Error(errorData.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image: ' + error.message);
      return null;
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    try {
      // Check admin authentication
      const adminToken = Cookies.get('adminToken');
      console.log('Admin token exists:', !!adminToken);
      
      if (!adminToken) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      console.log('Form data before processing:', formData);
      
      // Basic validation
      if (!(formData.title || '').trim()) {
        toast.error('Package title is required');
        return;
      }
      
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error('Valid price is required');
        return;
      }
      
      // Handle image upload if file is selected
      let imageUrl = formData.imageUrl;
      if (formData.imageFile) {
        const uploadedImageUrl = await uploadImage(formData.imageFile);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }
      
      // Prepare data for API - match backend validation schema exactly
      const packageData = {
        title: (formData.title || '').trim(),
        price: `$${parseFloat(formData.price || 0).toFixed(2)}`,
        efinRequired: Boolean(formData.efinRequired),
        ptinRequired: Boolean(formData.ptinRequired),
        minReturns: parseInt(formData.minReturns) || 0,
        includes: formData.includes.filter(f => (f || '').trim() !== ''),
        process: formData.process.filter(p => (p || '').trim() !== ''),
        isActive: Boolean(formData.isActive),
        featured: Boolean(formData.featured)
      };

      // Add optional fields only if they have valid non-empty values
      const description = (formData.description || '').trim();
      if (description) {
        packageData.description = description;
      }

      if (formData.category && parseInt(formData.category) > 0) {
        packageData.categoryId = parseInt(formData.category);
      }
      
      const revenueShare = (formData.revenueShare || '').trim();
      if (revenueShare) {
        packageData.revenueShare = revenueShare;
      }
      
      const efinDescription = (formData.efinDescription || '').trim();
      if (efinDescription) {
        packageData.efinDescription = efinDescription;
      }
      
      const ptinDescription = (formData.ptinDescription || '').trim();
      if (ptinDescription) {
        packageData.ptinDescription = ptinDescription;
      }
      
      const minReturnsDescription = (formData.minReturnsDescription || '').trim();
      if (minReturnsDescription) {
        packageData.minReturnsDescription = minReturnsDescription;
      }
      
      const imageUrlValue = (imageUrl || '').trim();
      if (imageUrlValue) {
        packageData.imageUrl = imageUrlValue;
      }
      
      // Validate and add link only if it's a valid URL
      const linkValue = (formData.link || '').trim();
      if (linkValue) {
        try {
          new URL(linkValue); // Test if it's a valid URL
          packageData.link = linkValue;
        } catch (urlError) {
          toast.error('Please enter a valid URL for the external link');
          return;
        }
      }

      console.log('Sending to API:', packageData);
      console.log('Package data JSON:', JSON.stringify(packageData, null, 2));

      const response = await coursesAPI.create(packageData);
      console.log('Full API response:', response);
      
      if (response.data && response.data.success) {
        toast.success('Package created successfully');
        setShowCreateModal(false);
        resetForm();
        fetchPackages();
      } else {
        console.error('API returned false success:', response.data);
        toast.error(response.data?.message || 'Failed to create package');
      }
    } catch (error) {
      console.error('Error creating package:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Failed to create package';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ');
      }
      
      toast.error(errorMessage);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      // Handle image upload if file is selected
      let imageUrl = formData.imageUrl;
      if (formData.imageFile) {
        console.log('Uploading new image for edit...');
        const uploadedImageUrl = await uploadImage(formData.imageFile);
        if (uploadedImageUrl) {
          imageUrl = getImageUrl(uploadedImageUrl); // Ensure full URL
          console.log('New image uploaded:', imageUrl);
        }
      }

      // Prepare data for API - match backend validation schema exactly
      const packageData = {
        title: (formData.title || '').trim(),
        description: (formData.description || '').trim(),
        price: formData.price.startsWith('$') ? formData.price : `$${formData.price}`,
        efinRequired: Boolean(formData.efinRequired),
        ptinRequired: Boolean(formData.ptinRequired),
        minReturns: parseInt(formData.minReturns) || 0,
        includes: formData.includes.filter(f => (f || '').trim() !== ''),
        process: formData.process.filter(p => (p || '').trim() !== ''),
        isActive: Boolean(formData.isActive),
        featured: Boolean(formData.featured)
      };

      // Add optional fields only if they have valid values
      if (formData.category && parseInt(formData.category) > 0) {
        packageData.categoryId = parseInt(formData.category);
      }
      
      if ((formData.revenueShare || '').trim()) {
        packageData.revenueShare = formData.revenueShare.trim();
      }
      
      if ((formData.efinDescription || '').trim()) {
        packageData.efinDescription = formData.efinDescription.trim();
      }
      
      if ((formData.ptinDescription || '').trim()) {
        packageData.ptinDescription = formData.ptinDescription.trim();
      }
      
      if ((formData.minReturnsDescription || '').trim()) {
        packageData.minReturnsDescription = formData.minReturnsDescription.trim();
      }
      
      if ((imageUrl || '').trim()) {
        packageData.imageUrl = imageUrl.trim();
      }
      
      // Validate and add link only if it's a valid URL
      const linkValue = (formData.link || '').trim();
      if (linkValue) {
        try {
          new URL(linkValue); // Test if it's a valid URL
          packageData.link = linkValue;
        } catch (urlError) {
          toast.error('Please enter a valid URL for the external link');
          return;
        }
      }

      console.log('Updating package with data:', packageData);
      const response = await coursesAPI.update(selectedPackage.id, packageData);
      console.log('Update response:', response.data);
      
      if (response.data && response.data.success) {
        toast.success('Package updated successfully');
        setShowEditModal(false);
        resetForm();
        // Add a small delay to ensure database has committed the transaction
        setTimeout(async () => {
          await fetchPackages();
        }, 500);
      } else {
        toast.error('Failed to update package');
      }
    } catch (error) {
      console.error('Error updating package:', error);
      toast.error(error.response?.data?.message || 'Failed to update package');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await coursesAPI.delete(selectedPackage.id);
      if (response.data && response.data.success) {
        toast.success('Package deleted successfully');
        setShowDeleteModal(false);
        setSelectedPackage(null);
        fetchPackages();
      } else {
        toast.error('Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error(error.response?.data?.message || 'Failed to delete package');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      includes: [''],
      process: [''],
      category: '',
      revenueShare: '',
      imageUrl: '',
      imageFile: null,
      imagePreview: '',
      efinRequired: false,
      efinDescription: '',
      ptinRequired: false,
      ptinDescription: '',
      minReturns: 0,
      minReturnsDescription: '',
      link: '',
      isActive: true,
      featured: false
    });
    setSelectedPackage(null);
  };

  const openEditModal = (pkg) => {
    setSelectedPackage(pkg);
    
    // Helper function to convert includes/process to array format
    const parseArrayField = (field) => {
      if (Array.isArray(field)) {
        return field.length > 0 ? field : [''];
      } else if (typeof field === 'string' && field.trim()) {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed : [''];
        } catch (e) {
          return [field]; // If not JSON, treat as single item
        }
      }
      return [''];
    };

    setFormData({
      title: pkg.title || '',
      description: pkg.description || '',
      price: pkg.price ? pkg.price.replace('$', '') : '',
      includes: parseArrayField(pkg.includes),
      process: parseArrayField(pkg.process),
      category: pkg.categoryId ? pkg.categoryId.toString() : '',
      revenueShare: pkg.revenueShare || '',
      imageUrl: getImageUrl(pkg.imageUrl || pkg.image_url || ''),
      imageFile: null,
      imagePreview: '',
      efinRequired: pkg.efinRequired === 1 || pkg.efinRequired === true,
      efinDescription: pkg.efinDescription || '',
      ptinRequired: pkg.ptinRequired === 1 || pkg.ptinRequired === true,
      ptinDescription: pkg.ptinDescription || '',
      minReturns: pkg.minReturns || 0,
      minReturnsDescription: pkg.minReturnsDescription || '',
      link: pkg.link || '',
      isActive: pkg.isActive === 1 || pkg.isActive === true,
      featured: pkg.featured === 1 || pkg.featured === true
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (pkg) => {
    setSelectedPackage(pkg);
    setShowDeleteModal(true);
  };

  const filteredPackages = packages
    .filter(pkg => {
      const matchesSearch = (pkg.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (pkg.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      // Handle database values: 1 = active, 0 = inactive
      const isPackageActive = pkg.isActive === 1 || pkg.isActive === true;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && isPackageActive) ||
                           (filterStatus === 'inactive' && !isPackageActive);
      
      const matchesCategory = filterCategory === 'all' || 
                             (pkg.categoryId && pkg.categoryId.toString() === filterCategory);
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          // Handle price as string with $ symbol
          aValue = parseFloat((a.price || '0').replace('$', '')) || 0;
          bValue = parseFloat((b.price || '0').replace('$', '')) || 0;
          break;
          
        case 'title':
          aValue = (a.title || '').toLowerCase();
          bValue = (b.title || '').toLowerCase();
          break;
          
        case 'featured':
          // Featured items first, then by creation date
          if (a.featured !== b.featured) {
            return b.featured - a.featured; // Featured first
          }
          aValue = new Date(a.created_at || a.updated_at || '1970-01-01');
          bValue = new Date(b.created_at || b.updated_at || '1970-01-01');
          break;
          
        case 'created_at':
        default:
          // Handle date sorting with fallbacks
          aValue = new Date(a.created_at || a.updated_at || '1970-01-01');
          bValue = new Date(b.created_at || b.updated_at || '1970-01-01');
          break;
      }
      
      // Handle different data types for comparison
      if (aValue instanceof Date && bValue instanceof Date) {
        const result = aValue.getTime() - bValue.getTime();
        return sortOrder === 'asc' ? result : -result;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? result : -result;
      } else {
        // Numeric comparison
        const result = (aValue || 0) - (bValue || 0);
        return sortOrder === 'asc' ? result : -result;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Package Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your tax packages and courses
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Package
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
          {/* Search and Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search packages by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm min-w-[120px]"
              >
                <option value="all">All Categories</option>
                <option value="1">Category 1</option>
                <option value="2">Category 2</option>
                <option value="3">Category 3</option>
              </select>
              
              {/* Clear Filters Button */}
              {(searchTerm || filterStatus !== 'all' || filterCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                    setFilterCategory('all');
                  }}
                  className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <FunnelIcon className="h-4 w-4" />
              <span>Sort by:</span>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm"
            >
              <option value="created_at">Date Created</option>
              <option value="title">Title (A-Z)</option>
              <option value="price">Price</option>
              <option value="featured">Featured First</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className={`p-2 border rounded-lg transition-colors ${
                sortOrder === 'asc' 
                  ? 'border-violet-300 bg-violet-50 text-violet-600 dark:border-violet-600 dark:bg-violet-900/20 dark:text-violet-400' 
                  : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ChevronUpDownIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>
              Showing {filteredPackages.length} of {packages.length} packages
              {searchTerm && (
                <span className="ml-2 text-violet-600 dark:text-violet-400">
                  matching "{searchTerm}"
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className="ml-2 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs">
                  {filterStatus}
                </span>
              )}
              {filterCategory !== 'all' && (
                <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs">
                  Category {filterCategory}
                </span>
              )}
            </span>
            {packages.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {packages.filter(p => p.isActive === 1 || p.isActive === true).length} Active
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {packages.filter(p => !(p.isActive === 1 || p.isActive === true)).length} Inactive
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  {packages.filter(p => p.featured === 1 || p.featured === true).length} Featured
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
          >
            {/* Package Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CubeIcon className="h-6 w-6 text-violet-600" />
                {pkg.featured && (
                  <StarIcon className="h-5 w-5 text-yellow-500" />
                )}
                {pkg.category && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {pkg.category.name || `Category ${pkg.categoryId}`}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(pkg)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Package Image */}
            {(pkg.imageUrl || pkg.image_url) && (
              <div className="mb-4">
                <img
                  src={getImageUrl(pkg.imageUrl || pkg.image_url)}
                  alt={pkg.title}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Package Title and Description */}
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {pkg.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
              {pkg.description}
            </p>

            {/* Price and Status */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-violet-600">
                  {pkg.price}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  (pkg.isActive === 1 || pkg.isActive === true)
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {(pkg.isActive === 1 || pkg.isActive === true) ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {/* Revenue Share */}
              {pkg.revenueShare && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Revenue Share:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {pkg.revenueShare}
                  </span>
                </div>
              )}

              {/* External Link */}
              {pkg.link && (
                <div className="text-sm">
                  <span className="text-slate-600 dark:text-slate-400">External Link: </span>
                  <a 
                    href={pkg.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Course
                  </a>
                </div>
              )}

              {/* View Course Button */}
              <div className="mt-3">
                <Link
                  to={`/buy-course/${pkg.id}`}
                  className="inline-flex items-center px-3 py-2 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                >
                  <EyeIcon className="w-3 h-3 mr-1" />
                  View Course Page
                </Link>
              </div>
            </div>

            {/* Requirements Section */}
            {(pkg.efinRequired || pkg.ptinRequired || (pkg.minReturns && pkg.minReturns > 0)) && (
              <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Requirements:</p>
                <div className="space-y-1">
                  {pkg.efinRequired && (
                    <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      EFIN Required
                      {pkg.efinDescription && (
                        <span className="ml-1">- {pkg.efinDescription}</span>
                      )}
                    </div>
                  )}
                  {pkg.ptinRequired && (
                    <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                      PTIN Required
                      {pkg.ptinDescription && (
                        <span className="ml-1">- {pkg.ptinDescription}</span>
                      )}
                    </div>
                  )}
                  {pkg.minReturns > 0 && (
                    <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      Min {pkg.minReturns} Returns
                      {pkg.minReturnsDescription && (
                        <span className="ml-1">- {pkg.minReturnsDescription}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* What's Included */}
            {(() => {
              const includes = pkg.includes;
              let includesArray = [];
              
              if (Array.isArray(includes)) {
                includesArray = includes;
              } else if (typeof includes === 'string' && includes.trim()) {
                try {
                  includesArray = JSON.parse(includes);
                } catch (e) {
                  includesArray = [includes]; // If not JSON, treat as single item
                }
              }
              
              return includesArray.length > 0 ? (
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">What's Included:</p>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {includesArray.slice(0, 3).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="w-3 h-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                    {includesArray.length > 3 && (
                      <li className="text-xs text-slate-500">
                        +{includesArray.length - 3} more items
                      </li>
                    )}
                  </ul>
                </div>
              ) : null;
            })()}

            {/* Process Steps */}
            {(() => {
              const process = pkg.process;
              let processArray = [];
              
              if (Array.isArray(process)) {
                processArray = process;
              } else if (typeof process === 'string' && process.trim()) {
                try {
                  processArray = JSON.parse(process);
                } catch (e) {
                  processArray = [process]; // If not JSON, treat as single item
                }
              }
              
              return processArray.length > 0 ? (
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Process Steps:</p>
                  <div className="space-y-1">
                    {processArray.slice(0, 2).map((step, index) => (
                      <div key={index} className="flex items-start text-xs text-slate-600 dark:text-slate-400">
                        <span className="w-4 h-4 bg-violet-500 text-white rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0">
                          {index + 1}
                        </span>
                        {typeof step === 'object' ? step.title || step : step}
                      </div>
                    ))}
                    {processArray.length > 2 && (
                      <div className="text-xs text-slate-500 ml-6">
                        +{processArray.length - 2} more steps
                      </div>
                    )}
                  </div>
                </div>
              ) : null;
            })()}
          </motion.div>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
            No packages found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first package'}
          </p>
        </div>
      )}

      {/* Modals */}
      <FormModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        onSubmit={handleCreate}
        title="Create New Package"
        formData={formData}
        onInputChange={handleInputChange}
        onIncludesChange={handleIncludesChange}
        onAddInclude={addInclude}
        onRemoveInclude={removeInclude}
        onProcessChange={handleProcessChange}
        onAddProcess={addProcess}
        onRemoveProcess={removeProcess}
      />

      <FormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        onSubmit={handleEdit}
        title="Edit Package"
        isEdit={true}
        formData={formData}
        onInputChange={handleInputChange}
        onIncludesChange={handleIncludesChange}
        onAddInclude={addInclude}
        onRemoveInclude={removeInclude}
        onProcessChange={handleProcessChange}
        onAddProcess={addProcess}
        onRemoveProcess={removeProcess}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Delete Package
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Are you sure you want to delete "{selectedPackage?.title}"? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPackages;
