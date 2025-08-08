import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  WrenchScrewdriverIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import AdminBreadcrumb from '../../components/Layout/AdminBreadcrumb';
import { servicesAPI } from '../../services/api';

// FormModal Component - moved outside to prevent re-creation
const FormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  isEdit = false, 
  submitting = false, 
  formData, 
  onInputChange 
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
            {/* Debug info for development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded mb-4">
                <div>Debug: {title} | Submitting: {submitting.toString()}</div>
                <div>Form Data: Name="{formData.name}" | Price={formData.price} | Type={formData.serviceType}</div>
                <div>Required Fields: Name={!!formData.name} | Price={!!formData.price} | ShortDesc={!!formData.shortDescription} | Desc={!!formData.description}</div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onInputChange}
                  required
                  minLength={3}
                  maxLength={100}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="Enter service name (minimum 3 characters)"
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
                  Service Type
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                >
                  <option value="consultation">Consultation</option>
                  <option value="tax_preparation">Tax Preparation</option>
                  <option value="financial_planning">Financial Planning</option>
                  <option value="business_advisory">Business Advisory</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={onInputChange}
                  required
                  min="15"
                  step="15"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder="e.g., 60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Service Image
                </label>
                <div className="space-y-3">
                  {/* Image Upload Area */}
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-violet-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onInputChange}
                      className="hidden"
                      id="image-upload"
                      name="imageFile"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      {formData.imagePreview || (formData.imageUrl && formData.imageUrl.trim()) ? (
                        <div className="relative">
                          <img
                            src={formData.imagePreview || (formData.imageUrl.startsWith('http') ? formData.imageUrl : `http://localhost:5000${formData.imageUrl}`)}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg mb-2"
                            onError={(e) => {
                              console.error('Image preview error:', e);
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02NCA5NkM4MC41NjkgOTYgOTQgODIuNTY5IDk0IDY2Qzk0IDQ5LjQzMSA4MC41NjkgMzYgNjQgMzZDNDcuNDMxIDM2IDM0IDQ5LjQzMSAzNCA2NkMzNCA4Mi41NjkgNDcuNDMxIDk2IDY0IDk2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              onInputChange({
                                target: {
                                  name: 'clearImage',
                                  value: true
                                }
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
                  placeholder="https://example.com/service"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Short Description
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={onInputChange}
                required
                minLength={10}
                maxLength={200}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="Brief description for listings (minimum 10 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onInputChange}
                required
                minLength={20}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="Enter detailed service description (minimum 20 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={onInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="What clients need to provide or prepare"
              />
            </div>

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
                disabled={submitting}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.name || !formData.price || !formData.shortDescription || !formData.description}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  isEdit ? 'Update Service' : 'Create Service'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterServiceType, setFilterServiceType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    durationMinutes: 60,
    serviceType: 'consultation',
    imageUrl: '',
    imageFile: null,
    imagePreview: '',
    link: '',
    isActive: true,
    featured: false,
    requirements: ''
  });

  useEffect(() => {
    let isMounted = true;
    
    const loadServices = async () => {
      if (isMounted) {
        await fetchServices();
      }
    };
    
    loadServices();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to run only once

  const fetchServices = async () => {
    try {
      setLoading(true);
      // Include inactive services for admin view
      const response = await servicesAPI.getAll({ includeInactive: 'true', limit: 1000 }); // Get all services
      
      if (response.data && response.data.success) {
        const servicesData = response.data.data || [];
        setServices(servicesData);
      } else {
        setServices([]);
        if (services.length === 0) { // Only show message if no services were previously loaded
          toast.info('No services found');
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      if (error.response?.status === 404) {
        setServices([]);
        if (services.length === 0) {
          toast.info('No services found');
        }
      } else {
        toast.error('Failed to load services');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === 'clearImage') {
      // Handle clearing image
      setFormData(prev => ({
        ...prev,
        imageFile: null,
        imagePreview: '',
        imageUrl: ''
      }));
      // Reset file input
      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';
      return;
    }
    
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: e.target.result,
          imageUrl: '' // Clear URL when file is selected
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // Handle all other inputs normally (including imageUrl)
      const newValue = type === 'checkbox' ? checked : value;
      
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: newValue
        };
        
        // If imageUrl is being set, clear file upload
        if (name === 'imageUrl' && value.trim()) {
          newData.imageFile = null;
          newData.imagePreview = '';
          // Reset file input
          setTimeout(() => {
            const fileInput = document.getElementById('image-upload');
            if (fileInput) fileInput.value = '';
          }, 0);
        }
        
        return newData;
      });
    }
  };

  const validateForm = () => {
    const errors = [];
    
    // Service name validation
    if (!formData.name || formData.name.trim().length < 3) {
      errors.push('Service name must be at least 3 characters long');
    }
    
    // Price validation
    if (!formData.price || parseFloat(formData.price) < 0) {
      errors.push('Price must be a valid positive number');
    }
    
    // Short description validation
    if (!formData.shortDescription || formData.shortDescription.trim().length < 10) {
      errors.push('Short description must be at least 10 characters long');
    }
    
    // Full description validation
    if (!formData.description || formData.description.trim().length < 20) {
      errors.push('Full description must be at least 20 characters long');
    }
    
    // Duration validation
    if (!formData.durationMinutes || parseInt(formData.durationMinutes) < 15) {
      errors.push('Duration must be at least 15 minutes');
    }
    
    // URL validations
    if (formData.imageUrl && formData.imageUrl.trim()) {
      try {
        new URL(formData.imageUrl);
      } catch (e) {
        errors.push('Please enter a valid image URL');
      }
    }
    
    if (formData.link && formData.link.trim()) {
      try {
        new URL(formData.link);
      } catch (e) {
        errors.push('Please enter a valid external link URL');
      }
    }
    
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (submitting) return; // Prevent double submission
    
    console.log('Starting create service process...', formData);
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      console.log('Form validation errors:', validationErrors);
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      setSubmitting(true);
      
      // Check admin authentication
      const adminToken = Cookies.get('adminToken');
      console.log('Admin token exists:', !!adminToken);
      
      if (!adminToken) {
        toast.error('Authentication required');
        return;
      }
      
      // Basic validation
      if (!(formData.name || '').trim()) {
        toast.error('Service name is required');
        return;
      }
      
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error('Valid price is required');
        return;
      }
      
      // Handle image upload if file is selected
      let imageUrl = formData.imageUrl;
      if (formData.imageFile) {
        console.log('Uploading image for new service...');
        try {
          const uploadedImageUrl = await uploadImage(formData.imageFile);
          if (uploadedImageUrl) {
            imageUrl = uploadedImageUrl;
            console.log('Image uploaded successfully:', imageUrl);
          } else {
            console.warn('Image upload failed, proceeding without image');
          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          toast.error('Image upload failed, proceeding without image');
        }
      }

      const serviceData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined, // Don't send empty strings
        shortDescription: formData.shortDescription.trim() || undefined,
        price: parseFloat(formData.price),
        durationMinutes: parseInt(formData.durationMinutes) || 60,
        serviceType: formData.serviceType,
        isActive: Boolean(formData.isActive),
        featured: Boolean(formData.featured),
        requirements: formData.requirements.trim() || undefined
      };
      
      // Add optional fields only if they have valid values
      const imageUrlValue = (imageUrl || '').trim();
      if (imageUrlValue) {
        serviceData.imageUrl = imageUrlValue;
      }
      
      const linkValue = (formData.link || '').trim();
      if (linkValue) {
        try {
          new URL(linkValue); // Test if it's a valid URL
          serviceData.link = linkValue;
        } catch (urlError) {
          toast.error('Please enter a valid URL for the external link');
          return;
        }
      }

      console.log('Creating service with data:', { ...serviceData, imageUrl: serviceData.imageUrl ? '[IMAGE_URL_SET]' : '[NO_IMAGE]' });
      
      const response = await servicesAPI.create(serviceData);
      console.log('Create service response:', response.data);
      
      if (response.data && response.data.success) {
        toast.success('Service created successfully');
        setShowCreateModal(false);
        resetForm();
        await fetchServices();
      } else {
        console.error('Service creation failed:', response.data);
        toast.error(response.data?.message || 'Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      
      // Handle specific error types
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.errors?.join(', ') || 
                           `Server error (${error.response.status})`;
        toast.error(errorMessage);
        console.error('Server response:', error.response.data);
      } else if (error.request) {
        toast.error('Network error - please check your connection');
        console.error('Network error:', error.request);
      } else {
        toast.error(error.message || 'Failed to create service');
        console.error('Error:', error.message);
      }
    } finally {
      setSubmitting(false);
      console.log('Create service process completed');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    
    if (submitting) return; // Prevent double submission
    
    console.log('Starting edit service process...', { serviceId: selectedService?.id, formData });
    
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      console.log('Form validation errors:', validationErrors);
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    try {
      setSubmitting(true);
      
      // Check admin authentication
      const adminToken = Cookies.get('adminToken');
      console.log('Admin token exists:', !!adminToken);
      
      if (!adminToken) {
        toast.error('Authentication required');
        return;
      }
      
      if (!selectedService || !selectedService.id) {
        toast.error('No service selected for editing');
        return;
      }
      
      // Handle image upload if file is selected
      let imageUrl = formData.imageUrl;
      if (formData.imageFile) {
        console.log('Uploading new image for edit...');
        try {
          const uploadedImageUrl = await uploadImage(formData.imageFile);
          if (uploadedImageUrl) {
            imageUrl = getImageUrl(uploadedImageUrl); // Ensure full URL
            console.log('New image uploaded:', imageUrl);
          } else {
            console.warn('Image upload failed, keeping existing image');
          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          toast.error('Image upload failed, keeping existing image');
        }
      }

      const serviceData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined, // Don't send empty strings
        shortDescription: formData.shortDescription.trim() || undefined,
        price: parseFloat(formData.price),
        durationMinutes: parseInt(formData.durationMinutes) || 60,
        serviceType: formData.serviceType,
        isActive: Boolean(formData.isActive),
        featured: Boolean(formData.featured),
        requirements: formData.requirements.trim() || undefined
      };
      
      // Add optional fields only if they have valid values
      const imageUrlValue = (imageUrl || '').trim();
      if (imageUrlValue) {
        serviceData.imageUrl = imageUrlValue;
      }
      
      const linkValue = (formData.link || '').trim();
      if (linkValue) {
        try {
          new URL(linkValue); // Test if it's a valid URL
          serviceData.link = linkValue;
        } catch (urlError) {
          toast.error('Please enter a valid URL for the external link');
          return;
        }
      }

      console.log('Updating service with data:', { ...serviceData, imageUrl: serviceData.imageUrl ? '[IMAGE_URL_SET]' : '[NO_IMAGE]' });
      
      const response = await servicesAPI.update(selectedService.id, serviceData);
      console.log('Update service response:', response.data);
      
      if (response.data && response.data.success) {
        toast.success('Service updated successfully');
        setShowEditModal(false);
        resetForm();
        await fetchServices();
      } else {
        console.error('Service update failed:', response.data);
        toast.error(response.data?.message || 'Failed to update service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      
      // Handle specific error types
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.errors?.join(', ') || 
                           `Server error (${error.response.status})`;
        toast.error(errorMessage);
        console.error('Server response:', error.response.data);
      } else if (error.request) {
        toast.error('Network error - please check your connection');
        console.error('Network error:', error.request);
      } else {
        toast.error(error.message || 'Failed to update service');
        console.error('Error:', error.message);
      }
    } finally {
      setSubmitting(false);
      console.log('Edit service process completed');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await servicesAPI.delete(selectedService.id);
      if (response.data && response.data.success) {
        toast.success('Service deleted successfully');
        setShowDeleteModal(false);
        setSelectedService(null);
        await fetchServices();
      } else {
        toast.error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const resetForm = () => {
    console.log('Resetting form data...');
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      durationMinutes: 60,
      serviceType: 'consultation',
      imageUrl: '',
      imageFile: null,
      imagePreview: '',
      link: '',
      isActive: true,
      featured: false,
      requirements: ''
    });
    setSelectedService(null);
    
    // Clear file input
    setTimeout(() => {
      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';
    }, 0);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name || '',
      description: service.description || '',
      shortDescription: service.shortDescription || service.short_description || '',
      price: service.price ? service.price.toString() : '',
      durationMinutes: service.durationMinutes || service.duration_minutes || 60,
      serviceType: service.serviceType || service.service_type || 'consultation',
      imageUrl: service.imageUrl || service.image_url || '',
      imageFile: null,
      imagePreview: '',
      link: service.link || '',
      isActive: service.isActive === 1 || service.isActive === true,
      featured: service.featured === 1 || service.featured === true,
      requirements: service.requirements || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  // Helper function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // If it's a relative path, prepend the backend URL
    return `http://localhost:5000${imageUrl}`;
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;
    
    console.log('Uploading image file:', imageFile.name, imageFile.type, imageFile.size);
    
    const formDataUpload = new FormData();
    formDataUpload.append('image', imageFile);
    
    try {
      const adminToken = Cookies.get('adminToken');
      console.log('Admin token for upload:', !!adminToken);
      
      if (!adminToken) {
        console.error('No admin token for image upload');
        toast.error('Authentication required for image upload');
        return null;
      }

      console.log('Starting image upload to:', 'http://localhost:5000/api/v1/services/upload-image');
      
      // Use the services upload endpoint
      const response = await fetch('http://localhost:5000/api/v1/services/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formDataUpload
      });
      
      console.log('Upload response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Image upload successful:', result);
        return result.imageUrl;
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Upload error response:', errorData);
        
        // Don't show error toast here, let the calling function handle it
        console.warn(`Upload failed: ${errorData.message}`);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Don't show error toast here, let the calling function handle it
      console.warn(`Failed to upload image: ${error.message}`);
      return null;
    }
  };

  const filteredServices = services
    .filter(service => {
      const matchesSearch = (service.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (service.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (service.shortDescription || service.short_description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      // Handle database values: 1 = active, 0 = inactive
      const isServiceActive = service.isActive === 1 || service.isActive === true;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && isServiceActive) ||
                           (filterStatus === 'inactive' && !isServiceActive);
      
      // Service type filter
      const serviceType = service.serviceType || service.service_type || '';
      const matchesServiceType = filterServiceType === 'all' || serviceType === filterServiceType;
      
      return matchesSearch && matchesStatus && matchesServiceType;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = parseFloat(a.price || 0);
          bValue = parseFloat(b.price || 0);
          break;
        case 'name':
          aValue = (a.name || '').toLowerCase();
          bValue = (b.name || '').toLowerCase();
          break;
        case 'durationMinutes':
          aValue = a.durationMinutes || a.duration_minutes || 0;
          bValue = b.durationMinutes || b.duration_minutes || 0;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.created_at || a.createdAt || '1970-01-01');
          bValue = new Date(b.created_at || b.createdAt || '1970-01-01');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Services Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage all your professional services
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Service
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
                placeholder="Search services by name or description..."
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
                value={filterServiceType}
                onChange={(e) => setFilterServiceType(e.target.value)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-sm min-w-[140px]"
              >
                <option value="all">All Types</option>
                <option value="consultation">Consultation</option>
                <option value="tax_preparation">Tax Preparation</option>
                <option value="financial_planning">Financial Planning</option>
                <option value="business_advisory">Business Advisory</option>
              </select>
              
              {/* Clear Filters Button */}
              {(searchTerm || filterStatus !== 'all' || filterServiceType !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                    setFilterServiceType('all');
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
              <option value="createdAt">Date Created</option>
              <option value="name">Name (A-Z)</option>
              <option value="price">Price</option>
              <option value="durationMinutes">Duration</option>
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
              Showing {filteredServices.length} of {services.length} services
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
              {filterServiceType !== 'all' && (
                <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs">
                  {filterServiceType.replace('_', ' ')}
                </span>
              )}
            </span>
            {services.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {services.filter(s => s.isActive === 1 || s.isActive === true).length} Active
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {services.filter(s => !(s.isActive === 1 || s.isActive === true)).length} Inactive
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  {services.filter(s => s.featured === 1 || s.featured === true).length} Featured
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <WrenchScrewdriverIcon className="h-6 w-6 text-violet-600" />
                {(service.featured === 1 || service.featured === true) && (
                  <StarIcon className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(service)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(service)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Service Image */}
            {((service.imageUrl || service.image_url) && (service.imageUrl || service.image_url).trim()) && (
              <div className="mb-4">
                <img
                  src={getImageUrl(service.imageUrl || service.image_url)}
                  alt={service.name}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {service.name}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
              {service.shortDescription || service.short_description}
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
              {service.description}
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-violet-600">
                  ${service.price}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  (service.isActive === 1 || service.isActive === true)
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {(service.isActive === 1 || service.isActive === true) ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 capitalize">
                  {(service.serviceType || service.service_type || '').replace('_', ' ')}
                </span>
                {(service.featured === 1 || service.featured === true) && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {service.durationMinutes || service.duration_minutes} minutes
                </span>
                {service.link && (
                  <a 
                    href={service.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                  >
                    External Link
                  </a>
                )}
              </div>

              {/* View Service Button */}
              <div className="mt-3">
                <Link
                  to={`/buy-service/${service.id}`}
                  className="inline-flex items-center px-3 py-2 text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                >
                  <EyeIcon className="w-3 h-3 mr-1" />
                  View Service Page
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {service.requirements && (
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">Requirements:</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {service.requirements}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
            No services found
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first service'}
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
        title="Create New Service"
        submitting={submitting}
        formData={formData}
        onInputChange={handleInputChange}
      />

      <FormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        onSubmit={handleEdit}
        title="Edit Service"
        isEdit={true}
        submitting={submitting}
        formData={formData}
        onInputChange={handleInputChange}
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
                  Delete Service
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Are you sure you want to delete "{selectedService?.name}"? This action cannot be undone.
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

export default ServicesManagement;
