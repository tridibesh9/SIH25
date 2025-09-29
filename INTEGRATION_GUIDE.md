# Register Project with Territory Mapping - Integration Guide

## Overview
The new `RegisterProjectWithTerritory.jsx` component combines:
- Full backend integration from `RegisterProject.jsx`
- Territory mapping functionality from `TerritorialMap.jsx`
- Proper GeoJSON handling for location data

## Key Features

### 1. Form Fields
- **Project Name** (required)
- **Owner Name** (required)
- **Contact Number** (required)
- **Email** (required)
- **Geographic Location Description** (required) - Text description
- **Project Type** (required) - Blue carbon ecosystem types
- **Site Description** (optional)

### 2. File Uploads
- **Land Document**: Single PDF (max 2MB) - uploaded immediately on selection
- **Project Image**: Single image (max 1MB) - uploaded immediately on selection

### 3. Territory Mapping
- Interactive map using Leaflet/React-Leaflet
- Click-to-draw polygon functionality
- Automatic polygon completion after 4 points
- Manual completion after 3+ points
- Real-time GeoJSON display

### 4. Backend Integration
- Immediate file uploads to backend endpoints
- Token-based authentication
- Proper error handling and validation
- GeoJSON location data handling

## API Endpoints Used

### File Upload Endpoints
```
POST /projects/upload-document
POST /projects/upload-images
```

### Project Registration
```
POST /projects/register
```

## Data Structure

### Frontend Form Data
```javascript
{
  projectName: string,
  owner: string,
  contactNumber: string,
  email: string,
  location: string, // Text description
  territoryLocation: object, // GeoJSON object
  type: enum,
  siteDescription: string,
  landDocuments: string, // URL from upload
  projectImages: array, // URLs from upload
}
```

### Backend Data (Final Submission)
```javascript
{
  projectName: string,
  owner: string,
  contactNumber: string,
  email: string,
  location: string, // JSON stringified GeoJSON
  type: enum,
  siteDescription: string,
  landDocuments: string,
  projectImages: array,
}
```

### GeoJSON Structure
```javascript
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [87.29595059441554, 22.3421140445042],
        [87.33128596542326, 22.285637893996135],
        [87.2949214088522, 22.28056026739571],
        [87.26027216155339, 22.29039800144911],
        [87.29595059441554, 22.3421140445042]
      ]
    ]
  },
  "properties": {
    "name": "Project Territory"
  }
}
```

## Step-by-Step User Flow

### Step 1: Project Information
- User fills in basic project details
- Form validates required fields
- Progress moves to step 1

### Step 2: Documents & Images
- User uploads land document (PDF)
- User uploads project image
- Files are immediately uploaded to backend
- Progress moves to step 2

### Step 3: Territory Mapping
- User draws project boundaries on map
- Map creates GeoJSON data
- Progress moves to step 3

### Step 4: Review & Submit
- All data is validated
- Form submits to backend
- Success/error feedback provided

## Backend Updates

### Project Controller
- Added GeoJSON validation in `registerProject` function
- Handles both string descriptions and GeoJSON in location field
- Maintains backward compatibility

### Project Model
- Location field remains as String type
- Can store both text descriptions and JSON strings
- Flexible data handling

## Usage

### Import the Component
```javascript
import RegisterProjectWithTerritory from './pages/RegisterProjectWithTerritory';
```

### Use in Router
```javascript
<Route path="/register-with-territory" element={<RegisterProjectWithTerritory />} />
```

## Authentication Requirements
- User must be logged in
- Auth token stored in localStorage
- Token included in all API requests

## Error Handling
- File size validation
- File type validation
- Network error handling
- Form validation errors
- Territory mapping validation

## Dependencies
- React (with hooks)
- Framer Motion (animations)
- Lucide React (icons)
- React-Leaflet (mapping)
- Leaflet (map library)

## Features
- ✅ Immediate file uploads
- ✅ Real-time territory mapping
- ✅ Step-by-step progress indication
- ✅ Comprehensive validation
- ✅ Error feedback
- ✅ Success confirmation
- ✅ Form reset after submission
- ✅ Responsive design
- ✅ Backend integration
- ✅ GeoJSON support

## Note
This is a completely new component that doesn't modify any existing files. It combines the best features of both original components while adding proper backend integration for territory mapping.