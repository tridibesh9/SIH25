import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, Clock, MapPin, FileText, Calendar } from 'lucide-react';
import ReviewWindow from '../components/ReviewWindow';

export const AdminDashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const pendingProjects = [
    {
      id: 'PROJ-001',
      name: 'Costa Rica Reforestation Initiative',
      developer: 'GreenWorld Foundation',
      location: 'San José, Costa Rica',
      type: 'Reforestation',
      submittedDate: '2024-01-15',
      expectedCredits: 15000,
      area: '500 hectares',
      description: 'Large-scale reforestation project focusing on native species restoration in degraded pasturelands.',
      documents: ['Environmental Impact Assessment', 'Land Use Permits', 'Community Agreements'],
      image: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'PROJ-002',
      name: 'Solar Energy Farm Philippines',
      developer: 'SunPower Asia',
      location: 'Luzon, Philippines',
      type: 'Renewable Energy',
      submittedDate: '2024-01-18',
      expectedCredits: 25000,
      capacity: '50 MW',
      description: 'Large-scale solar installation providing clean energy to rural communities.',
      documents: ['Technical Specifications', 'Grid Connection Agreement', 'Environmental Clearance'],
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'PROJ-003',
      name: 'Mangrove Restoration Indonesia',
      developer: 'Ocean Conservation Co.',
      location: 'Java, Indonesia',
      type: 'Conservation',
      submittedDate: '2024-01-20',
      expectedCredits: 12000,
      area: '300 hectares',
      description: 'Coastal mangrove restoration project protecting communities from climate impacts.',
      documents: ['Marine Survey Report', 'Community Impact Study', 'Restoration Plan'],
      image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const handleReviewProject = (project) => {
    setSelectedProject(project);
  };

  const handleBulkVerifyDocuments = () => {
    console.log('Bulk verifying all documents');
    alert('All documents have been verified!');
  };

  const handleBulkApproveCertifications = () => {
    console.log('Bulk approving all certifications');
    alert('All certifications have been approved!');
  };

  const handleBulkProcessRequests = () => {
    console.log('Bulk processing all credit requests');
    alert('All credit requests have been processed!');
  };

  const handleBulkVerifyRequests = () => {
    console.log('Bulk verifying all verification requests');
    alert('All verification requests have been verified!');
  };

  const ReviewModal = ({ project, onClose, onApprove, onReject }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
              <p className="text-gray-600 mt-1">Project ID: {project.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <XCircle className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />

              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <span>Submitted: {project.submittedDate}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-2" />
                  <span>Developer: {project.developer}</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Project Details</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{project.expectedCredits.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Expected Credits</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{project.area || project.capacity}</div>
                    <div className="text-sm text-gray-600">{project.area ? 'Project Area' : 'Capacity'}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Verification Documents</h3>
                  <div className="space-y-2">
                    {project.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{doc}</span>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={() => onReject(project.id)}
            className="flex items-center px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            <XCircle className="w-5 h-5 mr-2" />
            Reject Project
          </button>
          <button
            onClick={() => onApprove(project.id)}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Approve & Tokenize
          </button>
        </div>
      </div>
    </div>
  );

  const handleApprove = (projectId) => {
    alert(`Project ${projectId} approved and sent for tokenization!`);
    setSelectedProject(null);
  };

  const handleReject = (projectId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      alert(`Project ${projectId} rejected. Reason: ${reason}`);
      setSelectedProject(null);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Review and approve carbon credit projects</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">3</h3>
            <p className="text-gray-600">Pending Review</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">47</h3>
            <p className="text-gray-600">Approved</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">5</h3>
            <p className="text-gray-600">Rejected</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">55</h3>
            <p className="text-gray-600">Total Projects</p>
          </div>
        </div>

        {/* Review Windows Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Review Dashboard</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <ReviewWindow
              title="Documents"
              data={pendingProjects}
              onReview={handleReviewProject}
              onBulkAction={handleBulkVerifyDocuments}
              bulkActionText="Verify All"
            />
            <ReviewWindow
              title="Satellite Image"
              data={pendingProjects}
              onReview={handleReviewProject}
              onBulkAction={handleBulkApproveCertifications}
              bulkActionText="Approve All"
            />
            <ReviewWindow
              title="Drone Verification"
              data={pendingProjects}
              onReview={handleReviewProject}
              onBulkAction={handleBulkProcessRequests}
              bulkActionText="Process All"
            />
            <ReviewWindow
              title="NGO Reports"
              data={pendingProjects}
              onReview={handleReviewProject}
              onBulkAction={handleBulkVerifyRequests}
              bulkActionText="Verify All"
            />
          </div>
        </div>

        {/* Pending Projects Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Pending Projects</h2>
            <p className="text-gray-600 mt-1">Projects awaiting verification and approval</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Project</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Developer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Expected Credits</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{project.name}</div>
                          <div className="text-sm text-gray-500">{project.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{project.developer}</td>
                    <td className="px-6 py-4 text-gray-700">{project.location}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        {project.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{project.submittedDate}</td>
                    <td className="px-6 py-4 text-gray-700">{project.expectedCredits.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Modal */}
        {selectedProject && (
          <ReviewModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </div>
  );
};