import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MonitoringMap.css';
import { Filter, Eye, MapPin, Activity, BarChart3, RefreshCw, ZoomIn, Layers } from 'lucide-react';
import { dummyProjects, statusColors, statusDisplayNames, typeColors } from '../data/dummyProjects';

// Fix for default markers in react-leaflet
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Fix for default markers in react-leaflet
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Custom marker icons based on project status
const createCustomIcon = (status, isSelected = false) => {
  const color = statusColors[status] || statusColors.pending;
  const size = isSelected ? 32 : 24;
  const innerSize = isSelected ? 12 : 8;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        background-color: ${color}; 
        border: 3px solid white; 
        border-radius: 50%; 
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: all 0.3s ease;
        cursor: pointer;
      ">
        <div style="
          width: ${innerSize}px;
          height: ${innerSize}px;
          background-color: white;
          border-radius: 50%;
        "></div>
        ${isSelected ? '<div style="position: absolute; top: -8px; right: -8px; width: 16px; height: 16px; background-color: #3b82f6; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-size: 10px; font-weight: bold;">!</span></div>' : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

// Zoom level tracker component
const ZoomTracker = ({ onZoomChange, showTerritories, onToggleTerritories }) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const handleZoom = () => {
      const currentZoom = map.getZoom();
      setZoom(currentZoom);
      onZoomChange(currentZoom);
    };

    map.on('zoomend', handleZoom);
    return () => map.off('zoomend', handleZoom);
  }, [map, onZoomChange]);

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border z-[1000] p-3">
      <div className="flex items-center space-x-3">
        <div className="text-xs text-gray-600">
          Zoom: <span className="font-semibold">{zoom.toFixed(1)}</span>
        </div>
        <button
          onClick={onToggleTerritories}
          className={`flex items-center px-3 py-1 text-xs rounded transition-colors ${
            showTerritories 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Layers className="w-3 h-3 mr-1" />
          Territories
        </button>
      </div>
    </div>
  );
};

// Component to handle India map bounds
const IndianMapBounds = () => {
  const map = useMap();
  
  useEffect(() => {
    // Set view to center of India
    map.setView([20.5937, 78.9629], 5);
  }, [map]);

  return null;
};

// Status badge component
const StatusBadge = ({ status, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm';
  const statusText = statusDisplayNames[status] || 'Unknown';
  const color = statusColors[status] || '#6b7280';
  
  return (
    <span 
      className={`${sizeClasses} font-medium rounded-full capitalize border-2 border-white shadow-sm text-white`}
      style={{ backgroundColor: color }}
    >
      {statusText}
    </span>
  );
};

// Legend component
const MapLegend = ({ isVisible, onToggle, projectCounts = {} }) => {
  const legendItems = [
    { status: 'pending', label: 'Pending Review' },
    { status: 'landApproval', label: 'Land Approval' },
    { status: 'ngoAssigned', label: 'NGO Assigned' },
    { status: 'droneAssigned', label: 'Drone Survey' },
    { status: 'adminApproval', label: 'Final Review' },
    { status: 'approved', label: 'Approved' },
    { status: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className={`absolute bottom-4 left-4 bg-white rounded-lg shadow-xl border z-[1000] transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
          Project Status Legend
        </h3>
        <div className="space-y-2">
          {legendItems.map(({ status, label }) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: statusColors[status] }}
                />
                <span className="text-xs text-gray-700">{label}</span>
              </div>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                {projectCounts[status] || 0}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="font-medium">Total Projects:</span>
            <span className="font-bold text-blue-600">
              {Object.values(projectCounts).reduce((sum, count) => sum + count, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter panel component
const FilterPanel = ({ filters, onFilterChange, projectCounts = {}, isVisible }) => {
  const statusOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'landApproval', label: 'Land Approval' },
    { value: 'ngoAssigned', label: 'NGO Assigned' },
    { value: 'droneAssigned', label: 'Drone Survey' },
    { value: 'adminApproval', label: 'Final Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className={`absolute top-4 left-4 bg-white rounded-lg shadow-lg border z-[1000] transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
      <div className="p-4 min-w-[280px]">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <Filter className="w-4 h-4 mr-2 text-blue-600" />
          Filter Projects
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} {projectCounts[option.value] ? `(${projectCounts[option.value]})` : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Project name or location..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main MonitoringMap component
export const MonitoringMap = ({ 
  projects = [], 
  onProjectClick, 
  onRefresh,
  className = "",
  height = "600px" 
}) => {
  const [filters, setFilters] = useState({ status: 'all', search: '' });
  const [showLegend, setShowLegend] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showTerritory, setShowTerritory] = useState(false);

  // Use dummy projects if no projects provided
  const actualProjects = projects.length > 0 ? projects : dummyProjects;

  // Calculate project counts by status
  const projectCounts = React.useMemo(() => {
    const counts = { all: actualProjects.length };
    actualProjects.forEach(project => {
      const status = project.verificationStatus || project.status || 'pending';
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [actualProjects]);

  // Filter projects based on current filters
  const filteredProjects = React.useMemo(() => {
    return actualProjects.filter(project => {
      const status = project.verificationStatus || project.status || 'pending';
      const matchesStatus = filters.status === 'all' || status === filters.status;
      const matchesSearch = !filters.search || 
        project.projectName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.location?.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.owner?.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [actualProjects, filters]);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    if (onRefresh) {
      await onRefresh();
    }
    setIsLoading(false);
  }, [onRefresh]);

  // Default Indian coordinates for projects without coordinates
  const getProjectCoordinates = (project) => {
    if (project.coordinates?.lat && project.coordinates?.lng) {
      return [project.coordinates.lat, project.coordinates.lng];
    }
    
    // You can add location-based coordinate mapping here
    // For now, return random coordinates within India bounds
    const lat = 8.5 + Math.random() * 29; // India latitude range approximately
    const lng = 68.5 + Math.random() * 29; // India longitude range approximately
    return [lat, lng];
  };

  return (
    <div className={`relative bg-white rounded-lg shadow-lg border overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-semibold">Project Monitoring Map</h2>
              <div className="flex items-center space-x-4">
                <p className="text-blue-100 text-sm">
                  Showing {filteredProjects.length} of {actualProjects.length} projects
                </p>
                {showTerritory && selectedProject && (
                  <p className="text-green-200 text-sm font-medium">
                    🗺️ Territory: {selectedProject.projectName}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}
              title="Toggle Filters"
            >
              <Filter className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowLegend(!showLegend)}
              className={`p-2 rounded-lg transition-colors ${showLegend ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'}`}
              title="Toggle Legend"
            >
              <Eye className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => {
                setShowTerritory(false);
                setSelectedProject(null);
              }}
              className={`p-2 rounded-lg transition-colors ${showTerritory ? 'bg-green-500' : 'bg-gray-600 hover:bg-gray-500'}`}
              title="Clear Territory"
              disabled={!showTerritory}
            >
              <Layers className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors bg-blue-600 hover:bg-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            
            <div className="bg-blue-500 px-3 py-1 rounded-full flex items-center space-x-1">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">{filteredProjects.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ height }} className="relative">
        <MapContainer
          center={[20.5937, 78.9629]} // Center of India
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Fit bounds to show all projects */}
          <IndianMapBounds projects={filteredProjects} />
          
          {/* Project markers */}
          {filteredProjects.map((project) => {
            const coordinates = getProjectCoordinates(project);
            const status = project.verificationStatus || project.status || 'pending';
            const isSelected = selectedProject?.id === project.id;
            
            return (
              <Marker
                key={project.projectId || project._id || project.id}
                position={coordinates}
                icon={createCustomIcon(status, isSelected)}
                eventHandlers={{
                  click: () => {
                    setSelectedProject(project);
                    setShowTerritory(true);
                  }
                }}
              >
                <Popup className="custom-popup" closeButton={true}>
                  <div className="p-2 min-w-[250px]">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">
                        {project.projectName}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">{project.location}</p>
                      <StatusBadge status={status} />
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Owner:</span>
                        <span className="font-medium text-gray-800">{project.owner}</span>
                      </div>
                      
                      {project.email && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contact:</span>
                          <span className="font-medium text-gray-800">{project.email}</span>
                        </div>
                      )}
                      
                      {project.carbonCredits && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Credits:</span>
                          <span className="font-medium text-green-600">{project.carbonCredits}</span>
                        </div>
                      )}
                      
                      {project.type && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium text-gray-800 capitalize">{project.type}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 mt-3">
                      {project.territory && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                            setShowTerritory(!showTerritory || selectedProject?.id !== project.id);
                          }}
                          className={`w-full px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center space-x-1 ${
                            showTerritory && selectedProject?.id === project.id
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <MapPin className="w-3 h-3" />
                          <span>
                            {showTerritory && selectedProject?.id === project.id ? 'Hide' : 'Show'} Territory
                          </span>
                        </button>
                      )}
                      
                      {onProjectClick && (
                        <button
                          onClick={() => onProjectClick(project)}
                          className="w-full bg-blue-600 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Details</span>
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          
          {/* Territory Polygons */}
          {showTerritory && selectedProject?.territory && (
            <Polygon
              positions={selectedProject.territory.geometry.coordinates[0].map(coord => [coord[1], coord[0]])}
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.2,
                weight: 3,
                opacity: 0.8
              }}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-sm">{selectedProject.territory.properties.name || selectedProject.projectName + ' Territory'}</h4>
                  <p className="text-xs text-gray-600 mt-1">Project: {selectedProject.projectName}</p>
                  <p className="text-xs text-gray-600">Area: {selectedProject.area || 'N/A'}</p>
                </div>
              </Popup>
            </Polygon>
          )}
        </MapContainer>

        {/* Overlays */}
        <FilterPanel 
          filters={filters}
          onFilterChange={setFilters}
          projectCounts={projectCounts}
          isVisible={showFilters}
        />
        
        <MapLegend 
          isVisible={showLegend}
          onToggle={() => setShowLegend(!showLegend)}
          projectCounts={projectCounts}
        />

        {/* Custom zoom controls */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border z-[1000]">
          <div className="flex flex-col">
            <button 
              onClick={() => {
                const map = window.mapInstance;
                if (map) map.zoomIn();
              }}
              className="p-2 hover:bg-gray-50 transition-colors border-b text-gray-700"
              title="Zoom In"
            >
              <span className="text-lg font-bold">+</span>
            </button>
            <button 
              onClick={() => {
                const map = window.mapInstance;
                if (map) map.zoomOut();
              }}
              className="p-2 hover:bg-gray-50 transition-colors text-gray-700"
              title="Zoom Out"
            >
              <span className="text-lg font-bold">−</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-gray-50 px-4 py-2 border-t">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            {filters.status !== 'all' && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Filter: {filters.status}
              </span>
            )}
            {filters.search && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Search: "{filters.search}"
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringMap;