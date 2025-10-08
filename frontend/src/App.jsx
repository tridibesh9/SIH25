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
import RegisterProjectWithTerritory from './pages/RegisterProjectWithTerritory.jsx';
import { ProjectOwnerDashboard } from './pages/ProjectOwner/ProjectOwnerDashboard.jsx';
import DroneImageUpload from './pages/DroneImageUpload.jsx';

import CarbonMarketPlaceArtifact from './artifacts/contracts/CarbonCycle.sol/CarbonMarketplace.json';

const DESIRED_CHAIN_ID = '80002';
const DESIRED_CHAIN_ID_HEX = '0x13882';

const amoyNetworkConfig = {
    chainId: DESIRED_CHAIN_ID_HEX,
    chainName: 'Polygon Amoy Testnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://rpc-amoy.polygon.technology/'],
    blockExplorerUrls: ['https://amoy.polygonscan.com/'],
};

const ProtectedRoute = ({ account, contract, children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');

            if (!token && !contract && !account) {
                setIsAuthorized(false);
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userName');
                    setIsAuthorized(false);
                } else {
                    setIsAuthorized(true);
                }
            } catch (err) {
                console.error('Token validation error:', err);
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                setIsAuthorized(false);
            }
        }
    }, []);

    if (isAuthorized === null) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>;
    }

    if (!isAuthorized) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

// Route wrapper to redirect authenticated users away from auth page
const AuthRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('userRole');

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp >= currentTime) {
                        setUserRole(role);
                    }
                } catch (err) {
                    console.error('Token validation error:', err);
                }
            }
            setIsChecking(false);
        }
    }, []);

    if (isChecking) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>;
    }

    // Redirect authenticated users to their dashboard
    if (userRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === 'seller') {
        return <Navigate to="/owner/dashboard" replace />;
    } else if (userRole === 'buyer') {
        return <Navigate to="/marketplace" replace />;
    }

    return children;
};

function App() {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [isClient, setIsClient] = useState(false);

    // Ensure we're on the client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    const switchOrAddNetwork = async () => {
        // Check if we're on client and ethereum is available
        if (typeof window === 'undefined' || !window.ethereum) {
            console.log('🔗 [BLOCKCHAIN] Ethereum provider not available');
            return;
        }
        
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

        if(!localStorage.getItem('token')){
            alert("please login first");
            return;
        }
        // CRITICAL: Only run on client side
        if (typeof window === 'undefined') {
            console.log('🔗 [BLOCKCHAIN] Skipping setup - not on client side');
            return;
        }

        const contractAddress = "0x291b0CD15bbE3EDF16f550f40115AF30e29e35e1";
        const contractABI = CarbonMarketPlaceArtifact;

        try {
            console.log('🔗 [BLOCKCHAIN] Starting blockchain setup...');
            console.log('🔗 [BLOCKCHAIN] Contract address:', contractAddress);
            console.log('🔗 [BLOCKCHAIN] Window.ethereum available:', !!window.ethereum);
            
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(provider);
                console.log('🔗 [BLOCKCHAIN] Provider created');
                
                // Check network
                const network = await provider.getNetwork();
                console.log('🔗 [BLOCKCHAIN] Current network:', {
                    name: network.name,
                    chainId: network.chainId.toString()
                });

                if (network.chainId.toString() !== DESIRED_CHAIN_ID) {
                    alert(`Wrong network. Please switch to Polygon Amoy (Chain ID: ${DESIRED_CHAIN_ID}).`);
                    await switchOrAddNetwork();
                    return;
                }

                // Request account access
                await window.ethereum.request({
                    method: 'wallet_requestPermissions',
                    params: [{ eth_accounts: {} }],
                });

                // ✅ Now request account access again
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const selectedAccount = accounts[0];
                setAccount(selectedAccount);
                 console.log("🔗 [BLOCKCHAIN] Account connected:", selectedAccount);
                const signer = await provider.getSigner();
                // const selectedAccount = await signer.getAddress();
                // setAccount(selectedAccount);
                // console.log("🔗 [BLOCKCHAIN] Account connected:", selectedAccount);

                // console.log("🔗 [BLOCKCHAIN] Creating contract instance...");
                const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
                setContract(contractInstance);
                console.log("🔗 [BLOCKCHAIN] Contract instance created successfully");
                
            } else {
                console.log("🔗 [BLOCKCHAIN] MetaMask not detected");
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

    const waitForEthereum = () => {
        return new Promise((resolve) => {
            if (window.ethereum) {
                resolve(window.ethereum);
            } else {
                window.addEventListener('ethereum#initialized', () => {
                    resolve(window.ethereum);
                }, { once: true });
                
                // Timeout after 3 seconds
                setTimeout(resolve, 3000);
            }
        });
    };

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined' || !isClient) {
            return;
        }

        const checkConnection = async () => {
            console.log('🔗 [BLOCKCHAIN] Checking existing connection...');
            
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    console.log('🔗 [BLOCKCHAIN] Existing accounts:', accounts);
                    
                    // // if (accounts.length > 0) {
                    // //     console.log("🔗 [BLOCKCHAIN] User already connected. Re-establishing...");
                    // //     await setupBlockchain();
                    // } else {
                    //     console.log("🔗 [BLOCKCHAIN] No existing connection found");
                    // }
                } catch (err) {
                    console.error('🔗 [BLOCKCHAIN] Error checking connection:', err);
                }
            } else {
                console.log('🔗 [BLOCKCHAIN] Ethereum provider not found');
            }
        };

        checkConnection();

        // Account change listener
        // Event Listeners
        if (window.ethereum) {
            const handleAccountsChanged = () => window.location.reload();
            // ✨ This is the new event listener for network changes
            const handleChainChanged = () => window.location.reload();

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            // ✨ This line tells your app to listen for the network switch
            window.ethereum.on('chainChanged', handleChainChanged);

            // Cleanup function to remove listeners
            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                // ✨ Cleans up the new listener
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, [isClient]);

    // Don't render until client-side hydration
    if (!isClient) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navigation setAccount={setAccount} setContract={setContract} account={account} setupBlockchain={setupBlockchain} />
                <Routes>
                    {/* Public route */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Auth page (also public) */}
                    <Route path="/auth" element={<Auth setupBlockchain={setupBlockchain} />} />

                    {/* All other routes are protected */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute account={account} contract={contract}>
                                <Routes>
                                    <Route path="/marketplace" element={<Marketplace contract={contract} account={account} />} />
                                    <Route path="/dashboard" element={<Dashboard contract={contract} account={account} />} />
                                    <Route path="/project/:id" element={<ProjectDetail contract={contract} account={account} />} />
                                    <Route path="/certificate/:id" element={<Certificate contract={contract} />} />
                                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                    <Route path="/admin/drone-upload" element={<DroneImageUpload />} />
                                    <Route path="/owner/register" element={<RegisterProjectWithTerritory />} />
                                    <Route path="/owner/dashboard" element={<ProjectOwnerDashboard contract={contract} account={account} />} />
                                </Routes>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
