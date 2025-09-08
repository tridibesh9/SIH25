import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Shield, Globe, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
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
            The world's most transparent blockchain-powered marketplace for carbon credits.
            Every transaction verified, every impact tracked.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            {...fadeInUp}
          >
            <Link
              to="/marketplace"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
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

      {/* Featured Projects */}
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
            {[
              {
                id: 1,
                title: 'Amazon Rainforest Restoration',
                type: 'Reforestation',
                location: 'Brazil',
                image: 'https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=800',
                price: '12',
                available: '50,000'
              },
              {
                id: 2,
                title: 'Solar Farm Initiative',
                type: 'Renewable Energy',
                location: 'India',
                image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800',
                price: '15',
                available: '75,000'
              },
              {
                id: 3,
                title: 'Mangrove Conservation',
                type: 'Conservation',
                location: 'Indonesia',
                image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=800',
                price: '18',
                available: '25,000'
              }
            ].map((project) => (
              <motion.div
                key={project.id}
                variants={fadeInUp}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 text-green-700 text-sm font-medium rounded-full">
                      {project.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.location}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">${project.price}</p>
                      <p className="text-sm text-gray-500">per tonne CO₂</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-800">{project.available}</p>
                      <p className="text-sm text-gray-500">tonnes available</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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

      {/* Trust & Partners */}
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
