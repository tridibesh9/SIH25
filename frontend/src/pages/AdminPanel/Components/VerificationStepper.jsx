// src/pages/AdminPanel/components/VerificationStepper.jsx
import React from 'react';
import { Shield, Users, Bot, CheckCircle } from 'lucide-react';

const steps = [
    { name: 'Pending', statuses: ['pending'], icon: Shield },
    { name: 'NGO Review', statuses: ['land approval', 'ngoAssigned'], icon: Users },
    { name: 'Drone Review', statuses: ['droneAssigning', 'droneAssigned', 'ngo'], icon: Bot },
    { name: 'Final Review', statuses: ['admin approval pending', 'drones'], icon: CheckCircle },
    { name: 'Completed', statuses: ['approved'], icon: CheckCircle },
];

const VerificationStepper = ({ currentStatus }) => {
    const currentStepIndex = steps.findIndex(step => step.statuses.includes(currentStatus));

    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {steps.map((step, stepIdx) => {
                    const Icon = step.icon;
                    const isCompleted = stepIdx < currentStepIndex;
                    const isCurrent = stepIdx === currentStepIndex;

                    return (
                        <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
                            <div className="flex items-center text-sm font-medium">
                                <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${isCompleted ? 'bg-blue-600' : isCurrent ? 'border-2 border-blue-600 bg-white' : 'border-2 border-gray-300 bg-white'}`}>
                                    <Icon className={`${isCompleted ? 'text-white' : isCurrent ? 'text-blue-600' : 'text-gray-500'}`} size={24} />
                                </span>
                                <span className={`ml-4 ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>{step.name}</span>
                            </div>
                            {stepIdx !== steps.length - 1 && (
                                <div className={`absolute left-5 top-10 -ml-px mt-1 w-0.5 h-6 ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}`} />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default VerificationStepper;