import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, Clock, MapPin, FileText, Calendar, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import ReviewWindow from '../components/ReviewWindow';
import ScoreBadge from '../components/ScoreBadge';

export const AdminDashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMonitoringProject, setSelectedMonitoringProject] = useState('reforestation-costa-rica');

  // Demo data for monitoring dashboard
  const monitoringProjects = [
    {
      id: 'reforestation-costa-rica',
      name: 'Costa Rica Reforestation',
      location: 'San José, Costa Rica',
      type: 'Reforestation',
      status: 'Active',
      totalCredits: 48500,
      currentYear: 15200,
      fluctuation: '+12.5%',
      risk: 'Low',
      lastUpdate: '2025-09-10',
      image: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=400',
      yearlyData: [
        { year: '2020', credits: 8500 },
        { year: '2021', credits: 12200 },
        { year: '2022', credits: 15800 },
        { year: '2023', credits: 18900 },
        { year: '2024', credits: 22100 },
        { year: '2025', credits: 15200 }
      ]
    },
    {
      id: 'solar-philippines',
      name: 'Solar Energy Farm Philippines',
      location: 'Luzon, Philippines',
      type: 'Renewable Energy',
      status: 'Active',
      totalCredits: 62300,
      currentYear: 18700,
      fluctuation: '-8.2%',
      risk: 'Medium',
      lastUpdate: '2025-09-08',
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400',
      yearlyData: [
        { year: '2020', credits: 14200 },
        { year: '2021', credits: 16800 },
        { year: '2022', credits: 19500 },
        { year: '2023', credits: 20400 },
        { year: '2024', credits: 20400 },
        { year: '2025', credits: 18700 }
      ]
    },
    {
      id: 'mangrove-indonesia',
      name: 'Mangrove Restoration Indonesia',
      location: 'Java, Indonesia',
      type: 'Conservation',
      status: 'Monitoring',
      totalCredits: 34800,
      currentYear: 9200,
      fluctuation: '+25.8%',
      risk: 'High',
      lastUpdate: '2025-09-05',
      image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=400',
      yearlyData: [
        { year: '2020', credits: 4500 },
        { year: '2021', credits: 6200 },
        { year: '2022', credits: 8100 },
        { year: '2023', credits: 7300 },
        { year: '2024', credits: 7300 },
        { year: '2025', credits: 9200 }
      ]
    },
    {
      id: 'wind-energy-brazil',
      name: 'Wind Energy Brazil',
      location: 'Bahia, Brazil',
      type: 'Renewable Energy',
      status: 'Active',
      totalCredits: 41200,
      currentYear: 13800,
      fluctuation: '+4.7%',
      risk: 'Low',
      lastUpdate: '2025-09-11',
      image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=400',
      yearlyData: [
        { year: '2020', credits: 9200 },
        { year: '2021', credits: 11500 },
        { year: '2022', credits: 13200 },
        { year: '2023', credits: 13200 },
        { year: '2024', credits: 13200 },
        { year: '2025', credits: 13800 }
      ]
    }
  ];

  const currentProject = monitoringProjects.find(p => p.id === selectedMonitoringProject);

  const pendingProjects = [
    {
      id: 'PROJ-001',
      name: 'Costa Rica Reforestation Initiative',
      developer: 'GreenWorld Foundation',
      location: 'San José, Costa Rica',
      type: 'Reforestation',
      submittedDate: '2024-01-15',
      expectedCredits: 15000,
      cumulativeScore: 82,
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
      cumulativeScore: 67,
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
      cumulativeScore: 43,
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

        {/* Monitoring Dashboard */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Project Monitoring Dashboard</h2>
            <p className="text-gray-600">Monitor carbon credit fluctuations and project performance</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graph Section */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{currentProject?.name}</h3>
                  <p className="text-gray-600 text-sm">{currentProject?.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Carbon Credits Over Time</span>
                </div>
              </div>

              {/* Simple Bar Chart */}
              <div className="space-y-4">
                <div className="flex items-end justify-between h-64 border-b border-gray-200 pb-2">
                  {currentProject?.yearlyData.map((data, index) => {
                    const maxCredits = Math.max(...currentProject.yearlyData.map(d => d.credits));
                    const height = (data.credits / maxCredits) * 240;
                    const isCurrentYear = data.year === '2025';
                    
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="relative flex items-end h-60 w-full justify-center">
                          <div
                            className={`w-12 rounded-t-lg transition-all duration-300 ${
                              isCurrentYear ? 'bg-green-500' : 'bg-blue-500'
                            } hover:opacity-80`}
                            style={{ height: `${height}px` }}
                            title={`${data.year}: ${data.credits.toLocaleString()} credits`}
                          />
                        </div>
                        <div className="mt-2 text-sm text-gray-600 font-medium">{data.year}</div>
                        <div className="text-xs text-gray-500">{data.credits.toLocaleString()}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Chart Legend and Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{currentProject?.totalCredits.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Credits</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{currentProject?.currentYear.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">2025 Credits</div>
                  </div>
                  <div className={`p-4 rounded-xl ${
                    currentProject?.fluctuation.startsWith('+') ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <div className={`text-2xl font-bold ${
                      currentProject?.fluctuation.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {currentProject?.fluctuation}
                    </div>
                    <div className="text-sm text-gray-600">YoY Change</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Projects Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monitored Projects</h3>
                <div className="space-y-3">
                  {monitoringProjects.map((project) => {
                    const isSelected = project.id === selectedMonitoringProject;
                    const isFluctuating = Math.abs(parseFloat(project.fluctuation.replace('%', ''))) > 10;
                    
                    return (
                      <div
                        key={project.id}
                        onClick={() => setSelectedMonitoringProject(project.id)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-gray-50 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-800 text-sm truncate">
                                {project.name}
                              </h4>
                              {isFluctuating && (
                                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">{project.location}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                project.risk === 'Low' ? 'bg-green-100 text-green-700' :
                                project.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {project.risk} Risk
                              </span>
                              <span className={`text-xs font-medium ${
                                project.fluctuation.startsWith('+') ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {project.fluctuation}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Generate Report
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-xl font-medium hover:bg-yellow-700 transition-colors">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Flag for Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Monitor Dashboard */}
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Cumulative Score</th>
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
                      <ScoreBadge score={project.cumulativeScore} />
                    </td>
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