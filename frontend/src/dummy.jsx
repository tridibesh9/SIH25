import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import jwt_decode from 'jwt-decode';

// --- Import your components ---
import Navigation from './components/Navigation.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { Marketplace } from './pages/Marketplace.jsx';
import { ProjectDetail } from './pages/ProjectDetail.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Auth } from './pages/Auth.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { Certificate } from './pages/Certificate.jsx';
import { RegisterProject } from './pages/RegisterProject.jsx';
import { ProjectOwnerDashboard } from './pages/ProjectOwner/ProjectOwnerDashboard.jsx';

// --- Import your contract artifact ---
// Make sure the path to this JSON file is correct
import CarbonMarketPlaceArtifact from './artifacts/contracts/CarbonCycle.sol/CarbonMarketplace.dbg.json';

// --- Your ProtectedRoute component (unchanged) ---
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    try {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            // It's better to have a logout function that clears localStorage
            localStorage.removeItem('token');
            return <Navigate to="/auth" replace />;
        }
    } catch (err) {
        localStorage.removeItem('token');
        return <Navigate to="/auth" replace />;
    }

    return children;
};


function App() {
    // State to hold blockchain information
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        const setupBlockchain = async () => {
            // Your contract address
            const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
            // Your contract ABI
            const contractABI = CarbonMarketPlaceArtifact.abi;

            try {
                // Check if MetaMask is installed
                if (window.ethereum) {
                    // 1. Create a provider
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    setProvider(provider);

                    // 2. Request account access
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const selectedAccount = accounts[0];
                    setAccount(selectedAccount);
                    console.log("Account connected: ", selectedAccount);

                    // 3. Get the signer to interact with the contract
                    const signer = await provider.getSigner();

                    // 4. Create a contract instance
                    const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
                    setContract(contractInstance);
                    console.log("Contract instance created:", contractInstance);

                } else {
                    alert("MetaMask is not installed. Please install it to use this app.");
                }
            } catch (error) {
                console.error("Error connecting to blockchain:", error);
            }
        };

        setupBlockchain();

        // Reload the page if the account changes in MetaMask
        window.ethereum.on('accountsChanged', () => {
            window.location.reload();
        });

    }, []); // Empty dependency array means this runs once on mount


    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                {/* Pass account info to Navigation to display it */}
                <Navigation account={account} />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<Auth />} />

                    {/* Routes that need blockchain data */}
                    <Route
                        path="/marketplace"
                        // Pass contract and account as props
                        element={<Marketplace contract={contract} account={account} />}
                    />
                    <Route
                        path="/dashboard"
                        element={<Dashboard contract={contract} account={account} />}
                    />
                    <Route
                        path="/project/:id"
                        element={<ProjectDetail contract={contract} account={account} />}
                    />
                    <Route
                        path="/certificate/:id"
                        element={<Certificate contract={contract} />}
                    />

                    {/* Example of a protected admin route */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                                <Route
                                    path="/owner/register"
                                    element={<RegisterProject />}
                                />
                                <Route
                                    path="/owner/dashboard"
                                    element={<ProjectOwnerDashboard contract={contract} account={account} />}
                                />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;