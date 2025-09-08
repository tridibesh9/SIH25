import React from 'react';
import { useParams } from 'react-router-dom';
import { Download, Share2, ExternalLink, Award, Calendar, MapPin, Hash } from 'lucide-react';

export const Certificate = () => {
  const { id } = useParams();

  // Mock certificate data
  const certificate = {
    id: 'CERT-789',
    tokenId: 'NFT-12345',
    buyerName: 'Jane Smith',
    walletAddress: '0x742d35Cc6669C4532939d2982e62f93bb5C4',
    projectName: 'Amazon Rainforest Restoration',
    projectImage: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Acre, Brazil',
    tonnesRetired: 25,
    retiredDate: '2023-12-15',
    transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
    blockchainExplorer: 'https://etherscan.io/tx/',
    verificationStandard: 'VCS-verified',
    serialNumber: 'VCS-1234-2023-BR-12345'
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Carbon Offset Certificate</h1>
          <p className="text-xl text-gray-600">Verified proof of environmental impact</p>
        </div>

        {/* Certificate */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">CarbonCycle</h2>
                    <p className="opacity-90">Official Carbon Offset Certificate</p>
                  </div>
                </div>
                <div className="text-sm opacity-80">
                  Certificate ID: {certificate.id}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{certificate.tonnesRetired}t</div>
                <div className="text-sm opacity-90">CO₂ Retired</div>
              </div>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                This certifies that
              </h3>
              <div className="text-3xl font-bold text-green-600 mb-4">
                {certificate.buyerName}
              </div>
              <p className="text-lg text-gray-600">
                has permanently retired <strong>{certificate.tonnesRetired} tonnes</strong> of verified carbon credits
                from the <strong>{certificate.projectName}</strong> project
              </p>
            </div>

            {/* Project Image */}
            <div className="flex justify-center mb-8">
              <img
                src={certificate.projectImage}
                alt={certificate.projectName}
                className="w-full max-w-md h-48 object-cover rounded-2xl"
              />
            </div>

            {/* Certificate Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-800">Project Location</div>
                    <div className="text-gray-600">{certificate.location}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-800">Retirement Date</div>
                    <div className="text-gray-600">{certificate.retiredDate}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Award className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-800">Verification Standard</div>
                    <div className="text-gray-600">{certificate.verificationStandard}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Hash className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-800">Token ID</div>
                    <div className="text-gray-600 font-mono">{certificate.tokenId}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Hash className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-800">Wallet Address</div>
                    <div className="text-gray-600 font-mono text-sm">{certificate.walletAddress}...</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Hash className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-800">Serial Number</div>
                    <div className="text-gray-600 font-mono text-sm">{certificate.serialNumber}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Verification */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-blue-800 mb-3">Blockchain Verification</h4>
              <p className="text-blue-700 mb-3">
                This certificate is permanently recorded on the Ethereum blockchain for transparent verification.
              </p>
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm text-blue-600">
                  TX: {certificate.transactionHash}
                </div>
                <a
                  href={`${certificate.blockchainExplorer}${certificate.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  View on Etherscan
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 border-t pt-6">
              <p className="mb-2">
                This certificate is issued by CarbonCycle and represents the permanent retirement
                of verified carbon offset credits. This action cannot be reversed.
              </p>
              <p>Generated on {new Date().toLocaleDateString()} • Certificate ID: {certificate.id}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </button>
          <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            <Share2 className="w-5 h-5 mr-2" />
            Share Certificate
          </button>
        </div>

        {/* Social Sharing */}
        <div className="text-center mt-6">
          <p className="text-gray-600 mb-4">Share your environmental impact:</p>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Twitter
            </button>
            <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
              LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};