function StatsCard({ icon, title, value, color }) {
  try {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600'
    };

    return (
      <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg" data-name="stats-card" data-file="components/StatsCard.js">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[var(--text-secondary)] text-sm mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <div className={`icon-${icon} text-2xl`}></div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('StatsCard component error:', error);
    return null;
  }
}