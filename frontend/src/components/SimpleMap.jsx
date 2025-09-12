import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from 'react-leaflet';
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

// Click handler component for drawing polygons
const ClickHandler = ({ onTerritoryDraw, isDrawing, setIsDrawing, points, setPoints }) => {
  useMapEvents({
    click: (e) => {
      if (isDrawing) {
        const newPoint = [e.latlng.lat, e.latlng.lng];
        const newPoints = [...points, newPoint];
        setPoints(newPoints);
      }
    }
  });
  
  return null;
};

// Component to handle completing the polygon
const PolygonCompleter = ({ points, onTerritoryDraw, setIsDrawing, setPoints }) => {
  const completePolygon = () => {
    if (points.length >= 3) {
      // Close the polygon by adding the first point at the end
      const closedPoints = [...points, points[0]];
      const geojson = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [closedPoints.map(point => [point[1], point[0]])] // Note: GeoJSON uses [lng, lat]
        },
        properties: {
          name: "Project Territory"
        }
      };
      onTerritoryDraw(geojson);
      setIsDrawing(false);
      setPoints([]);
    }
  };

  // Auto-complete when we have 4 or more points
  React.useEffect(() => {
    if (points.length >= 4) {
      completePolygon();
    }
  }, [points]);

  return null;
};

// Main Simple Map Component
export const SimpleMap = ({ geojsonData, onTerritoryDraw, center = [22.33, 87.32], zoom = 13 }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);

  const startDrawing = () => {
    setIsDrawing(true);
    setPoints([]);
    onTerritoryDraw(null); // Clear existing territory
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setPoints([]);
  };

  const completePolygon = () => {
    if (points.length >= 3) {
      const closedPoints = [...points, points[0]];
      const geojson = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [closedPoints.map(point => [point[1], point[0]])] // [lng, lat] for GeoJSON
        },
        properties: {
          name: "Project Territory"
        }
      };
      onTerritoryDraw(geojson);
      setIsDrawing(false);
      setPoints([]);
    }
  };

  const clearTerritory = () => {
    onTerritoryDraw(null);
    setPoints([]);
    setIsDrawing(false);
  };

  // Extract polygon coordinates from geojson (convert from [lng, lat] to [lat, lng] for Leaflet)
  const polygonPositions = geojsonData?.geometry?.coordinates?.[0]?.map(coord => [coord[1], coord[0]]);

  return (
    <div className="relative w-full h-full">
      {/* Map */}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg overflow-hidden"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Click handler for drawing */}
        <ClickHandler 
          onTerritoryDraw={onTerritoryDraw}
          isDrawing={isDrawing}
          setIsDrawing={setIsDrawing}
          points={points}
          setPoints={setPoints}
        />
        
        {/* Polygon completer */}
        <PolygonCompleter
          points={points}
          onTerritoryDraw={onTerritoryDraw}
          setIsDrawing={setIsDrawing}
          setPoints={setPoints}
        />
        
        {/* Display existing territory */}
        {polygonPositions && polygonPositions.length > 0 && (
          <Polygon 
            positions={polygonPositions}
            pathOptions={{
              color: '#059669',
              weight: 3,
              fillOpacity: 0.3,
              fillColor: '#10b981'
            }}
          />
        )}
        
        {/* Display markers for current drawing points */}
        {points.map((point, index) => (
          <Marker 
            key={index} 
            position={point}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `<div style="
                width: 12px; 
                height: 12px; 
                background-color: #ef4444; 
                border: 2px solid white; 
                border-radius: 50%; 
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              "></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            })}
          />
        ))}
        
        {/* Display current drawing polygon preview */}
        {points.length >= 3 && isDrawing && (
          <Polygon 
            positions={points}
            pathOptions={{
              color: '#ef4444',
              weight: 2,
              fillOpacity: 0.1,
              fillColor: '#ef4444',
              dashArray: '5, 5'
            }}
          />
        )}
      </MapContainer>

      {/* Drawing Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000] min-w-[200px]">
        <div className="flex flex-col space-y-3">
          <h3 className="text-sm font-semibold text-gray-800 border-b pb-2">Territory Tools</h3>
          
          {!isDrawing && !geojsonData && (
            <button
              onClick={startDrawing}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Start drawing territory boundaries"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Draw Territory
            </button>
          )}
          
          {isDrawing && (
            <>
              <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                <strong>Drawing Mode Active</strong>
                <br />
                Click on the map to add boundary points
                <br />
                Points added: <span className="font-semibold">{points.length}</span>
                {points.length >= 3 && (
                  <span className="text-green-600">
                    <br />Ready to complete!
                  </span>
                )}
              </div>
              
              {points.length >= 3 && (
                <button
                  onClick={completePolygon}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Complete the territory polygon"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete Territory
                </button>
              )}
              
              <button
                onClick={stopDrawing}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title="Cancel drawing"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </>
          )}
          
          {geojsonData && (
            <>
              <div className="text-xs text-green-700 bg-green-50 p-2 rounded">
                <strong>Territory Created!</strong>
                <br />
                Boundary points: {geojsonData.geometry?.coordinates?.[0]?.length - 1}
              </div>
              
              <button
                onClick={clearTerritory}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="Clear territory and start over"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Territory
              </button>
              
              <button
                onClick={startDrawing}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Draw new territory (will replace current)"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Redraw Territory
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;