import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { Filter, Search, Grid, List, MapPin, Leaf, Droplets, Wind, Waves } from 'lucide-react';

// --- Project Card Component ---
const ProjectCard = ({ project, ethToInrRate, viewMode }) => {
    const [metadata, setMetadata] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetadata = async () => {
            if (!project.documentCID) {
                setError("Document CID is missing.");
                setIsLoading(false);
                return;
            }
            try {
                const url = `https://gateway.pinata.cloud/ipfs/${project.documentCID}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch metadata (status: ${response.status})`);
                }
                const data = await response.json();
                setMetadata(data);
            } catch (err) {
                console.error("Error fetching metadata:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMetadata();
    }, [project.documentCID]);

    if (isLoading) {
        return <div className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
            <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    }

    if (error || !metadata) {
        return <div className="bg-red-50 text-red-700 p-6 rounded-2xl text-center">Failed to load project details.</div>
    }

    const priceInEth = parseFloat(ethers.formatEther(project.valuePerCarbon));
    const priceInInr = priceInEth * ethToInrRate;
    const formattedPriceInr = priceInInr.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    });
    
    // FIX: Create a plain, serializable object to pass in the Link state.
    // This converts BigInts to strings to prevent the DataCloneError.
    const serializableProject = {
        projectId: Number(project.projectId),
        externalId: project.externalId,
        projectName: project.projectName,
        documentCID: project.documentCID,
        valuePerCarbon: project.valuePerCarbon.toString(), // Convert BigInt to string
        quantity: project.quantity.toString(),             // Convert BigInt to string
        ownerName: project.ownerName,
        ownerAddress: project.ownerAddress,
    };

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
                <img src={metadata.projectImages[0]} alt={metadata.projectName} className="w-full h-56 object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full capitalize shadow-md">
                    {metadata.type}
                </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                     <Link 
                        to={`/project/${project.externalId}`} 
                        state={{ projectOnChain: serializableProject, projectMetadata: metadata }}
                        className="px-6 py-3 bg-white text-blue-800 font-bold rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg"
                    >
                         View Project
                    </Link>
                 </div>
            </div>
            <div className="p-6">
                {/* <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{metadata.location}</span>
                </div> */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
                    {metadata.projectName}
                </h3>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                    <div>
                        <p className="text-2xl font-extrabold text-blue-600">{formattedPriceInr}</p>
                        <p className="text-sm text-gray-500">per Carbon Credit</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">{Number(project.quantity).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">credits available</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const Marketplace = ({ contract, account }) => {
    const [viewMode, setViewMode] = useState('grid');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ethToInrRate, setEthToInrRate] = useState(400000);

    const projectTypes = [
        { id: 'wetlands', label: 'Wetlands', icon: Droplets },
        { id: 'mangroves', label: 'Mangroves', icon: Leaf },
        { id: 'seagrass', label: 'Seagrass Meadows', icon: Waves },
        { id: 'kelp', label: 'Kelp Forests', icon: Wind },
        { id: 'salt-marshes', label: 'Salt Marshes', icon: Droplets },
    ];

    useEffect(() => {
        const fetchProjects = async () => {
            if (!contract) {
                console.log("contract not found", contract);
                
                return;
            }
            setLoading(true);
            try {
                const fetchedProjects = await contract.getMarketplace();
                setProjects(fetchedProjects);
            } catch (error) {
                console.error("Error fetching projects from smart contract:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [contract]);

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-blue-900 mb-4">Blue Carbon Marketplace</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Invest in high-impact blue carbon projects, driving marine ecosystem restoration and climate action.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="lg:w-80">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                            <div className="flex items-center mb-6">
                                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                            </div>
                            <div className="mb-6 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" placeholder="Search by name or location..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-3">Project Type</h3>
                                <div className="space-y-3">
                                    {projectTypes.map((type) => (
                                        <label key={type.id} className="flex items-center cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                            <type.icon className="w-5 h-5 ml-3 mr-2 text-gray-500" />
                                            <span className="text-sm text-gray-700">{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-3">Price Range (₹/Credit)</h3>
                                <input type="range" min="0" max="300000" step="1000" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>₹0</span>
                                    <span>₹3,00,000+</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-600">{loading ? 'Loading...' : `${projects.length} projects found`}</span>
                            <div className="flex items-center space-x-4">
                                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest First</option>
                                </select>
                                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                                     <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}>
                                         <Grid className="w-5 h-5" />
                                     </button>
                                 </div>
                            </div>
                        </div>

                        {loading ? (
                             <p className="text-center text-gray-500">Fetching projects from the blockchain...</p>
                         ) : (
                             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                                 {projects.map((project) => (
                                     <ProjectCard key={Number(project.projectId)} project={project} ethToInrRate={ethToInrRate} viewMode={viewMode}/>
                                 ))}
                             </div>
                         )}
                    </main>
                </div>
            </div>
        </div>
    );
};