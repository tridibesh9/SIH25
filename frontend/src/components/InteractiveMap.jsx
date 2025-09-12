import React, { useEffect } from 'react';
// import { MapContainer, TileLayer, FeatureGroup, GeoJSON, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-draw/dist/leaflet.draw.css';

// Fix for default markers in react-leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// Drawing Control Component
const DrawControl = ({ onTerritoryDraw }) => {
  // Uncomment when leaflet is installed
  /*
  const map = useMap();
  
  useEffect(() => {
    // Create a feature group to store drawn layers
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Initialize draw control
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        remove: true
      },
      draw: {
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false,
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e100',
            message: '<strong>Error:</strong> Shape edges cannot cross!'
          },
          shapeOptions: {
            color: '#2563eb',
            weight: 3,
            fillOpacity: 0.2
          }
        }
      }
    });

    map.addControl(drawControl);

    // Handle draw events
    map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      const geojson = layer.toGeoJSON();
      
      // Clear previous drawings
      drawnItems.clearLayers();
      
      // Add new layer
      drawnItems.addLayer(layer);
      
      // Callback with geojson data
      onTerritoryDraw(geojson);
    });

    map.on(L.Draw.Event.EDITED, (event) => {
      const layers = event.layers;
      layers.eachLayer((layer) => {
        const geojson = layer.toGeoJSON();
        onTerritoryDraw(geojson);
      });
    });

    map.on(L.Draw.Event.DELETED, () => {
      onTerritoryDraw(null);
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onTerritoryDraw]);
  */

  return null;
};

// Territory Display Component
const TerritoryDisplay = ({ geojsonData }) => {
  // Uncomment when leaflet is installed
  /*
  if (!geojsonData) return null;

  const style = {
    color: '#2563eb',
    weight: 3,
    fillOpacity: 0.2,
    fillColor: '#3b82f6'
  };

  return <GeoJSON data={geojsonData} style={style} />;
  */
  
  return null;
};

// Main Interactive Map Component
export const InteractiveMap = ({ geojsonData, onTerritoryDraw, center = [22.33, 87.32], zoom = 13 }) => {
  // Placeholder component - replace with actual map when leaflet is installed
  return (
    <div className="w-full h-full bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
      {/* Background pattern to simulate map */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-6 w-full h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-gray-400"></div>
          ))}
        </div>
      </div>
      
      <div className="relative z-10 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg 
            className="w-8 h-8 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map</h3>
        <p className="text-gray-500 text-center max-w-xs">
          Install leaflet packages to enable:
          <br />
          <code className="text-xs bg-gray-200 px-1 rounded">npm install leaflet react-leaflet leaflet-draw</code>
        </p>
        
        {geojsonData && (
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-green-700">Territory Captured!</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              {geojsonData.geometry?.coordinates?.[0]?.length || 0} boundary points
            </p>
          </div>
        )}
      </div>

      {/* Simulate drawing tools */}
      <div className="absolute top-4 left-4 bg-white rounded shadow-lg p-2">
        <div className="flex flex-col space-y-2">
          <button 
            className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center hover:bg-blue-200"
            title="Polygon Tool"
            onClick={() => {
              // Simulate drawing a polygon
              const sampleGeojson = {
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [[
                    [87.31, 22.34],
                    [87.33, 22.34],
                    [87.33, 22.32],
                    [87.31, 22.32],
                    [87.31, 22.34]
                  ]]
                },
                properties: {
                  name: "Sample Territory"
                }
              };
              onTerritoryDraw(sampleGeojson);
            }}
          >
            ⬟
          </button>
          <button 
            className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200"
            title="Edit Tool"
          >
            ✏️
          </button>
          <button 
            className="w-8 h-8 bg-red-100 rounded flex items-center justify-center hover:bg-red-200"
            title="Delete Tool"
            onClick={() => onTerritoryDraw(null)}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );

  // Uncomment when leaflet packages are installed:
  /*
  return (
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
      <FeatureGroup>
        <DrawControl onTerritoryDraw={onTerritoryDraw} />
        <TerritoryDisplay geojsonData={geojsonData} />
      </FeatureGroup>
    </MapContainer>
  );
  */
};

export default InteractiveMap;