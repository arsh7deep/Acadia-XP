const XPBar = ({ xp }) => {
  const xpPerLevel = 100;
  const currentLevel = Math.floor(xp / xpPerLevel) + 1;
  const xpInCurrentLevel = xp % xpPerLevel;
  const percentage = (xpInCurrentLevel / xpPerLevel) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Level {currentLevel} 🏆</h3>
          <p className="text-gray-400">Total XP: {xp}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Progress to next level</p>
          <p className="text-xl font-bold">{xpInCurrentLevel}/{xpPerLevel} XP</p>
        </div>
      </div>
      
      <div className="w-full bg-gray-700 h-6 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>0 XP</span>
        <span>{percentage.toFixed(1)}%</span>
        <span>100 XP</span>
      </div>
    </div>
  );
};

export default XPBar;
