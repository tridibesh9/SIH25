import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { Filter, Search, Grid, Droplets, Leaf, Waves, Wind } from 'lucide-react';

// --- Project Card Component (Simplified) ---
// This component now receives all its data via props and doesn't fetch anything itself.
const ProjectCard = ({ projectData, ethToInrRate }) => {
    const { onChain, metadata } = projectData;

    // This check is in case metadata was not available for a project
    if (!metadata) {
        return <div className="bg-red-50 text-red-700 p-6 rounded-2xl text-center">Failed to load project details.</div>;
    }

    const priceInEth = parseFloat(ethers.formatEther(onChain.valuePerCarbon));
    const priceInInr = priceInEth * ethToInrRate;
    const formattedPriceInr = priceInInr.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    });

    // Create a plain, serializable object to pass in the Link state.
    const serializableProject = {
        projectId: Number(onChain.projectId),
        externalId: onChain.externalId,
        projectName: onChain.projectName,
        documentCID: onChain.documentCID,
        valuePerCarbon: onChain.valuePerCarbon.toString(),
        quantity: onChain.quantity.toString(),
        ownerName: onChain.ownerName,
        ownerAddress: onChain.ownerAddress,
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
                        to={`/project/${onChain.externalId}`}
                        state={{ projectOnChain: serializableProject, projectMetadata: metadata }}
                        className="px-6 py-3 bg-white text-blue-800 font-bold rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg"
                    >
                        View Project
                    </Link>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
                    {metadata.projectName}
                </h3>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                    <div>
                        <p className="text-2xl font-extrabold text-blue-600">{formattedPriceInr}</p>
                        <p className="text-sm text-gray-500">per Carbon Credit</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">{Number(onChain.quantity).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">credits available</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const Marketplace = ({ contract, account }) => {
    const [viewMode, setViewMode] = useState('grid');
    const [projects, setProjects] = useState([]); // Will store combined on-chain and metadata
    const [loading, setLoading] = useState(true);
    const [ethToInrRate, setEthToInrRate] = useState(400000); // More realistic INR rate

    // --- State for Filters ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [maxPrice, setMaxPrice] = useState(500000);

    const projectTypes = [
        { id: 'wetlands', label: 'Wetlands', icon: Droplets },
        { id: 'mangroves', label: 'Mangroves', icon: Leaf },
        { id: 'seagrass meadows', label: 'Seagrass Meadows', icon: Waves },
        { id: 'kelp forests', label: 'Kelp Forests', icon: Wind },
        { id: 'salt marshes', label: 'Salt Marshes', icon: Droplets },
    ];

    useEffect(() => {
        const fetchProjectsAndMetadata = async () => {
            if (!contract) {
                console.log("Contract not found");
                return;
            }
            setLoading(true);
            try {
                const projectsFromChain = await contract.getMarketplace();
                
                // Fetch metadata for all projects concurrently
                const projectsWithData = await Promise.all(
                    projectsFromChain.map(async (project) => {
                        try {
                            const url = `https://gateway.pinata.cloud/ipfs/${project.documentCID}`;
                            const response = await fetch(url);
                            if (!response.ok) {
                                console.error(`Failed to fetch metadata for CID: ${project.documentCID}`);
                                return { onChain: project, metadata: null };
                            }
                            const metadata = await response.json();
                            return { onChain: project, metadata: metadata };
                        } catch (err) {
                            console.error("Error fetching or parsing metadata:", err);
                            return { onChain: project, metadata: null };
                        }
                    })
                );

                // Filter out any projects where metadata fetching failed
                setProjects(projectsWithData.filter(p => p.metadata !== null));

            } catch (error) {
                console.error("Error fetching projects from smart contract:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectsAndMetadata();
    }, [contract]);

    // --- Event Handlers for Filters ---
    const handleTypeChange = (e) => {
        const { value, checked } = e.target;
        setSelectedTypes(prev =>
            checked ? [...prev, value] : prev.filter(type => type !== value)
        );
    };

    // --- Filtering Logic ---
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const { onChain, metadata } = project;

            // 1. Filter by Search Term (checks project name)
            if (searchTerm && !metadata.projectName.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }

            // 2. Filter by Project Type
            if (selectedTypes.length > 0 && !selectedTypes.includes(metadata.type.toLowerCase())) {
                return false;
            }

            // 3. Filter by Price
            const priceInInr = parseFloat(ethers.formatEther(onChain.valuePerCarbon)) * ethToInrRate;
            if (priceInInr > maxPrice) {
                return false;
            }
            
            return true;
        });
    }, [projects, searchTerm, selectedTypes, maxPrice, ethToInrRate]);


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
                                <input 
                                    type="text" 
                                    placeholder="Search by name..." 
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-3">Project Type</h3>
                                <div className="space-y-3">
                                    {projectTypes.map((type) => (
                                        <label key={type.id} className="flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                value={type.id}
                                                onChange={handleTypeChange}
                                                checked={selectedTypes.includes(type.id)}
                                            />
                                            <type.icon className="w-5 h-5 ml-3 mr-2 text-gray-500" />
                                            <span className="text-sm text-gray-700">{type.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-3">Max Price (₹{Number(maxPrice).toLocaleString('en-IN')}/Credit)</h3>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="300000" 
                                    step="1000" 
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>₹0</span>
                                    <span>₹3,00,000+</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-600">{loading ? 'Loading...' : `${filteredProjects.length} projects found`}</span>
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
                             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                                {/* Skeleton Loader */}
                                {[...Array(4)].map((_, i) => (
                                     <div key={i} className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
                                         <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                                         <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                                         <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                         <div className="flex justify-between items-center">
                                             <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                             <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                         </div>
                                     </div>
                                ))}
                            </div>
                        ) : (
                             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                                 {filteredProjects.length > 0 ? (
                                    filteredProjects.map((project) => (
                                         <ProjectCard 
                                            key={Number(project.onChain.projectId)} 
                                            projectData={project} 
                                            ethToInrRate={ethToInrRate} 
                                        />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 md:col-span-2 xl:col-span-2">No projects match the current filters.</p>
                                )}
                             </div>
                         )}
                    </main>
                </div>
            </div>
        </div>
    );
};