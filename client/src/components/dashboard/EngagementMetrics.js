export default function EngagementMetrics({ metrics }) {
  const {
    totalStudents = 0,
    activeStudents = 0,
    averageScore = 0,
    submissionRate = 0,
    averageCompletionTime = 0,
    topPerformers = [],
    needsAttention = []
  } = metrics;

  const participationRate = totalStudents > 0 ? ((activeStudents / totalStudents) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Participation Rate</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">{participationRate}%</div>
          <div className="text-xs text-blue-600 mt-1">
            {activeStudents} of {totalStudents} students
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Average Score</div>
          <div className="text-2xl font-bold text-green-900 mt-1">{averageScore.toFixed(1)}%</div>
          <div className="text-xs text-green-600 mt-1">
            {averageScore >= 75 ? '🎉 Excellent!' : averageScore >= 60 ? '✓ Good' : '⚠️ Needs improvement'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">Submission Rate</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">{submissionRate.toFixed(1)}%</div>
          <div className="text-xs text-purple-600 mt-1">
            {submissionRate >= 80 ? 'High engagement' : 'Room to improve'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
          <div className="text-sm text-orange-600 font-medium">Avg. Completion</div>
          <div className="text-2xl font-bold text-orange-900 mt-1">{averageCompletionTime} min</div>
          <div className="text-xs text-orange-600 mt-1">Time per exam</div>
        </div>
      </div>

      {/* Top Performers & Needs Attention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Performers */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-3">🏆 Top Performers</h4>
          {topPerformers.length === 0 ? (
            <p className="text-sm text-green-700">No data yet</p>
          ) : (
            <div className="space-y-2">
              {topPerformers.slice(0, 3).map((student, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                    <span className="text-sm font-medium text-gray-900">{student.name}</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">{student.score}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Needs Attention */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-orange-900 mb-3">⚠️ Needs Attention</h4>
          {needsAttention.length === 0 ? (
            <p className="text-sm text-orange-700">All students performing well!</p>
          ) : (
            <div className="space-y-2">
              {needsAttention.slice(0, 3).map((student, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{student.name}</span>
                  </div>
                  <span className="text-xs text-orange-600">{student.reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Class Progress</span>
          <span className="text-sm font-bold text-gray-900">{submissionRate.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${submissionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
