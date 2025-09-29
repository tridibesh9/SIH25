import React, { useState } from 'react';
import { MapPin, BarChart3, TrendingUp, Eye, Filter } from 'lucide-react';
import TerritorialMap from '../../../components/TerritorialMap';

// Monitoring Panel Component
export const MonitoringPanel = ({ 
  projects = [], 
  overview = {}, 
  onProjectClick,
  loading = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'stats'

  // Calculate additional statistics
  const totalProjects = projects.length;
  const approvedProjects = projects.filter(p => p.verificationStatus === 'approved').length;
  const rejectedProjects = projects.filter(p => p.verificationStatus === 'rejected').length;
  const pendingProjects = totalProjects - approvedProjects - rejectedProjects;
  
  const totalCarbonCredits = projects
    .filter(p => p.carbonCredits)
    .reduce((sum, p) => sum + (p.carbonCredits || 0), 0);

  // Project type distribution
  const typeDistribution = projects.reduce((acc, project) => {
    const type = project.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Status distribution for chart
  const statusStats = [
    { status: 'Approved', count: approvedProjects, color: '#10b981' },
    { status: 'Rejected', count: rejectedProjects, color: '#ef4444' },
    { status: 'Pending', count: pendingProjects, color: '#f59e0b' },
  ];

  const StatCard = ({ title, value, icon, colorClass, description }) => (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 p-4 ${colorClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Loading monitoring data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Project Monitoring</h2>
              <p className="text-sm text-gray-600">
                Real-time overview of all carbon credit projects across territories
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MapPin className="w-4 h-4 mr-1" />
                Map View
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'stats' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Statistics
              </button>
            </div>
            
            {/* Expand/Collapse */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <Eye className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-0' : 'rotate-180'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Total Projects" 
              value={totalProjects} 
              icon={<MapPin className="w-5 h-5" />} 
              colorClass="border-blue-500"
              description="Across all territories"
            />
            <StatCard 
              title="Carbon Credits" 
              value={totalCarbonCredits.toLocaleString()} 
              icon={<TrendingUp className="w-5 h-5" />} 
              colorClass="border-green-500"
              description="Total generated"
            />
            <StatCard 
              title="Approved Projects" 
              value={approvedProjects} 
              icon={<BarChart3 className="w-5 h-5" />} 
              colorClass="border-green-500"
              description={`${totalProjects > 0 ? Math.round((approvedProjects / totalProjects) * 100) : 0}% approval rate`}
            />
            <StatCard 
              title="Active Regions" 
              value={Object.keys(typeDistribution).length} 
              icon={<Filter className="w-5 h-5" />} 
              colorClass="border-purple-500"
              description="Different ecosystem types"
            />
          </div>

          {/* Main Content Area */}
          {viewMode === 'map' ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Territorial Overview</h3>
                <div className="text-sm text-gray-600">
                  Click on territories to view project details
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <TerritorialMap
                  projects={projects}
                  onProjectClick={onProjectClick}
                  height="500px"
                  showControls={true}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Distribution */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Status Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {statusStats.map((stat) => (
                    <div key={stat.status} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{stat.status}</span>
                        <span className="text-2xl font-bold" style={{ color: stat.color }}>
                          {stat.count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            backgroundColor: stat.color,
                            width: `${totalProjects > 0 ? (stat.count / totalProjects) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {totalProjects > 0 ? Math.round((stat.count / totalProjects) * 100) : 0}% of total
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project Type Distribution */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ecosystem Type Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(typeDistribution).map(([type, count]) => (
                    <div key={type} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="text-xl font-bold text-blue-600">{count}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0}% of projects
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Project Activity</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {projects
                      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                      .slice(0, 5)
                      .map((project) => (
                        <div key={project.projectId} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: project.verificationStatus === 'approved' ? '#10b981' :
                                                project.verificationStatus === 'rejected' ? '#ef4444' : '#f59e0b'
                              }}
                            ></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{project.projectName}</p>
                              <p className="text-xs text-gray-500">Owner: {project.owner}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 capitalize">{project.verificationStatus || 'pending'}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                  {projects.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No recent project activity</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonitoringPanel;