import { useEffect, useState } from 'react';
import API from '../services/api';
import AchievementBadge from './AchievementBadge';
import Spinner from './Spinner';

const DashboardCard = () => {
  const [stats, setStats] = useState({
    name: '',
    xp: 0,
    level: 1,
    streak: 0,
    badgeCount: 0,
    badges: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/users/stats');
        const statsData = response.data.data || response.data;
        setStats({
          name: statsData.name || '',
          xp: statsData.xp || 0,
          level: statsData.level || 1,
          streak: statsData.streak || 0,
          badgeCount: statsData.badges?.length || 0,
          badges: statsData.badges || []
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Set default empty stats on error
        setStats({
          name: '',
          xp: 0,
          level: 1,
          streak: 0,
          badgeCount: 0,
          badges: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-8"><Spinner /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-lg text-center hover:shadow-lg transition">
          <p className="text-blue-100 text-sm font-semibold">Level</p>
          <p className="text-3xl font-bold text-white">{stats.level}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-4 rounded-lg text-center hover:shadow-lg transition">
          <p className="text-green-100 text-sm font-semibold">Total XP</p>
          <p className="text-3xl font-bold text-white">{stats.xp}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-4 rounded-lg text-center hover:shadow-lg transition">
          <p className="text-orange-100 text-sm font-semibold">Streak 🔥</p>
          <p className="text-3xl font-bold text-white">{stats.streak}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 rounded-lg text-center hover:shadow-lg transition">
          <p className="text-purple-100 text-sm font-semibold">Badges</p>
          <p className="text-3xl font-bold text-white">{stats.badgeCount}</p>
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <h3 className="text-2xl font-bold mb-4">🏆 Achievements ({stats.badgeCount}/7)</h3>
        {stats.badges && stats.badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.badges.map((badge) => (
              <AchievementBadge key={badge.id} badge={badge} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No badges earned yet. Keep grinding! 💪</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
