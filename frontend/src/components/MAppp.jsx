import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Component to handle project territory hover details
const ProjectTerritory = ({ project, onProjectClick }) => {
  const [hovered, setHovered] = useState(false);
  
  // Check if project has location data that can be parsed as GeoJSON
  let territoryCoordinates = null;
  
  try {
    // Try to parse location as JSON (territory data)
    if (project.location && typeof project.location === 'string') {
      // First try to parse as JSON
      try {
        const locationData = JSON.parse(project.location);
        if (locationData.geometry && locationData.geometry.coordinates) {
          territoryCoordinates = locationData.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
        }
      } catch (jsonError) {
        // If JSON parsing fails, check if it's a simple location string
        // For demo purposes, create a mock territory around major Indian cities
        const locationStr = project.location.toLowerCase();
        const mockTerritories = {
          'mumbai': [[19.0760, 72.8777], [19.0760, 72.9777], [19.1760, 72.9777], [19.1760, 72.8777], [19.0760, 72.8777]],
          'delhi': [[28.6139, 77.2090], [28.6139, 77.3090], [28.7139, 77.3090], [28.7139, 77.2090], [28.6139, 77.2090]],
          'bangalore': [[12.9716, 77.5946], [12.9716, 77.6946], [13.0716, 77.6946], [13.0716, 77.5946], [12.9716, 77.5946]],
          'chennai': [[13.0827, 80.2707], [13.0827, 80.3707], [13.1827, 80.3707], [13.1827, 80.2707], [13.0827, 80.2707]],
          'kolkata': [[22.5726, 88.3639], [22.5726, 88.4639], [22.6726, 88.4639], [22.6726, 88.3639], [22.5726, 88.3639]],
          'hyderabad': [[17.3850, 78.4867], [17.3850, 78.5867], [17.4850, 78.5867], [17.4850, 78.4867], [17.3850, 78.4867]],
          'pune': [[18.5204, 73.8567], [18.5204, 73.9567], [18.6204, 73.9567], [18.6204, 73.8567], [18.5204, 73.8567]],
          'ahmedabad': [[23.0225, 72.5714], [23.0225, 72.6714], [23.1225, 72.6714], [23.1225, 72.5714], [23.0225, 72.5714]],
          'surat': [[21.1702, 72.8311], [21.1702, 72.9311], [21.2702, 72.9311], [21.2702, 72.8311], [21.1702, 72.8311]],
          'jaipur': [[26.9124, 75.7873], [26.9124, 75.8873], [27.0124, 75.8873], [27.0124, 75.7873], [26.9124, 75.7873]],
          'lucknow': [[26.8467, 80.9462], [26.8467, 81.0462], [26.9467, 81.0462], [26.9467, 80.9462], [26.8467, 80.9462]],
          'kanpur': [[26.4499, 80.3319], [26.4499, 80.4319], [26.5499, 80.4319], [26.5499, 80.3319], [26.4499, 80.3319]],
          'nagpur': [[21.1458, 79.0882], [21.1458, 79.1882], [21.2458, 79.1882], [21.2458, 79.0882], [21.1458, 79.0882]],
          'indore': [[22.7196, 75.8577], [22.7196, 75.9577], [22.8196, 75.9577], [22.8196, 75.8577], [22.7196, 75.8577]],
          'thane': [[19.2183, 72.9781], [19.2183, 73.0781], [19.3183, 73.0781], [19.3183, 72.9781], [19.2183, 72.9781]],
          'bhopal': [[23.2599, 77.4126], [23.2599, 77.5126], [23.3599, 77.5126], [23.3599, 77.4126], [23.2599, 77.4126]],
          'visakhapatnam': [[17.6868, 83.2185], [17.6868, 83.3185], [17.7868, 83.3185], [17.7868, 83.2185], [17.6868, 83.2185]],
          'pimpri': [[18.6298, 73.7997], [18.6298, 73.8997], [18.7298, 73.8997], [18.7298, 73.7997], [18.6298, 73.7997]],
          'patna': [[25.5941, 85.1376], [25.5941, 85.2376], [25.6941, 85.2376], [25.6941, 85.1376], [25.5941, 85.1376]],
          'vadodara': [[22.3072, 73.1812], [22.3072, 73.2812], [22.4072, 73.2812], [22.4072, 73.1812], [22.3072, 73.1812]],
          'ghaziabad': [[28.6692, 77.4538], [28.6692, 77.5538], [28.7692, 77.5538], [28.7692, 77.4538], [28.6692, 77.4538]],
          'ludhiana': [[30.9010, 75.8573], [30.9010, 75.9573], [31.0010, 75.9573], [31.0010, 75.8573], [30.9010, 75.8573]],
          'agra': [[27.1767, 78.0081], [27.1767, 78.1081], [27.2767, 78.1081], [27.2767, 78.0081], [27.1767, 78.0081]],
          'nashik': [[19.9975, 73.7898], [19.9975, 73.8898], [20.0975, 73.8898], [20.0975, 73.7898], [19.9975, 73.7898]],
          'faridabad': [[28.4089, 77.3178], [28.4089, 77.4178], [28.5089, 77.4178], [28.5089, 77.3178], [28.4089, 77.3178]],
          'meerut': [[28.9845, 77.7064], [28.9845, 77.8064], [29.0845, 77.8064], [29.0845, 77.7064], [28.9845, 77.7064]],
          'rajkot': [[22.3039, 70.8022], [22.3039, 70.9022], [22.4039, 70.9022], [22.4039, 70.8022], [22.3039, 70.8022]],
          'kalyan': [[19.2437, 73.1355], [19.2437, 73.2355], [19.3437, 73.2355], [19.3437, 73.1355], [19.2437, 73.1355]],
          'vasai': [[19.4040, 72.8022], [19.4040, 72.9022], [19.5040, 72.9022], [19.5040, 72.8022], [19.4040, 72.8022]],
          'varanasi': [[25.3176, 82.9739], [25.3176, 83.0739], [25.4176, 83.0739], [25.4176, 82.9739], [25.3176, 82.9739]],
          'srinagar': [[34.0837, 74.7973], [34.0837, 74.8973], [34.1837, 74.8973], [34.1837, 74.7973], [34.0837, 74.7973]],
          'dhanbad': [[23.7957, 86.4304], [23.7957, 86.5304], [23.8957, 86.5304], [23.8957, 86.4304], [23.7957, 86.4304]],
          'sunderbans': [[22.33, 87.32], [22.43, 87.42], [22.53, 87.52], [22.63, 87.62], [22.33, 87.32]] // Default Sunderbans territory
        };
        
        // Check if location matches any known territory
        for (const [city, coords] of Object.entries(mockTerritories)) {
          if (locationStr.includes(city)) {
            territoryCoordinates = coords;
            break;
          }
        }
        
        // If no match found, use default Sunderbans territory
        if (!territoryCoordinates) {
          territoryCoordinates = mockTerritories.sunderbans;
        }
      }
    } else if (project.location && project.location.geometry) {
      // Already parsed territory data
      territoryCoordinates = project.location.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
    }
  } catch (error) {
    // If parsing fails, use default territory
    console.warn(`Could not parse territory data for project ${project.projectName}:`, error);
    territoryCoordinates = [[22.33, 87.32], [22.43, 87.42], [22.53, 87.52], [22.63, 87.62], [22.33, 87.32]];
  }

  if (!territoryCoordinates || territoryCoordinates.length < 3) {
    return null; // Don't render if no valid territory data
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981'; // green
      case 'rejected': return '#ef4444'; // red
      case 'pending': return '#f59e0b'; // amber
      case 'land approval': return '#3b82f6'; // blue
      case 'ngo': return '#8b5cf6'; // purple
      case 'drones': return '#06b6d4'; // cyan
      case 'admin approval pending': return '#f97316'; // orange
      default: return '#6b7280'; // gray
    }
  };

  const statusColor = getStatusColor(project.verificationStatus);

  return (
    <Polygon
      positions={territoryCoordinates}
      pathOptions={{
        color: statusColor,
        weight: hovered ? 4 : 2,
        fillOpacity: hovered ? 0.5 : 0.3,
        fillColor: statusColor,
        opacity: hovered ? 1 : 0.8
      }}
      eventHandlers={{
        click: () => onProjectClick && onProjectClick(project),
        mouseover: () => setHovered(true),
        mouseout: () => setHovered(false)
      }}
    >
      <Popup className="custom-popup">
        <div className="p-2 max-w-xs">
          <div className="flex items-start space-x-3">
            {project.projectImages && project.projectImages[0] && (
              <img 
                src={project.projectImages[0]} 
                alt={project.projectName}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">
                {project.projectName}
              </h3>
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-medium">Owner:</span> {project.owner}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-medium">Type:</span> {project.type}
              </p>
              <div className="flex items-center space-x-1 mb-1">
                <span className="text-xs font-medium text-gray-600">Status:</span>
                <span 
                  className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                  style={{ backgroundColor: statusColor }}
                >
                  {project.verificationStatus || 'pending'}
                </span>
              </div>
              {project.carbonCredits > 0 && (
                <p className="text-xs text-green-600 font-medium">
                  Carbon Credits: {project.carbonCredits}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={() => onProjectClick && onProjectClick(project)}
            className="w-full mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </Popup>
    </Polygon>
  );
};

// Main Territorial Map Component
export const TerritorialMap = ({ 
  projects = [], 
  onProjectClick,
  height = '400px',
  showControls = true 
}) => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // India center coordinates for initial view
  const indiaCenter = [20.5937, 78.9629];
  const indiaZoom = 5;

  // Filter projects based on selected status
  const filteredProjects = selectedStatus === 'all' 
    ? projects 
    : projects.filter(p => p.verificationStatus === selectedStatus);

  // Get unique statuses for filter
  const statuses = [...new Set(projects.map(p => p.verificationStatus || 'pending'))];

  return (
    <div className="relative w-full territorial-map-container" style={{ height }}>
      {/* Map */}
      <MapContainer
        center={indiaCenter}
        zoom={indiaZoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg overflow-hidden"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render project territories */}
        {filteredProjects.map((project) => (
          <ProjectTerritory
            key={project.projectId}
            project={project}
            onProjectClick={onProjectClick}
          />
        ))}
      </MapContainer>

      {/* Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000] min-w-[200px]">
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 border-b pb-2">
              Project Filter
            </h3>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Projects ({projects.length})</option>
              {statuses.map(status => {
                const count = projects.filter(p => (p.verificationStatus || 'pending') === status).length;
                return (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                  </option>
                );
              })}
            </select>

            {/* Legend */}
            <div className="text-xs space-y-1">
              <h4 className="font-medium text-gray-700 mb-2">Status Legend</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Approved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Rejected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>Admin Review</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span>Drone Survey</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>NGO Review</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Land Approval</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span>Pending</span>
                </div>
              </div>
            </div>

            {/* Project count */}
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              Showing <span className="font-semibold">{filteredProjects.length}</span> of{' '}
              <span className="font-semibold">{projects.length}</span> projects
            </div>
          </div>
        </div>
      )}

      {/* Info overlay for empty state */}
      {projects.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 z-[999] rounded-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Projects Found</h3>
            <p className="text-gray-600">No projects with territorial data available to display.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerritorialMap;