import React, { useState, useEffect } from 'react';
import { Award, ExternalLink } from 'lucide-react';

export const RetiredCreditCard = ({ project }) => {
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

    if (isLoading) {
        return <div className="bg-green-50 rounded-xl p-6 h-24 animate-pulse"></div>;
    }

    if (error || !metadata) {
        return <div className="bg-red-50 text-red-700 rounded-xl p-6">Error loading project: {error}</div>;
    }

    const certificateUrl = `https://gateway.pinata.cloud/ipfs/${project.certificateCID}`;

    return (
        <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-gray-800">{metadata.projectName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{metadata.location}</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-green-700">{Number(project.quantity).toLocaleString()}t</div>
                    <div className="text-sm text-gray-500">CO₂ Retired</div>
                </div>
                <a 
                    href={certificateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                    <Award className="w-4 h-4 mr-2" />
                    View Certificate
                    <ExternalLink className="w-4 h-4 ml-2" />
                </a>
            </div>
        </div>
    );
};