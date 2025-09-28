const StatCard = ({ title, value, icon, colorClass }) => (
    <div className={`bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 border-l-4 ${colorClass}`}>
        <div className={`p-3 rounded-full bg-opacity-20 ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default StatCard;