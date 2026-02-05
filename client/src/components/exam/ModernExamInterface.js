import { useState, useEffect } from 'react';

export default function ModernExamInterface({ exam, onSubmit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(exam.durationMinutes * 60); // in seconds

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      console.log('Auto-saving...', answers);
      // TODO: Implement auto-save API call
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [answers]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (answerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answerValue,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleMarkForReview = () => {
    setMarkedForReview((prev) => {
      if (prev.includes(currentQuestion)) {
        return prev.filter((q) => q !== currentQuestion);
      }
      return [...prev, currentQuestion];
    });
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestion(index);
  };

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = () => {
    onSubmit(answers);
  };

  const handleTimeUp = () => {
    onSubmit(answers);
  };

  const getQuestionStatus = (index) => {
    if (index === currentQuestion) return 'current';
    if (markedForReview.includes(index)) return 'marked';
    if (answers[index] !== undefined && answers[index] !== null) return 'answered';
    if (index < currentQuestion) return 'not-answered';
    return 'not-visited';
  };

  const currentQ = exam.questions[currentQuestion];
  const answeredCount = Object.keys(answers).filter(
    (key) => answers[key] !== undefined && answers[key] !== null
  ).length;

  const stats = [
    { label: `${answeredCount} Answered`, color: 'bg-green-500' },
    { label: `${exam.questions.length - answeredCount - markedForReview.length} Not Answered`, color: 'bg-red-500' },
    { label: `${markedForReview.length} Marked for Review`, color: 'bg-purple-500' },
    { label: `${exam.questions.length - currentQuestion - 1} Not Visited`, color: 'bg-slate-200 dark:bg-slate-800' },
  ];

  return (
    <div className="h-screen flex flex-col lg:flex-row gap-0 bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Left Column: Question Area */}
      <div className="flex-grow flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8 flex-grow overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 text-primary font-bold text-xs mb-6">
            <span className="bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
              {exam.type || 'Exam'}
            </span>
            <span className="text-slate-300">•</span>
            <span>Question {currentQuestion + 1} of {exam.questions.length}</span>
          </div>

          <h3 className="text-slate-900 dark:text-white tracking-tight text-2xl font-black leading-tight mb-6">
            {currentQ.question}
          </h3>

          {currentQ.type === 'mcq' && (
            <div className="flex flex-col gap-4">
              {currentQ.options.map((option, idx) => {
                const optionKey = String.fromCharCode(97 + idx); // a, b, c, d
                const isChecked = answers[currentQuestion] === optionKey;
                
                return (
                  <label
                    key={idx}
                    className={`flex items-center gap-4 rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 group
                      ${isChecked
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-slate-100 dark:border-slate-800 hover:border-primary/50'
                      }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      checked={isChecked}
                      onChange={() => handleAnswerChange(optionKey)}
                      className="h-6 w-6 border-2 border-slate-300 dark:border-slate-600 bg-transparent text-primary focus:ring-primary focus:ring-offset-0"
                    />
                    <div className="flex grow flex-col">
                      <p className="text-slate-900 dark:text-white text-base font-semibold">
                        {option}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {currentQ.type === 'coding' && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {currentQ.description}
                </p>
              </div>
              <textarea
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Write your code here..."
                className="w-full h-64 p-4 font-mono text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white resize-none"
              />
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-6 flex flex-wrap items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-6 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">chevron_left</span>
              Previous
            </button>
            <button
              onClick={handleMarkForReview}
              className={`flex items-center gap-2 px-6 h-12 rounded-xl border font-bold hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all ${
                markedForReview.includes(currentQuestion)
                  ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800'
                  : 'bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
              }`}
            >
              <span className="material-symbols-outlined text-lg">bookmark</span>
              {markedForReview.includes(currentQuestion) ? 'Marked' : 'Mark for Review'}
            </button>
          </div>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-10 h-12 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/30"
          >
            Save & Next
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Right Column: Palette */}
      <aside className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0 p-6 bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Question Palette</h4>
            <div className="bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-1.5 font-bold text-sm">
              <span className="material-symbols-outlined text-base">timer</span>
              {formatTime(timeRemaining)}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {exam.questions.map((_, index) => {
              const status = getQuestionStatus(index);
              return (
                <button
                  key={index}
                  onClick={() => handleQuestionSelect(index)}
                  className={`size-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all shadow-sm
                    ${status === 'answered' ? 'bg-green-500 text-white' : ''}
                    ${status === 'not-answered' ? 'bg-red-500 text-white' : ''}
                    ${status === 'marked' ? 'bg-purple-500 text-white' : ''}
                    ${status === 'current' ? 'border-2 border-primary text-primary bg-white dark:bg-slate-800 shadow-md ring-2 ring-primary/20 scale-110' : ''}
                    ${status === 'not-visited' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : ''}
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <span className={`size-3 rounded ${s.color}`}></span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-6">
          <h4 className="text-xs font-black text-primary mb-3 uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">info</span>
            Quick Instructions
          </h4>
          <p className="text-xs text-primary/80 leading-relaxed font-semibold">
            Ensure all answers are carefully reviewed. You can change your answer anytime before the final submission.
          </p>
        </div>

        <button
          onClick={handleSubmitClick}
          className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-lg shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-2"
        >
          Finish & Submit
        </button>
      </aside>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Submit Exam?</h3>
            <div className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-400">
              <p>• Answered: <strong className="text-green-600">{answeredCount}</strong></p>
              <p>• Not Answered: <strong className="text-red-600">{exam.questions.length - answeredCount}</strong></p>
              <p>• Marked for Review: <strong className="text-purple-600">{markedForReview.length}</strong></p>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to submit? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/30"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
