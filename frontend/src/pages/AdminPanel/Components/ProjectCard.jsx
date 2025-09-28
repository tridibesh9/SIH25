// src/pages/AdminDashboard/components/ProjectCard.jsx

import React from 'react';
import { Eye } from 'lucide-react';

export const ProjectCard = ({ project, onDetailsClick, children }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex flex-col h-full">
            <div className="flex-grow">
                <h4 className="font-bold text-gray-800">{project.projectName}</h4>
                <p className="text-sm text-gray-500 mb-2">{project.location}</p>
                <div className="text-xs text-gray-400">Owner: {project.owner}</div>
            </div>
            <div className="mt-4 space-y-2">
                <button
                    onClick={() => onDetailsClick(project)}
                    className="w-full bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm hover:bg-gray-200 flex items-center justify-center"
                >
                    <Eye className="w-4 h-4 mr-2" /> View Details
                </button>
                <div>{children}</div>
            </div>
        </div>
    );
};