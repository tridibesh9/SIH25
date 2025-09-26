import React, { useState } from 'react';

import { PlusCircle, Map, ExternalLink, CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight, BarChart3, Cloud, FileText, Bot } from 'lucide-react';

const VerificationStepper = ({ currentStatus }) => {
  const steps = [
    { id: 'pending', name: 'Submitted', icon: <FileText/> },
    { id: 'land approval', name: 'Land Verified', icon: <Map/> },
    { id: 'ngo', name: 'NGO Report', icon: <Cloud/> },
    { id: 'drones', name: 'Drone Survey', icon: <Bot/> },
    { id: 'admin approval pending', name: 'Admin Review', icon: <Clock/> },
    { id: 'approved', name: 'Approved', icon: <CheckCircle/> },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStatus);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isCurrent ? 'bg-blue-500 text-white animate-pulse' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-300 text-gray-500' : ''}`}
              >
                {step.icon}
              </div>
              <p className={`mt-2 text-xs font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-600'}`}>
                {step.name}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default VerificationStepper;