import React, { useState } from 'react';
import { PlusCircle, Map, ExternalLink, CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight, BarChart3, Cloud, FileText, Bot } from 'lucide-react';
import VerificationStepper  from './VerificationStepper.jsx';

const ProjectDetailModal = ({ project, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.projectImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + project.projectImages.length) % project.projectImages.length);
    };


  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">
          <XCircle size={28} />
        </button>
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{project.projectName}</h2>
            <p className="text-gray-600">{project.location} | <span className="capitalize font-medium text-blue-600">{project.type}</span></p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Verification Status</h3>
            <VerificationStepper currentStatus={project.verificationStatus} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Images */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Project Images</h3>
              <div className="relative">
                <img src={project.projectImages[currentImageIndex]} alt={project.projectName} className="w-full h-80 object-cover rounded-lg shadow-md" />
                 {project.projectImages.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white transition">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white transition">
                            <ChevronRight size={20} />
                        </button>
                    </>
                 )}
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Project Information</h3>
              <div>
                <label className="text-sm font-medium text-gray-500">Owner</label>
                <p className="text-gray-800">{project.owner}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Contact</label>
                <p className="text-gray-800">{project.email} | {project.contactNumber}</p>
              </div>
               <div>
                <label className="text-sm font-medium text-gray-500">Site Description</label>
                <p className="text-gray-800 text-sm">{project.siteDescription}</p>
              </div>
               <a href={project.landDocuments} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  View Land Documents <ExternalLink className="w-4 h-4 ml-2" />
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;