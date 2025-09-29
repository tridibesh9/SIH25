import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { jwtDecode } from 'jwt-decode';

import Navigation from './components/Navigation.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { Marketplace } from './pages/Marketplace.jsx';
import { ProjectDetail } from './pages/ProjectDetail.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Auth } from './pages/AuthPages/Auth.jsx';
import { AdminDashboard } from './pages/AdminPanel/AdminDashboard.jsx';
import { Certificate } from './pages/Certificate.jsx';
import { RegisterProject } from './pages/RegisterProject.jsx';
import { ProjectOwnerDashboard } from './pages/ProjectOwner/ProjectOwnerDashboard.jsx';

import CarbonMarketPlaceArtifact from './artifacts/contracts/CarbonCycle.sol/CarbonMarketplace.json';




const DESIRED_CHAIN_ID = '80002'; // Polygon Amoy Testnet
const DESIRED_CHAIN_ID_HEX = '0x13882'; // Hexadecimal of 80002

const amoyNetworkConfig = {
    chainId: DESIRED_CHAIN_ID_HEX,
    chainName: 'Polygon Amoy Testnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://rpc-amoy.polygon.technology/'],
    blockExplorerUrls: ['https://www.oklink.com/amoy'],
};


const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            return <Navigate to="/auth" replace />;
        }0
    } catch (err) {
        localStorage.removeItem('token');
        return <Navigate to="/auth" replace />;
    }

    return children;
};

function App() {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);

    const switchOrAddNetwork = async () => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: DESIRED_CHAIN_ID_HEX }],
            });
            window.location.reload();
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [amoyNetworkConfig],
                    });
                     window.location.reload();
                } catch (addError) {
                    console.error("Failed to add the network:", addError);
                    alert("Failed to add Polygon Amoy. Please add it manually.");
                }
            } else {
                console.error("Failed to switch network:", switchError);
                alert("Failed to switch network. Please do it manually.");
            }
        }
    };


    const setupBlockchain = async () => {
        // Your contract address might be different
        const contractAddress = "0xbF43C988e4F14B57F3208D31778Fb58e271e8FCB";
        const contractABI = CarbonMarketPlaceArtifact;

        try {
            console.log('🔗 [BLOCKCHAIN] Starting blockchain setup...');
            console.log('🔗 [BLOCKCHAIN] Contract address:', contractAddress);
            
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(provider);
                console.log('🔗 [BLOCKCHAIN] Provider created');
                

                // Check network
                const network = await provider.getNetwork();
                if (network.chainId.toString() !== DESIRED_CHAIN_ID) {
                    alert(`Wrong network. Please switch to Polygon Amoy (Chain ID: ${DESIRED_CHAIN_ID}).`);
                    await switchOrAddNetwork();
                    return;
                }
                console.log('🔗 [BLOCKCHAIN] Connected to network:', {
                    name: network.name,
                    chainId: network.chainId.toString()
                });

                // Request account access if not already connected
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                const signer = await provider.getSigner();
                const selectedAccount = await signer.getAddress();
                setAccount(selectedAccount);
                console.log("🔗 [BLOCKCHAIN] Account connected:", selectedAccount);

                console.log(" Contract ABI:\n\n\n", contractABI);

                const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
                console.log("contract ins:",contractInstance)
                setContract(contractInstance);
                // console.log("🔗 [BLOCKCHAIN] Contract instance created");
                
                // Test contract connection
                try {
                    const nextProjectId = await contractInstance.nextProjectId();
                    console.log("🔗 [BLOCKCHAIN] Contract test successful - nextProjectId:", nextProjectId.toString());
                } catch (testError) {
                    console.error("🔗 [BLOCKCHAIN] Contract test failed:", testError);
                    console.error("🔗 [BLOCKCHAIN] Make sure Hardhat node is running on localhost:8545");
                }
                
            } else {
                alert("MetaMask is not installed. Please install it to use this app.");
            }
        } catch (error) {
            console.error("🔗 [BLOCKCHAIN] Error connecting to blockchain:", error);
            console.error("🔗 [BLOCKCHAIN] Error details:", {
                message: error.message,
                code: error.code,
                data: error.data
            });
        }
    };

    useEffect(() => {
        const checkConnection = async () => {
            if (window.ethereum) {
                // Check if the user is already connected
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                
                // If accounts are found and a token exists, re-establish the connection
                if (accounts.length > 0 && localStorage.getItem('token')) {
                    console.log("User already connected. Re-establishing connection...");
                    setupBlockchain();
                }
            }
        };

        checkConnection();

        // Reload the page if the account changes in MetaMask
        window.ethereum.on('accountsChanged', () => {
            window.location.reload();
        });

    }, []);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navigation account={account} setupBlockchain={setupBlockchain}/>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<Auth setupBlockchain={setupBlockchain} />} />
                    <Route
                        path="/marketplace"
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
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/owner/register"
                        element={<RegisterProject />}
                    />
                    <Route
                        path="/owner/dashboard"
                        element={<ProjectOwnerDashboard contract={contract} account={account} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;