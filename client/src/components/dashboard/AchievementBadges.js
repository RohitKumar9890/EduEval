export default function AchievementBadges({ achievements }) {
  const badges = [
    // Beginner Achievements
    { id: 'first_exam', name: 'First Step', icon: '🎯', description: 'Completed your first exam', tier: 'bronze', unlocked: achievements.firstExam },
    { id: 'early_bird', name: 'Early Bird', icon: '🌅', description: 'Started exam within first hour', tier: 'bronze', unlocked: achievements.earlyBird },
    
    // Score Achievements
    { id: 'perfect_score', name: 'Perfectionist', icon: '💯', description: 'Scored 100% on an exam', tier: 'gold', unlocked: achievements.perfectScore },
    { id: 'high_avg', name: 'Excellence', icon: '⭐', description: 'Maintained 85%+ average', tier: 'silver', unlocked: achievements.highAverage },
    { id: 'ninety_plus', name: 'A+ Student', icon: '🌟', description: 'Scored 90%+ on 3 exams', tier: 'silver', unlocked: achievements.ninetyPlus },
    
    // Completion Achievements
    { id: 'five_exams', name: 'Dedicated', icon: '📚', description: 'Completed 5 exams', tier: 'bronze', unlocked: achievements.fiveExams },
    { id: 'ten_exams', name: 'Committed', icon: '🔥', description: 'Completed 10 exams', tier: 'silver', unlocked: achievements.tenExams },
    { id: 'twenty_exams', name: 'Expert', icon: '👑', description: 'Completed 20 exams', tier: 'gold', unlocked: achievements.twentyExams },
    
    // Streak Achievements
    { id: 'streak', name: 'Consistent', icon: '📈', description: 'Improving scores streak', tier: 'silver', unlocked: achievements.streak },
    { id: 'week_streak', name: 'Week Warrior', icon: '🗓️', description: '7-day study streak', tier: 'bronze', unlocked: achievements.weekStreak },
    { id: 'month_streak', name: 'Month Master', icon: '🏅', description: '30-day study streak', tier: 'gold', unlocked: achievements.monthStreak },
    
    // Special Achievements
    { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', description: 'Completed exam in half the time', tier: 'silver', unlocked: achievements.speedDemon },
    { id: 'comeback_kid', name: 'Comeback Kid', icon: '💪', description: 'Improved score by 20%+', tier: 'bronze', unlocked: achievements.comebackKid },
    { id: 'night_owl', name: 'Night Owl', icon: '🦉', description: 'Completed exam after 10 PM', tier: 'bronze', unlocked: achievements.nightOwl },
    { id: 'all_subjects', name: 'Renaissance', icon: '🎨', description: 'Scored 80%+ in all subjects', tier: 'gold', unlocked: achievements.allSubjects },
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const goldCount = badges.filter(b => b.unlocked && b.tier === 'gold').length;
  const silverCount = badges.filter(b => b.unlocked && b.tier === 'silver').length;
  const bronzeCount = badges.filter(b => b.unlocked && b.tier === 'bronze').length;

  const getTierColor = (tier, unlocked) => {
    if (!unlocked) return 'bg-gray-50 border-gray-200 opacity-50';
    
    switch (tier) {
      case 'gold':
        return 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 shadow-lg';
      case 'silver':
        return 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400 shadow-md';
      case 'bronze':
        return 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400 shadow-md';
      default:
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-md';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your Achievements</h3>
        <div className="flex items-center space-x-3">
          {goldCount > 0 && <span className="text-sm">🥇 {goldCount}</span>}
          {silverCount > 0 && <span className="text-sm">🥈 {silverCount}</span>}
          {bronzeCount > 0 && <span className="text-sm">🥉 {bronzeCount}</span>}
          <span className="text-sm text-gray-600">
            {unlockedCount}/{badges.length}
          </span>
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="space-y-4">
        {/* Gold Tier */}
        <div>
          <h4 className="text-sm font-semibold text-yellow-700 mb-2 flex items-center">
            <span className="text-lg mr-1">🥇</span> Gold Tier
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {badges.filter(b => b.tier === 'gold').map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border-2 transition-all ${getTierColor(badge.tier, badge.unlocked)}`}
              >
                <div className="text-center">
                  <div className={`text-3xl mb-1 ${badge.unlocked ? '' : 'grayscale'}`}>
                    {badge.icon}
                  </div>
                  <div className="font-semibold text-gray-900 text-xs">{badge.name}</div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">{badge.description}</div>
                  {badge.unlocked && (
                    <div className="mt-1">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                        ✓
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Silver Tier */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
            <span className="text-lg mr-1">🥈</span> Silver Tier
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {badges.filter(b => b.tier === 'silver').map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border-2 transition-all ${getTierColor(badge.tier, badge.unlocked)}`}
              >
                <div className="text-center">
                  <div className={`text-3xl mb-1 ${badge.unlocked ? '' : 'grayscale'}`}>
                    {badge.icon}
                  </div>
                  <div className="font-semibold text-gray-900 text-xs">{badge.name}</div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">{badge.description}</div>
                  {badge.unlocked && (
                    <div className="mt-1">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                        ✓
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bronze Tier */}
        <div>
          <h4 className="text-sm font-semibold text-orange-700 mb-2 flex items-center">
            <span className="text-lg mr-1">🥉</span> Bronze Tier
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {badges.filter(b => b.tier === 'bronze').map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border-2 transition-all ${getTierColor(badge.tier, badge.unlocked)}`}
              >
                <div className="text-center">
                  <div className={`text-3xl mb-1 ${badge.unlocked ? '' : 'grayscale'}`}>
                    {badge.icon}
                  </div>
                  <div className="font-semibold text-gray-900 text-xs">{badge.name}</div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">{badge.description}</div>
                  {badge.unlocked && (
                    <div className="mt-1">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                        ✓
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Achievement Progress</span>
          <span className="text-sm font-bold text-gray-900">
            {((unlockedCount / badges.length) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
