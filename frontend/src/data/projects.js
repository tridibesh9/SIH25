import sunderbansData from '../Location-jsons/Sunderbands.json';

export const projects = [
  {
    id: 1,
    title: 'Amazon Rainforest Restoration',
    type: 'Reforestation',
    location: 'Acre, Brazil',
    image: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    coordinates: [-9.9747, -67.8243],
    territoryData: null
  },
  {
    id: 2,
    title: 'Solar Farm Initiative',
    type: 'Renewable Energy',
    location: 'Rajasthan, India',
    image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/533827/pexels-photo-533827.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    price: 15,
    available: 75000,
    sold: 45,
    vintage: 2024,
    verification: 'Gold Standard',
    verificationDocs: 'https://example.com/docs',
    description: 'A large-scale solar photovoltaic project in Rajasthan, harnessing the abundant solar energy to generate clean electricity. The project reduces reliance on fossil fuels while providing employment opportunities in rural areas and contributing to India\'s renewable energy targets.',
    impact: {
      co2Sequestered: '3.2M tonnes',
      treesPlanted: 'N/A',
      areaRestored: '5,000 hectares',
      jobsCreated: '800'
    },
    coordinates: [26.9124, 75.7873],
    territoryData: null
  },
  {
    id: 3,
    title: 'Sunderbans Mangrove Conservation',
    type: 'Mangrove Conservation',
    location: 'Sunderbans, West Bengal, India',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=600&q=80',
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
    coordinates: [22.1, 89.0],
    territoryData: sunderbansData
  },
  {
    id: 4,
    title: 'Wind Energy Development',
    type: 'Renewable Energy',
    location: 'Turkana, Kenya',
    image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/533827/pexels-photo-533827.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    price: 14,
    available: 40000,
    sold: 25,
    vintage: 2024,
    verification: 'Gold Standard',
    verificationDocs: 'https://example.com/docs',
    description: 'Africa\'s largest wind farm project in Turkana, Kenya, generating clean energy for the national grid. The project provides sustainable electricity to rural communities while creating local employment and contributing to Kenya\'s commitment to renewable energy development.',
    impact: {
      co2Sequestered: '2.8M tonnes',
      treesPlanted: 'N/A',
      areaRestored: '4,000 hectares',
      jobsCreated: '600'
    },
    coordinates: [3.5, 35.8],
    territoryData: null
  },
  {
    id: 5,
    title: 'Forest Protection Initiative',
    type: 'Conservation',
    location: 'Osa Peninsula, Costa Rica',
    image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    price: 16,
    available: 35000,
    sold: 40,
    vintage: 2024,
    verification: 'VCS-verified',
    verificationDocs: 'https://example.com/docs',
    description: 'Protecting primary rainforest in Costa Rica\'s Osa Peninsula through community-based conservation. The project prevents deforestation while supporting indigenous communities through sustainable eco-tourism and forest stewardship programs.',
    impact: {
      co2Sequestered: '1.5M tonnes',
      treesPlanted: '200K+',
      areaRestored: '6,000 hectares',
      jobsCreated: '400'
    },
    coordinates: [8.6, -83.6],
    territoryData: null
  },
  {
    id: 6,
    title: 'Biomass Energy Project',
    type: 'Renewable Energy',
    location: 'Chiang Mai, Thailand',
    image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/533827/pexels-photo-533827.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    price: 13,
    available: 60000,
    sold: 35,
    vintage: 2023,
    verification: 'Gold Standard',
    verificationDocs: 'https://example.com/docs',
    description: 'Converting agricultural waste into clean energy through biomass power generation. The project reduces methane emissions from rice husks while providing sustainable energy and additional income streams for local farmers.',
    impact: {
      co2Sequestered: '2.4M tonnes',
      treesPlanted: 'N/A',
      areaRestored: '3,500 hectares',
      jobsCreated: '500'
    },
    coordinates: [18.7883, 98.9853],
    territoryData: null
  }
];