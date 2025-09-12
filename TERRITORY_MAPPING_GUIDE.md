# Territory Mapping Page - Installation & Setup Guide

## Overview

The Territory Mapping Page is a comprehensive React component that allows users to register environmental projects with interactive territory mapping capabilities. The page includes:

- Project information form with validation
- Document and image upload functionality
- Interactive map for drawing territory boundaries
- GeoJSON data capture and management
- Load existing territory feature
- Responsive design consistent with the application theme

## Installation Steps

### 1. Install Required Dependencies

Navigate to the frontend directory and install the mapping libraries:

```bash
cd frontend
npm install leaflet react-leaflet leaflet-draw
```

### 2. Update the InteractiveMap Component

After installing the packages, uncomment the actual map implementation in:
- `src/components/InteractiveMap.jsx`

Replace the placeholder return statement with the commented MapContainer implementation.

### 3. Route Configuration

The route has already been added to `App.jsx`:
```jsx
<Route path="/map-territory" element={<TerritoryMappingPage />} />
```

### 4. Navigation Links

Navigation links have been added to both desktop and mobile menus in `Navigation.jsx`.

## Features

### Form Fields
- Project Name (required)
- Contact Person (required)  
- Contact Email (required)
- Project Location (required)
- Project Type (dropdown)
- Expected Carbon Credits
- Project Duration
- Site Description

### File Upload
- **Documents**: PDF, DOC, DOCX, TXT files
- **Images**: All image formats with preview
- Drag & drop interface
- File size display
- Remove functionality

### Interactive Mapping
- **Drawing Tools**: Polygon drawing for territory boundaries
- **Edit Tools**: Modify existing boundaries
- **Delete Tools**: Remove drawn territories
- **GeoJSON Export**: Copy territory data to clipboard
- **Load Existing**: Import GeoJSON data from external sources

### Territory Management
- Real-time boundary capture
- Coordinate point counting
- GeoJSON format validation
- Visual feedback for captured territories

## Technical Implementation

### State Management
```jsx
const [formData, setFormData] = useState({...});
const [geojsonData, setGeojsonData] = useState(null);
const [documents, setDocuments] = useState([]);
const [images, setImages] = useState([]);
```

### Map Integration
The component uses Leaflet with React-Leaflet for mapping functionality:
- OpenStreetMap tiles for base layer
- Leaflet-draw for polygon drawing tools
- GeoJSON for territory data format

### File Handling
- Preview images with thumbnail grid
- File type validation
- Size formatting and display
- Memory cleanup for object URLs

## Styling & Theme Consistency

The page follows the application's design system:
- **Color Scheme**: Green primary (`green-600`, `green-800`) with blue accents
- **Layout**: Two-column responsive grid
- **Components**: Consistent with existing form elements
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React icon library

## API Integration Points

The component is prepared for backend integration:

```jsx
const submissionData = {
  ...formData,
  territoryData: geojsonData,
  documents: documents.map(doc => ({...})),
  images: images.map(img => ({...})),
  submissionTime: new Date().toISOString()
};
```

Replace the console.log with actual API calls to your backend.

## Map Configuration

Default map settings:
- **Center**: Kharagpur, West Bengal ([22.33, 87.32])
- **Zoom Level**: 13
- **Drawing**: Polygon tool only
- **Style**: Blue borders with transparent fill

## Browser Compatibility

Tested and compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- Images are converted to object URLs for preview
- Memory cleanup implemented for image previews
- File size validation and display
- Responsive image grid for mobile devices

## Security Features

- File type validation
- Email format validation
- Required field validation
- GeoJSON format validation

## Usage Instructions

1. Navigate to `/map-territory` route
2. Fill in required project information
3. Upload relevant documents and images
4. Use map tools to draw project territory:
   - Click polygon tool
   - Click on map to add boundary points
   - Double-click to complete polygon
5. Review captured territory data
6. Submit the form

## Future Enhancements

Potential improvements:
- Multiple territory support
- Area calculation
- Coordinate search
- Satellite imagery layers
- Export to various formats
- Integration with GPS coordinates
- Offline map support

## Troubleshooting

### Common Issues

1. **Map not loading**: Ensure leaflet packages are installed
2. **Drawing tools not working**: Check leaflet-draw CSS import
3. **Images not previewing**: Verify file type support
4. **Form not submitting**: Check required field validation
5. **L.Control.Draw is not a constructor**: Use SimpleMap component instead of InteractiveMap

### Map Component Options

The application includes two map components:

#### SimpleMap (Recommended)
- Click-based territory drawing
- Compatible with React 19
- No external draw dependencies
- Located: `src/components/SimpleMap.jsx`

#### InteractiveMap (Advanced)
- Full leaflet-draw integration
- Advanced editing tools
- May have compatibility issues with newer React versions
- Located: `src/components/InteractiveMap.jsx`

### Debug Mode

Enable console logging to see form submission data:
```jsx
console.log('Project Submission Data:', submissionData);
```

### React 19 Compatibility

If you encounter issues with leaflet-draw and React 19:
1. Use the SimpleMap component (already configured)
2. Or downgrade to React 18 for full leaflet-draw support
3. Check package compatibility before upgrading React versions

## Support

For additional assistance or feature requests, please refer to the project documentation or contact the development team.