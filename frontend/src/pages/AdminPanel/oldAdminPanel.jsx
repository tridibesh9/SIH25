import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, Clock, MapPin, FileText, Calendar, TrendingUp, AlertTriangle, BarChart3, Zap, Camera, Users, Thermometer, Wind, Droplets, Shield, RotateCcw, FileCheck, Upload, CalendarDays, MapPinIcon, Settings } from 'lucide-react';
import ReviewWindow from '../components/ReviewWindow';
import ScoreBadge from '../components/ScoreBadge';

export const AdminDashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMonitoringProject, setSelectedMonitoringProject] = useState('reforestation-costa-rica');

  // Demo data for monitoring dashboard
  const monitoringProjects = [
    {
      id: 'reforestation-costa-rica',
      name: 'Costa Rica Reforestation',
      location: 'San José, Costa Rica',
      type: 'Reforestation',
      status: 'Active',
      totalCredits: 48500,
      currentYear: 15200,
      fluctuation: '+12.5%',
      risk: 'Low',
      lastUpdate: '2025-09-10',
      image: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=400',
      yearlyData: [
        { year: '2020', credits: 8500 },
        { year: '2021', credits: 12200 },
        { year: '2022', credits: 15800 },
        { year: '2023', credits: 18900 },
        { year: '2024', credits: 22100 },
        { year: '2025', credits: 15200 }
      ]
    },
    {
      id: 'solar-philippines',
      name: 'Solar Energy Farm Philippines',
      location: 'Luzon, Philippines',
      type: 'Renewable Energy',
      status: 'Active',
      totalCredits: 62300,
      currentYear: 18700,
      fluctuation: '-8.2%',
      risk: 'Medium',
      lastUpdate: '2025-09-08',
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400',
      yearlyData: [
        { year: '2020', credits: 14200 },
        { year: '2021', credits: 16800 },
        { year: '2022', credits: 19500 },
        { year: '2023', credits: 20400 },
        { year: '2024', credits: 20400 },
        { year: '2025', credits: 18700 }
      ]
    },
    {
      id: 'mangrove-indonesia',
      name: 'Mangrove Restoration Indonesia',
      location: 'Java, Indonesia',
      type: 'Conservation',
      status: 'Monitoring',
      totalCredits: 34800,
      currentYear: 9200,
      fluctuation: '+25.8%',
      risk: 'High',
      lastUpdate: '2025-09-05',
      image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=400',
      yearlyData: [
        { year: '2020', credits: 4500 },
        { year: '2021', credits: 6200 },
        { year: '2022', credits: 8100 },
        { year: '2023', credits: 7300 },
        { year: '2024', credits: 7300 },
        { year: '2025', credits: 9200 }
      ]
    },
    {
      id: 'wind-energy-brazil',
      name: 'Wind Energy Brazil',
      location: 'Bahia, Brazil',
      type: 'Renewable Energy',
      status: 'Active',
      totalCredits: 41200,
      currentYear: 13800,
      fluctuation: '+4.7%',
      risk: 'Low',
      lastUpdate: '2025-09-11',
      image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=400',
      yearlyData: [
        { year: '2020', credits: 9200 },
        { year: '2021', credits: 11500 },
        { year: '2022', credits: 13200 },
        { year: '2023', credits: 13200 },
        { year: '2024', credits: 13200 },
        { year: '2025', credits: 13800 }
      ]
    }
  ];

  const currentProject = monitoringProjects.find(p => p.id === selectedMonitoringProject);

  // Additional handlers for monitoring dashboard
  const handleProjectAnalysis = (projectId) => {
    const project = monitoringProjects.find(p => p.id === projectId);
    alert(`Generating detailed analysis for ${project.name}...`);
  };

  const handleFlagForReview = (projectId) => {
    const project = monitoringProjects.find(p => p.id === projectId);
    alert(`${project.name} has been flagged for detailed review due to fluctuations.`);
  };

  // Reporting Dashboard Data
  const droneReports = [
    {
      id: 'DRONE-001',
      projectId: 'PROJ-001',
      projectName: 'Costa Rica Reforestation',
      droneId: 'DRN-Alpha-7',
      reportDate: '2025-09-10',
      status: 'Pending Review',
      priority: 'High',
      location: 'Sector A-3, San José',
      sensors: {
        co2Levels: { value: 385, unit: 'ppm', status: 'Normal', change: '-12 ppm' },
        temperature: { value: 24.5, unit: '°C', status: 'Normal', change: '-0.8°C' },
        humidity: { value: 78, unit: '%', status: 'High', change: '+5%' },
        windSpeed: { value: 12, unit: 'km/h', status: 'Normal', change: '+2 km/h' }
      },
      images: [
        { id: 1, url: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'overview', timestamp: '10:30 AM' },
        { id: 2, url: 'https://images.pexels.com/photos/1632796/pexels-photo-1632796.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'detail', timestamp: '10:45 AM' },
        { id: 3, url: 'https://images.pexels.com/photos/1632794/pexels-photo-1632794.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'thermal', timestamp: '11:00 AM' }
      ],
      anomalies: ['Unusual vegetation growth in Sector A-3', 'Minor soil erosion detected'],
      recommendations: 'Continue monitoring. Consider additional tree planting in identified sparse areas.'
    },
    {
      id: 'DRONE-002',
      projectId: 'PROJ-002',
      projectName: 'Solar Energy Farm Philippines',
      droneId: 'DRN-Beta-3',
      reportDate: '2025-09-08',
      status: 'Flagged',
      priority: 'Critical',
      location: 'Panel Array B-7, Luzon',
      sensors: {
        co2Levels: { value: 340, unit: 'ppm', status: 'Excellent', change: '-45 ppm' },
        temperature: { value: 31.2, unit: '°C', status: 'High', change: '+3.1°C' },
        humidity: { value: 65, unit: '%', status: 'Normal', change: '-2%' },
        windSpeed: { value: 8, unit: 'km/h', status: 'Low', change: '-4 km/h' }
      },
      images: [
        { id: 1, url: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'overview', timestamp: '2:15 PM' },
        { id: 2, url: 'https://images.pexels.com/photos/356037/pexels-photo-356037.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'detail', timestamp: '2:30 PM' }
      ],
      anomalies: ['Panel efficiency drop in Array B-7', 'Dust accumulation above normal levels'],
      recommendations: 'Immediate cleaning required. Schedule maintenance for affected panels.'
    },
    {
      id: 'DRONE-003',
      projectId: 'PROJ-003',
      projectName: 'Mangrove Restoration Indonesia',
      droneId: 'DRN-Gamma-1',
      reportDate: '2025-09-05',
      status: 'Approved',
      priority: 'Medium',
      location: 'Coastal Zone C-2, Java',
      sensors: {
        co2Levels: { value: 395, unit: 'ppm', status: 'Normal', change: '-8 ppm' },
        temperature: { value: 28.7, unit: '°C', status: 'Normal', change: '+0.5°C' },
        humidity: { value: 89, unit: '%', status: 'High', change: '+7%' },
        windSpeed: { value: 15, unit: 'km/h', status: 'Normal', change: '+1 km/h' }
      },
      images: [
        { id: 1, url: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'overview', timestamp: '8:20 AM' },
        { id: 2, url: 'https://images.pexels.com/photos/1179231/pexels-photo-1179231.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'detail', timestamp: '8:35 AM' }
      ],
      anomalies: [],
      recommendations: 'Project progressing well. Continue current monitoring schedule.'
    }
  ];

  const ngoReports = [
    {
      id: 'NGO-001',
      projectId: 'PROJ-001',
      projectName: 'Costa Rica Reforestation',
      ngoName: 'EcoWatch Foundation',
      reportDate: '2025-09-09',
      status: 'Pending Review',
      priority: 'High',
      reportType: 'Quarterly Assessment',
      fieldOfficer: 'Maria Rodriguez',
      visitDate: '2025-09-07',
      assessmentAreas: [
        { area: 'Tree Survival Rate', score: 92, notes: 'Excellent survival rate, above target of 85%' },
        { area: 'Community Engagement', score: 88, notes: 'Strong local participation in maintenance activities' },
        { area: 'Biodiversity Impact', score: 85, notes: 'Native species returning to the area' },
        { area: 'Soil Quality', score: 78, notes: 'Gradual improvement observed' }
      ],
      carbonAssessment: {
        estimatedSequestration: 1850,
        verificationMethod: 'Biomass sampling',
        confidence: 'High',
        notes: 'Measurements align with project projections'
      },
      images: [
        { id: 1, url: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'field-work', timestamp: 'Sept 7, 9:00 AM' },
        { id: 2, url: 'https://images.pexels.com/photos/1632795/pexels-photo-1632795.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'community', timestamp: 'Sept 7, 2:00 PM' }
      ],
      concerns: ['Some areas showing slower growth than expected'],
      recommendations: 'Continue current practices. Consider additional irrigation in slower-growth areas.'
    },
    {
      id: 'NGO-002',
      projectId: 'PROJ-002',
      projectName: 'Solar Energy Farm Philippines',
      ngoName: 'Green Energy Watch',
      reportDate: '2025-09-06',
      status: 'Flagged',
      priority: 'Critical',
      reportType: 'Impact Assessment',
      fieldOfficer: 'Jun Santos',
      visitDate: '2025-09-04',
      assessmentAreas: [
        { area: 'Energy Output', score: 75, notes: 'Below expected output due to maintenance issues' },
        { area: 'Environmental Impact', score: 90, notes: 'Minimal negative environmental impact observed' },
        { area: 'Community Benefits', score: 82, notes: 'Local employment and energy access improved' },
        { area: 'Equipment Status', score: 65, notes: 'Several panels require maintenance' }
      ],
      carbonAssessment: {
        estimatedReduction: 2100,
        verificationMethod: 'Energy output calculation',
        confidence: 'Medium',
        notes: 'Reduced output affecting carbon credit calculations'
      },
      images: [
        { id: 1, url: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'equipment', timestamp: 'Sept 4, 11:00 AM' },
        { id: 2, url: 'https://images.pexels.com/photos/356038/pexels-photo-356038.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'maintenance', timestamp: 'Sept 4, 3:00 PM' }
      ],
      concerns: ['Equipment degradation faster than expected', 'Maintenance schedule needs adjustment'],
      recommendations: 'Immediate maintenance required. Review maintenance protocols and scheduling.'
    },
    {
      id: 'NGO-003',
      projectId: 'PROJ-003',
      projectName: 'Mangrove Restoration Indonesia',
      ngoName: 'Ocean Conservation Alliance',
      reportDate: '2025-09-03',
      status: 'Approved',
      priority: 'Low',
      reportType: 'Environmental Monitoring',
      fieldOfficer: 'Sari Dewi',
      visitDate: '2025-09-01',
      assessmentAreas: [
        { area: 'Mangrove Health', score: 94, notes: 'Excellent growth and establishment' },
        { area: 'Marine Ecosystem', score: 89, notes: 'Fish populations returning to the area' },
        { area: 'Coastal Protection', score: 91, notes: 'Effective wave reduction observed' },
        { area: 'Community Livelihood', score: 87, notes: 'Fishing communities benefiting from restoration' }
      ],
      carbonAssessment: {
        estimatedSequestration: 1650,
        verificationMethod: 'Blue carbon methodology',
        confidence: 'High',
        notes: 'Sequestration rates exceeding projections'
      },
      images: [
        { id: 1, url: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'restoration', timestamp: 'Sept 1, 7:30 AM' },
        { id: 2, url: 'https://images.pexels.com/photos/1179232/pexels-photo-1179232.jpeg?auto=compress&cs=tinysrgb&w=400', type: 'ecosystem', timestamp: 'Sept 1, 4:00 PM' }
      ],
      concerns: [],
      recommendations: 'Project exceeding expectations. Maintain current monitoring schedule.'
    }
  ];

  // Reporting Dashboard Handlers
  const [selectedReportType, setSelectedReportType] = useState('drone');
  const [selectedReport, setSelectedReport] = useState(null);

  const handleApproveReport = (reportId, type) => {
    alert(`${type === 'drone' ? 'Drone' : 'NGO'} Report ${reportId} approved!`);
    setSelectedReport(null);
  };

  const handleRescheduleReport = (reportId, type) => {
    const reason = prompt('Please provide a reason for rescheduling:');
    if (reason) {
      alert(`${type === 'drone' ? 'Drone' : 'NGO'} Report ${reportId} rescheduled. Reason: ${reason}`);
      setSelectedReport(null);
    }
  };

  const handleFlagReport = (reportId, type) => {
    const reason = prompt('Please provide a reason for flagging:');
    if (reason) {
      alert(`${type === 'drone' ? 'Drone' : 'NGO'} Report ${reportId} flagged for review. Reason: ${reason}`);
      setSelectedReport(null);
    }
  };

  const handleBulkApproveReports = (type) => {
    const pendingCount = type === 'drone' 
      ? droneReports.filter(r => r.status === 'Pending Review').length
      : ngoReports.filter(r => r.status === 'Pending Review').length;
    alert(`${pendingCount} ${type === 'drone' ? 'drone' : 'NGO'} reports approved!`);
  };

  // Verification Dashboard Data
  const landDocuments = [
    {
      id: 'DOC-001',
      projectId: 'PROJ-001',
      projectName: 'Costa Rica Reforestation Initiative',
      ownerName: 'Carlos Mendez',
      landArea: '500 hectares',
      location: 'San José Province, Costa Rica',
      submittedDate: '2025-09-08',
      status: 'Pending Verification',
      priority: 'High',
      documents: [
        { type: 'Title Deed', status: 'Verified', uploadDate: '2025-09-08', size: '2.4 MB' },
        { type: 'Survey Map', status: 'Pending', uploadDate: '2025-09-08', size: '5.1 MB' },
        { type: 'Tax Records', status: 'Verified', uploadDate: '2025-09-08', size: '1.8 MB' },
        { type: 'Environmental Clearance', status: 'Under Review', uploadDate: '2025-09-07', size: '3.2 MB' }
      ],
      verificationNotes: 'Title deed authentic. Survey map requires cross-verification with government records.',
      riskLevel: 'Low',
      image: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'DOC-002',
      projectId: 'PROJ-002',
      projectName: 'Solar Energy Farm Philippines',
      ownerName: 'SunPower Asia Ltd.',
      landArea: '200 hectares',
      location: 'Luzon, Philippines',
      submittedDate: '2025-09-06',
      status: 'Flagged',
      priority: 'Critical',
      documents: [
        { type: 'Corporate Lease Agreement', status: 'Flagged', uploadDate: '2025-09-06', size: '4.7 MB' },
        { type: 'Government Permit', status: 'Verified', uploadDate: '2025-09-06', size: '2.1 MB' },
        { type: 'Land Survey', status: 'Pending', uploadDate: '2025-09-05', size: '6.3 MB' },
        { type: 'Environmental Impact Assessment', status: 'Verified', uploadDate: '2025-09-05', size: '8.9 MB' }
      ],
      verificationNotes: 'Lease agreement discrepancies found. Requires legal review and clarification.',
      riskLevel: 'High',
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'DOC-003',
      projectId: 'PROJ-003',
      projectName: 'Mangrove Restoration Indonesia',
      ownerName: 'Indonesian Forestry Department',
      landArea: '300 hectares',
      location: 'Java, Indonesia',
      submittedDate: '2025-09-04',
      status: 'Verified',
      priority: 'Medium',
      documents: [
        { type: 'Government Land Grant', status: 'Verified', uploadDate: '2025-09-04', size: '3.5 MB' },
        { type: 'Coastal Zone Permit', status: 'Verified', uploadDate: '2025-09-04', size: '2.8 MB' },
        { type: 'Marine Survey', status: 'Verified', uploadDate: '2025-09-03', size: '7.2 MB' },
        { type: 'Community Consent', status: 'Verified', uploadDate: '2025-09-03', size: '1.9 MB' }
      ],
      verificationNotes: 'All documents verified successfully. Government backing confirmed.',
      riskLevel: 'Low',
      image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const droneScheduling = [
    {
      id: 'SCHED-001',
      projectId: 'PROJ-001',
      projectName: 'Costa Rica Reforestation Initiative',
      location: 'San José, Costa Rica',
      region: 'Central America',
      priority: 'High',
      requestDate: '2025-09-10',
      preferredDate: '2025-09-15',
      status: 'Pending Assignment',
      droneType: 'Environmental Monitoring',
      estimatedDuration: '4 hours',
      availableDrones: ['DRN-Alpha-7', 'DRN-Beta-2', 'DRN-Gamma-3'],
      weatherConditions: 'Favorable',
      accessibilityNotes: 'Good access roads. Helicopter landing zone available.',
      image: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'SCHED-002',
      projectId: 'PROJ-002',
      projectName: 'Solar Energy Farm Philippines',
      location: 'Luzon, Philippines',
      region: 'Southeast Asia',
      priority: 'Critical',
      requestDate: '2025-09-08',
      preferredDate: '2025-09-12',
      status: 'Scheduled',
      assignedDrone: 'DRN-Beta-3',
      scheduledDate: '2025-09-12',
      droneType: 'Technical Inspection',
      estimatedDuration: '6 hours',
      availableDrones: ['DRN-Beta-3', 'DRN-Delta-1'],
      weatherConditions: 'Monitoring required',
      accessibilityNotes: 'Remote location. Drone transport via mobile unit required.',
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'SCHED-003',
      projectId: 'PROJ-004',
      projectName: 'Wind Energy Brazil',
      location: 'Bahia, Brazil',
      region: 'South America',
      priority: 'Medium',
      requestDate: '2025-09-07',
      preferredDate: '2025-09-20',
      status: 'Pending Assignment',
      droneType: 'Routine Inspection',
      estimatedDuration: '3 hours',
      availableDrones: ['DRN-Alpha-5', 'DRN-Gamma-1'],
      weatherConditions: 'Favorable',
      accessibilityNotes: 'Coastal access. Wind conditions may affect flight patterns.',
      image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const ngoScheduling = [
    {
      id: 'NGO-SCHED-001',
      projectId: 'PROJ-001',
      projectName: 'Costa Rica Reforestation Initiative',
      ngoName: 'EcoWatch Foundation',
      ngoType: 'Environmental Monitoring',
      location: 'San José, Costa Rica',
      requestDate: '2025-09-09',
      preferredDate: '2025-09-18',
      status: 'Pending Confirmation',
      priority: 'High',
      fieldOfficer: 'Maria Rodriguez',
      visitType: 'Quarterly Assessment',
      estimatedDuration: '2 days',
      accommodationNeeded: true,
      localContact: 'Carlos Mendez (+506-8888-1234)',
      specialRequirements: 'Biomass sampling equipment required',
      travelDistance: '45 km from San José',
      image: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'NGO-SCHED-002',
      projectId: 'PROJ-002',
      projectName: 'Solar Energy Farm Philippines',
      ngoName: 'Green Energy Watch',
      ngoType: 'Technical Assessment',
      location: 'Luzon, Philippines',
      requestDate: '2025-09-06',
      preferredDate: '2025-09-14',
      status: 'Confirmed',
      confirmedDate: '2025-09-14',
      priority: 'Critical',
      fieldOfficer: 'Jun Santos',
      visitType: 'Emergency Inspection',
      estimatedDuration: '1 day',
      accommodationNeeded: false,
      localContact: 'Miguel Torres (+63-912-345-6789)',
      specialRequirements: 'Electrical testing equipment and safety gear',
      travelDistance: '120 km from Manila',
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'NGO-SCHED-003',
      projectId: 'PROJ-003',
      projectName: 'Mangrove Restoration Indonesia',
      ngoName: 'Ocean Conservation Alliance',
      ngoType: 'Marine Ecosystem',
      location: 'Java, Indonesia',
      requestDate: '2025-09-05',
      preferredDate: '2025-09-25',
      status: 'Pending Confirmation',
      priority: 'Medium',
      fieldOfficer: 'Sari Dewi',
      visitType: 'Biodiversity Survey',
      estimatedDuration: '3 days',
      accommodationNeeded: true,
      localContact: 'Ahmad Suryanto (+62-813-4567-890)',
      specialRequirements: 'Marine sampling equipment and boat access',
      travelDistance: '80 km from Jakarta',
      image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  // Verification Dashboard Handlers
  const [selectedVerificationTab, setSelectedVerificationTab] = useState('documents');
  const [selectedVerificationItem, setSelectedVerificationItem] = useState(null);

  const handleVerifyDocument = (docId) => {
    alert(`Document ${docId} verified successfully!`);
    setSelectedVerificationItem(null);
  };

  const handleFlagDocument = (docId) => {
    const reason = prompt('Please provide a reason for flagging this document:');
    if (reason) {
      alert(`Document ${docId} flagged. Reason: ${reason}`);
      setSelectedVerificationItem(null);
    }
  };

  const handleScheduleDrone = (schedId, droneId) => {
    const schedule = droneScheduling.find(s => s.id === schedId);
    alert(`Drone ${droneId} scheduled for ${schedule.projectName} on ${schedule.preferredDate}!`);
    setSelectedVerificationItem(null);
  };

  const handleBulkScheduleDrones = () => {
    const pendingCount = droneScheduling.filter(s => s.status === 'Pending Assignment').length;
    alert(`${pendingCount} drone visits automatically scheduled based on regional availability!`);
  };

  const handleConfirmNGOVisit = (ngoSchedId) => {
    const ngoSchedule = ngoScheduling.find(s => s.id === ngoSchedId);
    alert(`NGO visit confirmed for ${ngoSchedule.projectName} with ${ngoSchedule.ngoName}!`);
    setSelectedVerificationItem(null);
  };

  const handleRescheduleNGO = (ngoSchedId) => {
    const newDate = prompt('Enter new preferred date (YYYY-MM-DD):');
    if (newDate) {
      alert(`NGO visit rescheduled to ${newDate}!`);
      setSelectedVerificationItem(null);
    }
  };

  const pendingProjects = [
    {
      id: 'PROJ-001',
      name: 'Costa Rica Reforestation Initiative',
      developer: 'GreenWorld Foundation',
      location: 'San José, Costa Rica',
      type: 'Reforestation',
      submittedDate: '2024-01-15',
      expectedCredits: 15000,
      cumulativeScore: 82,
      area: '500 hectares',
      description: 'Large-scale reforestation project focusing on native species restoration in degraded pasturelands.',
      documents: ['Environmental Impact Assessment', 'Land Use Permits', 'Community Agreements'],
      image: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'PROJ-002',
      name: 'Solar Energy Farm Philippines',
      developer: 'SunPower Asia',
      location: 'Luzon, Philippines',
      type: 'Renewable Energy',
      submittedDate: '2024-01-18',
      expectedCredits: 25000,
      cumulativeScore: 67,
      capacity: '50 MW',
      description: 'Large-scale solar installation providing clean energy to rural communities.',
      documents: ['Technical Specifications', 'Grid Connection Agreement', 'Environmental Clearance'],
      image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'PROJ-003',
      name: 'Mangrove Restoration Indonesia',
      developer: 'Ocean Conservation Co.',
      location: 'Java, Indonesia',
      type: 'Conservation',
      submittedDate: '2024-01-20',
      expectedCredits: 12000,
      cumulativeScore: 43,
      area: '300 hectares',
      description: 'Coastal mangrove restoration project protecting communities from climate impacts.',
      documents: ['Marine Survey Report', 'Community Impact Study', 'Restoration Plan'],
      image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const handleReviewProject = (project) => {
    setSelectedProject(project);
  };

  const handleBulkVerifyDocuments = () => {
    console.log('Bulk verifying all documents');
    alert('All documents have been verified!');
  };

  const handleBulkApproveCertifications = () => {
    console.log('Bulk approving all certifications');
    alert('All certifications have been approved!');
  };

  const handleBulkProcessRequests = () => {
    console.log('Bulk processing all credit requests');
    alert('All credit requests have been processed!');
  };

  const handleBulkVerifyRequests = () => {
    console.log('Bulk verifying all verification requests');
    alert('All verification requests have been verified!');
  };

  const ReviewModal = ({ project, onClose, onApprove, onReject }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
              <p className="text-gray-600 mt-1">Project ID: {project.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <XCircle className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />

              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <span>Submitted: {project.submittedDate}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-2" />
                  <span>Developer: {project.developer}</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Project Details</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{project.expectedCredits.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Expected Credits</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{project.area || project.capacity}</div>
                    <div className="text-sm text-gray-600">{project.area ? 'Project Area' : 'Capacity'}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Verification Documents</h3>
                  <div className="space-y-2">
                    {project.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{doc}</span>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={() => onReject(project.id)}
            className="flex items-center px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            <XCircle className="w-5 h-5 mr-2" />
            Reject Project
          </button>
          <button
            onClick={() => onApprove(project.id)}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Approve & Tokenize
          </button>
        </div>
      </div>
    </div>
  );

  const handleApprove = (projectId) => {
    alert(`Project ${projectId} approved and sent for tokenization!`);
    setSelectedProject(null);
  };

  const handleReject = (projectId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      alert(`Project ${projectId} rejected. Reason: ${reason}`);
      setSelectedProject(null);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Review and approve carbon credit projects</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">3</h3>
            <p className="text-gray-600">Pending Review</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">47</h3>
            <p className="text-gray-600">Approved</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">5</h3>
            <p className="text-gray-600">Rejected</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">55</h3>
            <p className="text-gray-600">Total Projects</p>
          </div>
        </div>

        {/* Monitoring Dashboard */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Project Monitoring Dashboard</h2>
            <p className="text-gray-600">Monitor carbon credit fluctuations and project performance</p>
          </div>

          {/* Monitoring Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">4</h3>
              <p className="text-gray-600">Projects Monitored</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">186.8K</h3>
              <p className="text-gray-600">Total Credits Generated</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">1</h3>
              <p className="text-gray-600">High Risk Projects</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">56.9K</h3>
              <p className="text-gray-600">Credits This Year</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graph Section */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{currentProject?.name}</h3>
                  <p className="text-gray-600 text-sm">{currentProject?.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Carbon Credits Over Time</span>
                </div>
              </div>

              {/* Simple Bar Chart */}
              <div className="space-y-4">
                <div className="flex items-end justify-between h-64 border-b border-gray-200 pb-2">
                  {currentProject?.yearlyData.map((data, index) => {
                    const maxCredits = Math.max(...currentProject.yearlyData.map(d => d.credits));
                    const height = (data.credits / maxCredits) * 240;
                    const isCurrentYear = data.year === '2025';
                    
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="relative flex items-end h-60 w-full justify-center">
                          <div
                            className={`w-12 rounded-t-lg transition-all duration-300 cursor-pointer ${
                              isCurrentYear ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                            style={{ height: `${height}px` }}
                            title={`${data.year}: ${data.credits.toLocaleString()} credits`}
                            onClick={() => {
                              alert(`${data.year} Details:\nCredits Generated: ${data.credits.toLocaleString()}\nProject: ${currentProject.name}\nStatus: ${data.year === '2025' ? 'Current Year' : 'Historical Data'}`);
                            }}
                          />
                        </div>
                        <div className="mt-2 text-sm text-gray-600 font-medium">{data.year}</div>
                        <div className="text-xs text-gray-500">{data.credits.toLocaleString()}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Chart Legend and Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{currentProject?.totalCredits.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Credits</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{currentProject?.currentYear.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">2025 Credits</div>
                  </div>
                  <div className={`p-4 rounded-xl ${
                    currentProject?.fluctuation.startsWith('+') ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <div className={`text-2xl font-bold ${
                      currentProject?.fluctuation.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {currentProject?.fluctuation}
                    </div>
                    <div className="text-sm text-gray-600">YoY Change</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Projects Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monitored Projects</h3>
                <div className="space-y-3">
                  {monitoringProjects.map((project) => {
                    const isSelected = project.id === selectedMonitoringProject;
                    const isFluctuating = Math.abs(parseFloat(project.fluctuation.replace('%', ''))) > 10;
                    
                    return (
                      <div
                        key={project.id}
                        onClick={() => setSelectedMonitoringProject(project.id)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-gray-50 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-800 text-sm truncate">
                                {project.name}
                              </h4>
                              {isFluctuating && (
                                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">{project.location}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                project.risk === 'Low' ? 'bg-green-100 text-green-700' :
                                project.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {project.risk} Risk
                              </span>
                              <span className={`text-xs font-medium ${
                                project.fluctuation.startsWith('+') ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {project.fluctuation}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleProjectAnalysis(selectedMonitoringProject)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Generate Report
                  </button>
                  <button 
                    onClick={() => handleFlagForReview(selectedMonitoringProject)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-xl font-medium hover:bg-yellow-700 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Flag for Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Reporting Dashboard */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Reporting Dashboard</h2>
          <p className="text-gray-600">Review drone sensor data and NGO field reports</p>
        </div>

        {/* Report Type Toggle */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setSelectedReportType('drone')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
              selectedReportType === 'drone'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Zap className="w-5 h-5 mr-2" />
            Drone Reports ({droneReports.filter(r => r.status === 'Pending Review').length} pending)
          </button>
          <button
            onClick={() => setSelectedReportType('ngo')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
              selectedReportType === 'ngo'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            NGO Reports ({ngoReports.filter(r => r.status === 'Pending Review').length} pending)
          </button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {(selectedReportType === 'drone' ? droneReports : ngoReports).map((report) => (
            <div key={report.id} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-blue-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedReportType === 'drone' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {selectedReportType === 'drone' ? (
                      <Zap className={`w-5 h-5 ${selectedReportType === 'drone' ? 'text-blue-600' : 'text-green-600'}`} />
                    ) : (
                      <Users className={`w-5 h-5 ${selectedReportType === 'drone' ? 'text-blue-600' : 'text-green-600'}`} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{report.projectName}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedReportType === 'drone' ? report.droneId : report.ngoName}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  report.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-700' :
                  report.status === 'Approved' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {report.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {report.reportDate}
                  <span className={`ml-auto px-2 py-1 rounded text-xs ${
                    report.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                    report.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                    report.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {report.priority}
                  </span>
                </div>

                {selectedReportType === 'drone' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <Thermometer className="w-4 h-4 mr-1 text-orange-500" />
                      <span>{report.sensors.co2Levels.value} {report.sensors.co2Levels.unit}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Wind className="w-4 h-4 mr-1 text-blue-500" />
                      <span>{report.sensors.temperature.value}°C</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Droplets className="w-4 h-4 mr-1 text-cyan-500" />
                      <span>{report.sensors.humidity.value}%</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Camera className="w-4 h-4 mr-1 text-purple-500" />
                      <span>{report.images.length} images</span>
                    </div>
                  </div>
                )}

                {selectedReportType === 'ngo' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Field Officer:</span>
                      <span className="font-medium">{report.fieldOfficer}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Assessment Type:</span>
                      <span className="font-medium">{report.reportType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Carbon Impact:</span>
                      <span className="font-medium text-green-600">
                        {report.carbonAssessment.estimatedSequestration || report.carbonAssessment.estimatedReduction} tCO2
                      </span>
                    </div>
                  </div>
                )}

                {report.anomalies && report.anomalies.length > 0 && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center text-red-700 text-sm font-medium mb-1">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Issues Detected
                    </div>
                    <ul className="text-xs text-red-600 space-y-1">
                      {report.anomalies.slice(0, 2).map((anomaly, index) => (
                        <li key={index}>• {anomaly}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.concerns && report.concerns.length > 0 && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center text-yellow-700 text-sm font-medium mb-1">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Concerns
                    </div>
                    <ul className="text-xs text-yellow-600 space-y-1">
                      {report.concerns.slice(0, 2).map((concern, index) => (
                        <li key={index}>• {concern}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex space-x-2 pt-3">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Review
                  </button>
                  {report.status === 'Pending Review' && (
                    <>
                      <button
                        onClick={() => handleApproveReport(report.id, selectedReportType)}
                        className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFlagReport(report.id, selectedReportType)}
                        className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handleBulkApproveReports(selectedReportType)}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Approve All Pending {selectedReportType === 'drone' ? 'Drone' : 'NGO'} Reports
          </button>
        </div>
      </div>

        {/* Verification Dashboard */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Verification Dashboard</h2>
            <p className="text-gray-600">Verify land documents and schedule field inspections</p>
          </div>

          {/* Verification Type Toggle */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setSelectedVerificationTab('documents')}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
                selectedVerificationTab === 'documents'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileCheck className="w-5 h-5 mr-2" />
              Land Documents ({landDocuments.filter(d => d.status === 'Pending Verification').length} pending)
            </button>
            <button
              onClick={() => setSelectedVerificationTab('drone')}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
                selectedVerificationTab === 'drone'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CalendarDays className="w-5 h-5 mr-2" />
              Drone Scheduling ({droneScheduling.filter(s => s.status === 'Pending Assignment').length} pending)
            </button>
            <button
              onClick={() => setSelectedVerificationTab('ngo')}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
                selectedVerificationTab === 'ngo'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              NGO Scheduling ({ngoScheduling.filter(n => n.status === 'Pending Confirmation').length} pending)
            </button>
          </div>

          {/* Documents Verification */}
          {selectedVerificationTab === 'documents' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {landDocuments.map((doc) => (
                <div key={doc.id} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-purple-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{doc.projectName}</h3>
                        <p className="text-sm text-gray-600">{doc.ownerName}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      doc.status === 'Pending Verification' ? 'bg-yellow-100 text-yellow-700' :
                      doc.status === 'Verified' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      {doc.location}
                      <span className={`ml-auto px-2 py-1 rounded text-xs ${
                        doc.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                        doc.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                        doc.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {doc.priority}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Land Area:</span>
                        <div className="font-medium">{doc.landArea}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Risk Level:</span>
                        <div className={`font-medium ${
                          doc.riskLevel === 'Low' ? 'text-green-600' :
                          doc.riskLevel === 'Medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {doc.riskLevel}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-800 mb-2">Document Status</div>
                      <div className="space-y-1">
                        {doc.documents.slice(0, 3).map((document, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span>{document.type}</span>
                            <span className={`px-2 py-1 rounded-full ${
                              document.status === 'Verified' ? 'bg-green-100 text-green-700' :
                              document.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              document.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {document.status}
                            </span>
                          </div>
                        ))}
                        {doc.documents.length > 3 && (
                          <div className="text-xs text-gray-500">+{doc.documents.length - 3} more documents</div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-3">
                      <button
                        onClick={() => setSelectedVerificationItem(doc)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </button>
                      {doc.status === 'Pending Verification' && (
                        <>
                          <button
                            onClick={() => handleVerifyDocument(doc.id)}
                            className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleFlagDocument(doc.id)}
                            className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Drone Scheduling */}
          {selectedVerificationTab === 'drone' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                {droneScheduling.map((schedule) => (
                  <div key={schedule.id} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Zap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{schedule.projectName}</h3>
                          <p className="text-sm text-gray-600">{schedule.region}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        schedule.status === 'Pending Assignment' ? 'bg-yellow-100 text-yellow-700' :
                        schedule.status === 'Scheduled' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {schedule.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Preferred: {schedule.preferredDate}
                        <span className={`ml-auto px-2 py-1 rounded text-xs ${
                          schedule.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          schedule.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {schedule.priority}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <div className="font-medium">{schedule.estimatedDuration}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Weather:</span>
                          <div className={`font-medium ${
                            schedule.weatherConditions === 'Favorable' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {schedule.weatherConditions}
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-blue-800 mb-2">Available Drones</div>
                        <div className="space-y-1">
                          {schedule.availableDrones.slice(0, 2).map((drone, index) => (
                            <div key={index} className="text-xs text-blue-700">• {drone}</div>
                          ))}
                          {schedule.availableDrones.length > 2 && (
                            <div className="text-xs text-blue-600">+{schedule.availableDrones.length - 2} more available</div>
                          )}
                        </div>
                      </div>

                      {schedule.status === 'Scheduled' && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-green-800">Assigned</div>
                          <div className="text-sm text-green-700">
                            {schedule.assignedDrone} - {schedule.scheduledDate}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-3">
                        <button
                          onClick={() => setSelectedVerificationItem(schedule)}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </button>
                        {schedule.status === 'Pending Assignment' && (
                          <button
                            onClick={() => handleScheduleDrone(schedule.id, schedule.availableDrones[0])}
                            className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            <CalendarDays className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleBulkScheduleDrones}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Auto-Schedule All Pending Drone Visits
                </button>
              </div>
            </div>
          )}

          {/* NGO Scheduling */}
          {selectedVerificationTab === 'ngo' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {ngoScheduling.map((ngoSched) => (
                <div key={ngoSched.id} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-green-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{ngoSched.projectName}</h3>
                        <p className="text-sm text-gray-600">{ngoSched.ngoName}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ngoSched.status === 'Pending Confirmation' ? 'bg-yellow-100 text-yellow-700' :
                      ngoSched.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {ngoSched.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {ngoSched.status === 'Confirmed' ? `Confirmed: ${ngoSched.confirmedDate}` : `Preferred: ${ngoSched.preferredDate}`}
                      <span className={`ml-auto px-2 py-1 rounded text-xs ${
                        ngoSched.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                        ngoSched.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {ngoSched.priority}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Field Officer:</span>
                        <div className="font-medium">{ngoSched.fieldOfficer}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <div className="font-medium">{ngoSched.estimatedDuration}</div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-green-800 mb-2">Visit Details</div>
                      <div className="space-y-1 text-xs text-green-700">
                        <div>Type: {ngoSched.visitType}</div>
                        <div>Travel: {ngoSched.travelDistance}</div>
                        <div>Accommodation: {ngoSched.accommodationNeeded ? 'Required' : 'Not needed'}</div>
                      </div>
                    </div>

                    {ngoSched.specialRequirements && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-yellow-800 mb-1">Special Requirements</div>
                        <div className="text-xs text-yellow-700">{ngoSched.specialRequirements}</div>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-3">
                      <button
                        onClick={() => setSelectedVerificationItem(ngoSched)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </button>
                      {ngoSched.status === 'Pending Confirmation' && (
                        <>
                          <button
                            onClick={() => handleConfirmNGOVisit(ngoSched.id)}
                            className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRescheduleNGO(ngoSched.id)}
                            className="flex items-center justify-center px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Projects Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Pending Projects</h2>
            <p className="text-gray-600 mt-1">Projects awaiting verification and approval</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Project</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Developer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Expected Credits</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Cumulative Score</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{project.name}</div>
                          <div className="text-sm text-gray-500">{project.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{project.developer}</td>
                    <td className="px-6 py-4 text-gray-700">{project.location}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        {project.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{project.submittedDate}</td>
                    <td className="px-6 py-4 text-gray-700">{project.expectedCredits.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <ScoreBadge score={project.cumulativeScore} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Modal */}
        {selectedProject && (
          <ReviewModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {/* Detailed Report Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedReportType === 'drone' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {selectedReportType === 'drone' ? (
                        <Zap className={`w-6 h-6 ${selectedReportType === 'drone' ? 'text-blue-600' : 'text-green-600'}`} />
                      ) : (
                        <Users className={`w-6 h-6 ${selectedReportType === 'drone' ? 'text-blue-600' : 'text-green-600'}`} />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedReport.projectName}</h2>
                      <p className="text-gray-600 mt-1">
                        {selectedReportType === 'drone' ? `Drone ID: ${selectedReport.droneId}` : `NGO: ${selectedReport.ngoName}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <XCircle className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Images and Location */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {selectedReportType === 'drone' ? 'Captured Images' : 'Field Documentation'}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      {selectedReport.images.map((image) => (
                        <div key={image.id} className="relative">
                          <img
                            src={image.url}
                            alt={`${selectedReportType} image`}
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            {image.type} - {image.timestamp}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-800 mb-2">Location Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span>{selectedReport.location || selectedReport.projectName}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span>Report Date: {selectedReport.reportDate}</span>
                        </div>
                        {selectedReportType === 'ngo' && (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-400 mr-2" />
                            <span>Visit Date: {selectedReport.visitDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Data and Analysis */}
                  <div>
                    {selectedReportType === 'drone' ? (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sensor Data</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <Thermometer className="w-5 h-5 text-blue-600 mr-2" />
                                  <span className="font-medium">CO₂ Levels</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  selectedReport.sensors.co2Levels.status === 'Normal' ? 'bg-green-100 text-green-700' :
                                  selectedReport.sensors.co2Levels.status === 'Excellent' ? 'bg-blue-100 text-blue-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {selectedReport.sensors.co2Levels.status}
                                </span>
                              </div>
                              <div className="text-2xl font-bold text-blue-600">
                                {selectedReport.sensors.co2Levels.value} {selectedReport.sensors.co2Levels.unit}
                              </div>
                              <div className="text-sm text-gray-600">
                                Change: {selectedReport.sensors.co2Levels.change}
                              </div>
                            </div>

                            <div className="bg-orange-50 p-4 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <Thermometer className="w-5 h-5 text-orange-600 mr-2" />
                                  <span className="font-medium">Temperature</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  selectedReport.sensors.temperature.status === 'Normal' ? 'bg-green-100 text-green-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {selectedReport.sensors.temperature.status}
                                </span>
                              </div>
                              <div className="text-2xl font-bold text-orange-600">
                                {selectedReport.sensors.temperature.value}°C
                              </div>
                              <div className="text-sm text-gray-600">
                                Change: {selectedReport.sensors.temperature.change}
                              </div>
                            </div>

                            <div className="bg-cyan-50 p-4 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <Droplets className="w-5 h-5 text-cyan-600 mr-2" />
                                  <span className="font-medium">Humidity</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  selectedReport.sensors.humidity.status === 'Normal' ? 'bg-green-100 text-green-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {selectedReport.sensors.humidity.status}
                                </span>
                              </div>
                              <div className="text-2xl font-bold text-cyan-600">
                                {selectedReport.sensors.humidity.value}%
                              </div>
                              <div className="text-sm text-gray-600">
                                Change: {selectedReport.sensors.humidity.change}
                              </div>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <Wind className="w-5 h-5 text-purple-600 mr-2" />
                                  <span className="font-medium">Wind Speed</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  selectedReport.sensors.windSpeed.status === 'Normal' ? 'bg-green-100 text-green-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {selectedReport.sensors.windSpeed.status}
                                </span>
                              </div>
                              <div className="text-2xl font-bold text-purple-600">
                                {selectedReport.sensors.windSpeed.value} km/h
                              </div>
                              <div className="text-sm text-gray-600">
                                Change: {selectedReport.sensors.windSpeed.change}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment Areas</h3>
                          <div className="space-y-3">
                            {selectedReport.assessmentAreas.map((area, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-800">{area.area}</span>
                                  <ScoreBadge score={area.score} />
                                </div>
                                <p className="text-sm text-gray-600">{area.notes}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-xl">
                          <h4 className="font-semibold text-green-800 mb-2">Carbon Assessment</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Estimated Impact:</span>
                              <span className="font-medium">
                                {selectedReport.carbonAssessment.estimatedSequestration || selectedReport.carbonAssessment.estimatedReduction} tCO₂
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Method:</span>
                              <span className="font-medium">{selectedReport.carbonAssessment.verificationMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Confidence:</span>
                              <span className={`font-medium ${
                                selectedReport.carbonAssessment.confidence === 'High' ? 'text-green-600' :
                                selectedReport.carbonAssessment.confidence === 'Medium' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {selectedReport.carbonAssessment.confidence}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{selectedReport.carbonAssessment.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Issues and Recommendations */}
                    <div className="space-y-4">
                      {((selectedReportType === 'drone' && selectedReport.anomalies?.length > 0) ||
                        (selectedReportType === 'ngo' && selectedReport.concerns?.length > 0)) && (
                        <div className="bg-red-50 p-4 rounded-xl">
                          <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2" />
                            {selectedReportType === 'drone' ? 'Anomalies Detected' : 'Concerns Raised'}
                          </h4>
                          <ul className="text-sm text-red-700 space-y-1">
                            {(selectedReportType === 'drone' ? selectedReport.anomalies : selectedReport.concerns)?.map((item, index) => (
                              <li key={index}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="bg-blue-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
                        <p className="text-sm text-blue-700">{selectedReport.recommendations}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                {selectedReport.status === 'Pending Review' && (
                  <>
                    <button
                      onClick={() => handleRescheduleReport(selectedReport.id, selectedReportType)}
                      className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleFlagReport(selectedReport.id, selectedReportType)}
                      className="flex items-center px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Flag for Review
                    </button>
                    <button
                      onClick={() => handleApproveReport(selectedReport.id, selectedReportType)}
                      className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Approve Report
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Verification Detail Modal */}
        {selectedVerificationItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedVerificationTab === 'documents' ? 'bg-purple-100' :
                      selectedVerificationTab === 'drone' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {selectedVerificationTab === 'documents' ? (
                        <FileCheck className={`w-6 h-6 ${
                          selectedVerificationTab === 'documents' ? 'text-purple-600' :
                          selectedVerificationTab === 'drone' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      ) : selectedVerificationTab === 'drone' ? (
                        <Zap className={`w-6 h-6 ${
                          selectedVerificationTab === 'documents' ? 'text-purple-600' :
                          selectedVerificationTab === 'drone' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      ) : (
                        <Users className={`w-6 h-6 ${
                          selectedVerificationTab === 'documents' ? 'text-purple-600' :
                          selectedVerificationTab === 'drone' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedVerificationItem.projectName}</h2>
                      <p className="text-gray-600 mt-1">
                        {selectedVerificationTab === 'documents' ? `Owner: ${selectedVerificationItem.ownerName}` :
                         selectedVerificationTab === 'drone' ? `Region: ${selectedVerificationItem.region}` :
                         `NGO: ${selectedVerificationItem.ngoName}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVerificationItem(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <XCircle className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {selectedVerificationTab === 'documents' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Project Image and Basic Info */}
                    <div>
                      <img
                        src={selectedVerificationItem.image}
                        alt={selectedVerificationItem.projectName}
                        className="w-full h-64 object-cover rounded-xl mb-6"
                      />
                      
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-4">Property Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Land Area:</span>
                            <span className="font-medium">{selectedVerificationItem.landArea}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span className="font-medium">{selectedVerificationItem.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Submitted:</span>
                            <span className="font-medium">{selectedVerificationItem.submittedDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Risk Level:</span>
                            <span className={`font-medium ${
                              selectedVerificationItem.riskLevel === 'Low' ? 'text-green-600' :
                              selectedVerificationItem.riskLevel === 'Medium' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {selectedVerificationItem.riskLevel}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-xl mt-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Verification Notes</h4>
                        <p className="text-sm text-blue-700">{selectedVerificationItem.verificationNotes}</p>
                      </div>
                    </div>

                    {/* Right Column - Document Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Verification Status</h3>
                      <div className="space-y-4">
                        {selectedVerificationItem.documents.map((doc, index) => (
                          <div key={index} className="bg-white border rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <div>
                                  <h4 className="font-medium text-gray-800">{doc.type}</h4>
                                  <p className="text-sm text-gray-500">{doc.size} • {doc.uploadDate}</p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                doc.status === 'Verified' ? 'bg-green-100 text-green-700' :
                                doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                doc.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {doc.status}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                                View Document
                              </button>
                              {doc.status === 'Pending' && (
                                <>
                                  <button className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
                                    Verify
                                  </button>
                                  <button className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                                    Flag
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedVerificationTab === 'drone' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Schedule Details */}
                    <div>
                      <img
                        src={selectedVerificationItem.image}
                        alt={selectedVerificationItem.projectName}
                        className="w-full h-64 object-cover rounded-xl mb-6"
                      />
                      
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-4">Schedule Information</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Request Date:</span>
                            <span className="font-medium">{selectedVerificationItem.requestDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Preferred Date:</span>
                            <span className="font-medium">{selectedVerificationItem.preferredDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{selectedVerificationItem.estimatedDuration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Weather:</span>
                            <span className={`font-medium ${
                              selectedVerificationItem.weatherConditions === 'Favorable' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {selectedVerificationItem.weatherConditions}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-xl mt-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">Accessibility Notes</h4>
                        <p className="text-sm text-yellow-700">{selectedVerificationItem.accessibilityNotes}</p>
                      </div>
                    </div>

                    {/* Right Column - Drone Assignment */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Drone Assignment</h3>
                      <div className="space-y-4">
                        {selectedVerificationItem.availableDrones.map((drone, index) => (
                          <div key={index} className="bg-white border rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <Zap className="w-5 h-5 text-blue-600" />
                                <div>
                                  <h4 className="font-medium text-gray-800">{drone}</h4>
                                  <p className="text-sm text-gray-500">{selectedVerificationItem.droneType}</p>
                                </div>
                              </div>
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                Available
                              </span>
                            </div>
                            <button 
                              onClick={() => handleScheduleDrone(selectedVerificationItem.id, drone)}
                              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                            >
                              Assign {drone}
                            </button>
                          </div>
                        ))}
                      </div>

                      {selectedVerificationItem.status === 'Scheduled' && (
                        <div className="bg-green-50 p-4 rounded-xl mt-4">
                          <h4 className="font-semibold text-green-800 mb-2">Scheduled Assignment</h4>
                          <div className="space-y-2 text-sm text-green-700">
                            <div>Drone: {selectedVerificationItem.assignedDrone}</div>
                            <div>Date: {selectedVerificationItem.scheduledDate}</div>
                            <div>Status: Confirmed</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedVerificationTab === 'ngo' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Visit Details */}
                    <div>
                      <img
                        src={selectedVerificationItem.image}
                        alt={selectedVerificationItem.projectName}
                        className="w-full h-64 object-cover rounded-xl mb-6"
                      />
                      
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-4">Visit Information</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Field Officer:</span>
                            <span className="font-medium">{selectedVerificationItem.fieldOfficer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Visit Type:</span>
                            <span className="font-medium">{selectedVerificationItem.visitType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{selectedVerificationItem.estimatedDuration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Travel Distance:</span>
                            <span className="font-medium">{selectedVerificationItem.travelDistance}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Accommodation:</span>
                            <span className={`font-medium ${
                              selectedVerificationItem.accommodationNeeded ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {selectedVerificationItem.accommodationNeeded ? 'Required' : 'Not needed'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-xl mt-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Local Contact</h4>
                        <p className="text-sm text-blue-700">{selectedVerificationItem.localContact}</p>
                      </div>
                    </div>

                    {/* Right Column - Requirements and Confirmation */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Visit Requirements</h3>
                      
                      <div className="bg-yellow-50 p-4 rounded-xl mb-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">Special Requirements</h4>
                        <p className="text-sm text-yellow-700">{selectedVerificationItem.specialRequirements}</p>
                      </div>

                      <div className="bg-white border rounded-xl p-4 mb-4">
                        <h4 className="font-semibold text-gray-800 mb-3">NGO Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Organization:</span>
                            <span className="font-medium">{selectedVerificationItem.ngoName}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium">{selectedVerificationItem.ngoType}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Request Date:</span>
                            <span className="font-medium">{selectedVerificationItem.requestDate}</span>
                          </div>
                        </div>
                      </div>

                      {selectedVerificationItem.status === 'Confirmed' && (
                        <div className="bg-green-50 p-4 rounded-xl">
                          <h4 className="font-semibold text-green-800 mb-2">Confirmed Schedule</h4>
                          <div className="space-y-2 text-sm text-green-700">
                            <div>Date: {selectedVerificationItem.confirmedDate}</div>
                            <div>Officer: {selectedVerificationItem.fieldOfficer}</div>
                            <div>Status: Confirmed</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                {selectedVerificationTab === 'documents' && selectedVerificationItem.status === 'Pending Verification' && (
                  <>
                    <button
                      onClick={() => handleFlagDocument(selectedVerificationItem.id)}
                      className="flex items-center px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Flag for Review
                    </button>
                    <button
                      onClick={() => handleVerifyDocument(selectedVerificationItem.id)}
                      className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Verify Documents
                    </button>
                  </>
                )}

                {selectedVerificationTab === 'drone' && selectedVerificationItem.status === 'Pending Assignment' && (
                  <button
                    onClick={() => handleScheduleDrone(selectedVerificationItem.id, selectedVerificationItem.availableDrones[0])}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <CalendarDays className="w-5 h-5 mr-2" />
                    Schedule Visit
                  </button>
                )}

                {selectedVerificationTab === 'ngo' && selectedVerificationItem.status === 'Pending Confirmation' && (
                  <>
                    <button
                      onClick={() => handleRescheduleNGO(selectedVerificationItem.id)}
                      className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleConfirmNGOVisit(selectedVerificationItem.id)}
                      className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirm Visit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};