export default function StudyStreak({ streakData }) {
  const {
    currentStreak = 0,
    longestStreak = 0,
    lastActivity = null,
    weeklyActivity = [],
    totalDaysActive = 0
  } = streakData;

  const today = new Date();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const isActiveDay = (date) => {
    return weeklyActivity.some(activityDate => {
      const d = new Date(activityDate);
      return d.getDate() === date.getDate() &&
             d.getMonth() === date.getMonth() &&
             d.getFullYear() === date.getFullYear();
    });
  };

  const getStreakMessage = () => {
    if (currentStreak === 0) {
      return "Start your learning journey today! 🚀";
    } else if (currentStreak === 1) {
      return "Great start! Come back tomorrow to build your streak! 💪";
    } else if (currentStreak < 7) {
      return `Amazing! Keep it up to reach a week! 🔥`;
    } else if (currentStreak < 30) {
      return `Incredible dedication! You're on fire! 🔥🔥`;
    } else {
      return `Legendary streak! You're a learning machine! 🏆`;
    }
  };

  const getStreakIcon = (days) => {
    if (days >= 30) return '🏆';
    if (days >= 14) return '🔥🔥';
    if (days >= 7) return '🔥';
    if (days >= 3) return '⭐';
    if (days >= 1) return '✨';
    return '🌱';
  };

  return (
    <div className="space-y-4">
      {/* Current Streak Display */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-6">
        <div className="text-center">
          <div className="text-6xl mb-2">{getStreakIcon(currentStreak)}</div>
          <div className="text-4xl font-bold text-orange-600 mb-1">{currentStreak}</div>
          <div className="text-sm text-orange-700 font-medium">Day Streak</div>
          <div className="text-xs text-orange-600 mt-2">{getStreakMessage()}</div>
        </div>
      </div>

      {/* Weekly Activity Calendar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">This Week's Activity</h4>
        <div className="grid grid-cols-7 gap-2">
          {last7Days.map((date, index) => {
            const isActive = isActiveDay(date);
            const isToday = date.toDateString() === today.toDateString();
            
            return (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-600 mb-1">
                  {weekDays[date.getDay()]}
                </div>
                <div
                  className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center text-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg scale-110'
                      : isToday
                      ? 'bg-blue-100 border-2 border-blue-400 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isActive ? '✓' : date.getDate()}
                </div>
                {isToday && (
                  <div className="text-xs text-blue-600 font-medium mt-1">Today</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">{longestStreak}</div>
          <div className="text-xs text-purple-700">Longest Streak</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalDaysActive}</div>
          <div className="text-xs text-blue-700">Total Active Days</div>
        </div>
      </div>

      {/* Milestone Progress */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Next Milestone</h4>
        {currentStreak < 7 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">7-Day Streak 🔥</span>
              <span className="text-sm font-bold text-gray-900">{currentStreak}/7</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all"
                style={{ width: `${(currentStreak / 7) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        {currentStreak >= 7 && currentStreak < 14 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">14-Day Streak 🔥🔥</span>
              <span className="text-sm font-bold text-gray-900">{currentStreak}/14</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all"
                style={{ width: `${(currentStreak / 14) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        {currentStreak >= 14 && currentStreak < 30 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">30-Day Streak 🏆</span>
              <span className="text-sm font-bold text-gray-900">{currentStreak}/30</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all"
                style={{ width: `${(currentStreak / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        {currentStreak >= 30 && (
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <div className="text-sm text-gray-600">You've achieved the ultimate milestone!</div>
            <div className="text-xs text-gray-500 mt-1">Keep the momentum going!</div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        💡 <strong>Tip:</strong> Activity counts when you complete an exam, view materials, or engage with the platform. Come back daily to maintain your streak!
      </div>
    </div>
  );
}
