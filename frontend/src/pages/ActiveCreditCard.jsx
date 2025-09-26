import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Tag, Zap, RotateCw } from 'lucide-react';

export const ActiveCreditCard = ({ project, contract, ethToInrRate }) => {
    const [metadata, setMetadata] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resalePriceInr, setResalePriceInr] = useState('');

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
    
    // --- Smart Contract Actions ---

    const handleRetire = async () => {
        if (!contract) {
            alert("Contract not connected.");
            return;
        }
        try {
            console.log(`Retiring project ID: ${Number(project.projectId)}`);
            const tx = await contract.retireProject(project.projectId);
            await tx.wait();
            alert("Project successfully retired! It will now appear in your 'Retired Credits' tab.");
            // You might want to trigger a refresh of the dashboard data here
        } catch (error) {
            console.error("Failed to retire project:", error);
            alert("Retiring project failed. See console for details.");
        }
    };

    const handleResell = async () => {
        if (!contract || !resalePriceInr || parseFloat(resalePriceInr) <= 0) {
            alert("Please connect your wallet and enter a valid positive price.");
            return;
        }
        try {
            // 1. Convert INR to ETH
            const priceInEth = parseFloat(resalePriceInr) / ethToInrRate;
            // 2. Convert ETH to Wei (as a string to avoid precision issues)
            const priceInWei = ethers.parseEther(priceInEth.toString());
            
            console.log(`Reselling project ID: ${Number(project.projectId)} for ${priceInWei.toString()} Wei`);

            const tx = await contract.resellProject(project.projectId, priceInWei);
            await tx.wait();
            alert("Project successfully listed for resale on the marketplace!");
            // You might want to trigger a refresh of the dashboard data here
        } catch (error) {
            console.error("Failed to list project for resale:", error);
            alert("Listing project for resale failed. See console for details.");
        }
    };


    if (isLoading) {
        return <div className="bg-gray-50 rounded-xl p-6 h-32 animate-pulse"></div>;
    }

    if (error || !metadata) {
        return <div className="bg-red-50 text-red-700 rounded-xl p-6">Error loading project: {error}</div>;
    }

    return (
        <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="flex items-center space-x-4 md:col-span-2">
                    <img src={metadata.projectImages[0]} alt={metadata.projectName} className="w-20 h-20 rounded-lg object-cover border" />
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">{metadata.projectName}</h3>
                        <p className="text-sm text-gray-600">{metadata.location}</p>
                        <p className="text-sm text-gray-500 mt-1">Quantity: <span className="font-semibold">{Number(project.quantity).toLocaleString()}</span></p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                     <input
                        type="number"
                        placeholder="Set INR Price"
                        value={resalePriceInr}
                        onChange={(e) => setResalePriceInr(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={handleResell} className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                        <Tag className="w-4 h-4 inline mr-1" />
                        Resell
                    </button>
                </div>

                <div className="text-right">
                    <button onClick={handleRetire} className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm">
                        <Zap className="w-4 h-4 inline mr-1" />
                        Retire Credit
                    </button>
                </div>
            </div>
        </div>
    );
};