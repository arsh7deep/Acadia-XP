import { useState } from 'react';

const ActivityForm = ({ onAdd }) => {
  const [type, setType] = useState('study');
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const activityTypes = {
    study: {
      label: '📚 Study',
      description: 'Reading, homework, research',
      xp: 10,
      color: 'from-purple-600 to-purple-800'
    },
    class: {
      label: '🎓 Class',
      description: 'Attend lectures, seminars',
      xp: 15,
      color: 'from-blue-600 to-blue-800'
    },
    workout: {
      label: '💪 Fitness/Workout',
      description: 'Exercise, sports, gym training',
      xp: 20,
      color: 'from-green-600 to-green-800'
    }
  };

  const validateForm = () => {
    const errors = {};

    const durationNum = parseInt(duration);
    if (!duration || isNaN(durationNum)) {
      errors.duration = 'Duration is required';
    } else if (durationNum < 1) {
      errors.duration = 'Duration must be at least 1 hour';
    } else if (durationNum > 12) {
      errors.duration = 'Duration cannot exceed 12 hours';
    }

    if (!type) {
      errors.type = 'Please select an activity type';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'duration') {
      setDuration(value);
    } else {
      setType(value);
    }
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
    setError('');
  };

  const handleActivitySelect = (activityType) => {
    console.log('Activity type selected:', activityType);
    setType(activityType);
    setFieldErrors({}); // Clear ALL field errors, not just type
    setError('');
    console.log('Field errors cleared, ready to submit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== Form Submit Handler Called ===');
    console.log('Current state:', { type, duration, fieldErrors });
    
    if (!validateForm()) {
      console.log('Form validation failed with errors:', fieldErrors);
      return;
    }
    console.log('Form validation passed');

    setLoading(true);
    setError('');
    try {
      console.log('Submitting activity:', { type, duration: parseInt(duration) });
      const response = await onAdd({ type, duration: parseInt(duration) });
      console.log('Activity added successfully:', response);
      
      // Reset form completely
      setDuration(1);
      setType('study');
      setFieldErrors({});
      setError('');
    } catch (err) {
      console.error('Error adding activity:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add activity';
      console.error('Error details:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const currentXP = activityTypes[type].xp;
  const earnedXP = currentXP * parseInt(duration || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded">
          {error}
        </div>
      )}

      {/* Activity Type Selection - Visual Cards */}
      <div>
        <label className="block text-lg font-bold mb-4">🎯 Select Activity Type</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(activityTypes).map(([key, activity]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleActivitySelect(key)}
              className={`p-4 rounded-lg border-2 transition transform hover:scale-105 ${
                type === key
                  ? `border-yellow-400 bg-gradient-to-br ${activity.color} shadow-lg`
                  : 'border-gray-600 bg-gray-800 hover:border-gray-500'
              }`}
            >
              <div className="text-3xl mb-2">{activity.label.split(' ')[0]}</div>
              <div className="font-bold text-white text-lg">{activity.label}</div>
              <div className="text-sm text-gray-200 mt-2">{activity.description}</div>
              <div className="text-lg font-bold text-white mt-3">{activity.xp} XP/hour</div>
            </button>
          ))}
        </div>
        {fieldErrors.type && (
          <p className="text-red-400 text-sm mt-2">{fieldErrors.type}</p>
        )}
      </div>

      {/* Duration Input */}
      <div>
        <label className="block text-lg font-bold mb-2">⏱️ Duration (hours)</label>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <input
              type="number"
              name="duration"
              min="1"
              max="12"
              value={duration}
              onChange={handleChange}
              className={`w-full p-3 bg-gray-700 text-white rounded outline-none transition text-lg ${
                fieldErrors.duration ? 'border-2 border-red-500' : 'border border-gray-600'
              }`}
              placeholder="Enter hours (1-12)"
            />
            {fieldErrors.duration && (
              <p className="text-red-400 text-sm mt-2">{fieldErrors.duration}</p>
            )}
          </div>
          
          {/* XP Earned Preview */}
          <div className={`p-4 rounded-lg font-bold text-xl text-white text-center min-w-fit ${
            earnedXP > 0 ? `bg-gradient-to-br ${activityTypes[type].color}` : 'bg-gray-600'
          }`}>
            <div className="text-sm text-gray-100 mb-1">You'll earn</div>
            <div>+{earnedXP} XP</div>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      {earnedXP > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
          <div className="text-sm text-gray-300">📊 Activity Summary:</div>
          <div className="text-white mt-2">
            <strong>{activityTypes[type].label}</strong> for <strong>{duration} hour{duration > 1 ? 's' : ''}</strong> = <strong className="text-green-400">+{earnedXP} XP</strong>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {(() => {
        const isDisabled = loading || Object.keys(fieldErrors).length > 0;
        console.log('Button render - disabled:', isDisabled, 'fieldErrors:', fieldErrors, 'loading:', loading);
        return (
          <button 
            type="submit"
            disabled={isDisabled}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed p-4 rounded-lg font-bold text-lg transition text-white"
          >
            {loading ? '⏳ Adding Activity...' : '✅ Log This Activity'}
          </button>
        );
      })()}
    </form>
  );
};

export default ActivityForm;
