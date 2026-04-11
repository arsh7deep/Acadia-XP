import { useEffect, useState } from 'react';
import { addActivity, getActivities } from '../services/activityService';
import { getLeaderboard, getProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import XPBar from '../components/XPBar';
import ActivityForm from '../components/ActivityForm';
import LeaderboardTable from '../components/LeaderboardTable';
import DashboardCard from '../components/DashboardCard';
import Analytics from '../components/Analytics';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(user || {});
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  const totalXP = activities.reduce((sum, activity) => sum + (activity.xpEarned || 0), 0);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [acts, lb, profile] = await Promise.all([
        getActivities(),
        getLeaderboard(),
        getProfile()
      ]);
      
      setActivities(acts || []);
      setLeaderboard(lb || []);
      setUserStats(profile || user || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const handleAdd = async (data) => {
    try {
      setActivityLoading(true);
      setError('');
      console.log('handleAdd called with:', data);
      
      const result = await addActivity(data);
      console.log('addActivity result:', result);
      
      setSuccess('Activity added successfully! 🎉');
      setRefreshKey(prev => prev + 1);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('handleAdd error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add activity';
      console.error('Error message:', errorMsg);
      setError(errorMsg);
    } finally {
      setActivityLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-400 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Toast Notifications */}
        {error && <Toast message={error} type="error" />}
        {success && <Toast message={success} type="success" />}
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold">Welcome, {userStats?.name || 'Learner'}! 🎯</h2>
          <p className="text-gray-400 mt-2">Track your activities and watch yourself level up!</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg">
            <p className="text-blue-100 text-sm font-semibold mb-1">Total XP</p>
            <p className="text-4xl font-bold">{userStats?.xp || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg">
            <p className="text-purple-100 text-sm font-semibold mb-1">Level</p>
            <p className="text-4xl font-bold">{userStats?.level || 1}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-lg">
            <p className="text-orange-100 text-sm font-semibold mb-1">Streak</p>
            <p className="text-4xl font-bold">{userStats?.streak || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg">
            <p className="text-green-100 text-sm font-semibold mb-1">Badges</p>
            <p className="text-4xl font-bold">{userStats?.badges?.length || 0}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'overview' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📊 Overview
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'analytics' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📈 Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* XP Bar */}
            <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <XPBar xp={userStats?.xp || 0} />
            </div>

            {/* Stats & Badges Card */}
            <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <DashboardCard key={refreshKey} />
            </div>

            {/* Activity Form */}
            <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <h3 className="text-2xl font-bold mb-4">➕ Add New Activity</h3>
              {activityLoading ? (
                <div className="flex justify-center py-6">
                  <Spinner />
                </div>
              ) : (
                <ActivityForm onAdd={handleAdd} />
              )}
            </div>

            {/* Leaderboard */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">🏆 Top 10 Leaderboard</h3>
              {leaderboard.length > 0 ? (
                <LeaderboardTable users={leaderboard} />
              ) : (
                <p className="text-gray-400 text-center py-8">No leaderboard data available yet</p>
              )}
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <Analytics activities={activities} userStats={userStats} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
