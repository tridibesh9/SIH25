import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Leaf, TrendingUp, Award, BarChart3, Tag } from 'lucide-react';
import { ActiveCreditCard } from '../components/ActiveCreditCard.jsx'; // Adjust path
import { RetiredCreditCard } from '../components/RetiredCreditCard.jsx'; // Adjust path
import { EnlistedProjectCard } from '../pages/ProjectOwner/EnlistedProjectCard'; // Adjust path

export const Dashboard = ({ contract, account }) => {
    const [activeTab, setActiveTab] = useState('portfolio');
    const [activeProjects, setActiveProjects] = useState([]);
    const [retiredProjects, setRetiredProjects] = useState([]);
    const [enlistedProjects, setEnlistedProjects] = useState([]); // New state for enlisted projects
    const [stats, setStats] = useState({ totalInvestment: 0, totalCO2Offset: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ethToInrRate, setEthToInrRate] = useState(400000); // Placeholder rate

    useEffect(() => {
        const fetchProjects = async () => {
            if (!contract || !account) {
                setLoading(false);
                return;
            }
            
            setLoading(true);
            setError(null);
            
            try {
                console.log("🔗 [DASHBOARD] Fetching owned, retired, and listed projects for account:", account);
                console.log("🔗 [DASHBOARD] Contract available:", !!contract);
                
                const [owned, retired, listed] = await Promise.all([
                    (async () => {
                        try {
                            console.log("🔗 [DASHBOARD] Calling getOwnedProjects...");
                            const result = await contract.getOwnedProjects(account);
                            console.log("🔗 [DASHBOARD] getOwnedProjects result:", result);
                            return result;
                        } catch (err) {
                            console.error("🔗 [DASHBOARD] getOwnedProjects failed:", err);
                            return [];
                        }
                    })(),
                    (async () => {
                        try {
                            console.log("🔗 [DASHBOARD] Calling getRetiredProjects...");
                            const result = await contract.getRetiredProjects(account);
                            console.log("🔗 [DASHBOARD] getRetiredProjects result:", result);
                            return result;
                        } catch (err) {
                            console.error("🔗 [DASHBOARD] getRetiredProjects failed:", err);
                            return [];
                        }
                    })(),
                    (async () => {
                        try {
                            console.log("🔗 [DASHBOARD] Calling getListedProjects...");
                            const result = await contract.getListedProjects(account);
                            console.log("🔗 [DASHBOARD] getListedProjects result:", result);
                            return result;
                        } catch (err) {
                            console.error("🔗 [DASHBOARD] getListedProjects failed:", err);
                            console.error("🔗 [DASHBOARD] Error details:", {
                                message: err.message,
                                code: err.code,
                                data: err.data
                            });
                            return [];
                        }
                    })()
                ]);
                
                setActiveProjects(owned);
                setRetiredProjects(retired);
                setEnlistedProjects(listed); // Set the state for listed projects
                
                console.log("🔗 [DASHBOARD] Owned projects:", owned);
                console.log("🔗 [DASHBOARD] Retired projects:", retired);
                console.log("🔗 [DASHBOARD] Enlisted projects:", listed);

            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Could not fetch your project data from the blockchain.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [contract, account]);

    useEffect(() => {
        // Calculate stats whenever projects data changes
        if (activeProjects.length > 0 || retiredProjects.length > 0) {
            const totalInv = activeProjects.reduce((sum, proj) => sum + parseFloat(ethers.formatEther(proj.valuePerCarbon)), 0);
            const totalOffset = retiredProjects.reduce((sum, proj) => sum + Number(proj.quantity), 0);
            
            setStats({
                totalInvestment: totalInv * ethToInrRate,
                totalCO2Offset: totalOffset,
            });
        }
    }, [activeProjects, retiredProjects, ethToInrRate]);
    
    const TABS = [
        { id: 'portfolio', label: 'My Portfolio' },
        { id: 'enlisted', label: 'Enlisted Projects' },
        { id: 'retired', label: 'Retired Credits' },
    ];
    
    const renderContent = () => {
        if (loading) {
            return <div className="text-center py-10 text-gray-500">Loading your portfolio...</div>;
        }
        if (error) {
            return <div className="text-center py-10 text-red-600">{error}</div>;
        }

        switch (activeTab) {
            case 'portfolio':
                return (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Active Carbon Credits</h2>
                            <p className="text-gray-600">These are your owned carbon credit tokens. You can choose to retire them to claim their environmental impact or resell them on the marketplace.</p>
                        </div>
                        {activeProjects.length > 0 ? (
                            <div className="space-y-4">
                                {activeProjects.map(proj => (
                                    <ActiveCreditCard key={`active-${Number(proj.projectId)}`} project={proj} contract={contract} ethToInrRate={ethToInrRate} account={account} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-10 text-gray-500">You do not own any active carbon credits.</p>
                        )}
                    </div>
                );
            case 'enlisted':
                return (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Enlisted for Sale</h2>
                            <p className="text-gray-600">These are your projects currently listed on the marketplace for other users to purchase.</p>
                        </div>
                        {enlistedProjects.length > 0 ? (
                            <div className="space-y-4">
                                {enlistedProjects.map(proj => (
                                    <EnlistedProjectCard key={`enlisted-${Number(proj.projectId)}`} project={proj} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-10 text-gray-500">You have not listed any projects for sale.</p>
                        )}
                    </div>
                );
            case 'retired':
                return (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Retired Carbon Credits</h2>
                            <p className="text-gray-600">This is your permanent, on-chain record of climate action. These credits have been taken out of circulation forever.</p>
                        </div>
                        {retiredProjects.length > 0 ? (
                            <div className="space-y-4">
                                {retiredProjects.map(proj => (
                                    <RetiredCreditCard key={`retired-${Number(proj.projectId)}`} project={proj} contract={contract}/>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-10 text-gray-500">You have not retired any carbon credits yet.</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-blue-900 mb-4">My Dashboard</h1>
                    <p className="text-xl text-gray-600">Manage your carbon credit portfolio and track your environmental impact.</p>
                </div>

                {/* --- UPDATED STATS CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4"><TrendingUp className="w-6 h-6 text-green-600" /></div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{stats.totalInvestment.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</h3>
                        <p className="text-gray-600">Portfolio Value</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4"><Award className="w-6 h-6 text-yellow-600" /></div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{activeProjects.length}</h3>
                        <p className="text-gray-600">Active Projects</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4"><Tag className="w-6 h-6 text-purple-600" /></div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{enlistedProjects.length}</h3>
                        <p className="text-gray-600">Enlisted Projects</p>
                    </div>
                                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4"><Leaf className="w-6 h-6 text-blue-600" /></div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{retiredProjects.length}</h3>
                        <p className="text-gray-600">Retired Projects</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-8">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                                        activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="p-8">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};