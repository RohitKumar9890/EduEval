import { useState } from 'react';

export default function Leaderboard({ students, currentUserId, timeframe = 'all' }) {
  const [showMe, setShowMe] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

  // Sort students by average score
  const sortedStudents = [...students].sort((a, b) => b.avgScore - a.avgScore);

  // Find current user's rank
  const myRank = sortedStudents.findIndex(s => s.id === currentUserId) + 1;
  const myData = sortedStudents.find(s => s.id === currentUserId);

  // Get top 10 or show more if user is not in top 10
  const displayStudents = sortedStudents.slice(0, 10);
  const showMyRank = myRank > 10;

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getProgressColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (!students || students.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No leaderboard data available yet.</p>
        <p className="text-sm mt-2">Complete exams to see rankings!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="text-blue-800">
          🔒 <strong>Privacy Protected:</strong> Names are anonymized. Only you can see your position.
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedTimeframe('week')}
          className={`px-3 py-1 text-sm rounded ${
            selectedTimeframe === 'week' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setSelectedTimeframe('month')}
          className={`px-3 py-1 text-sm rounded ${
            selectedTimeframe === 'month' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setSelectedTimeframe('all')}
          className={`px-3 py-1 text-sm rounded ${
            selectedTimeframe === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Time
        </button>
      </div>

      {/* My Rank Summary */}
      {myData && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-600 font-medium">Your Rank</div>
              <div className="text-3xl font-bold text-purple-900">{getRankEmoji(myRank)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-600">Average Score</div>
              <div className="text-2xl font-bold text-purple-900">{myData.avgScore.toFixed(1)}%</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-600">Exams</div>
              <div className="text-2xl font-bold text-purple-900">{myData.examsCompleted}</div>
            </div>
          </div>
        </div>
      )}

      {/* Top 10 Leaderboard */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <span className="text-lg">🏆 Top Performers</span>
          <span className="ml-2 text-xs text-gray-500">({sortedStudents.length} students)</span>
        </h3>
        
        {displayStudents.map((student, index) => {
          const rank = index + 1;
          const isCurrentUser = student.id === currentUserId;
          
          return (
            <div
              key={student.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                isCurrentUser
                  ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-400 shadow-md'
                  : rank <= 3
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center space-x-3 flex-1">
                <div className={`text-2xl font-bold ${
                  rank <= 3 ? 'text-3xl' : 'text-gray-600'
                }`}>
                  {getRankEmoji(rank)}
                </div>
                
                {/* Name (anonymized) */}
                <div>
                  <div className={`font-semibold ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                    {isCurrentUser ? '👤 You' : `Student ${student.anonymousId}`}
                  </div>
                  <div className="text-xs text-gray-600">
                    {student.examsCompleted} exam{student.examsCompleted !== 1 ? 's' : ''} completed
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    isCurrentUser ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {student.avgScore.toFixed(1)}%
                  </div>
                  {student.trend && (
                    <div className={`text-xs ${
                      student.trend === 'up' ? 'text-green-600' : 
                      student.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {student.trend === 'up' ? '↗ Improving' : 
                       student.trend === 'down' ? '↘ Declining' : '→ Stable'}
                    </div>
                  )}
                </div>
                
                {/* Progress Bar */}
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(student.avgScore)} transition-all`}
                    style={{ width: `${student.avgScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Show current user if not in top 10 */}
        {showMyRank && myData && (
          <>
            <div className="text-center py-2">
              <span className="text-gray-400">...</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-400">
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-lg font-bold text-gray-600">{getRankEmoji(myRank)}</div>
                <div>
                  <div className="font-semibold text-blue-900">👤 You</div>
                  <div className="text-xs text-gray-600">
                    {myData.examsCompleted} exam{myData.examsCompleted !== 1 ? 's' : ''} completed
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-900">{myData.avgScore.toFixed(1)}%</div>
                </div>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(myData.avgScore)}`}
                    style={{ width: `${myData.avgScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Motivational Message */}
      {myRank > 1 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
          💪 <strong>Keep pushing!</strong> You're {myRank === 2 ? 'so close to the top!' : `${myRank - 1} rank${myRank - 1 > 1 ? 's' : ''} away from the top!`}
        </div>
      )}
      {myRank === 1 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          🏆 <strong>Congratulations!</strong> You're at the top! Keep up the excellent work!
        </div>
      )}
    </div>
  );
}
