import { useState } from 'react';

export default function GoalSetting({ goals, onSetGoal, onUpdateGoal }) {
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: 'score',
    target: '',
    deadline: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSetGoal) {
      onSetGoal(newGoal);
    }
    setNewGoal({ type: 'score', target: '', deadline: '', description: '' });
    setShowForm(false);
  };

  const calculateProgress = (goal) => {
    if (!goal.current || !goal.target) return 0;
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getGoalIcon = (type) => {
    switch (type) {
      case 'score': return '🎯';
      case 'exams': return '📝';
      case 'streak': return '🔥';
      case 'average': return '📊';
      default: return '⭐';
    }
  };

  const getGoalColor = (progress) => {
    if (progress >= 100) return 'green';
    if (progress >= 75) return 'blue';
    if (progress >= 50) return 'yellow';
    return 'orange';
  };

  const isDeadlineSoon = (deadline) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    return daysLeft <= 3 && daysLeft > 0;
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your Goals</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ New Goal'}
        </button>
      </div>

      {/* Goal Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
            <select
              value={newGoal.type}
              onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="score">Target Score</option>
              <option value="exams">Complete Exams</option>
              <option value="streak">Study Streak</option>
              <option value="average">Average Score</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
            <input
              type="number"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              placeholder="e.g., 90 (for 90%)"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (Optional)</label>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="What's your motivation?"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Set Goal
          </button>
        </form>
      )}

      {/* Active Goals */}
      {goals && goals.length > 0 ? (
        <div className="space-y-3">
          {goals.map((goal, index) => {
            const progress = calculateProgress(goal);
            const color = getGoalColor(progress);
            const deadlineSoon = isDeadlineSoon(goal.deadline);
            const deadlinePassed = isDeadlinePassed(goal.deadline);
            const isCompleted = progress >= 100;

            return (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 ${
                  isCompleted
                    ? 'bg-green-50 border-green-300'
                    : deadlinePassed
                    ? 'bg-red-50 border-red-300'
                    : deadlineSoon
                    ? 'bg-orange-50 border-orange-300'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start space-x-2">
                    <span className="text-2xl">{getGoalIcon(goal.type)}</span>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {goal.type === 'score' && `Score ${goal.target}% on next exam`}
                        {goal.type === 'exams' && `Complete ${goal.target} exams`}
                        {goal.type === 'streak' && `${goal.target} day study streak`}
                        {goal.type === 'average' && `${goal.target}% average score`}
                      </div>
                      {goal.description && (
                        <div className="text-sm text-gray-600 mt-1">{goal.description}</div>
                      )}
                    </div>
                  </div>
                  {isCompleted && (
                    <span className="text-2xl">✅</span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-bold text-gray-900">
                      {goal.current || 0} / {goal.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        color === 'green' ? 'bg-green-500' :
                        color === 'blue' ? 'bg-blue-500' :
                        color === 'yellow' ? 'bg-yellow-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{progress.toFixed(0)}% complete</div>
                </div>

                {/* Deadline */}
                {goal.deadline && (
                  <div className={`text-xs ${
                    deadlinePassed ? 'text-red-600' :
                    deadlineSoon ? 'text-orange-600' :
                    'text-gray-600'
                  }`}>
                    ⏰ {deadlinePassed ? 'Deadline passed' : `Due: ${new Date(goal.deadline).toLocaleDateString()}`}
                    {deadlineSoon && !deadlinePassed && ' (Soon!)'}
                  </div>
                )}

                {/* Motivational Message */}
                {!isCompleted && progress > 0 && (
                  <div className="text-xs text-blue-600 mt-2">
                    💪 Keep going! You're {(100 - progress).toFixed(0)}% away from your goal!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">🎯</p>
          <p>No goals set yet.</p>
          <p className="text-sm mt-1">Set a goal to stay motivated and track your progress!</p>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-800">
        💬 <em>"A goal without a plan is just a wish. Set your targets and crush them!"</em>
      </div>
    </div>
  );
}
