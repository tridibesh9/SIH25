# Project Detail Territory Map Fix

## Overview
Fixed the `ProjectDetail.jsx` component to properly display the territory map for projects.

## Issues Fixed

### 1. **Missing Imports**
- Added `GeoJSON` component from `react-leaflet` for rendering territory boundaries
- Added `useMemo` hook (imported but can be used for optimization later)

### 2. **Undefined Variables**
- Fixed undefined `project` variable (should have been `projectMetadata`)
- Fixed undefined `bounds` variable
- Fixed missing `territoryData` state

### 3. **Territory Data Parsing**
- Added proper parsing logic for territory data stored in `projectMetadata.location`
- Handles both GeoJSON string format and object format
- Gracefully handles cases where location is just a text description

### 4. **Map Centering**
- Implemented automatic map centering based on territory coordinates
- Calculates bounding box from GeoJSON coordinates
- Falls back to default India center when no territory data is available

### 5. **Map Styling**
- Added proper styling for territory boundaries:
  - Blue border (`#3B82F6`) with 3px weight
  - Light blue fill (`#60A5FA`) with 30% opacity
  - 80% opacity for the border
- Enhanced map container with border and shadow for better visual presentation

## Changes Made

### State Management
```javascript
const [territoryData, setTerritoryData] = useState(null);
const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default India center
const [mapZoom, setMapZoom] = useState(5);
```

### Territory Data Processing
```javascript
useEffect(() => {
    // Parse territory data if it exists
    if (projectMetadata?.location) {
        try {
            const parsedLocation = typeof projectMetadata.location === 'string' 
                ? JSON.parse(projectMetadata.location) 
                : projectMetadata.location;
            
            if (parsedLocation.type === 'Feature' && parsedLocation.geometry) {
                setTerritoryData(parsedLocation);
                
                // Calculate center from GeoJSON bounds
                const coordinates = parsedLocation.geometry.coordinates[0];
                if (coordinates && coordinates.length > 0) {
                    const lngs = coordinates.map(coord => coord[0]);
                    const lats = coordinates.map(coord => coord[1]);
                    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
                    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
                    setMapCenter([centerLat, centerLng]);
                    setMapZoom(12);
                }
            }
        } catch (e) {
            console.log("Location is not GeoJSON, using default map view");
        }
    }
}, [projectMetadata]);
```

### Map Rendering
```javascript
<MapContainer
    center={mapCenter}
    zoom={mapZoom}
    style={{ height: '100%', width: '100%' }}
    className="rounded-xl"
>
    <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    
    {territoryData && (
        <GeoJSON 
            data={territoryData} 
            style={{
                color: '#3B82F6',
                weight: 3,
                opacity: 0.8,
                fillColor: '#60A5FA',
                fillOpacity: 0.3
            }}
        />
    )}
</MapContainer>
```

## Features

1. **Dynamic Territory Display**: Shows the exact project territory boundaries on the map
2. **Auto-Centering**: Map automatically centers and zooms to show the territory
3. **Fallback Handling**: Gracefully handles projects without territory data
4. **Visual Feedback**: Shows a message when territory data is not available
5. **Professional Styling**: Clean, blue-themed styling that matches the app's design

## Testing

To test the fix:
1. Navigate to a project detail page from the marketplace
2. The map should display the project's territory if available
3. The map should automatically center on the territory boundaries
4. If no territory data exists, a fallback message will be shown

## Notes

- The territory data should be stored in GeoJSON format in the `location` field
- The component handles both string (JSON) and object formats
- Default map position is centered on India when no territory data is available
