import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { MapPin, User, Leaf, FileText, Mail, Phone, ChevronDown, BarChart3, Info } from 'lucide-react';

// A simple loading skeleton component for a better user experience
const CardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="flex items-center space-x-5">
                <div className="w-24 h-24 rounded-xl bg-gray-200"></div>
                <div>
                    <div className="h-6 bg-gray-200 rounded w-52 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-36 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
            </div>
            <div className="text-right">
                <div className="h-7 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
        </div>
    </div>
);

export const EnlistedProjectCard = ({ project }) => {
    const [metadata, setMetadata] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Hardcoded ETH to INR conversion rate to avoid network errors
    const ETH_TO_INR_RATE = 400000;

    // Effect for fetching project metadata from IPFS
    useEffect(() => {
        const fetchMetadata = async () => {
            setIsLoading(true);
            setError(null);
            setMetadata(null);
            
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
        return <CardSkeleton />;
    }

    if (error) {
        return (
            <div className="text-red-600 text-center p-6 bg-red-50 rounded-2xl border border-red-200">
                Failed to load project metadata: {error}
            </div>
        );
    }
    
    if (!metadata) {
        return null; 
    }

    // Format the price from Wei to ETH
    const priceInEth = parseFloat(ethers.formatEther(project.valuePerCarbon));
    const availableQuantity = Number(project.quantity);

    // Calculate and format the price in INR using the desired currency style
    const priceInInr = priceInEth * ETH_TO_INR_RATE;
    const formattedInrPrice = priceInInr.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
    });


    return (
        <div 
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-200 transition-all duration-300 ease-in-out cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* --- ALWAYS VISIBLE HEADER --- */}
            <div className="p-6">
                <div className="flex justify-between items-start">
                    {/* Left Side: Image and Basic Info */}
                    <div className="flex items-center space-x-5">
                        <img 
                            src={metadata.projectImages[0]} 
                            alt={metadata.projectName} 
                            className="w-24 h-24 rounded-xl object-cover border" 
                        />
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-1">{metadata.projectName}</h3>
                            <div className="flex items-center text-gray-500 space-x-4">
                                <span className="flex items-center text-sm">
                                    <MapPin className="w-4 h-4 mr-1.5 text-gray-400" /> {metadata.locationName || 'N/A'}
                                </span>
                                <span className="flex items-center text-sm">
                                    <User className="w-4 h-4 mr-1.5 text-gray-400" /> {project.ownerName}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Price and Expander Icon */}
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-2xl font-bold text-emerald-600">{formattedInrPrice}</p>
                            <p className="text-sm text-gray-500">per token</p>
                        </div>
                        <ChevronDown 
                            className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                        />
                    </div>
                </div>
            </div>

            {/* --- EXPANDABLE DETAILS SECTION --- */}
            <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}
            >
                <div className="border-t border-gray-200 px-8 pt-6 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                        {/* Column 1: Core Stats */}
                        <div className="space-y-4">
                             <h4 className="font-semibold text-gray-600">Project Stats</h4>
                             <div className="flex items-center text-gray-700">
                                <BarChart3 className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                                <div>
                                    <span className="font-bold">{availableQuantity.toLocaleString()}</span> tokens available
                                </div>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Leaf className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                                <div>
                                    <span className="font-bold">{Number(metadata.carbonCredits).toLocaleString()}</span> total carbon credits
                                </div>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Info className="w-5 h-5 mr-3 text-purple-500 flex-shrink-0" />
                                <div className="capitalize">{metadata.type}</div>
                            </div>
                        </div>

                        {/* Column 2: Description & Documents */}
                        <div className="space-y-4 lg:col-span-2">
                            <h4 className="font-semibold text-gray-600">Description</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{metadata.siteDescription}</p>
                            
                            <h4 className="font-semibold text-gray-600 pt-2">Contact & Verification</h4>
                            <div className="flex items-center space-x-6">
                                <span className="flex items-center text-sm text-gray-600">
                                    <Mail className="w-4 h-4 mr-2 text-gray-400" /> {metadata.email}
                                </span>
                                <span className="flex items-center text-sm text-gray-600">
                                    <Phone className="w-4 h-4 mr-2 text-gray-400" /> {metadata.contactNumber}
                                </span>
                                <a 
                                    href={metadata.landDocuments} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()} 
                                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-colors"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Land Documents
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};