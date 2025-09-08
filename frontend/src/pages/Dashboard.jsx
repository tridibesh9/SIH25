import React, { useState } from 'react';
import { Leaf, TrendingUp, Award, Download, ExternalLink, BarChart3 } from 'lucide-react';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio');

  const portfolioStats = {
    totalInvestment: 125000,
    totalCO2Offset: 8500,
    activeCredits: 42,
    totalProjects: 12
  };

  const activeCredits = [
    {
      id: 'CC-001',
      projectName: 'Amazon Rainforest Restoration',
      tokenId: '#NFT-12345',
      tonnes: 100,
      purchaseDate: '2024-01-15',
      purchasePrice: 12,
      currentPrice: 15,
      image: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'CC-002',
      projectName: 'Solar Farm Initiative',
      tokenId: '#NFT-12346',
      tonnes: 50,
      purchaseDate: '2024-01-20',
      purchasePrice: 15,
      currentPrice: 18,
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'CC-003',
      projectName: 'Mangrove Conservation',
      tokenId: '#NFT-12347',
      tonnes: 75,
      purchaseDate: '2024-02-01',
      purchasePrice: 18,
      currentPrice: 20,
      image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const retiredCredits = [
    {
      id: 'RC-001',
      projectName: 'Wind Energy Development',
      tonnes: 25,
      retiredDate: '2023-12-15',
      certificateId: 'CERT-789',
      reason: 'Corporate Net Zero Initiative'
    },
    {
      id: 'RC-002',
      projectName: 'Forest Protection Initiative',
      tonnes: 40,
      retiredDate: '2023-11-20',
      certificateId: 'CERT-790',
      reason: 'Annual Carbon Offsetting'
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your carbon credit portfolio and track your environmental impact</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+12.5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">${portfolioStats.totalInvestment.toLocaleString()}</h3>
            <p className="text-gray-600">Total Investment</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-blue-600 font-medium">+850t</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{portfolioStats.totalCO2Offset.toLocaleString()}t</h3>
            <p className="text-gray-600">Total CO₂ Offset</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{portfolioStats.activeCredits}</h3>
            <p className="text-gray-600">Active Credits</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{portfolioStats.totalProjects}</h3>
            <p className="text-gray-600">Total Projects</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-8">
              {[
                { id: 'portfolio', label: 'My Portfolio' },
                { id: 'retired', label: 'Retired Credits' },
                { id: 'projects', label: 'My Projects' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'portfolio' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Active Carbon Credits</h2>
                  <p className="text-gray-600">Your owned carbon credit NFTs that can be retired or traded</p>
                </div>

                <div className="space-y-4">
                  {activeCredits.map((credit) => (
                    <div key={credit.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={credit.image}
                            alt={credit.projectName}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-800">{credit.projectName}</h3>
                            <p className="text-sm text-gray-600">{credit.tokenId}</p>
                            <p className="text-sm text-gray-500">Purchased: {credit.purchaseDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{credit.tonnes}t</div>
                          <div className="text-sm text-gray-500">CO₂ Credits</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-800">${credit.currentPrice}/t</div>
                          <div className={`text-sm ${credit.currentPrice > credit.purchasePrice ? 'text-green-600' : 'text-red-600'}`}>
                            {credit.currentPrice > credit.purchasePrice ? '+' : ''}
                            {((credit.currentPrice - credit.purchasePrice) / credit.purchasePrice * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                            Retire Now
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            List for Sale
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'retired' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Retired Carbon Credits</h2>
                  <p className="text-gray-600">Your permanent record of environmental impact</p>
                </div>

                <div className="space-y-4">
                  {retiredCredits.map((credit) => (
                    <div key={credit.id} className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{credit.projectName}</h3>
                          <p className="text-sm text-gray-600 mt-1">{credit.reason}</p>
                          <p className="text-sm text-gray-500 mt-1">Retired: {credit.retiredDate}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{credit.tonnes}t</div>
                          <div className="text-sm text-gray-500">CO₂ Retired</div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            <Award className="w-4 h-4 mr-2" />
                            View Certificate
                          </button>
                          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Projects</h2>
                  <p className="text-gray-600">Projects you've submitted for verification</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Projects Yet</h3>
                  <p className="text-gray-600 mb-6">Start by submitting your first environmental project for verification</p>
                  <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
                    Submit New Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
