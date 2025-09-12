import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

export const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                index < currentStep
                  ? 'bg-green-600 border-green-600'
                  : index === currentStep
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-gray-200 border-gray-300'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {index < currentStep ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <span
                  className={`text-sm font-semibold ${
                    index === currentStep
                      ? 'text-white'
                      : index < currentStep
                      ? 'text-white'
                      : 'text-gray-500'
                  }`}
                >
                  {index + 1}
                </span>
              )}
            </motion.div>
            
            {/* Step Label */}
            <span
              className={`mt-2 text-xs font-medium text-center max-w-20 ${
                index <= currentStep ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {step}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                index < currentStep ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;