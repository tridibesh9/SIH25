import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, BarChart3 } from 'lucide-react';
import { ethers } from 'ethers';
import ProjectDetailModal from './ProjectDetailModal.jsx';
import { backend_url } from '../../api endpoints/backend_url.jsx';
import { EnlistedProjectCard } from './EnlistedProjectCard.jsx';

export const ProjectOwnerDashboard = ({ contract, account }) => {
    // State for the different project lists
    const [pendingProjects, setPendingProjects] = useState([]);
    const [verifiedProjects, setVerifiedProjects] = useState([]);
    const [enlistedProjects, setEnlistedProjects] = useState([]);
    
    // Other component states
    const [activeTab, setActiveTab] = useState('pending'); // <-- THE FIX IS HERE
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [prices, setPrices] = useState({});
    const [isEnlisting, setIsEnlisting] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication token not found.");
                setLoading(false);
                return;
            }

            try {
                console.log('🔗 [DASHBOARD] Starting data fetch...');
                console.log('🔗 [DASHBOARD] Contract:', !!contract);
                console.log('🔗 [DASHBOARD] Account:', account);
                
                const [backendData, onChainData] = await Promise.all([
                    // Fetch backend projects
                    fetch(`${backend_url}/projects/userprojects`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    }).then(res => {
                        if (!res.ok) throw new Error("Failed to fetch projects from server.");
                        return res.json();
                    }),
                    // Fetch on-chain enlisted projects with better error handling
                    (contract && account) ? (async () => {
                        try {
                            console.log('🔗 [DASHBOARD] Calling getListedProjects for account:', account);
                            const result = await contract.getListedProjects(account);
                            console.log('🔗 [DASHBOARD] getListedProjects result:', result);
                            return result;
                        } catch (contractError) {
                            console.error('🔗 [DASHBOARD] Contract call failed:', contractError);
                            console.error('🔗 [DASHBOARD] Error details:', {
                                message: contractError.message,
                                code: contractError.code,
                                data: contractError.data
                            });
                            // Return empty array instead of failing completely
                            return [];
                        }
                    })() : Promise.resolve([])
                ]);

                // Process and set state for backend projects
                const allBackendProjects = backendData.projects || [];
                const pending = allBackendProjects.filter(p => p.verificationStatus !== 'approved' && p.verificationStatus !== 'rejected');
                const verified = allBackendProjects.filter(p => p.verificationStatus === 'approved');
                
                setPendingProjects(pending);
                setVerifiedProjects(verified);

                // Process and set state for on-chain projects
                setEnlistedProjects(onChainData || []);

            } catch (err) {
                console.error("Error fetching user projects:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [contract, account]);

    const handlePriceChange = (projectId, value) => {
        setPrices(prevPrices => ({ ...prevPrices, [projectId]: value }));
    };

    const RegisterProjectOnChain = (project) => async () => {
        const priceInInr = prices[project.projectId];
        if (!contract || !account || !priceInInr || parseFloat(priceInInr) <= 0) {
            setError("Please connect wallet and set a valid price.");
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Authentication token not found.");
            return;
        }
        setIsEnlisting(project.projectId);
        setError(null);
        try {
            const priceApiResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
            if (!priceApiResponse.ok) throw new Error("Could not fetch the live ETH-INR exchange rate.");
            const priceApiData = await priceApiResponse.json();
            const ethToInrRate = priceApiData.ethereum.inr;
            const priceInEth = parseFloat(priceInInr) / ethToInrRate;
            
            const metadataResponse = await fetch(`${backend_url}/projects/upload-metadata`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
                body: JSON.stringify({ projectId: project.projectId }),
            });
            if (!metadataResponse.ok) throw new Error("Failed to get metadata URI from backend.");
            const metadataData = await metadataResponse.json();
            const documentCID = metadataData.ipfsHash;
            
            const formattedPriceInEth = priceInEth.toFixed(18);
            const valuePerCarbonWei = ethers.parseEther(formattedPriceInEth);
            console.log(contract);
            console.log("doing on-chain registration with values:");

            const transaction = await contract.registerProject(
                project.projectId, project.projectName, documentCID,
                valuePerCarbonWei, project.carbonCredits
            );
            console.log("🔗 Transaction sent. Awaiting confirmation...", transaction);
            await transaction.wait();
            alert("Project successfully enlisted!");
        } catch (err) {
            console.error("Failed to enlist project:", err);
            setError(err.message || "An error occurred during enlistment.");
        } finally {
            setIsEnlisting(null);
        }
    };

    const navigateToRegister = () => navigate('/owner/register');
    const TABS = [
        { id: 'pending', label: 'Pending Projects', count: pendingProjects.length },
        { id: 'verified', label: 'Verified Projects', count: verifiedProjects.length },
        { id: 'enlisted', label: 'Enlisted Projects', count: enlistedProjects.length },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
                <p className="ml-4 text-xl text-gray-700">Loading Your Projects...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
                <div>
                    <h2 className="text-2xl font-bold text-red-600">An Error Occurred</h2>
                    <p className="text-gray-600 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
            <div className="min-h-screen bg-gray-50 pt-16">
                 <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Projects Dashboard</h1>
                            <p className="text-xl text-gray-600">Track, verify, and manage your blue carbon projects.</p>
                        </div>
                        <button onClick={navigateToRegister} className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm">
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Register New Project
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8 px-8">
                                {TABS.map((tab) => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                        {tab.label}
                                        <span className={`ml-2 text-xs font-bold rounded-full px-2 py-0.5 ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-8">
                            {activeTab === 'pending' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pendingProjects.map(project => (
                                        <div key={project.projectId} onClick={() => setSelectedProject(project)} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg hover:bg-white transition-all cursor-pointer border border-transparent hover:border-blue-400">
                                            <img src={project.projectImages[0]} alt={project.projectName} className="w-full h-40 object-cover rounded-lg mb-4"/>
                                            <h3 className="font-semibold text-lg text-gray-800">{project.projectName}</h3>
                                            <p className="text-sm text-gray-600 mb-4">{project.location}</p>
                                            <div className="text-xs font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full inline-block capitalize">{project.verificationStatus.replace(' approval pending', '...')}</div>
                                        </div>
                                    ))}
                                    {pendingProjects.length === 0 && <p className="text-gray-500 col-span-full text-center py-10">No pending projects found.</p>}
                                </div>
                            )}

                            {activeTab === 'verified' && (
                               <div className="space-y-6">
                                    {verifiedProjects.map(project => (
                                         <div key={project.projectId} className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-800">{project.projectName}</h3>
                                                <p className="text-sm text-gray-600">{project.location}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <BarChart3 className="w-10 h-10 text-green-600"/>
                                                <div>
                                                    <p className="text-2xl font-bold text-green-700">{project.carbonCredits}</p>
                                                    <p className="text-sm text-gray-600">Carbon Tokens Generated</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor={`price-${project.projectId}`} className="text-sm font-medium text-gray-700">Set Price (INR per Token)</label>
                                                <input type="number" id={`price-${project.projectId}`} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., 250000" value={prices[project.projectId] || ''} onChange={(e) => handlePriceChange(project.projectId, e.target.value)} />
                                                <p className="text-xs text-gray-500">Enter the price in Indian Rupees.</p>
                                                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors mt-2 disabled:bg-gray-400" onClick={RegisterProjectOnChain(project)} disabled={isEnlisting !== null}>
                                                    {isEnlisting === project.projectId ? 'Enlisting...' : 'Enlist for Sale'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {verifiedProjects.length === 0 && <p className="text-gray-500 text-center py-10">You have no verified projects ready for enlistment.</p>}
                               </div>
                            )}

                            {activeTab === 'enlisted' && (
                                <div className="space-y-4">
                                    {enlistedProjects.map((project, index) => (
                                        <EnlistedProjectCard key={`${project.documentCID}-${index}`} project={project} />
                                    ))}
                                    {enlistedProjects.length === 0 && <p className="text-gray-500 text-center py-10">You have no projects currently listed on the marketplace.</p>}
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
            </div>
        </>
    );
};