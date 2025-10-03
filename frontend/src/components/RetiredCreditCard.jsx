import React from 'react';
import { Award, ExternalLink, Send } from 'lucide-react';
import { backend_url } from '../api endpoints/backend_url'; 

export const RetiredCreditCard = ({ project, contract }) => {
    // State for fetching project metadata from IPFS
    const [metadata, setMetadata] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // State to manage the loading status of the certificate generation process
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Fetch the project's metadata from Pinata (IPFS) when the component mounts
    React.useEffect(() => {
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

    const generateAndStoreCertificate = async () => {
        if (isSubmitting) return; // Prevent multiple clicks
        setIsSubmitting(true);

        try {
            // --- Step 1: Call Backend to Generate Certificate ---
            const dataToSend = {
                projectId: Number(project.projectId),
                externalId: project.externalId,
                projectName: metadata?.projectName,
                quantityRetired: Number(project.quantity),
                retiredByAddress: project.ownerAddress,
                DocumentCID: project.documentCID,
                retiredAt: new Date(Number(project.createdAt) * 1000).toISOString(),
            };

            // console.log("Sending data to backend to generate certificate...", dataToSend);
            const backendResponse = await fetch(`${backend_url}/projects/retireproject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!backendResponse.ok) {
                const errorBody = await backendResponse.text();
                throw new Error(`Backend API Error: ${backendResponse.status} - ${errorBody}`);
            }

            const result = await backendResponse.json();
            const newCertificateCID = result.certificateCID;
            alert(`Certificate generated! Now storing on-chain...`);

            // --- Step 2: Call Smart Contract to Store Certificate CID ---
            if (!contract) {
                throw new Error("Smart contract is not connected. Cannot store certificate CID.");
            }
            
            // console.log(`Calling addRetirementCertificate for project ${project.projectId} with CID ${newCertificateCID}`);
            const tx = await contract.addRetirementCertificate(project.projectId, newCertificateCID);
            await tx.wait(); // Wait for the transaction to be confirmed

            alert("Certificate CID successfully stored on the blockchain! The page will now refresh.");
            window.location.reload(); // Reload to show the 'View Certificate' button

        } catch (err) {
            console.error('Failed during certificate generation or storage:', err);
            alert(`An error occurred: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading and Error States
    if (isLoading) {
        return <div className="bg-green-50 rounded-xl p-6 h-24 animate-pulse"></div>;
    }

    if (error || !metadata) {
        return <div className="bg-red-50 text-red-700 rounded-xl p-6">Error loading project: {error}</div>;
    }

    // --- Conditional Rendering Logic ---
    const hasCertificate = project.certificateCID && project.certificateCID.length > 0;
    const certificateUrl = `https://gateway.pinata.cloud/ipfs/${project.certificateCID}`;

    return (
        <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Project Info */}
                <div>
                    <h3 className="font-semibold text-gray-800">{metadata.projectName}</h3>
                    {/* <p className="text-sm text-gray-600 mt-1">{metadata.location}</p> */}
                </div>

                {/* Retired Amount */}
                <div className="text-right">
                    <div className="text-2xl font-bold text-green-700">{Number(project.quantity).toLocaleString()} token</div>
                    <div className="text-sm text-gray-500">of carbon Retired</div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    {hasCertificate ? (
                        // If certificate exists, show a link to view it
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
                    ) : (
                        // If not, show a button to generate it
                        <button
                            onClick={generateAndStoreCertificate}
                            disabled={isSubmitting}
                            className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Generate and store the retirement certificate"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Processing...' : 'Generate Certificate'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};