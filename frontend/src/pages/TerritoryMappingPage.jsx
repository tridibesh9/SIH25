import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Map, 
  Upload, 
  Camera, 
  MapPin, 
  Save, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Trash2,
  Download,
  Info
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap.jsx';
import StepIndicator from '../components/StepIndicator.jsx';

export const TerritoryMappingPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    projectName: '',
    contactPerson: '',
    contactEmail: '',
    location: '',
    projectType: '',
    siteDescription: '',
    expectedCarbonCredits: '',
    projectDuration: ''
  });

  // Territory and file states
  const [geojsonData, setGeojsonData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [images, setImages] = useState([]);
  const [existingTerritory, setExistingTerritory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Step definitions
  const steps = ['Project Info', 'Documents', 'Territory', 'Review & Submit'];

  // File input refs
  const documentInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update step progress based on form completion
    updateStepProgress();
  };

  // Update step progress
  const updateStepProgress = () => {
    const requiredFields = ['projectName', 'contactPerson', 'contactEmail', 'location'];
    const completedFields = requiredFields.filter(field => formData[field]);
    
    if (completedFields.length === requiredFields.length) {
      setCurrentStep(Math.max(currentStep, 1));
    }
    
    if (documents.length > 0 || images.length > 0) {
      setCurrentStep(Math.max(currentStep, 2));
    }
    
    if (geojsonData) {
      setCurrentStep(Math.max(currentStep, 3));
    }
  };

  // Update step when territory is drawn
  useEffect(() => {
    updateStepProgress();
  }, [formData, documents, images, geojsonData]);

  // Handle territory drawing
  const handleTerritoryDraw = (geojson) => {
    setGeojsonData(geojson);
  };

  // Handle document upload
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setDocuments(prev => [...prev, ...newDocuments]);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  // Remove document
  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Remove image
  const removeImage = (id) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove && imageToRemove.url) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  // Load existing territory
  const loadExistingTerritory = () => {
    try {
      const parsedTerritory = JSON.parse(existingTerritory);
      setGeojsonData(parsedTerritory);
      setExistingTerritory('');
    } catch (error) {
      alert('Invalid GeoJSON format. Please check your input.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Validate required fields
      const requiredFields = ['projectName', 'contactPerson', 'contactEmail', 'location'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      if (!geojsonData) {
        throw new Error('Please draw the project territory on the map');
      }

      // Prepare submission data
      const submissionData = {
        ...formData,
        territoryData: geojsonData,
        documents: documents.map(doc => ({
          name: doc.name,
          size: doc.size,
          type: doc.type
        })),
        images: images.map(img => ({
          name: img.name
        })),
        submissionTime: new Date().toISOString()
      };

      // For now, just log the data (replace with actual API call)
      console.log('Project Submission Data:', submissionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          projectName: '',
          contactPerson: '',
          contactEmail: '',
          location: '',
          projectType: '',
          siteDescription: '',
          expectedCarbonCredits: '',
          projectDuration: ''
        });
        setGeojsonData(null);
        setDocuments([]);
        setImages([]);
        setSubmitStatus(null);
      }, 3000);

    } catch (error) {
      setSubmitStatus('error');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          {...fadeInUp}
        >
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Project Territory Mapping
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Register your environmental project by providing detailed information and mapping your project territory. 
            Our interactive tools make it easy to define boundaries and submit all necessary documentation.
          </p>
          
          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} steps={steps} />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Form */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Project Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter your project name"
                  required
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter contact person name"
                  required
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter contact email"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter project location"
                  required
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select project type</option>
                  <option value="reforestation">Reforestation</option>
                  <option value="renewable-energy">Renewable Energy</option>
                  <option value="waste-management">Waste Management</option>
                  <option value="energy-efficiency">Energy Efficiency</option>
                  <option value="methane-capture">Methane Capture</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Expected Carbon Credits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Carbon Credits (tons CO2e/year)
                </label>
                <input
                  type="number"
                  name="expectedCarbonCredits"
                  value={formData.expectedCarbonCredits}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter expected annual carbon credits"
                />
              </div>

              {/* Project Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Duration (years)
                </label>
                <input
                  type="number"
                  name="projectDuration"
                  value={formData.projectDuration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter project duration"
                />
              </div>

              {/* Site Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Description
                </label>
                <textarea
                  name="siteDescription"
                  value={formData.siteDescription}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Describe your project site and objectives"
                />
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Upload project documents</p>
                  <button
                    type="button"
                    onClick={() => documentInputRef.current?.click()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Choose Files
                  </button>
                  <input
                    ref={documentInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                </div>
                
                {/* Document List */}
                {documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium">{doc.name}</span>
                          <span className="text-xs text-gray-500 ml-2">({formatFileSize(doc.size)})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(doc.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Upload project images</p>
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Choose Images
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                {/* Image Preview Grid */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-lg font-semibold transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
                  } text-white shadow-lg`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting Project...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Submit Project Data
                    </>
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="flex items-center p-4 bg-green-100 border border-green-400 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-700">Project submitted successfully!</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center p-4 bg-red-100 border border-red-400 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-700">Error submitting project. Please try again.</span>
                </div>
              )}
            </form>
          </motion.div>

          {/* Right Column - Map */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <MapPin className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Territory Mapping</h2>
            </div>

            {/* Map Container */}
            <div className="h-96 mb-6 rounded-lg overflow-hidden border">
              <InteractiveMap 
                geojsonData={geojsonData} 
                onTerritoryDraw={handleTerritoryDraw}
                center={[22.33, 87.32]}
                zoom={13}
              />
            </div>

            {/* Map Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Drawing Instructions:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Click the polygon tool to start drawing</li>
                <li>• Click on the map to add boundary points</li>
                <li>• Double-click to complete the polygon</li>
                <li>• Use the edit tools to modify your boundary</li>
              </ul>
            </div>

            {/* Territory Data Display */}
            {geojsonData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-800 mb-2">Territory Captured:</h3>
                <div className="text-sm text-green-700">
                  <p>Type: {geojsonData.type}</p>
                  <p>Coordinates: {geojsonData.geometry?.coordinates?.[0]?.length || 0} points</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(geojsonData, null, 2));
                    alert('GeoJSON copied to clipboard!');
                  }}
                  className="mt-2 flex items-center text-xs text-green-600 hover:text-green-800"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Copy GeoJSON
                </button>
              </div>
            )}

            {/* Load Existing Territory */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-800 mb-4">Load Existing Territory</h3>
              <div className="space-y-3">
                <textarea
                  value={existingTerritory}
                  onChange={(e) => setExistingTerritory(e.target.value)}
                  placeholder="Paste GeoJSON data here to load existing territory boundaries..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={loadExistingTerritory}
                  disabled={!existingTerritory.trim()}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    existingTerritory.trim()
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Load Territory on Map
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Information Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-blue-800 ml-3">Project Guidelines</h3>
            </div>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Provide accurate project information</li>
              <li>• Upload relevant documentation</li>
              <li>• Ensure territory boundaries are precise</li>
              <li>• Include high-quality project images</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 ml-3">Required Documents</h3>
            </div>
            <ul className="text-sm text-green-700 space-y-2">
              <li>• Environmental impact assessment</li>
              <li>• Land ownership certificates</li>
              <li>• Project methodology documents</li>
              <li>• Baseline study reports</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-purple-800 ml-3">Mapping Tips</h3>
            </div>
            <ul className="text-sm text-purple-700 space-y-2">
              <li>• Use satellite view for accuracy</li>
              <li>• Mark clear boundary points</li>
              <li>• Include buffer zones if applicable</li>
              <li>• Verify GPS coordinates</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};