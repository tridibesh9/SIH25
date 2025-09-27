import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Tag, Zap } from 'lucide-react';
import { backend_url } from '../api endpoints/backend_url';
export const ActiveCreditCard = ({ project, contract, ethToInrRate, account }) => { // Added 'account' prop
    const [metadata, setMetadata] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for user inputs
    const [quantity, setQuantity] = useState(1);
    const [resalePriceInr, setResalePriceInr] = useState('');
    const [resaleOwnerName, setResaleOwnerName] = useState('');

    const maxQuantity = Number(project.quantity);

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
                if (!response.ok) throw new Error(`Failed to fetch metadata (status: ${response.status})`);
                const data = await response.json();
                setMetadata(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMetadata();
    }, [project.documentCID]);

    const handleRetire = async () => {
        if (!contract || !account) {
            alert("Contract not connected, or account is missing.");
            return;
        }
        try {
            console.log(`Retiring ${quantity} credits from project ID: ${Number(project.projectId)}`);
            
            const tx = await contract.retireProject(project.projectId, quantity);
            const receipt = await tx.wait(); // Wait for the transaction to be mined
            
            alert(`${quantity} credits successfully retired!`);

        } catch (error) {
            console.error("Failed to retire credits:", error);
            alert("Retiring credits failed. Check the console for details.");
        }
    };

    const handleResell = async () => {
        if (!contract || quantity <= 0 || !resalePriceInr || parseFloat(resalePriceInr) <= 0 || !resaleOwnerName.trim()) {
            alert("Please enter a valid quantity, a positive resale price, and an owner name.");
            return;
        }
        try {
            const priceInEth = parseFloat(resalePriceInr) / ethToInrRate;
            const priceInWei = ethers.parseEther(priceInEth.toString());
            const newExternalId = crypto.randomUUID();

            const tx = await contract.resellProject(
                project.projectId,
                quantity,
                priceInWei,
                newExternalId,
                resaleOwnerName
            );
            
            await tx.wait();
            alert(`${quantity} credits successfully listed for resale!`);
        } catch (error) {
            console.error("Failed to list credits for resale:", error);
            alert("Reselling credits failed. Check the console for details.");
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 h-48 animate-pulse">
                <div className="flex items-center space-x-4 h-full">
                    <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !metadata) {
        return (
            <div className="bg-red-50 text-red-700 rounded-2xl p-6 border border-red-200">
                <span className="font-medium">Error loading project: {error}</span>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-300">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                
                {/* Part 1: Project Info (Left Side) */}
                <div className="flex items-center space-x-5 flex-grow">
                    <img 
                        src={metadata.projectImages?.[0] || 'https://via.placeholder.com/96x96?text=No+Image'} 
                        alt={metadata.projectName} 
                        className="w-24 h-24 rounded-xl object-cover border-2 border-gray-100 flex-shrink-0" 
                    />
                    <div className="space-y-1">
                        <h3 className="font-bold text-xl text-gray-800">{metadata.projectName}</h3>
                        <p className="text-sm text-gray-500">{metadata.location}</p>
                        <p className="text-sm pt-1">
                            <span className="font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                {maxQuantity.toLocaleString()} Credits Available
                            </span>
                        </p>
                    </div>
                </div>

                {/* Part 2: Action Panel (Right Side) */}
                <div className="w-full md:w-auto flex-shrink-0 grid grid-cols-2 md:flex md:items-end gap-4 bg-gray-50 p-4 rounded-xl border">
                    {/* Quantity */}
                    <div className="space-y-1">
                        <label htmlFor={`quantity-${project.projectId}`} className="text-xs font-semibold text-gray-600 block">
                            QUANTITY
                        </label>
                        <input
                            id={`quantity-${project.projectId}`}
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, Number(e.target.value))))}
                            className="w-full h-12 px-3 text-base font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                            min="1" max={maxQuantity}
                        />
                    </div>
                    
                    {/* Your Name */}
                    <div className="space-y-1">
                        <label htmlFor={`ownerName-${project.projectId}`} className="text-xs font-semibold text-gray-600 block">
                            YOUR NAME
                        </label>
                        <input
                            id={`ownerName-${project.projectId}`}
                            type="text"
                            placeholder="For Resale"
                            value={resaleOwnerName}
                            onChange={(e) => setResaleOwnerName(e.target.value)}
                            className="w-full h-12 px-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                        <label htmlFor={`price-${project.projectId}`} className="text-xs font-semibold text-gray-600 block">
                            PRICE (₹)
                        </label>
                        <input
                            id={`price-${project.projectId}`}
                            type="number"
                            placeholder="Per Credit"
                            value={resalePriceInr}
                            onChange={(e) => setResalePriceInr(e.target.value)}
                            className="w-full h-12 px-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                            min="0"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="col-span-2 md:col-span-1 flex items-center gap-3">
                        <button 
                            onClick={handleRetire} 
                            className="h-12 w-full px-5 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 transition-colors text-sm flex items-center justify-center"
                            title="Retire Credits"
                        >
                            <Zap className="w-4 h-4 mr-2" />
                            Retire
                        </button>
                         <button 
                            onClick={handleResell} 
                            className="h-12 w-full px-5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                            title="List for Resale"
                        >
                            <Tag className="w-4 h-4 mr-2" />
                            Resell
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};