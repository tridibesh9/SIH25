import React, { useState, useEffect, useCallback } from 'react';
import { Eye, CheckCircle, XCircle, Shield, Users, Bot, RotateCcw, ThumbsDown, ThumbsUp, ExternalLink, ChevronLeft, ChevronRight, FileText, Camera, Upload, Download, Calendar, MapPin, Clock, ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from './adminApiServices';
import StatCard from './Components/StatCard';
import MonitoringPanel from './Components/MonitoringPanel';

// --- Helper Components ---

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg',
        landApproval: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg',
        ngoAssigning: 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg',
        ngoAssigned: 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow-lg',
        droneAssigning: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg',
        droneAssigned: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg',
        adminApproval: 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg',
        accepted: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg',
        approved: 'bg-gradient-to-r from-green-600 to-teal-500 text-white shadow-lg',
        rejected: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg',
    };
    const statusText = status ? status.replace(/_/g, ' ') : 'Unknown';
    return <span className={`px-4 py-2 text-sm font-semibold rounded-full capitalize transition-all duration-300 hover:scale-105 ${styles[status] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg'}`}>{statusText}</span>;
};

const ProjectCard = ({ project, children, onDetailsClick }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group overflow-hidden">
        <div className="flex-grow p-5">
            {project.projectImages && project.projectImages.length > 0 ? (
                 <img src={project.projectImages[0]} alt={project.projectName} className="w-full h-44 object-cover rounded-xl mb-4 transition-transform duration-300 group-hover:scale-105" />
            ) : (
                <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center transition-all duration-300 group-hover:from-gray-200 group-hover:to-gray-300">
                    <span className="text-gray-500 text-sm font-medium">No Image</span>
                </div>
            )}
            <h4 className="font-bold text-gray-800 text-lg leading-tight mb-2 group-hover:text-blue-700 transition-colors duration-300">{project.projectName}</h4>
            <div className="flex items-center text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                <span>{project.location}</span>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-2">
                <span className="font-medium text-gray-700">Owner:</span> {project.owner}
            </div>
        </div>
        <div className="p-5 pt-0 space-y-3">
             <button onClick={() => onDetailsClick(project)} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl">
                <Eye className="w-4 h-4 mr-2"/> View Details
            </button>
            {children}
        </div>
    </div>
);

