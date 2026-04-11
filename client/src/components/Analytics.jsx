import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import Spinner from './Spinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = ({ activities = [], userStats = {} }) => {
  const [loading, setLoading] = useState(false);
  const [weeklyData, setWeeklyData] = useState(null);
  const [activityBreakdown, setActivityBreakdown] = useState(null);

  useEffect(() => {
    generateAnalytics();
  }, [activities]);

  const generateAnalytics = () => {
    if (!activities || activities.length === 0) {
      return;
    }

    // Generate Weekly XP Data (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    const xpByDay = last7Days.map(day => {
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
        return activityDate === day;
      });
      return dayActivities.reduce((total, activity) => total + (activity.xpEarned || 0), 0);
    });

    setWeeklyData({
      labels: last7Days,
      datasets: [
        {
          label: 'XP Earned',
          data: xpByDay,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    });

    // Activity Type Breakdown
    const activityCounts = {
      study: 0,
      class: 0,
      workout: 0
    };

    activities.forEach(activity => {
      if (activityCounts.hasOwnProperty(activity.type)) {
        activityCounts[activity.type]++;
      }
    });

    setActivityBreakdown({
      labels: ['📚 Study', '🎓 Class', '💪 Workout'],
      datasets: [
        {
          data: [activityCounts.study, activityCounts.class, activityCounts.workout],
          backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981'],
          borderColor: '#1f2937',
          borderWidth: 2
        }
      ]
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          padding: 15,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
    scales: {
      y: {
        ticks: { 
          color: '#fff',
          padding: 10
        },
        grid: { 
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: true
        }
      },
      x: {
        ticks: { 
          color: '#fff',
          padding: 10
        },
        grid: { 
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: true
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#fff',
          padding: 20,
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm font-bold mb-2">Total XP</h3>
          <p className="text-3xl font-bold text-blue-400">{userStats?.xp || 0}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm font-bold mb-2">Current Level</h3>
          <p className="text-3xl font-bold text-green-400">{userStats?.level || 1}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm font-bold mb-2">Streak</h3>
          <p className="text-3xl font-bold text-orange-400">{userStats?.streak || 0} days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weeklyData && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-white text-lg font-bold mb-4">📈 Weekly XP Progress</h3>
            <Line data={weeklyData} options={chartOptions} />
          </div>
        )}

        {activityBreakdown && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-white text-lg font-bold mb-4">🎯 Activity Breakdown</h3>
            <div style={{ position: 'relative', height: '400px', width: '100%' }}>
              <Doughnut data={activityBreakdown} options={doughnutOptions} />
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-white text-lg font-bold mb-4">📊 Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Total Activities</p>
            <p className="text-2xl font-bold text-white">{activities?.length || 0}</p>
          </div>
          <div>
            <p className="text-gray-400">Total Hours</p>
            <p className="text-2xl font-bold text-white">
              {activities?.reduce((total, a) => total + (a.duration || 0), 0) || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Avg XP per Activity</p>
            <p className="text-2xl font-bold text-white">
              {activities && activities.length > 0
                ? Math.round(
                    activities.reduce((total, a) => total + (a.xpEarned || 0), 0) /
                      activities.length
                  )
                : 0}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Most Common</p>
            <p className="text-2xl font-bold text-white">
              {(() => {
                if (!activities || activities.length === 0) return '-';
                const counts = { study: 0, class: 0, workout: 0 };
                activities.forEach(a => {
                  if (counts.hasOwnProperty(a.type)) counts[a.type]++;
                });
                return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
              })()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
