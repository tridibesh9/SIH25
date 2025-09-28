// src/pages/AdminPanel/Components/StatCard.jsx

import React from 'react';

const StatCard = ({ title, value, icon, colorClass }) => {
    return (
        <div className={`p-4 bg-white rounded-xl shadow-md flex items-center space-x-4 border-l-4 ${colorClass}`}>
            <div className={`p-3 rounded-full ${colorClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;