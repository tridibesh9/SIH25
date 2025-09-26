import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { backend_url } from '../api endpoints/backend_url';
import { 
  MapPin, 
  Save, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Trash2,
  Upload,
  Camera
} from 'lucide-react';

// --- MAIN COMPONENT ---
export const RegisterProject = () => {
  // Form state aligned with the backend schema, including fields for URLs
  const [formData, setFormData] = useState({
    projectName: '',
    owner: '',
    contactNumber: '',
    email: '',
    location: '',
    type: '',
    siteDescription: '',
    landDocuments: '', // Will hold the single URL for the document
    projectImages: [], // Will hold an array with a single URL for the image
  });

  // State for managing local file objects for the UI
  const [documentFile, setDocumentFile] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Changed to manage a single file

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ status: null, message: '' });

  // File input refs
  const documentInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // --- HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

      // 2. Get Auth Token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      console.log("Final formData to submit:", formData);
      console.log("Auth Token:", token);
      
      // 3. Send final data
      const response = await fetch(`${backend_url}/projects/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Project registration failed.');
      }

      const result = await response.json();
      setSubmitStatus({ status: 'success', message: 'Project registered successfully!' });

      // 4. Reset form on success
      setTimeout(() => {
        setFormData({
          projectName: '', owner: '', contactNumber: '', email: '',
          location: '', type: '', siteDescription: '', landDocuments: '', projectImages: [],
        });
        setDocumentFile(null);
        setImageFile(null);
        setSubmitStatus({ status: null, message: '' });
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
      <div className="max-w-4xl mx-auto px-4">
        <motion.div className="text-center mb-10" {...fadeInUp}>
          <h1 className="text-4xl font-bold text-green-800 mb-4">Register New Project</h1>
          <p className="text-xl text-gray-600">Provide your project details and upload the necessary files to begin.</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- Text Inputs --- */}
            {/* ... all your text and select inputs remain the same ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
              <input type="text" name="projectName" value={formData.projectName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., Coastal Mangrove Restoration" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
              <input type="text" name="owner" value={formData.owner} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., John Doe" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
              <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., +1234567890" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., owner@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Location *</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="e.g., Sundarbans, India" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
              <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required>
                <option value="" disabled>Select a blue carbon ecosystem</option>
                <option value="wetlands">Wetlands</option>
                <option value="mangroves">Mangroves</option>
                <option value="seagrass meadows">Seagrass Meadows</option>
                <option value="kelp forests">Kelp Forests</option>
                <option value="salt marshes">Salt Marshes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
              <textarea name="siteDescription" value={formData.siteDescription} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Describe your project site, objectives, and methods."></textarea>
            </div>

            {/* --- Land Document Upload --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Land Document * <span className="text-gray-500">(Single PDF, max 2MB)</span></label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <button type="button" onClick={() => documentInputRef.current?.click()} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Choose File</button>
                <input ref={documentInputRef} type="file" accept=".pdf" onChange={handleDocumentSelect} className="hidden" />
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
                  <button type="button" onClick={removeDocument} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>

            {/* --- Project Image Upload (Single) --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Image * <span className="text-gray-500">(Single image, max 1MB)</span></label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <button type="button" onClick={() => imageInputRef.current?.click()} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" disabled={!!imageFile}>Choose Image</button>
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </div>
              {imageFile && (
                <div className="mt-4">
                    <div key={imageFile.id} className="relative group w-1/2 md:w-1/3">
                        <img src={imageFile.url} alt={imageFile.name} className="w-full h-24 object-cover rounded-lg"/>
                        <button type="button" onClick={removeImage} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
                    </div>
                </div>
              )}
            </div>

            {/* --- Submit & Status --- */}
            {submitStatus.message && (
              <div className={`flex items-center p-4 rounded-lg ${submitStatus.status === 'error' ? 'bg-red-100 border border-red-400' : 'bg-green-100 border border-green-400'}`}>
                {submitStatus.status === 'error' ? <AlertCircle className="w-5 h-5 text-red-600 mr-2" /> : <CheckCircle className="w-5 h-5 text-green-600 mr-2" />}
                <span className={`${submitStatus.status === 'error' ? 'text-red-700' : 'text-green-700'}`}>{submitStatus.message}</span>
              </div>
            )}
            <div className="pt-6">
              <button type="submit" disabled={isSubmitting} className={`w-full flex items-center justify-center px-6 py-4 rounded-lg font-semibold transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white shadow-lg`}>
                {isSubmitting ? (
                  <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Submitting Project...</>
                ) : (
                  <><Save className="w-5 h-5 mr-2" />Submit for Verification</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};