function StatCard({ title, value }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm mr-2" style={{ width: "300px", height: "120px" }}>
            <h3 className="text-gray-600 text-sm">{title}</h3>
            <p className="text-2xl font-semibold mt-2">{value}</p>
        </div>
    );
}

export default StatCard;