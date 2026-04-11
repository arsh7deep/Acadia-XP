const AchievementBadge = ({ badge }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg text-center hover:bg-gray-600 transition">
      <div className="text-4xl mb-2">{badge.icon}</div>
      <h4 className="font-bold text-sm">{badge.title}</h4>
      <p className="text-xs text-gray-300 mt-1">{badge.description}</p>
      <p className="text-xs text-gray-400 mt-2">
        {new Date(badge.unlockedAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default AchievementBadge;
