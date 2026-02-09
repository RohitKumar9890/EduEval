import { useState } from 'react';
import Card from '../Card';

export default function ExamSettings({ settings, onUpdate }) {
  const [examSettings, setExamSettings] = useState({
    // Randomization
    randomizeQuestions: settings?.randomizeQuestions || false,
    randomizeOptions: settings?.randomizeOptions || false,
    questionPoolSize: settings?.questionPoolSize || null,
    
    // Scoring
    enableNegativeMarking: settings?.enableNegativeMarking || false,
    negativeMarkingValue: settings?.negativeMarkingValue || 0.25,
    enablePartialCredit: settings?.enablePartialCredit || false,
    
    // Timing
    enableTimePenalty: settings?.enableTimePenalty || false,
    penaltyPerMinute: settings?.penaltyPerMinute || 0.5,
    gracePeriodMinutes: settings?.gracePeriodMinutes || 5,
    
    // Security
    preventBackNavigation: settings?.preventBackNavigation || false,
    shuffleQuestionsPerStudent: settings?.shuffleQuestionsPerStudent || false,
    ...settings
  });

  const handleChange = (field, value) => {
    const updated = { ...examSettings, [field]: value };
    setExamSettings(updated);
    if (onUpdate) {
      onUpdate(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Randomization */}
      <Card title="🔀 Question Randomization">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Randomize Question Order</div>
              <div className="text-sm text-gray-600">Each student gets questions in different order</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={examSettings.randomizeQuestions}
                onChange={(e) => handleChange('randomizeQuestions', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Randomize Answer Options</div>
              <div className="text-sm text-gray-600">Shuffle MCQ options for each student</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={examSettings.randomizeOptions}
                onChange={(e) => handleChange('randomizeOptions', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Pool Size (Optional)
            </label>
            <input
              type="number"
              value={examSettings.questionPoolSize || ''}
              onChange={(e) => handleChange('questionPoolSize', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Leave empty to use all questions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Select N random questions from total pool (e.g., 20 from 30 questions)
            </p>
          </div>
        </div>
      </Card>

      {/* Negative Marking */}
      <Card title="➖ Negative Marking">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Enable Negative Marking</div>
              <div className="text-sm text-gray-600">Deduct marks for wrong answers</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={examSettings.enableNegativeMarking}
                onChange={(e) => handleChange('enableNegativeMarking', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {examSettings.enableNegativeMarking && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marks to Deduct per Wrong Answer
              </label>
              <input
                type="number"
                step="0.25"
                value={examSettings.negativeMarkingValue}
                onChange={(e) => handleChange('negativeMarkingValue', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Common values: 0.25, 0.33, 0.5, 1.0
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Partial Credit */}
      <Card title="✅ Partial Credit">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-900">Enable Partial Credit</div>
            <div className="text-sm text-gray-600">Award marks based on test cases passed (coding questions)</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={examSettings.enablePartialCredit}
              onChange={(e) => handleChange('enablePartialCredit', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </Card>

      {/* Time Penalty */}
      <Card title="⏰ Late Submission Penalty">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Enable Late Penalty</div>
              <div className="text-sm text-gray-600">Deduct marks for late submissions</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={examSettings.enableTimePenalty}
                onChange={(e) => handleChange('enableTimePenalty', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {examSettings.enableTimePenalty && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penalty per Minute Late
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={examSettings.penaltyPerMinute}
                  onChange={(e) => handleChange('penaltyPerMinute', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grace Period (minutes)
                </label>
                <input
                  type="number"
                  value={examSettings.gracePeriodMinutes}
                  onChange={(e) => handleChange('gracePeriodMinutes', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  No penalty within this period after deadline
                </p>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Security Settings */}
      <Card title="🔒 Security Settings">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Prevent Back Navigation</div>
              <div className="text-sm text-gray-600">Students cannot go back to previous questions</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={examSettings.preventBackNavigation}
                onChange={(e) => handleChange('preventBackNavigation', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Settings Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Settings Summary</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          {examSettings.randomizeQuestions && <li>✓ Questions will be randomized</li>}
          {examSettings.randomizeOptions && <li>✓ Answer options will be shuffled</li>}
          {examSettings.questionPoolSize && <li>✓ {examSettings.questionPoolSize} questions from pool</li>}
          {examSettings.enableNegativeMarking && <li>✓ Negative marking: -{examSettings.negativeMarkingValue} per wrong answer</li>}
          {examSettings.enablePartialCredit && <li>✓ Partial credit enabled for coding questions</li>}
          {examSettings.enableTimePenalty && <li>✓ Late penalty: {examSettings.penaltyPerMinute}/min after {examSettings.gracePeriodMinutes} min grace</li>}
          {!examSettings.randomizeQuestions && !examSettings.enableNegativeMarking && !examSettings.enablePartialCredit && (
            <li className="text-gray-600">No advanced settings enabled</li>
          )}
        </ul>
      </div>
    </div>
  );
}
