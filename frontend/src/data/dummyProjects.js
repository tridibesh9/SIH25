// Dummy project data for monitoring map
export const dummyProjects = [
  {
    id: 1,
    projectName: "Sundarbans Mangrove Restoration",
    location: "West Bengal, India",
    owner: "Green Earth Foundation",
    email: "contact@greenearth.org",
    contactNumber: "+91 9876543210",
    type: "reforestation",
    status: "approved",
    coordinates: [22.3407, 87.2896],
    siteDescription: "Large-scale mangrove restoration project in the Sundarbans delta region",
    projectImages: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600",
      "https://images.unsplash.com/photo-1574482620881-0c8db9d0b731?w=800&h=600"
    ],
    territory: {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [87.28964178053039, 22.3407639474257],
          [87.34247330611473, 22.328233170017132],
          [87.33286757419029, 22.31348030600046],
          [87.29941904338206, 22.301105733928495],
          [87.28964178053039, 22.3407639474257]
        ]]
      },
      "properties": { "name": "Sundarbans Territory" }
    },
    carbonCredits: 1500,
    area: "2,500 hectares"
  },
  {
    id: 2,
    projectName: "Western Ghats Forest Conservation",
    location: "Kerala, India",
    owner: "Kerala Forest Department",
    email: "forestdept@kerala.gov.in",
    contactNumber: "+91 9123456789",
    type: "conservation",
    status: "adminApproval",
    coordinates: [10.8505, 76.2711],
    siteDescription: "Conservation and restoration of biodiversity hotspot in Western Ghats",
    projectImages: [
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600"
    ],
    territory: {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [76.2511, 10.8705],
          [76.2911, 10.8605],
          [76.2811, 10.8305],
          [76.2411, 10.8405],
          [76.2511, 10.8705]
        ]]
      },
      "properties": { "name": "Western Ghats Territory" }
    },
    carbonCredits: 2200,
    area: "3,200 hectares"
  },
  {
    id: 3,
    projectName: "Rajasthan Desert Afforestation",
    location: "Rajasthan, India",
    owner: "Desert Green Initiative",
    email: "info@desertgreen.org",
    contactNumber: "+91 9234567890",
    type: "afforestation",
    status: "droneAssigned",
    coordinates: [27.0238, 74.2179],
    siteDescription: "Desert afforestation project using drought-resistant native species",
    projectImages: [
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600"
    ],
    territory: {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [74.1979, 27.0438],
          [74.2379, 27.0338],
          [74.2279, 27.0038],
          [74.1879, 27.0138],
          [74.1979, 27.0438]
        ]]
      },
      "properties": { "name": "Rajasthan Desert Territory" }
    },
    carbonCredits: 800,
    area: "1,800 hectares"
  },
  {
    id: 4,
    projectName: "Northeast Bamboo Plantation",
    location: "Assam, India",
    owner: "Bamboo Development Agency",
    email: "bda@assam.gov.in",
    contactNumber: "+91 9345678901",
    type: "plantation",
    status: "ngoAssigned",
    coordinates: [26.2006, 92.9376],
    siteDescription: "Sustainable bamboo plantation for carbon sequestration and livelihood",
    projectImages: [
      "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&h=600",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600"
    ],
    territory: {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [92.9176, 26.2206],
          [92.9576, 26.2106],
          [92.9476, 26.1806],
          [92.9076, 26.1906],
          [92.9176, 26.2206]
        ]]
      },
      "properties": { "name": "Bamboo Plantation Territory" }
    },
    carbonCredits: 950,
    area: "1,200 hectares"
  },
  {
    id: 5,
    projectName: "Himalayan Reforestation Project",
    location: "Uttarakhand, India",
    owner: "Mountain Ecology Institute",
    email: "mei@uttarakhand.org",
    contactNumber: "+91 9456789012",
    type: "reforestation",
    status: "landApproval",
    coordinates: [30.0668, 79.0193],
    siteDescription: "High-altitude reforestation using native Himalayan species",
    projectImages: [
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=600",
      "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=800&h=600"
    ],
    territory: {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [78.9993, 30.0868],
          [79.0393, 30.0768],
          [79.0293, 30.0468],
          [78.9893, 30.0568],
          [78.9993, 30.0868]
        ]]
      },
      "properties": { "name": "Himalayan Territory" }
    },
    carbonCredits: 1800,
    area: "2,800 hectares"
  },
  {
    id: 6,
    projectName: "Coastal Forest Restoration",
    location: "Tamil Nadu, India",
    owner: "Coastal Conservation Trust",
    email: "cct@tamilnadu.org",
    contactNumber: "+91 9567890123",
    type: "restoration",
    status: "pending",
    coordinates: [11.1271, 79.8612],
    siteDescription: "Restoration of coastal forests damaged by cyclones and human activities",
    projectImages: [
      "https://images.unsplash.com/photo-1476209446441-5ad72f223207?w=800&h=600",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600"
    ],
    territory: {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [79.8412, 11.1471],
          [79.8812, 11.1371],
          [79.8712, 11.1071],
          [79.8312, 11.1171],
          [79.8412, 11.1471]
        ]]
      },
      "properties": { "name": "Coastal Forest Territory" }
    },
    carbonCredits: 1200,
    area: "2,100 hectares"
  },
  {
    id: 7,
    projectName: "Central India Tribal Forest",
    location: "Madhya Pradesh, India",
    owner: "Tribal Forest Cooperative",
    email: "tfc@madhyapradesh.gov.in",
    contactNumber: "+91 9678901234",
    type: "community_forestry",
    status: "approved",
    coordinates: [23.2599, 77.4126],
    siteDescription: "Community-managed forest restoration with tribal participation",
    projectImages: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600",
      "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=800&h=600"
    ],
    territory: {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [77.3926, 23.2799],
          [77.4326, 23.2699],
          [77.4226, 23.2399],
          [77.3826, 23.2499],
          [77.3926, 23.2799]
        ]]
      },
      "properties": { "name": "Tribal Forest Territory" }
    },
    carbonCredits: 1650,
    area: "2,400 hectares"
  },
  {
    id: 8,
    projectName: "Punjab Agroforestry Initiative",
    location: "Punjab, India",
    owner: "Punjab Agricultural University",
    email: "pau@punjab.edu",
    contactNumber: "+91 9789012345",
    type: "agroforestry",
    status: "rejected",
    coordinates: [30.9010, 75.8573],
    siteDescription: "Integration of trees with agricultural crops for sustainable farming",
    projectImages: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600",
      "https://images.unsplash.com/photo-1529440482099-95492fbb08ba?w=800&h=600"
    ],
    territory: {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [75.8373, 30.9210],
          [75.8773, 30.9110],
          [75.8673, 30.8810],
          [75.8273, 30.8910],
          [75.8373, 30.9210]
        ]]
      },
      "properties": { "name": "Agroforestry Territory" }
    },
    carbonCredits: 600,
    area: "1,500 hectares"
  }
];

// Status color mapping for consistent styling
export const statusColors = {
  pending: '#f59e0b',
  landApproval: '#3b82f6',
  ngoAssigning: '#6366f1',
  ngoAssigned: '#6366f1',
  droneAssigning: '#8b5cf6',
  droneAssigned: '#8b5cf6',
  adminApproval: '#f97316',
  approved: '#10b981',
  rejected: '#ef4444'
};

// Status display names
export const statusDisplayNames = {
  pending: 'Pending Review',
  landApproval: 'Land Approval',
  ngoAssigning: 'NGO Assigning',
  ngoAssigned: 'NGO Assigned',
  droneAssigning: 'Drone Assigning',
  droneAssigned: 'Drone Assigned',
  adminApproval: 'Admin Approval',
  approved: 'Approved',
  rejected: 'Rejected'
};

// Project type colors
export const typeColors = {
  reforestation: '#059669',
  conservation: '#0d9488',
  afforestation: '#7c3aed',
  plantation: '#dc2626',
  restoration: '#ea580c',
  community_forestry: '#2563eb',
  agroforestry: '#ca8a04'
};