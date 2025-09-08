import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, Grid, List, MapPin, Leaf, Zap, Sun } from 'lucide-react';

export const Marketplace = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    type: [],
    priceRange: [0, 100],
    location: '',
    sortBy: 'price-low'
  });

  const projectTypes = [
    { id: 'reforestation', label: 'Reforestation', icon: Leaf },
    { id: 'renewable', label: 'Renewable Energy', icon: Sun },
    { id: 'methane', label: 'Methane Capture', icon: Zap },
  ];

  const projects = [
    {
      id: 1,
      title: 'Amazon Rainforest Restoration',
      type: 'Reforestation',
      location: 'Brazil',
      image: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 12,
      available: 50000,
      sold: 30,
      vintage: 2024,
      verification: 'VCS-verified'
    },
    {
      id: 2,
      title: 'Solar Farm Initiative',
      type: 'Renewable Energy',
      location: 'India',
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 15,
      available: 75000,
      sold: 45,
      vintage: 2024,
      verification: 'Gold Standard'
    },
    {
      id: 3,
      title: 'Mangrove Conservation Project',
      type: 'Conservation',
      location: 'Indonesia',
      image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 18,
      available: 25000,
      sold: 60,
      vintage: 2023,
      verification: 'VCS-verified'
    },
    {
      id: 4,
      title: 'Wind Energy Development',
      type: 'Renewable Energy',
      location: 'Kenya',
      image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 14,
      available: 40000,
      sold: 25,
      vintage: 2024,
      verification: 'Gold Standard'
    },
    {
      id: 5,
      title: 'Forest Protection Initiative',
      type: 'Conservation',
      location: 'Costa Rica',
      image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 16,
      available: 35000,
      sold: 40,
      vintage: 2024,
      verification: 'VCS-verified'
    },
    {
      id: 6,
      title: 'Biomass Energy Project',
      type: 'Renewable Energy',
      location: 'Thailand',
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 13,
      available: 60000,
      sold: 35,
      vintage: 2023,
      verification: 'Gold Standard'
    }
  ];

  const ProjectCard = ({ project }) => (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover"
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
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/project/${project.id}`}
            className="px-6 py-2 bg-white text-green-800 font-semibold rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            View Project
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {project.location}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-green-700 transition-colors">
          {project.title}
        </h3>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Credits Sold</span>
            <span>{project.sold}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.sold}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold text-green-600">${project.price}</p>
            <p className="text-sm text-gray-500">per tonne CO₂</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-800">{project.available.toLocaleString()}</p>
            <p className="text-sm text-gray-500">tonnes available</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Carbon Credit Marketplace</h1>
          <p className="text-xl text-gray-600">
            Discover verified carbon offset projects from around the world
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center mb-6">
                <Filter className="w-5 h-5 mr-2 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Project Type */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Project Type</h3>
                <div className="space-y-2">
                  {projectTypes.map((type) => (
                    <label key={type.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <type.icon className="w-4 h-4 ml-2 mr-1 text-gray-500" />
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Price Range (USD/tonne)</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>$100+</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Location</h3>
                <select className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">All Locations</option>
                  <option value="africa">Africa</option>
                  <option value="asia">Asia</option>
                  <option value="south-america">South America</option>
                  <option value="north-america">North America</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{projects.length} projects found</span>
              </div>

              <div className="flex items-center space-x-4">
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="available">Most Available</option>
                </select>

                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-white border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                Load More Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
