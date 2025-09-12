import React from 'react';

const ScoreBadge = ({ score, size = 'default' }) => {
  const getScoreColor = (score) => {
    if (score >= 75) {
      return 'bg-green-100 text-green-700 border-green-200';
    } else if (score >= 50) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    } else {
      return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-xs';
      case 'large':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full border ${getScoreColor(score)} ${getSizeClasses(size)}`}
    >
      {score}
    </span>
  );
};

export default ScoreBadge;
