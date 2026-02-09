// Exam randomization utilities

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Randomize questions for a student
 * @param {Array} questions - Original questions array
 * @param {Object} options - Randomization options
 * @returns {Array} - Randomized questions
 */
export const randomizeQuestions = (questions, options = {}) => {
  const {
    randomizeOrder = false,
    randomizeOptions = false,
    questionPoolSize = null,
  } = options;

  let processedQuestions = [...questions];

  // If question pool size is specified, select random subset
  if (questionPoolSize && questionPoolSize < questions.length) {
    processedQuestions = shuffleArray(questions).slice(0, questionPoolSize);
  }

  // Randomize question order
  if (randomizeOrder) {
    processedQuestions = shuffleArray(processedQuestions);
  }

  // Randomize answer options for MCQ questions
  if (randomizeOptions) {
    processedQuestions = processedQuestions.map(question => {
      if (question.type === 'mcq' && question.options) {
        const correctAnswer = question.correctAnswer;
        const correctOptionText = question.options[correctAnswer];
        
        // Shuffle options
        const shuffledOptions = shuffleArray(question.options);
        
        // Find new index of correct answer
        const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);
        
        return {
          ...question,
          options: shuffledOptions,
          correctAnswer: newCorrectIndex,
          originalCorrectAnswer: correctAnswer, // Keep for reference
        };
      }
      return question;
    });
  }

  // Add randomization metadata
  return processedQuestions.map((q, index) => ({
    ...q,
    randomizedOrder: index,
    originalIndex: questions.findIndex(orig => orig.id === q.id),
  }));
};

/**
 * Calculate score with negative marking
 * @param {Array} answers - Student's answers
 * @param {Array} questions - Questions with correct answers
 * @param {Object} scoringRules - Scoring configuration
 * @returns {Object} - Score breakdown
 */
export const calculateScoreWithNegativeMarking = (answers, questions, scoringRules = {}) => {
  const {
    correctMarks = 1,
    incorrectMarks = 0,
    unansweredMarks = 0,
    partialCredit = false,
  } = scoringRules;

  let totalScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let partialCount = 0;

  const scoreBreakdown = [];

  questions.forEach((question, index) => {
    const answer = answers[index];
    const questionMarks = question.marks || correctMarks;
    const negativeMarks = question.negativeMarks !== undefined 
      ? question.negativeMarks 
      : incorrectMarks;

    let questionScore = 0;
    let status = 'unanswered';

    if (!answer || answer === null || answer === '') {
      // Unanswered
      questionScore = unansweredMarks;
      unansweredCount++;
      status = 'unanswered';
    } else if (question.type === 'mcq') {
      // MCQ question
      if (answer === question.correctAnswer || answer === question.originalCorrectAnswer) {
        questionScore = questionMarks;
        correctCount++;
        status = 'correct';
      } else {
        questionScore = -Math.abs(negativeMarks);
        incorrectCount++;
        status = 'incorrect';
      }
    } else if (question.type === 'coding') {
      // Coding question - check test case results
      if (partialCredit && answer.testCaseResults) {
        const passedTests = answer.testCaseResults.filter(t => t.passed).length;
        const totalTests = answer.testCaseResults.length;
        questionScore = (passedTests / totalTests) * questionMarks;
        
        if (passedTests === totalTests) {
          correctCount++;
          status = 'correct';
        } else if (passedTests > 0) {
          partialCount++;
          status = 'partial';
        } else {
          incorrectCount++;
          status = 'incorrect';
        }
      } else {
        // All or nothing for coding questions
        const allPassed = answer.testCaseResults?.every(t => t.passed);
        if (allPassed) {
          questionScore = questionMarks;
          correctCount++;
          status = 'correct';
        } else {
          questionScore = -Math.abs(negativeMarks);
          incorrectCount++;
          status = 'incorrect';
        }
      }
    } else {
      // Theory or other types - manual grading needed
      questionScore = 0;
      status = 'pending';
    }

    totalScore += questionScore;
    
    scoreBreakdown.push({
      questionId: question.id,
      questionNumber: index + 1,
      marks: questionMarks,
      scored: questionScore,
      status,
    });
  });

  return {
    totalScore: Math.max(0, totalScore), // Don't allow negative total scores
    maxScore: questions.reduce((sum, q) => sum + (q.marks || correctMarks), 0),
    correctCount,
    incorrectCount,
    unansweredCount,
    partialCount,
    scoreBreakdown,
    percentage: (Math.max(0, totalScore) / questions.reduce((sum, q) => sum + (q.marks || correctMarks), 0)) * 100,
  };
};

/**
 * Apply time penalties for late submission
 * @param {Object} scoreData - Score calculation result
 * @param {Date} submittedAt - When student submitted
 * @param {Date} deadline - Exam deadline
 * @param {Object} penaltyRules - Penalty configuration
 * @returns {Object} - Adjusted score
 */
export const applyTimePenalty = (scoreData, submittedAt, deadline, penaltyRules = {}) => {
  const {
    enableLatePenalty = false,
    penaltyPerMinute = 0,
    gracePeriodMinutes = 0,
  } = penaltyRules;

  if (!enableLatePenalty || !deadline || !submittedAt) {
    return scoreData;
  }

  const submissionTime = new Date(submittedAt);
  const deadlineTime = new Date(deadline);
  
  // Calculate delay in minutes
  const delayMs = submissionTime - deadlineTime;
  const delayMinutes = Math.max(0, Math.floor(delayMs / (1000 * 60)));

  if (delayMinutes > gracePeriodMinutes) {
    const effectiveDelay = delayMinutes - gracePeriodMinutes;
    const penalty = effectiveDelay * penaltyPerMinute;
    
    return {
      ...scoreData,
      totalScore: Math.max(0, scoreData.totalScore - penalty),
      penalty,
      delayMinutes,
      originalScore: scoreData.totalScore,
    };
  }

  return scoreData;
};

/**
 * Generate student-specific exam variant
 * @param {Object} exam - Original exam object
 * @param {String} studentId - Student's ID
 * @returns {Object} - Customized exam for student
 */
export const generateExamVariant = (exam, studentId) => {
  const {
    questions,
    randomizationSettings = {},
  } = exam;

  // Use student ID as seed for consistent randomization
  // This ensures same student gets same variant on reload
  const seed = parseInt(studentId.slice(-8), 16);
  Math.seedrandom = require('seedrandom');
  const rng = Math.seedrandom(seed.toString());

  // Randomize questions
  const randomizedQuestions = randomizeQuestions(questions, {
    ...randomizationSettings,
    random: rng,
  });

  return {
    ...exam,
    questions: randomizedQuestions,
    isRandomized: true,
    randomizationSeed: seed,
    generatedFor: studentId,
    generatedAt: new Date(),
  };
};
