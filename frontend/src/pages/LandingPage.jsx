import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Globe, Zap, CheckCircle, MapPin } from 'lucide-react';

// --- Reusable Project Card Component (Adapted from your Marketplace) ---
const ProjectCard = ({ project, ethToInrRate }) => {
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
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
            </div>
        );
    }

    if (error || !metadata) {
        return <div className="bg-red-50 text-red-700 p-6 rounded-2xl text-center">Failed to load project.</div>;
    }

    const priceInEth = parseFloat(ethers.formatEther(project.valuePerCarbon));
    const priceInInr = priceInEth * ethToInrRate;

    // A serializable project object to pass via Link state
    const serializableProject = {
        projectId: Number(project.projectId),
        externalId: project.externalId,
        projectName: project.projectName,
        documentCID: project.documentCID,
        valuePerCarbon: project.valuePerCarbon.toString(),
        quantity: project.quantity.toString(),
        ownerName: project.ownerName,
        ownerAddress: project.ownerAddress,
    };

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
             <div className="relative">
                <img
                    src={metadata.projectImages?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={metadata.projectName}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 text-green-700 text-sm font-medium rounded-full capitalize">
                        {metadata.type || 'Project'}
                    </span>
                </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link 
                        to={`/project/${project.externalId}`} 
                        state={{ projectOnChain: serializableProject, projectMetadata: metadata }}
                        className="px-6 py-3 bg-white text-blue-800 font-bold rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg"
                    >
                        View Project
                    </Link>
                </div>
            </div>
            <div className="p-6">
                 <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{metadata.location}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{metadata.projectName}</h3>
                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                    <div>
                        <p className="text-2xl font-bold text-green-600">
                            {priceInInr.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}
                        </p>
                        <p className="text-sm text-gray-500">per tonne CO₂</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">{Number(project.quantity).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">tonnes available</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const LandingPage = ({ contract }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ethToInrRate, setEthToInrRate] = useState(280000); // You can fetch this dynamically

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    useEffect(() => {
        const fetchFeaturedProjects = async ({contract}) => {
            if (!contract) {
                console.log("Contract not available, skipping fetch.");
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const allProjects = await contract.getMarketplace();
                // We only want to feature the first 3 projects
                setProjects(allProjects.slice(0, 3));
            } catch (error) {
                console.error("Error fetching featured projects from smart contract:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeaturedProjects({contract});
    }, [contract]);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(26, 71, 42, 0.4), rgba(26, 71, 42, 0.6)), url("https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=1920")'
                    }}
                />
                <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                        {...fadeInUp}
                    >
                        Invest in Our Planet.
                        <span className="block text-blue-400">Trade Verifiable</span>
                        Carbon Credits.
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto"
                        {...fadeInUp}
                    >
                        The world's most transparent blockchain-powered marketplace for carbon credits. Every transaction verified, every impact tracked.
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        {...fadeInUp}
                    >
                        <Link
                            to="/marketplace"
                            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            Explore Marketplace
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold text-green-800 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            From project registration to impact verification, our transparent process ensures every carbon credit makes a real difference.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {[
                            { icon: Globe, title: 'Register Project', desc: 'Submit your environmental project' },
                            { icon: Shield, title: 'Verify & Approve', desc: 'Third-party verification process' },
                            { icon: Zap, title: 'Tokenize Credits', desc: 'Blockchain tokenization' },
                            { icon: ArrowRight, title: 'Buy & Sell', desc: 'Trade on our marketplace' },
                            { icon: CheckCircle, title: 'Retire for Impact', desc: 'Retire credits for offset' },
                            { icon: Shield, title: 'Get Certificate', desc: 'Receive verified certificate' }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <step.icon className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-600">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold text-green-800 mb-4">Featured Projects</h2>
                        <p className="text-xl text-gray-600">
                            High-impact environmental projects making a difference today
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={stagger}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {loading ? (
                            [...Array(3)].map((_, index) => (
                                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
                                    <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="flex justify-between items-center">
                                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            projects.map((project) => (
                                <motion.div key={Number(project.projectId)} variants={fadeInUp}>
                                    <ProjectCard project={project} ethToInrRate={ethToInrRate} />
                                </motion.div>
                            ))
                        )}
                    </motion.div>

                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Link
                            to="/marketplace"
                            className="inline-flex items-center px-8 py-3 bg-green-800 text-white rounded-xl font-semibold hover:bg-green-900 transition-colors"
                        >
                            View All Projects
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>
            
            {/* Trust & Partners Section */}
             <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold text-green-800 mb-4">Trusted by Leading Organizations</h2>
                        <p className="text-xl text-gray-600 mb-12">
                            Verified by industry-leading standards and trusted by global corporations
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
                            {['Verra', 'Gold Standard', 'Climate Action Reserve', 'VCS'].map((partner, index) => (
                                <div key={index} className="text-2xl font-bold text-gray-400">
                                    {partner}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};