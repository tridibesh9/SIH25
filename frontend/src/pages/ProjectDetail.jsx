import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, ExternalLink, Shield, Calendar, Globe, Minus, Plus } from 'lucide-react';

export const ProjectDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // Mock project data
  const project = {
    id: 1,
    title: 'Amazon Rainforest Restoration',
    type: 'Reforestation',
    location: 'Acre, Brazil',
    images: [
      'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    price: 12,
    available: 50000,
    sold: 30,
    vintage: 2024,
    verification: 'VCS-verified',
    verificationDocs: 'https://example.com/docs',
    description: 'This large-scale reforestation project in the Brazilian Amazon focuses on restoring degraded pastureland to native forest. The project works with local communities to plant native tree species, creating biodiversity corridors and sequestering significant amounts of carbon while providing sustainable livelihoods.',
    impact: {
      co2Sequestered: '2.1M tonnes',
      treesPlanted: '500K+',
      areaRestored: '10,000 hectares',
      jobsCreated: '1,200'
    },
    coordinates: [-9.9747, -67.8243]
  };

  const totalPrice = quantity * project.price;

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
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{project.impact.co2Sequestered}</div>
                  <div className="text-sm text-gray-600">CO₂ Sequestered</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{project.impact.treesPlanted}</div>
                  <div className="text-sm text-gray-600">Trees Planted</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600">{project.impact.areaRestored}</div>
                  <div className="text-sm text-gray-600">Area Restored</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{project.impact.jobsCreated}</div>
                  <div className="text-sm text-gray-600">Jobs Created</div>
                </div>
              </div>

              {/* Verification */}
              <div className="border-t pt-6">
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
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Project Location
              </h3>
              <div className="bg-gray-100 h-64 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive map showing project location</p>
                  <p className="text-sm text-gray-400">{project.location}</p>
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
