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
import SimpleMap from '../components/SimpleMap.jsx';
import StepIndicator from '../components/StepIndicator.jsx';
import { backend_url } from '../api endpoints/backend_url.jsx';

export const RegisterProjectWithTerritory = () => {
  // Form state aligned with the backend schema, including fields for URLs and territory
  const [formData, setFormData] = useState({
    projectName: '',
    owner: '',
    contactNumber: '',
    email: '',
    location: '', // This will be a string description
    territoryLocation: null, // This will be the GeoJSON object
    type: '',
    siteDescription: '',
    landDocuments: '', // Will hold the single URL for the document
    projectImages: [], // Will hold an array with a single URL for the image
  });

  // Territory and file states
  const [geojsonData, setGeojsonData] = useState(null);
  
  // State for managing local file objects for the UI
  const [documentFile, setDocumentFile] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Changed to manage a single file

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ status: null, message: '' });
  const [currentStep, setCurrentStep] = useState(0);

  // Step definitions
  const steps = ['Project Info', 'Documents & Images', 'Territory Mapping', 'Review & Submit'];

  // File input refs
  const documentInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // --- HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    updateStepProgress();
  };

  // Update step progress
  const updateStepProgress = () => {
    const requiredFields = ['projectName', 'owner', 'email', 'location', 'contactNumber'];
    const completedFields = requiredFields.filter(field => formData[field]);
    
    if (completedFields.length === requiredFields.length) {
      setCurrentStep(Math.max(currentStep, 1));
    }
    
    if (formData.landDocuments && formData.projectImages.length > 0) {
      setCurrentStep(Math.max(currentStep, 2));
    }
    
    if (geojsonData) {
      setCurrentStep(Math.max(currentStep, 3));
    }
  };

  // Update step when territory is drawn
  useEffect(() => {
    updateStepProgress();
  }, [formData, geojsonData]);

  // Handle territory drawing
  const handleTerritoryDraw = (geojson) => {
    setGeojsonData(geojson);
    setFormData(prev => ({ ...prev, territoryLocation: geojson }));
  };

  // Handle document selection and IMMEDIATE upload
  const handleDocumentSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (file.type !== 'application/pdf') {
      setSubmitStatus({ status: 'error', message: 'Invalid file type. Only PDF is allowed.' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2 MB
      setSubmitStatus({ status: 'error', message: 'File size exceeds 2MB limit.' });
      return;
    }

    setDocumentFile({ file, name: file.name, size: file.size });
    setSubmitStatus({ status: null, message: '' }); // Clear previous errors

    const token = localStorage.getItem('token');
    if (!token) {
      setSubmitStatus({ status: 'error', message: "Authentication token not found." });
      return;
    }
    
    const uploadFormData = new FormData();
    uploadFormData.append('projectDocument', file);

    try {
      const response = await fetch(`${backend_url}/projects/upload-document`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Document upload failed.');
      }
      
      setFormData(prev => ({ ...prev, landDocuments: result.url }));

    } catch (error) {
      setSubmitStatus({ status: 'error', message: error.message });
      setDocumentFile(null);
    }
  };

  // Handle image selection and IMMEDIATE upload for a SINGLE image
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (file.size > 1 * 1024 * 1024) { // 1 MB
      setSubmitStatus({ status: 'error', message: `Image size exceeds 1MB limit.` });
      return false;
    }
    
    // Create a preview URL
    setImageFile({
        id: Date.now(),
        file,
        name: file.name,
        url: URL.createObjectURL(file)
    });
    setSubmitStatus({ status: null, message: '' });

    const token = localStorage.getItem('token');
    if (!token) {
      setSubmitStatus({ status: 'error', message: "Authentication token not found." });
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('projectImages', file); // 'projectImages' should match multer field name

    try {
      const response = await fetch(`${backend_url}/projects/upload-images`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Image upload failed.');
      }
      
      setFormData(prev => ({ ...prev, projectImages: result.urls }));

    } catch (error) {
      setSubmitStatus({ status: 'error', message: error.message });
      setImageFile(null); // Clear image on failed upload
    }
  };
  
  const removeDocument = () => {
    setDocumentFile(null);
    setFormData(prev => ({ ...prev, landDocuments: '' }));
  };

  const removeImage = () => {
   setImageFile(null);
   setFormData(prev => ({ ...prev, projectImages: [] }));
  };

  // --- FINAL FORM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ status: null, message: '' });

    try {
      // 1. Validation
      const requiredFields = ['projectName', 'owner', 'contactNumber', 'email', 'location', 'type'];
      if (requiredFields.some(field => !formData[field])) {
        throw new Error('Please fill all required text fields.');
      }
      if (!formData.landDocuments) {
        throw new Error('Land document must be uploaded.');
      }
      if (formData.projectImages.length === 0) {
        throw new Error('A project image must be uploaded.');
      }
      if (!formData.territoryLocation) {
        throw new Error('Please map the project territory on the map.');
      }

      // 2. Get Auth Token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      // 3. Prepare the final data - convert territoryLocation to JSON string for backend
      const finalFormData = {
        ...formData,
        location: JSON.stringify(formData.territoryLocation) // Send the GeoJSON as location field
      };

      // Remove territoryLocation from the final data since we're sending it as location
      delete finalFormData.territoryLocation;

      console.log("Final formData to submit:", finalFormData);
      console.log("Auth Token:", token);
      
      // 4. Send final data
      const response = await fetch(`${backend_url}/projects/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Project registration failed.');
      }

      const result = await response.json();
      setSubmitStatus({ status: 'success', message: 'Project registered successfully!' });

      // 5. Reset form on success
      setTimeout(() => {
        setFormData({
          projectName: '',
          owner: '',
          contactNumber: '',
          email: '',
          location: '',
          territoryLocation: null,
          type: '',
          siteDescription: '',
          landDocuments: '',
          projectImages: [],
        });
        setGeojsonData(null);
        setDocumentFile(null);
        setImageFile(null);
        setSubmitStatus({ status: null, message: '' });
        setCurrentStep(0);
      }, 4000);

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({ status: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${['Bytes', 'KB', 'MB', 'GB'][i]}`;
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
        <motion.div className="text-center mb-10" {...fadeInUp}>
          <h1 className="text-4xl font-bold text-green-800 mb-4">Register New Project with Territory Mapping</h1>
          <p className="text-xl text-gray-600">Provide your project details, upload necessary files, and map your project territory.</p>
          
          {/* Step Indicator */}
          <div className="mt-8">
            <StepIndicator currentStep={currentStep} steps={steps} />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                <input 
                  type="text" 
                  name="projectName" 
                  value={formData.projectName} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                  placeholder="e.g., Coastal Mangrove Restoration" 
                  required 
                />
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
                <input 
                  type="text" 
                  name="owner" 
                  value={formData.owner} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                  placeholder="e.g., John Doe" 
                  required 
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                <input 
                  type="tel" 
                  name="contactNumber" 
                  value={formData.contactNumber} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                  placeholder="e.g., +1234567890" 
                  required 
                />
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                  placeholder="e.g., owner@example.com" 
                  required 
                />
              </div>

              {/* Geographic Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Location Description *</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                  placeholder="e.g., Sundarbans, India (Note: Exact boundaries will be mapped on the right)" 
                  required 
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                  required
                >
                  <option value="" disabled>Select a blue carbon ecosystem</option>
                  <option value="wetlands">Wetlands</option>
                  <option value="mangroves">Mangroves</option>
                  <option value="seagrass meadows">Seagrass Meadows</option>
                  <option value="kelp forests">Kelp Forests</option>
                  <option value="salt marshes">Salt Marshes</option>
                </select>
              </div>

              {/* Site Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <textarea 
                  name="siteDescription" 
                  value={formData.siteDescription} 
                  onChange={handleInputChange} 
                  rows={4} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                  placeholder="Describe your project site, objectives, and methods."
                ></textarea>
              </div>

              {/* Land Document Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Land Document * <span className="text-gray-500">(Single PDF, max 2MB)</span></label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <button 
                    type="button" 
                    onClick={() => documentInputRef.current?.click()} 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Choose File
                  </button>
                  <input 
                    ref={documentInputRef} 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleDocumentSelect} 
                    className="hidden" 
                  />
                </div>
                {documentFile && (
                  <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {formData.landDocuments ? 
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> :
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                      }
                        <span className="text-sm font-medium">{documentFile.name} ({formatFileSize(documentFile.size)})</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={removeDocument} 
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Project Image Upload (Single) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Image * <span className="text-gray-500">(Single image, max 1MB)</span></label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <button 
                    type="button" 
                    onClick={() => imageInputRef.current?.click()} 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" 
                    disabled={!!imageFile}
                  >
                    Choose Image
                  </button>
                  <input 
                    ref={imageInputRef} 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageSelect} 
                    className="hidden" 
                  />
                </div>
                {imageFile && (
                  <div className="mt-4">
                      <div key={imageFile.id} className="relative group w-1/2 md:w-1/3">
                          <img 
                            src={imageFile.url} 
                            alt={imageFile.name} 
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button 
                            type="button" 
                            onClick={removeImage} 
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                      </div>
                  </div>
                )}
              </div>

              {/* Submit & Status */}
              {submitStatus.message && (
                <div className={`flex items-center p-4 rounded-lg ${submitStatus.status === 'error' ? 'bg-red-100 border border-red-400' : 'bg-green-100 border border-green-400'}`}>
                  {submitStatus.status === 'error' ? 
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" /> : 
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  }
                  <span className={`${submitStatus.status === 'error' ? 'text-red-700' : 'text-green-700'}`}>
                    {submitStatus.message}
                  </span>
                </div>
              )}

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !geojsonData} 
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-lg font-semibold transition-all ${isSubmitting || !geojsonData ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white shadow-lg`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting Project...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Submit for Verification
                    </>
                  )}
                </button>
                {!geojsonData && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Please map your project territory on the right panel to enable submission
                  </p>
                )}
              </div>
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
              <Map className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Territory Mapping</h2>
            </div>

            <div className="mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">How to map your territory:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Click "Start Drawing" to begin</li>
                      <li>Click on the map to create boundary points</li>
                      <li>The polygon will auto-complete after 4 points</li>
                      <li>Or click "Complete" after placing at least 3 points</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Territory Status */}
            {geojsonData && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Territory mapped successfully!</span>
                </div>
              </div>
            )}

            {/* Map Component */}
            <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
              <SimpleMap 
                geojsonData={geojsonData}
                onTerritoryDraw={handleTerritoryDraw}
                center={[22.33, 87.32]}
                zoom={13}
              />
            </div>

            {/* Territory Data Display */}
            {geojsonData && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Territory Data (GeoJSON)
                </label>
                <textarea 
                  value={JSON.stringify(geojsonData, null, 2)}
                  readOnly
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-xs font-mono"
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterProjectWithTerritory;