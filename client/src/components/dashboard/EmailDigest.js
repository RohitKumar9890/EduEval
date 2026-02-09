import { useState } from 'react';

export default function EmailDigest({ preferences, onUpdatePreferences }) {
  const [settings, setSettings] = useState(preferences || {
    enabled: true,
    frequency: 'weekly',
    includeProgress: true,
    includeUpcoming: true,
    includeAchievements: true,
    includeLeaderboard: false,
  });

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    if (onUpdatePreferences) {
      onUpdatePreferences(newSettings);
    }
  };

  const handleFrequencyChange = (frequency) => {
    const newSettings = { ...settings, frequency };
    setSettings(newSettings);
    if (onUpdatePreferences) {
      onUpdatePreferences(newSettings);
    }
  };

  const getNextDigestDate = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    if (settings.frequency === 'daily') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toLocaleDateString();
    } else if (settings.frequency === 'weekly') {
      // Next Monday
      const daysUntilMonday = (8 - dayOfWeek) % 7 || 7;
      const nextMonday = new Date(today);
      nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
      return nextMonday.toLocaleDateString();
    } else if (settings.frequency === 'monthly') {
      // First day of next month
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      return nextMonth.toLocaleDateString();
    }
    return 'N/A';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Email Digest Settings</h3>
        <button
          onClick={() => handleToggle('enabled')}
          className={`px-4 py-2 rounded font-medium transition ${
            settings.enabled
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          {settings.enabled ? '✓ Enabled' : '✗ Disabled'}
        </button>
      </div>

      {/* Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        📧 Get a personalized summary of your learning progress delivered to your email!
      </div>

      {/* Frequency Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Digest Frequency
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleFrequencyChange('daily')}
            className={`px-4 py-2 rounded border-2 transition ${
              settings.frequency === 'daily'
                ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => handleFrequencyChange('weekly')}
            className={`px-4 py-2 rounded border-2 transition ${
              settings.frequency === 'weekly'
                ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => handleFrequencyChange('monthly')}
            className={`px-4 py-2 rounded border-2 transition ${
              settings.frequency === 'monthly'
                ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Content Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Include in Digest
        </label>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center space-x-2">
              <span>📊</span>
              <div>
                <div className="text-sm font-medium text-gray-900">Progress Summary</div>
                <div className="text-xs text-gray-600">Your scores and completion stats</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('includeProgress')}
              className={`w-12 h-6 rounded-full transition ${
                settings.includeProgress ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                settings.includeProgress ? 'translate-x-6' : 'translate-x-1'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center space-x-2">
              <span>📅</span>
              <div>
                <div className="text-sm font-medium text-gray-900">Upcoming Exams</div>
                <div className="text-xs text-gray-600">Schedule and deadlines</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('includeUpcoming')}
              className={`w-12 h-6 rounded-full transition ${
                settings.includeUpcoming ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                settings.includeUpcoming ? 'translate-x-6' : 'translate-x-1'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center space-x-2">
              <span>🏆</span>
              <div>
                <div className="text-sm font-medium text-gray-900">Achievements</div>
                <div className="text-xs text-gray-600">New badges and milestones</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('includeAchievements')}
              className={`w-12 h-6 rounded-full transition ${
                settings.includeAchievements ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                settings.includeAchievements ? 'translate-x-6' : 'translate-x-1'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center space-x-2">
              <span>🏅</span>
              <div>
                <div className="text-sm font-medium text-gray-900">Leaderboard Position</div>
                <div className="text-xs text-gray-600">Your rank and comparison</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('includeLeaderboard')}
              className={`w-12 h-6 rounded-full transition ${
                settings.includeLeaderboard ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
                settings.includeLeaderboard ? 'translate-x-6' : 'translate-x-1'
              }`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Next Digest Info */}
      {settings.enabled && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-sm text-green-800">
            <strong>📬 Next digest:</strong> {getNextDigestDate()}
          </div>
          <div className="text-xs text-green-600 mt-1">
            Sent every {settings.frequency === 'daily' ? 'day' : settings.frequency === 'weekly' ? 'Monday' : 'month'}
          </div>
        </div>
      )}

      {/* Preview Button */}
      <button
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
        onClick={() => {
          alert('📧 Preview email digest functionality would be implemented on the backend. This would show you what your digest email will look like!');
        }}
      >
        Preview Digest Email
      </button>

      {/* Privacy Note */}
      <div className="text-xs text-gray-500 text-center">
        🔒 Your email preferences are private and can be changed anytime
      </div>
    </div>
  );
}