const ProjectDetailsModal = ({ project, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!project) return null;

    const images = project.projectImages || [];

    const nextImage = () => {
        if (images.length > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (images.length > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">
                    <XCircle size={28} />
                </button>
                <div className="p-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">{project.projectName}</h2>
                        <p className="text-gray-600">{project.location} | <span className="capitalize font-medium text-blue-600">{project.type}</span></p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Project Images</h3>
                            {images.length > 0 ? (
                                <div className="relative">
                                    <img src={images[currentImageIndex]} alt={`${project.projectName} ${currentImageIndex + 1}`} className="w-full h-80 object-cover rounded-lg shadow-md" />
                                    {images.length > 1 && (
                                        <>
                                            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white transition">
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full hover:bg-white transition">
                                                <ChevronRight size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-500">No images available.</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Project Information</h3>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Owner</label>
                                <p className="text-gray-800">{project.owner}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Contact</label>
                                <p className="text-gray-800">{project.email} | {project.contactNumber}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Site Description</label>
                                <p className="text-gray-800 text-sm">{project.siteDescription || 'No description provided.'}</p>
                            </div>
                            <a href={project.landDocuments} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                View Land Documents <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2 flex items-center"><Users className="w-5 h-5 mr-2 text-blue-600" /> NGO Verification Report</h4>
                                {project.siteVerification && Object.keys(project.siteVerification).length > 0 ? (
                                    <pre className="bg-gray-100 p-3 rounded-md text-xs text-gray-800 overflow-auto max-h-48">
                                        {JSON.stringify(project.siteVerification, null, 2)}
                                    </pre>
                                ) : <p className="text-sm text-gray-500">No NGO data submitted yet.</p>}
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><Bot className="w-5 h-5 mr-2 text-indigo-600" /> Drone Survey Data</h4>
                                {project.droneSurvey && Object.keys(project.droneSurvey).length > 0 ? (
                                    <pre className="bg-gray-100 p-3 rounded-md text-xs text-gray-800 overflow-auto max-h-48">
                                        {JSON.stringify(project.droneSurvey, null, 2)}
                                    </pre>
                                ) : <p className="text-sm text-gray-500">No drone data submitted yet.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
    
const MainTabButton = ({ label, value, icon, count, activeTab, setActiveTab }) => (
    <button onClick={() => setActiveTab(value)} className={`flex items-center space-x-3 px-6 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${activeTab === value ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl' : 'text-gray-700 hover:bg-white hover:shadow-lg bg-gray-50 border border-gray-200'}`}>
        <div className={`p-1 rounded-lg ${activeTab === value ? 'bg-white/20' : 'bg-blue-100'}`}>
            {React.cloneElement(icon, { className: `w-4 h-4 ${activeTab === value ? 'text-white' : 'text-blue-600'}` })}
        </div>
        <span>{label}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${activeTab === value ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'}`}>{count || 0}</span>
    </button>
);

const SubTabButton = ({ label, value, active, setActive, count }) => (
    <button onClick={() => setActive(value)} className={`px-5 py-2.5 text-sm rounded-xl font-medium transition-all duration-300 ${active === value ? 'bg-white text-blue-600 font-bold shadow-lg transform scale-105' : 'text-gray-600 hover:bg-white/70 hover:text-blue-500'}`}>
        {label} ({count || 0})
    </button>
);

// Reporting Panel Component
const ReportingPanel = ({ droneReports, ngoReports, activeReportTab, setActiveReportTab }) => {
    const navigate = useNavigate();
    
    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-blue-600" />
                    Reports Dashboard
                </h2>
                <button 
                    onClick={() => navigate('/admin/drone-upload')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Drone Images
                </button>
            </div>
            
            <div className="flex space-x-4 mb-6">
                <button 
                    onClick={() => setActiveReportTab('drone')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        activeReportTab === 'drone' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    <Bot className="w-4 h-4 inline mr-2" />
                    Drone Reports ({droneReports.length})
                </button>
                <button 
                    onClick={() => setActiveReportTab('ngo')}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        activeReportTab === 'ngo' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    <Users className="w-4 h-4 inline mr-2" />
                    NGO Reports ({ngoReports.length})
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeReportTab === 'drone' ? (
                    droneReports.length > 0 ? droneReports.map((report, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-800">{report.projectName || `Project #${report.projectId}`}</h3>
                                <span className="text-xs text-gray-500">{report.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{report.location}</p>
                            <div className="flex items-center text-sm text-blue-600 mb-2">
                                <Bot className="w-4 h-4 mr-1" />
                                {report.droneName || 'Drone Survey'}
                            </div>
                            {report.images && report.images.length > 0 && (
                                <div className="flex items-center text-sm text-green-600 mb-2">
                                    <ImageIcon className="w-4 h-4 mr-1" />
                                    {report.images.length} Images
                                </div>
                            )}
                            <p className="text-xs text-gray-500">{report.description || 'Survey completed successfully'}</p>
                            {report.surveyData && (
                                <button className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                                    View Survey Data
                                </button>
                            )}
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            <Bot className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No drone reports available</p>
                        </div>
                    )
                ) : (
                    ngoReports.length > 0 ? ngoReports.map((report, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-800">{report.projectName || `Project #${report.projectId}`}</h3>
                                <span className="text-xs text-gray-500">{report.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{report.location}</p>
                            <div className="flex items-center text-sm text-green-600 mb-2">
                                <Users className="w-4 h-4 mr-1" />
                                {report.ngoName || 'NGO Verification'}
                            </div>
                            <p className="text-xs text-gray-500">{report.description || 'Site verification completed'}</p>
                            {report.verificationData && (
                                <button className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
                                    View Verification Data
                                </button>
                            )}
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No NGO reports available</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export const AdminDashboard = () => {
    const [projects, setProjects] = useState({
        pending: [], landApproval: [], ngoAssigned: [],
        droneAssigning: [], droneAssigned: [], adminApproval: [],
        approved: [], rejected: [],
    });
    const [loading, setLoading] = useState(true);
    const [selectedProjectForDetails, setSelectedProjectForDetails] = useState(null);
    const [activeMainTab, setActiveMainTab] = useState('land');
    const [activeNgoTab, setActiveNgoTab] = useState('assigning');
    const [activeDroneTab, setActiveDroneTab] = useState('assigning');
    const [reasons, setReasons] = useState({});
    const [overview, setOverview] = useState({});
    const [availableNgos, setAvailableNgos] = useState([]);
    const [availableDrones, setAvailableDrones] = useState([]);
    const [activeReportTab, setActiveReportTab] = useState('drone');
    const [droneReports, setDroneReports] = useState([]);
    const [ngoReports, setNgoReports] = useState([]);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const [
                overviewData, ngosData, dronesData,
                pending, landApproval, ngoAssigned, droneAssigning,
                droneAssigned, adminApproval, accepted, rejected
            ] = await Promise.all([
                apiService.fetchOverview(),
                apiService.fetchNgos(),
                apiService.fetchDrones(),
                apiService.fetchProjectsByStatus('pending'),
                apiService.fetchProjectsByStatus('landApproval'),
                apiService.fetchProjectsByStatus('ngoAssigned'),
                apiService.fetchProjectsByStatus('droneAssigning'),
                apiService.fetchProjectsByStatus('droneAssigned'),
                apiService.fetchProjectsByStatus('adminApproval'),
                apiService.fetchProjectsByStatus('accepted'),
                apiService.fetchProjectsByStatus('rejected'),
            ]);

            setOverview(overviewData);
            setAvailableNgos(ngosData);
            setAvailableDrones(dronesData);
            
            setProjects({
                pending: pending || [],
                landApproval: landApproval || [],
                ngoAssigned: ngoAssigned || [],
                droneAssigning: droneAssigning || [],
                droneAssigned: droneAssigned || [],
                adminApproval: adminApproval || [],
                approved: accepted || [],
                rejected: rejected || [],
            });

            // Fetch reports data
            await fetchReports();
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            alert('Failed to load dashboard data. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchReports = async () => {
        try {
            // These would be actual API calls to fetch reports
            // For now, using mock data
            const mockDroneReports = [
                {
                    projectId: '1',
                    projectName: 'Forest Restoration Project',
                    location: 'Mumbai, Maharashtra',
                    droneName: 'DJI Mavic Pro',
                    date: '2025-09-25',
                    description: 'Aerial survey completed successfully',
                    images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
                    surveyData: { area: '50 hectares', trees: '2500+' }
                },
                {
                    projectId: '2',
                    projectName: 'Solar Farm Installation',
                    location: 'Rajasthan',
                    droneName: 'DJI Phantom 4',
                    date: '2025-09-20',
                    description: 'Site mapping and analysis complete',
                    images: ['img4.jpg', 'img5.jpg'],
                    surveyData: { area: '100 hectares', potential: 'High' }
                }
            ];

            const mockNgoReports = [
                {
                    projectId: '1',
                    projectName: 'Forest Restoration Project',
                    location: 'Mumbai, Maharashtra',
                    ngoName: 'Green Earth Foundation',
                    date: '2025-09-22',
                    description: 'Site verification completed, land suitable for restoration',
                    verificationData: { landQuality: 'Good', accessibility: 'Moderate' }
                },
                {
                    projectId: '3',
                    projectName: 'Wind Energy Project',
                    location: 'Gujarat',
                    ngoName: 'Environmental Watch',
                    date: '2025-09-18',
                    description: 'Environmental impact assessment completed',
                    verificationData: { impact: 'Minimal', approval: 'Recommended' }
                }
            ];

            setDroneReports(mockDroneReports);
            setNgoReports(mockNgoReports);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleAction = async (action, successMsg, ...params) => {
        try {
            const response = await action(...params);
            if (response.success) {
                alert(successMsg);
                fetchAllData();
                setReasons(prev => {
                    const newReasons = {...prev};
                    delete newReasons[params[0]];
                    delete newReasons[`redo-${params[0]}`];
                    return newReasons;
                });
            } else {
                alert(`Error: ${response.message || 'An unknown error occurred'}`);
            }
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };
    
    const handleLandApproval = (projectId) => handleAction(apiService.movePendingToLandApproval, 'Project moved to NGO assignment', projectId, 'Land verification approved');
    const handleAssignNgo = (projectId, ngoId) => handleAction(apiService.assignNgo, 'NGO assigned successfully', projectId, ngoId, 'NGO assigned for verification');
    const handleNgoApproval = (projectId) => handleAction(apiService.moveNgoToDroneAssigning, 'NGO verification approved', projectId, 'NGO approved, moving to drone assignment');
    const handleAssignDrone = (projectId, droneId) => handleAction(apiService.assignDrone, 'Drone assigned successfully', projectId, droneId, 'Drone assigned for verification');
    const handleDroneApproval = (projectId) => handleAction(apiService.moveDroneToAdminApproval, 'Drone verification approved', projectId, 'Drone survey approved, ready for final review');

    const handleFinalApproval = (projectId) => {
        const carbonCredits = prompt('Enter carbon credits amount:');
        if (carbonCredits && !isNaN(carbonCredits)) {
            handleAction(apiService.approveProject, 'Project approved successfully', projectId, 'Final approval granted', parseInt(carbonCredits));
        } else if (carbonCredits !== null) {
            alert('Valid carbon credits amount is required');
        }
    };

    const handleReject = (projectId) => {
        const reason = reasons[projectId];
        if (!reason) return alert('Rejection reason is required');
        handleAction(apiService.rejectProject, 'Project rejected', projectId, reason);
    };

    const handleChangeStatus = (projectId, newStatus) => {
        const reason = reasons[`redo-${projectId}`];
        if (!reason) return alert('A reason for the redo request is required');
        handleAction(apiService.changeStatus, `Project sent back to ${newStatus}`, projectId, newStatus, reason);
    };

    // Get all projects for monitoring panel
    const getAllProjects = () => {
        return [
            ...projects.pending,
            ...projects.landApproval,
            ...projects.ngoAssigned,
            ...projects.droneAssigning,
            ...projects.droneAssigned,
            ...projects.adminApproval,
            ...projects.approved,
            ...projects.rejected,
        ];
    };
    
    return (
        <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Admin Verification Dashboard</h1>
                    <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">Review, approve, and manage carbon credit projects with streamlined workflows.</p>
                </div>

                {/* Monitoring Panel */}
                <MonitoringPanel 
                    projects={getAllProjects()}
                    overview={overview}
                    onProjectClick={setSelectedProjectForDetails}
                    loading={loading}
                />

                {/* Reporting Panel */}
                <ReportingPanel 
                    droneReports={droneReports}
                    ngoReports={ngoReports}
                    activeReportTab={activeReportTab}
                    setActiveReportTab={setActiveReportTab}
                />
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
                    <StatCard title="Pending Land" value={overview.pending || 0} icon={<Shield size={24} className="text-purple-500"/>} colorClass="border-purple-500 bg-purple-50" />
                    <StatCard title="Pending NGO" value={(overview.landApproval || 0) + (overview.ngoAssigned || 0)} icon={<Users size={24} className="text-blue-500"/>} colorClass="border-blue-500 bg-blue-50" />
                    <StatCard title="Pending Drone" value={(overview.droneAssigning || 0) + (overview.droneAssigned || 0)} icon={<Bot size={24} className="text-indigo-500"/>} colorClass="border-indigo-500 bg-indigo-50" />
                    <StatCard title="Final Review" value={overview.adminApproval || 0} icon={<CheckCircle size={24} className="text-orange-500"/>} colorClass="border-orange-500 bg-orange-50" />
                    <StatCard title="Approved" value={overview.accepted || 0} icon={<ThumbsUp size={24} className="text-green-500"/>} colorClass="border-green-500 bg-green-50" />
                    <StatCard title="Rejected" value={overview.rejected || 0} icon={<ThumbsDown size={24} className="text-red-500"/>} colorClass="border-red-500 bg-red-50" />
                </div>

                <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 pb-6 mb-8 bg-white rounded-2xl p-6 shadow-lg">
                    <MainTabButton label="Land Verification" value="land" icon={<Shield size={18}/>} count={overview.pending} activeTab={activeMainTab} setActiveTab={setActiveMainTab}/>
                    <MainTabButton label="NGO Verification" value="ngo" icon={<Users size={18}/>} count={(overview.landApproval || 0) + (overview.ngoAssigned || 0)} activeTab={activeMainTab} setActiveTab={setActiveMainTab}/>
                    <MainTabButton label="Drone Verification" value="drone" icon={<Bot size={18}/>} count={(overview.droneAssigning || 0) + (overview.droneAssigned || 0)} activeTab={activeMainTab} setActiveTab={setActiveMainTab}/>
                    <MainTabButton label="Final Approval" value="admin" icon={<CheckCircle size={18}/>} count={overview.adminApproval} activeTab={activeMainTab} setActiveTab={setActiveMainTab}/>
                    <MainTabButton label="Approved" value="approved" icon={<ThumbsUp size={18}/>} count={overview.accepted} activeTab={activeMainTab} setActiveTab={setActiveMainTab}/>
                    <MainTabButton label="Rejected" value="rejected" icon={<ThumbsDown size={18}/>} count={overview.rejected} activeTab={activeMainTab} setActiveTab={setActiveMainTab}/>
                </div>
                
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-24">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200"></div>
                            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                        </div>
                        <p className="mt-6 text-gray-600 text-lg font-medium">Loading Projects...</p>
                        <p className="text-gray-400 text-sm">Please wait while we fetch the latest data</p>
                    </div>
                ) : (
                    <div>
                        {activeMainTab === 'land' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {projects.pending.length > 0 ? projects.pending.map(p => (
                                    <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleLandApproval(p.projectId)} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 mr-2" />Approve
                                            </button>
                                            <button onClick={() => handleReject(p.projectId)} className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                                                <XCircle className="w-4 h-4 mr-2" />Reject
                                            </button>
                                        </div>
                                        <textarea value={reasons[p.projectId] || ''} onChange={(e) => setReasons(prev => ({...prev, [p.projectId]: e.target.value}))} placeholder="Enter rejection reason..." className="w-full border-0 bg-gray-50 rounded-xl shadow-inner text-sm p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-300 resize-none" rows="3"/>
                                    </ProjectCard>
                                )) : <p className="text-xl text-gray-500 col-span-full text-center py-16 font-medium">No projects pending land verification.</p>}
                            </div>
                        )}
                        {activeMainTab === 'ngo' && (
                            <div>
                                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-2 rounded-2xl flex items-center space-x-2 mb-8 max-w-md">
                                    <SubTabButton label="Awaiting Assignment" value="assigning" active={activeNgoTab} setActive={setActiveNgoTab} count={overview.landApproval}/>
                                    <SubTabButton label="Awaiting Approval" value="approval" active={activeNgoTab} setActive={setActiveNgoTab} count={overview.ngoAssigned}/>
                                </div>
                                {activeNgoTab === 'assigning' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {projects.landApproval.map(p => (
                                            <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                                <div className="space-y-3">
                                                    <select id={`ngo-${p.projectId}`} className="w-full border-0 bg-gray-50 rounded-xl shadow-inner p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-300">
                                                        {availableNgos.map(ngo => <option key={ngo._id} value={ngo._id}>{ngo.name} ({ngo.location})</option>)}
                                                    </select>
                                                    <button onClick={() => handleAssignNgo(p.projectId, document.getElementById(`ngo-${p.projectId}`).value)} className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                                                        <Users className="w-4 h-4 mr-2" />Assign NGO
                                                    </button>
                                                </div>
                                            </ProjectCard>
                                        ))}
                                    </div>
                                )}
                                {activeNgoTab === 'approval' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {projects.ngoAssigned.map(p => (
                                            <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl mb-3 border border-blue-100">
                                                    <p className="text-sm font-medium text-blue-700 flex items-center">
                                                        <Users className="w-4 h-4 mr-2" />NGO Report Submitted
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2 mb-3">
                                                    <button onClick={() => handleNgoApproval(p.projectId)} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                                                        <CheckCircle className="w-4 h-4 mr-1" />Approve
                                                    </button>
                                                    <button onClick={() => handleChangeStatus(p.projectId, 'pending')} className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                                                        <RotateCcw className="w-4 h-4 mr-1" />Redo
                                                    </button>
                                                </div>
                                                <textarea value={reasons[`redo-${p.projectId}`] || ''} onChange={(e) => setReasons(prev => ({...prev, [`redo-${p.projectId}`]: e.target.value}))} placeholder="Enter reason for redo..." className="w-full border-0 bg-gray-50 rounded-xl shadow-inner text-sm p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-300 resize-none" rows="3"/>
                                            </ProjectCard>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {activeMainTab === 'drone' && (
                             <div>
                                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-2 rounded-2xl flex items-center space-x-2 mb-8 max-w-md">
                                    <SubTabButton label="Awaiting Assignment" value="assigning" active={activeDroneTab} setActive={setActiveDroneTab} count={overview.droneAssigning}/>
                                    <SubTabButton label="Awaiting Approval" value="approval" active={activeDroneTab} setActive={setActiveDroneTab} count={overview.droneAssigned}/>
                                </div>
                                
                                {activeDroneTab === 'assigning' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {projects.droneAssigning.map(p => (
                                            <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                                <div className="space-y-3">
                                                    <select id={`drone-${p.projectId}`} className="w-full border-0 bg-gray-50 rounded-xl shadow-inner p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all duration-300">
                                                        {availableDrones.map(drone => <option key={drone._id} value={drone._id}>{drone.model_name} ({drone.serving_location})</option>)}
                                                    </select>
                                                    <button onClick={() => handleAssignDrone(p.projectId, document.getElementById(`drone-${p.projectId}`).value)} className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                                                        <Bot className="w-4 h-4 mr-2" />Assign Drone
                                                    </button>
                                                </div>
                                            </ProjectCard>
                                        ))}
                                    </div>
                                )}
                                
                                {activeDroneTab === 'approval' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {projects.droneAssigned.map(p => (
                                            <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-xl mb-3 border border-purple-100">
                                                    <p className="text-sm font-medium text-purple-700 flex items-center">
                                                        <Bot className="w-4 h-4 mr-2" />Drone Survey Complete
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2 mb-3">
                                                    <button onClick={() => handleDroneApproval(p.projectId)} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                                                        <CheckCircle className="w-4 h-4 mr-1" />Approve
                                                    </button>
                                                    <button onClick={() => handleChangeStatus(p.projectId, 'landApproval')} className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                                                        <RotateCcw className="w-4 h-4 mr-1" />Redo
                                                    </button>
                                                </div>
                                                <textarea value={reasons[`redo-${p.projectId}`] || ''} onChange={(e) => setReasons(prev => ({...prev, [`redo-${p.projectId}`]: e.target.value}))} placeholder="Enter reason for redo..." className="w-full border-0 bg-gray-50 rounded-xl shadow-inner text-sm p-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all duration-300 resize-none" rows="3"/>
                                            </ProjectCard>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {activeMainTab === 'admin' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {projects.adminApproval.length > 0 ? projects.adminApproval.map(p => (
                                    <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                        <div className="space-y-3">
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleFinalApproval(p.projectId)} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                                                    <CheckCircle className="w-4 h-4 mr-2" />Final Approve
                                                </button>
                                                <button onClick={() => handleReject(p.projectId)} className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                                                    <XCircle className="w-4 h-4 mr-2" />Reject
                                                </button>
                                            </div>
                                            <textarea value={reasons[p.projectId] || ''} onChange={(e) => setReasons(prev => ({...prev, [p.projectId]: e.target.value}))} placeholder="Enter rejection reason..." className="w-full border-0 bg-gray-50 rounded-xl shadow-inner text-sm p-4 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all duration-300 resize-none" rows="3"/>
                                            <div className="border-t border-gray-200 pt-3">
                                                <label className="text-sm font-medium text-gray-700 mb-2 block">Send Back To:</label>
                                                <select id={`redo-${p.projectId}`} className="w-full border-0 bg-gray-50 rounded-xl shadow-inner text-sm p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 mb-3">
                                                    <option value="land approval">🏞️ Land Verification</option>
                                                    <option value="ngo">👥 NGO Verification</option>
                                                    <option value="drones">🚁 Drone Verification</option>
                                                </select>
                                                <button onClick={() => handleChangeStatus(p.projectId, document.getElementById(`redo-${p.projectId}`).value)} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
                                                    <RotateCcw className="w-4 h-4 mr-2"/> Send Back
                                                </button>
                                                <textarea value={reasons[`redo-${p.projectId}`] || ''} onChange={(e) => setReasons(prev => ({...prev, [`redo-${p.projectId}`]: e.target.value}))} placeholder="Enter reason for sending back..." className="mt-3 w-full border-0 bg-gray-50 rounded-xl shadow-inner text-sm p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 resize-none" rows="3"/>
                                            </div>
                                        </div>
                                    </ProjectCard>
                                )) : <p className="text-xl text-gray-500 col-span-full text-center py-16 font-medium">No projects awaiting final approval.</p>}
                            </div>
                        )}
                        {activeMainTab === 'approved' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {projects.approved.length > 0 ? projects.approved.map(p => (
                                    <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                        <div className="space-y-3">
                                            <StatusBadge status={p.verificationStatus} />
                                            {p.carbonCredits && (
                                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                                                    <p className="text-sm font-semibold text-green-700 flex items-center">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                        Carbon Credits: {p.carbonCredits}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </ProjectCard>
                                )) : <p className="text-xl text-gray-500 col-span-full text-center py-16 font-medium">No approved projects.</p>}
                            </div>
                        )}
                        {activeMainTab === 'rejected' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {projects.rejected.length > 0 ? projects.rejected.map(p => (
                                    <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                        <div className="space-y-3">
                                            <StatusBadge status={p.verificationStatus} />
                                            {p.message && (
                                                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                                                    <p className="text-sm font-semibold text-red-700">
                                                        <span className="font-bold">Reason:</span> {p.message}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </ProjectCard>
                                )) : <p className="text-xl text-gray-500 col-span-full text-center py-16 font-medium">No rejected projects.</p>}
                            </div>
                        )}
                    </div>
                )}
                
                {selectedProjectForDetails && (
                    <ProjectDetailsModal
                        project={selectedProjectForDetails}
                        onClose={() => setSelectedProjectForDetails(null)}
                    />
                )}
            </div>
        </div>
    );
};