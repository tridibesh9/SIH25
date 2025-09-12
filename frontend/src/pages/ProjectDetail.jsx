import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, ExternalLink, Shield, Calendar, Globe, Minus, Plus } from 'lucide-react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import sunderbansData from '../Location-jsons/Sunderbands.json';

export const ProjectDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // Mock project data
  const project = {
    id: 1,
    title: 'Sunderbans Mangrove Restoration',
    type: 'Mangrove Conservation',
    location: 'Sunderbans, West Bengal, India',
    images: [
      'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1573160813043-5e999a2b3f85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=600&q=80'
    ],
    price: 18,
    available: 75000,
    sold: 45,
    vintage: 2024,
    verification: 'VCS-verified',
    verificationDocs: 'https://example.com/docs',
    description: 'This critical mangrove restoration project in the Sunderbans delta focuses on protecting and restoring one of the world\'s largest mangrove ecosystems. Located in the UNESCO World Heritage Site spanning across India and Bangladesh, the project works with local fishing communities to replant native mangrove species like Sundari, Gewa, and Keora trees. These mangroves create natural barriers against cyclones and storm surges while sequestering significant amounts of blue carbon and providing crucial habitat for endangered species including the Royal Bengal Tiger.',
    impact: {
      co2Sequestered: '1.8M tonnes',
      treesPlanted: '350K+',
      areaRestored: '8,500 hectares',
      jobsCreated: '950'
    },
    coordinates: [22.1, 89.0], // Center of Sunderbans
    territoryData: sunderbansData
  };

  const totalPrice = quantity * project.price;

  // Map styling for the territory
  const territoryStyle = {
    color: '#059669',
    weight: 3,
    fillOpacity: 0.3,
    fillColor: '#10b981'
  };

  // Calculate map bounds from territory data
  const bounds = project.territoryData?.geometry?.coordinates?.[0]?.reduce((acc, coord) => {
    const [lng, lat] = coord;
    return {
      minLat: Math.min(acc.minLat, lat),
      maxLat: Math.max(acc.maxLat, lat),
      minLng: Math.min(acc.minLng, lng),
      maxLng: Math.max(acc.maxLng, lng)
    };
  }, {
    minLat: Infinity,
    maxLat: -Infinity,
    minLng: Infinity,
    maxLng: -Infinity
  });

  const mapCenter = bounds ? [
    (bounds.minLat + bounds.maxLat) / 2,
    (bounds.minLng + bounds.maxLng) / 2
  ] : project.coordinates;

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/marketplace" className="text-blue-600 hover:underline">Marketplace</a></li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-600">{project.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative">
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 text-green-700 text-sm font-medium rounded-full">
                    {project.type}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-blue-600/90 text-white text-xs font-medium rounded">
                    {project.verification}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 p-4">
                {project.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${project.title} ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                  />
                ))}
              </div>
            </div>

            {/* Project Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h1 className="text-3xl font-bold text-green-800 mb-4">{project.title}</h1>

              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                {project.location}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="text-2xl font-bold text-green-600">{project.impact.co2Sequestered}</div>
                  <div className="text-sm text-gray-600">Blue Carbon Sequestered</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{project.impact.treesPlanted}</div>
                  <div className="text-sm text-gray-600">Mangroves Planted</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-2xl font-bold text-emerald-600">{project.impact.areaRestored}</div>
                  <div className="text-sm text-gray-600">Coastal Area Protected</div>
                </div>
                <div className="text-center p-4 bg-teal-50 rounded-xl border border-teal-100">
                  <div className="text-2xl font-bold text-teal-600">{project.impact.jobsCreated}</div>
                  <div className="text-sm text-gray-600">Local Jobs Created</div>
                </div>
              </div>

              {/* Verification */}
              <div className="border-t pt-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-800">Verification Documents</span>
                  </div>
                  <a
                    href={project.verificationDocs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Documents
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>

              {/* Ecosystem Information */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-100 mb-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Globe className="w-5 h-5 text-green-600 mr-2" />
                  Ecosystem Benefits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-gray-800">Biodiversity Protection:</span>
                      <span className="text-gray-600 ml-1">Habitat for 260 bird species, Royal Bengal Tigers, and saltwater crocodiles</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-gray-800">Coastal Protection:</span>
                      <span className="text-gray-600 ml-1">Natural barrier against cyclones, storms, and sea-level rise</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-gray-800">Blue Carbon:</span>
                      <span className="text-gray-600 ml-1">Mangroves store 3-5x more carbon than terrestrial forests</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-gray-800">Community Support:</span>
                      <span className="text-gray-600 ml-1">Sustainable fishing, honey collection, and eco-tourism opportunities</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-green-600" />
                Project Location & Territory
              </h3>
              
              <div className="h-80 rounded-xl overflow-hidden border border-gray-200">
                <MapContainer
                  center={mapCenter}
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-xl"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Display project territory */}
                  {project.territoryData && (
                    <GeoJSON 
                      data={project.territoryData} 
                      style={territoryStyle}
                    />
                  )}
                </MapContainer>
              </div>
              
              {/* Map Info */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1 text-green-600" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Project Area
                  </div>
                  <span>
                    {project.territoryData?.geometry?.coordinates?.[0]?.length - 1} boundary points
                  </span>
                </div>
              </div>
              
              {/* Territory Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-lg font-semibold text-green-700">
                    {project.impact.areaRestored}
                  </div>
                  <div className="text-sm text-green-600">Total Project Area</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-lg font-semibold text-blue-700">
                    Mangrove Ecosystem
                  </div>
                  <div className="text-sm text-blue-600">Habitat Type</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Box */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-sm sticky top-24">
              <div className="mb-6">
                <div className="text-3xl font-bold text-green-600 mb-1">${project.price}</div>
                <div className="text-gray-600">per tonne CO₂</div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Credits Available</span>
                  <span>{project.available.toLocaleString()} tonnes</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Credits Sold</span>
                  <span>{project.sold}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${project.sold}%` }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  Vintage Year: {project.vintage}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-1" />
                  {project.verification}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (tonnes CO₂)
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-400 hover:text-gray-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center border-0 focus:ring-0"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-green-600">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-3">
                Buy Now
              </button>

              <button className="w-full border-2 border-gray-200 text-gray-600 py-4 rounded-xl font-semibold hover:border-gray-300 transition-colors">
                Add to Watchlist
              </button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                By purchasing, you agree to our Terms of Service and acknowledge that carbon credits are digital assets.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
