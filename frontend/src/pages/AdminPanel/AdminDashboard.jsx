import React, { useState, useEffect, useCallback } from 'react';
import { Eye, CheckCircle, XCircle, Shield, Users, Bot, RotateCcw, ThumbsDown, ThumbsUp, ExternalLink, ChevronLeft, ChevronRight, FileText, Camera, Upload, Download, Calendar, MapPin, Clock, ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from './adminApiServices';
import StatCard from './Components/StatCard';
import MonitoringPanel from './Components/MonitoringPanel';

// --- Helper Components ---

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800',
        landApproval: 'bg-blue-100 text-blue-800',
        ngoAssigning: 'bg-indigo-100 text-indigo-800',
        ngoAssigned: 'bg-indigo-100 text-indigo-800',
        droneAssigning: 'bg-purple-100 text-purple-800',
        droneAssigned: 'bg-purple-100 text-purple-800',
        adminApproval: 'bg-orange-100 text-orange-800',
        accepted: 'bg-green-100 text-green-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };
    const statusText = status ? status.replace(/_/g, ' ') : 'Unknown';
    return <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{statusText}</span>;
};

const ProjectCard = ({ project, children, onDetailsClick }) => (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex flex-col h-full">
        <div className="flex-grow">
            {project.projectImages && project.projectImages.length > 0 ? (
                 <img src={project.projectImages[0]} alt={project.projectName} className="w-full h-40 object-cover rounded-md mb-4" />
            ) : (
                <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Image</span>
                </div>
            )}
            <h4 className="font-bold text-gray-800 text-md leading-tight">{project.projectName}</h4>
            <p className="text-sm text-gray-500 mb-2">{project.location}</p>
            <div className="text-xs text-gray-400">Owner: {project.owner}</div>
        </div>
        <div className="mt-4 space-y-2">
             <button onClick={() => onDetailsClick(project)} className="w-full bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm hover:bg-gray-200 flex items-center justify-center">
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
    <button onClick={() => setActiveTab(value)} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${activeTab === value ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}>
        {icon}
        <span>{label}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${activeTab === value ? 'bg-blue-100 text-blue-800' : 'bg-gray-300 text-gray-700'}`}>{count || 0}</span>
    </button>
);

const SubTabButton = ({ label, value, active, setActive, count }) => (
    <button onClick={() => setActive(value)} className={`px-4 py-1.5 text-sm rounded-md ${active === value ? 'bg-white text-blue-600 font-semibold shadow' : 'text-gray-500 hover:bg-white/50'}`}>
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
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Admin Verification Dashboard</h1>
                    <p className="text-lg text-gray-600 mt-2">Review, approve, and manage carbon credit projects.</p>
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

                <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4 mb-6">
                    <MainTabButton label="Land Verification" value="land" icon={<Shield size={18}/>} count={overview.pending} activeTab={activeMainTab} setActiveTab={setActiveMainTab}/>
                    <MainTabButton label="NGO Verification" value="ngo" icon={<Users size={18}/>} count={(overview.landApproval || 0) + (overview.ngoAssigned || 0)} activeTab={activeMainTab} setActiveTab={setActiveMainTab}/>
                    <MainTabButton label="Drone Verification" value="drone" icon={<Bot size={18}/>} count={(overview.droneAssigning || 0) + (overview.droneAssigned || 0)} activeTab={activeMainTab} setActiveTab={setActiveMainTab}/>
                    <MainTabButton label="Final Approval" value="admin" icon={<CheckCircle size={18}/>} count={overview.adminApproval} activeTab={activeMainTab} setActiveTab={setActiveMainTab}/>
                    <MainTabButton label="Approved" value="approved" icon={<ThumbsUp size={18}/>} count={overview.accepted} activeTab={activeMainTab} setActiveTab={setActiveMainTab}/>
                    <MainTabButton label="Rejected" value="rejected" icon={<ThumbsDown size={18}/>} count={overview.rejected} activeTab={activeMainTab} setActiveTab={setActiveMainTab}/>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">Loading Projects...</p>
                    </div>
                ) : (
                    <div>
                        {activeMainTab === 'land' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {projects.pending.length > 0 ? projects.pending.map(p => (
                                    <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                        <div className="flex space-x-2 mt-2">
                                            <button onClick={() => handleLandApproval(p.projectId)} className="w-full bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600">Approve</button>
                                            <button onClick={() => handleReject(p.projectId)} className="w-full bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600">Reject</button>
                                        </div>
                                        <textarea value={reasons[p.projectId] || ''} onChange={(e) => setReasons(prev => ({...prev, [p.projectId]: e.target.value}))} placeholder="Rejection reason..." className="mt-2 w-full border-gray-300 rounded-md shadow-sm text-sm p-2"/>
                                    </ProjectCard>
                                )) : <p className="text-lg text-gray-500 col-span-full text-center py-10">No projects pending land verification.</p>}
                            </div>
                        )}
                        {activeMainTab === 'ngo' && (
                            <div>
                                <div className="bg-gray-200 p-1 rounded-lg flex items-center space-x-2 mb-6 max-w-sm">
                                    <SubTabButton label="Awaiting Assignment" value="assigning" active={activeNgoTab} setActive={setActiveNgoTab} count={overview.landApproval}/>
                                    <SubTabButton label="Awaiting Approval" value="approval" active={activeNgoTab} setActive={setActiveNgoTab} count={overview.ngoAssigned}/>
                                </div>
                                {activeNgoTab === 'assigning' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                        {projects.landApproval.map(p => (
                                            <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                                <div className="space-y-2 mt-2">
                                                    <select id={`ngo-${p.projectId}`} className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm">
                                                        {availableNgos.map(ngo => <option key={ngo._id} value={ngo._id}>{ngo.name} ({ngo.location})</option>)}
                                                    </select>
                                                    <button onClick={() => handleAssignNgo(p.projectId, document.getElementById(`ngo-${p.projectId}`).value)} className="w-full bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600">Assign NGO</button>
                                                </div>
                                            </ProjectCard>
                                        ))}
                                    </div>
                                )}
                                {activeNgoTab === 'approval' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                        {projects.ngoAssigned.map(p => (
                                            <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                                <p className="text-xs my-2 p-2 bg-blue-50 rounded">NGO Report Submitted</p>
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleNgoApproval(p.projectId)} className="w-full bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600">Approve</button>
                                                    <button onClick={() => handleChangeStatus(p.projectId, 'pending')} className="w-full bg-yellow-500 text-white px-3 py-2 rounded-md text-sm hover:bg-yellow-600">Redo</button>
                                                </div>
                                                <textarea value={reasons[`redo-${p.projectId}`] || ''} onChange={(e) => setReasons(prev => ({...prev, [`redo-${p.projectId}`]: e.target.value}))} placeholder="Reason for redo..." className="mt-2 w-full border-gray-300 rounded-md shadow-sm text-sm p-2"/>
                                            </ProjectCard>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {activeMainTab === 'drone' && (
                             <div>
                                <div className="bg-gray-200 p-1 rounded-lg flex items-center space-x-2 mb-6 max-w-sm">
                                    <SubTabButton label="Awaiting Assignment" value="assigning" active={activeDroneTab} setActive={setActiveDroneTab} count={overview.droneAssigning}/>
                                    <SubTabButton label="Awaiting Approval" value="approval" active={activeDroneTab} setActive={setActiveDroneTab} count={overview.droneAssigned}/>
                                </div>
                                
                                {activeDroneTab === 'assigning' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                        {projects.droneAssigning.map(p => (
                                            <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                                <div className="space-y-2 mt-2">
                                                    <select id={`drone-${p.projectId}`} className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm">
                                                        {availableDrones.map(drone => <option key={drone._id} value={drone._id}>{drone.model_name} ({drone.serving_location})</option>)}
                                                    </select>
                                                    <button onClick={() => handleAssignDrone(p.projectId, document.getElementById(`drone-${p.projectId}`).value)} className="w-full bg-indigo-500 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-600">Assign Drone</button>
                                                </div>
                                            </ProjectCard>
                                        ))}
                                    </div>
                                )}
                                
                                {activeDroneTab === 'approval' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                        {projects.droneAssigned.map(p => (
                                            <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                                <p className="text-xs my-2 p-2 bg-indigo-50 rounded">Drone Survey Complete</p>
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleDroneApproval(p.projectId)} className="w-full bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600">Approve</button>
                                                    <button onClick={() => handleChangeStatus(p.projectId, 'landApproval')} className="w-full bg-yellow-500 text-white px-3 py-2 rounded-md text-sm hover:bg-yellow-600">Redo</button>
                                                </div>
                                                <textarea value={reasons[`redo-${p.projectId}`] || ''} onChange={(e) => setReasons(prev => ({...prev, [`redo-${p.projectId}`]: e.target.value}))} placeholder="Reason for redo..." className="mt-2 w-full border-gray-300 rounded-md shadow-sm text-sm p-2"/>
                                            </ProjectCard>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {activeMainTab === 'admin' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {projects.adminApproval.length > 0 ? projects.adminApproval.map(p => (
                                    <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                        <div className="space-y-2 mt-2">
                                            <button onClick={() => handleFinalApproval(p.projectId)} className="w-full bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600">Final Approve</button>
                                            <button onClick={() => handleReject(p.projectId)} className="w-full bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600">Reject</button>
                                            <textarea value={reasons[p.projectId] || ''} onChange={(e) => setReasons(prev => ({...prev, [p.projectId]: e.target.value}))} placeholder="Rejection reason..." className="mt-2 w-full border-gray-300 rounded-md shadow-sm text-sm p-2"/>
                                            <hr className="my-2"/>
                                            <select id={`redo-${p.projectId}`} className="w-full border-gray-300 rounded-md shadow-sm text-sm p-2">
                                                <option value="land approval">Redo to Land Approval</option>
                                                <option value="ngo">Redo to NGO Verification</option>
                                                <option value="drones">Redo to Drone Verification</option>
                                            </select>
                                            <button onClick={() => handleChangeStatus(p.projectId, document.getElementById(`redo-${p.projectId}`).value)} className="w-full bg-yellow-500 text-white px-3 py-2 rounded-md text-sm hover:bg-yellow-600 flex items-center justify-center">
                                                <RotateCcw className="w-4 h-4 mr-1"/> Request Redo
                                            </button>
                                            <textarea value={reasons[`redo-${p.projectId}`] || ''} onChange={(e) => setReasons(prev => ({...prev, [`redo-${p.projectId}`]: e.target.value}))} placeholder="Reason for redo..." className="mt-2 w-full border-gray-300 rounded-md shadow-sm text-sm p-2"/>
                                        </div>
                                    </ProjectCard>
                                )) : <p className="text-lg text-gray-500 col-span-full text-center py-10">No projects awaiting final approval.</p>}
                            </div>
                        )}
                        {activeMainTab === 'approved' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {projects.approved.length > 0 ? projects.approved.map(p => (
                                    <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                        <div className='mt-2'><StatusBadge status={p.verificationStatus} /></div>
                                        {p.carbonCredits && <p className="text-xs text-green-600 mt-2 p-2 bg-green-50 rounded"><strong>Carbon Credits:</strong> {p.carbonCredits}</p>}
                                    </ProjectCard>
                                )) : <p className="text-lg text-gray-500 col-span-full text-center py-10">No approved projects.</p>}
                            </div>
                        )}
                        {activeMainTab === 'rejected' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {projects.rejected.length > 0 ? projects.rejected.map(p => (
                                    <ProjectCard key={p.projectId} project={p} onDetailsClick={setSelectedProjectForDetails}>
                                        <div className='mt-2'><StatusBadge status={p.verificationStatus} /></div>
                                        {p.message && <p className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded"><strong>Reason:</strong> {p.message}</p>}
                                    </ProjectCard>
                                )) : <p className="text-lg text-gray-500 col-span-full text-center py-10">No rejected projects.</p>}
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