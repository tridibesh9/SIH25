import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
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
        
        // If we have at least 3 points, we can form a polygon
        if (newPoints.length >= 3) {
          // Auto-close the polygon after 3+ points
          const closedPoints = [...newPoints, newPoints[0]];
          const geojson = {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [closedPoints]
            },
            properties: {
              name: "Project Territory"
            }
          };
          onTerritoryDraw(geojson);
          setIsDrawing(false);
          setPoints([]);
        }
      }
    }
  });
  
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

  const clearTerritory = () => {
    onTerritoryDraw(null);
    setPoints([]);
    setIsDrawing(false);
  };

  // Extract polygon coordinates from geojson
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
        
        {/* Display existing territory */}
        {polygonPositions && (
          <Polygon 
            positions={polygonPositions}
            pathOptions={{
              color: '#2563eb',
              weight: 3,
              fillOpacity: 0.2,
              fillColor: '#3b82f6'
            }}
          />
        )}
        
        {/* Display current drawing points */}
        {points.length > 0 && (
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
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex flex-col space-y-2">
          <button
            onClick={startDrawing}
            disabled={isDrawing}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isDrawing
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            title="Start drawing territory (click 3+ points)"
          >
            {isDrawing ? 'Drawing...' : 'Draw Territory'}
          </button>
          
          {isDrawing && (
            <button
              onClick={stopDrawing}
              className="px-3 py-2 text-sm font-medium bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Cancel drawing"
            >
              Cancel
            </button>
          )}
          
          {geojsonData && (
            <button
              onClick={clearTerritory}
              className="px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              title="Clear territory"
            >
              Clear
            </button>
          )}
        </div>
        
        {/* Instructions */}
        {isDrawing && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700 max-w-48">
            Click on the map to add boundary points. Need at least 3 points to create territory.
            <br />
            <strong>Points: {points.length}</strong>
          </div>
        )}
        
        {geojsonData && (
          <div className="mt-3 p-2 bg-green-50 rounded text-xs text-green-700">
            <strong>Territory Created!</strong>
            <br />
            {geojsonData.geometry?.coordinates?.[0]?.length - 1} boundary points
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleMap;