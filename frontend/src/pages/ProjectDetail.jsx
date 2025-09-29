import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { MapPin, ExternalLink, Shield, Globe, Minus, Plus, FileText, User, Hash } from 'lucide-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// The component now needs the `contract` prop to make transactions
export const ProjectDetail = ({ contract }) => {
    const location = useLocation();
    const { projectOnChain, projectMetadata } = location.state || {};
    
    const [quantity, setQuantity] = useState(1);
    const [ethToInrRate, setEthToInrRate] = useState(400000);
    const [activeImage, setActiveImage] = useState(null);
    const [isPurchasing, setIsPurchasing] = useState(false); // State for loading during purchase

    // The function to handle the purchase transaction
    const handlebuytokens = async () => {
        if (!contract) {
            alert("Contract not connected. Please try again.");
            return;
        }

        setIsPurchasing(true);
        try {
            // 1. Calculate the total cost in Wei
            const pricePerTokenInWei = BigInt(projectOnChain.valuePerCarbon);
            const totalCostInWei = pricePerTokenInWei * BigInt(quantity);

            // 2. Call the smart contract's buyProject function
            console.log(`Attempting to buy ${quantity} tokens for project ID ${projectOnChain.projectId}`);
            console.log(`Total cost: ${ethers.formatEther(totalCostInWei)} ETH`);

            const tx = await contract.buyProject(
                projectOnChain.projectId,
                quantity,
                { value: totalCostInWei } // Send the calculated ETH amount with the transaction
            );

            alert("Transaction sent! Waiting for confirmation...");
            console.log("Transaction hash:", tx.hash);

            // 3. Wait for the transaction to be mined
            await tx.wait();

            alert(`Successfully purchased ${quantity} carbon credits!`);
            // Optionally, you could redirect the user to their dashboard or refresh the project data
        
        } catch (error) {
            console.error("Purchase failed:", error);
            alert("Purchase failed. See console for details.");
        } finally {
            setIsPurchasing(false);
        }
    };

    useEffect(() => {
        if (projectMetadata?.projectImages?.[0]) {
            setActiveImage(projectMetadata.projectImages[0]);
        }
    }, [projectMetadata]);

    if (!projectOnChain || !projectMetadata) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-red-700 mb-4">Project Data Missing</h1>
                    <p className="text-gray-600">Please access project details via the marketplace.</p>
                    <Link to="/marketplace" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
                        Back to Marketplace
                    </Link>
                </div>
            </div>
        );
    }
    
    const priceInEth = parseFloat(ethers.formatEther(projectOnChain.valuePerCarbon));
    const priceInInr = priceInEth * ethToInrRate;
    const totalPriceInr = quantity * priceInInr;
    
    const formattedPriceInr = priceInInr.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    const formattedTotalPriceInr = totalPriceInr.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm">
                        <li><Link to="/marketplace" className="text-blue-600 hover:underline">Marketplace</Link></li>
                        <li className="text-gray-500">/</li>
                        <li className="text-gray-600">{projectMetadata.projectName}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                             <div className="relative">
                                <img src={activeImage} alt={projectMetadata.projectName} className="w-full h-96 object-cover transition-all duration-300" />
                                <div className="absolute top-4 left-4">
                                     <span className="px-4 py-2 bg-white/90 text-blue-800 text-sm font-semibold rounded-full capitalize">
                                        {projectMetadata.type}
                                    </span>
                                </div>
                             </div>
                             <div className="flex gap-2 p-4">
                                 {projectMetadata.projectImages.map((img, index) => (
                                    <img 
                                        key={index} 
                                        src={img} 
                                        alt={`${projectMetadata.projectName} ${index + 1}`} 
                                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all duration-200 ${
                                            activeImage === img 
                                                ? 'ring-2 ring-blue-500 opacity-100' 
                                                : 'opacity-60 hover:opacity-100'
                                        }`}
                                        onClick={() => setActiveImage(img)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-sm">
                            <h1 className="text-3xl font-bold text-blue-900 mb-4">{projectMetadata.projectName}</h1>
                            <div className="flex items-center text-gray-600 mb-6">
                                <MapPin className="w-5 h-5 mr-2" /> {projectMetadata.location}
                            </div>
                            <p className="text-gray-700 text-lg leading-relaxed mb-8">
                                {projectMetadata.siteDescription}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="text-2xl font-bold text-blue-600">{Number(projectMetadata.carbonCredits).toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Total Carbon Credits</div>
                                </div>
                                <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                     <div className="text-2xl font-bold text-emerald-600 capitalize">{projectMetadata.type}</div>
                                     <div className="text-sm text-gray-600">Ecosystem Type</div>
                                 </div>
                                 <div className="text-center p-4 bg-teal-50 rounded-xl border border-teal-100">
                                     <div className="text-2xl font-bold text-teal-600">{projectOnChain.ownerName}</div>
                                     <div className="text-sm text-gray-600">Project Owner</div>
                                 </div>
                            </div>
                            <div className="border-t pt-6">
                                <h4 className="font-semibold text-gray-800 mb-4">Project Details & Verification</h4>
                                <div className="space-y-3 text-gray-700">
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center"><User className="w-4 h-4 mr-2 text-gray-400" />Owner Address</span>
                                        <span className="font-mono text-xs bg-gray-100 p-1 rounded">{projectOnChain.ownerAddress}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                         <span className="flex items-center"><FileText className="w-4 h-4 mr-2 text-gray-400" />Verification Documents</span>
                                         <a href={projectMetadata.landDocuments} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                                             View Documents
                                            <ExternalLink className="w-4 h-4 ml-1" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-8 shadow-sm sticky top-24">
                            <div className="mb-6">
                                <div className="text-3xl font-bold text-blue-600 mb-1">{formattedPriceInr}</div>
                                <div className="text-gray-600">per Carbon Credit</div>
                            </div>
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Credits Available</span>
                                    <span>{Number(projectOnChain.quantity).toLocaleString()} Credits</span>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (Credits)</label>
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-gray-400 hover:text-gray-600"><Minus className="w-4 h-4" /></button>
                                    <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-full text-center border-0 focus:ring-0" min="1" max={Number(projectOnChain.quantity)}/>
                                    <button onClick={() => setQuantity(Math.min(Number(projectOnChain.quantity), quantity + 1))} className="p-3 text-gray-400 hover:text-gray-600"><Plus className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                <div className="border-t pt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Total Price</span>
                                        <span className="text-xl font-bold text-blue-600">{formattedTotalPriceInr}</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                onClick={handlebuytokens}
                                disabled={isPurchasing}
                            >
                                {isPurchasing ? 'Processing...' : 'Purchase Credits'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};