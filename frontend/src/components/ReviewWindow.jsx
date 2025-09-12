import React from 'react';
import { Eye } from 'lucide-react';

const ReviewWindow = ({ title, data, onReview, onBulkAction, bulkActionText }) => {
  const handleShowAll = () => {
    // This will be implemented later when backend integration is done
    console.log(`Show all ${title}`);
  };

  const handleBulkAction = () => {
    // This will be implemented later when backend integration is done
    console.log(`${bulkActionText} for all ${title}`);
    if (onBulkAction) {
      onBulkAction();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <button
          onClick={handleBulkAction}
          className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors"
        >
          {bulkActionText}
        </button>
      </div>

      {/* Table */}
      <div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.slice(0, 3).map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-2 py-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                </td>
                <td className="px-2 py-3">
                  <div className="font-medium text-gray-800 text-xs truncate max-w-[120px]" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{item.id}</div>
                </td>
                <td className="px-2 py-3">
                  <button
                    onClick={() => onReview && onReview(item)}
                    className="flex items-center px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show All Button */}
      <div className="p-4 border-t border-gray-200 text-center">
        <button
          onClick={handleShowAll}
          className="text-blue-600 hover:text-blue-700 font-medium text-xs transition-colors"
        >
          Show All
        </button>
      </div>
    </div>
  );
};

export default ReviewWindow;
