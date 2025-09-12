import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Import leaflet-draw
import 'leaflet-draw';

// Fix for default markers in react-leaflet
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Drawing Control Component
const DrawControl = ({ onTerritoryDraw }) => {
  const map = useMap();
  
  useEffect(() => {
    // Check if L.Control.Draw is available
    if (!L.Control.Draw) {
      console.error('Leaflet Draw is not loaded properly');
      return;
    }

    // Create a feature group to store drawn layers
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Initialize draw control
    const drawControl = new L.Control.Draw({
      position: 'topright',
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
    const handleCreated = (event) => {
      const layer = event.layer;
      const geojson = layer.toGeoJSON();
      
      // Clear previous drawings
      drawnItems.clearLayers();
      
      // Add new layer
      drawnItems.addLayer(layer);
      
      // Callback with geojson data
      onTerritoryDraw(geojson);
    };

    const handleEdited = (event) => {
      const layers = event.layers;
      layers.eachLayer((layer) => {
        const geojson = layer.toGeoJSON();
        onTerritoryDraw(geojson);
      });
    };

    const handleDeleted = () => {
      onTerritoryDraw(null);
    };

    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.EDITED, handleEdited);
    map.on(L.Draw.Event.DELETED, handleDeleted);

    return () => {
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.EDITED, handleEdited);
      map.off(L.Draw.Event.DELETED, handleDeleted);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onTerritoryDraw]);

  return null;
};

// Territory Display Component
const TerritoryDisplay = ({ geojsonData }) => {
  if (!geojsonData) return null;

  const style = {
    color: '#2563eb',
    weight: 3,
    fillOpacity: 0.2,
    fillColor: '#3b82f6'
  };

  return <GeoJSON data={geojsonData} style={style} />;
};

// Main Interactive Map Component
export const InteractiveMap = ({ geojsonData, onTerritoryDraw, center = [22.33, 87.32], zoom = 13 }) => {
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
};

export default InteractiveMap;