import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PeerComparison({ myStats, classStats }) {
  const {
    myAverage = 0,
    myExamsCompleted = 0,
    myStreak = 0,
    myTopScore = 0
  } = myStats;

  const {
    classAverage = 0,
    topStudentAverage = 0,
    averageExamsCompleted = 0,
    averageStreak = 0
  } = classStats;

  // Comparison data
  const comparisonData = [
    {
      metric: 'Average Score',
      You: parseFloat(myAverage.toFixed(1)),
      Class: parseFloat(classAverage.toFixed(1)),
      Top: parseFloat(topStudentAverage.toFixed(1))
    },
    {
      metric: 'Exams Done',
      You: myExamsCompleted,
      Class: Math.round(averageExamsCompleted),
      Top: Math.round(averageExamsCompleted * 1.5) // Simulated
    },
    {
      metric: 'Study Streak',
      You: myStreak,
      Class: Math.round(averageStreak),
      Top: Math.round(averageStreak * 2) // Simulated
    }
  ];

  // Percentile calculation
  const getPercentile = () => {
    if (classAverage === 0) return 50;
    const diff = myAverage - classAverage;
    const percentile = 50 + (diff / classAverage) * 50;
    return Math.max(0, Math.min(100, percentile));
  };

  const percentile = getPercentile();

  const getPercentileMessage = () => {
    if (percentile >= 90) return "You're in the top 10%! Outstanding! 🌟";
    if (percentile >= 75) return "You're performing better than most! 💪";
    if (percentile >= 50) return "You're doing well! Keep it up! 👍";
    if (percentile >= 25) return "Room for improvement! You can do it! 📚";
    return "Keep working hard! Every effort counts! 🎯";
  };

  const getPercentileColor = () => {
    if (percentile >= 75) return 'text-green-600';
    if (percentile >= 50) return 'text-blue-600';
    if (percentile >= 25) return 'text-yellow-600';
    return 'text-orange-600';
  };

  // Skill comparison radar data
  const skillData = [
    { skill: 'Speed', You: Math.min(100, myExamsCompleted * 10), Class: Math.min(100, averageExamsCompleted * 10) },
    { skill: 'Accuracy', You: myAverage, Class: classAverage },
    { skill: 'Consistency', You: Math.min(100, myStreak * 10), Class: Math.min(100, averageStreak * 10) },
    { skill: 'Excellence', You: myTopScore, Class: topStudentAverage * 0.9 },
  ];

  return (
    <div className="space-y-6">
      {/* Percentile Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
        <div className="text-center">
          <div className="text-sm text-purple-600 font-medium mb-2">Your Percentile Rank</div>
          <div className={`text-5xl font-bold ${getPercentileColor()} mb-2`}>
            {percentile.toFixed(0)}th
          </div>
          <div className="text-sm text-purple-700">{getPercentileMessage()}</div>
          
          {/* Percentile Bar */}
          <div className="mt-4 relative">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all"
                style={{ width: `${percentile}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0th</span>
              <span>50th</span>
              <span>100th</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="You" fill="#3b82f6" name="You" />
            <Bar dataKey="Class" fill="#10b981" name="Class Average" />
            <Bar dataKey="Top" fill="#f59e0b" name="Top Student" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Radar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Profile Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={skillData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis domain={[0, 100]} />
            <Radar name="You" dataKey="You" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Radar name="Class Avg" dataKey="Class" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Comparison Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium mb-1">Your Position</div>
          <div className="text-2xl font-bold text-blue-900">
            {myAverage > classAverage ? 'Above' : myAverage === classAverage ? 'At' : 'Below'} Average
          </div>
          <div className="text-xs text-blue-700 mt-1">
            {myAverage > classAverage 
              ? `+${(myAverage - classAverage).toFixed(1)}% ahead` 
              : myAverage === classAverage 
              ? 'Right on target'
              : `${(classAverage - myAverage).toFixed(1)}% to catch up`}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium mb-1">To Top Student</div>
          <div className="text-2xl font-bold text-green-900">
            {topStudentAverage - myAverage > 0 
              ? `${(topStudentAverage - myAverage).toFixed(1)}%` 
              : 'You\'re #1! 🏆'}
          </div>
          <div className="text-xs text-green-700 mt-1">
            {topStudentAverage - myAverage > 0 
              ? 'Gap to close' 
              : 'Keep leading!'}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-900 mb-2">💡 Insights</h4>
        <ul className="space-y-1 text-sm text-yellow-800">
          {myAverage > classAverage && (
            <li>✓ You're outperforming the class average - great work!</li>
          )}
          {myExamsCompleted > averageExamsCompleted && (
            <li>✓ You've completed more exams than average - stay consistent!</li>
          )}
          {myStreak > averageStreak && (
            <li>✓ Your study streak is stronger than most - keep it going!</li>
          )}
          {myAverage < classAverage && (
            <li>→ Focus on understanding key concepts to boost your average</li>
          )}
          {myExamsCompleted < averageExamsCompleted && (
            <li>→ Try to complete more practice exams to gain experience</li>
          )}
          {comparisonData.every(d => d.You > d.Class) && (
            <li>🌟 You're excelling in all areas - phenomenal performance!</li>
          )}
        </ul>
      </div>

      {/* Privacy Notice */}
      <div className="text-xs text-gray-500 text-center bg-gray-50 border border-gray-200 rounded p-2">
        🔒 Comparisons are anonymized. Your individual performance is private.
      </div>
    </div>
  );
}
