import { asyncHandler } from '../../utils/asyncHandler.js';
import { parseBulkQuestions, validateQuestions, getTemplateExamples } from '../../utils/questionParser.js';
import { generateQuestionsFromSyllabus } from '../../utils/aiQuestionGenerator.js';

/**
 * Parse bulk questions from text
 */
export const parseQuestions = asyncHandler(async (req, res) => {
  const { text, format = 'auto' } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    // Parse questions
    const questions = parseBulkQuestions(text, format);

    // Validate
    const validation = validateQuestions(questions);

    res.json({
      questions,
      count: questions.length,
      validation,
      message: validation.isValid 
        ? `Successfully parsed ${questions.length} questions`
        : `Parsed ${questions.length} questions with ${validation.errors.length} warnings`
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Failed to parse questions', 
      error: error.message 
    });
  }
});

/**
 * Generate questions from syllabus using AI
 */
export const generateQuestions = asyncHandler(async (req, res) => {
  const { 
    syllabus, 
    type = 'mixed', 
    count = 10, 
    difficulty = 'medium',
    language = 'javascript',
    includeExplanations = false
  } = req.body;

  if (!syllabus || syllabus.trim().length === 0) {
    return res.status(400).json({ message: 'Syllabus text is required' });
  }

  try {
    const questions = await generateQuestionsFromSyllabus(syllabus, {
      type,
      count,
      difficulty,
      language,
      includeExplanations
    });

    // Validate generated questions
    const validation = validateQuestions(questions);

    res.json({
      questions,
      count: questions.length,
      validation,
      generatedBy: process.env.OPENAI_API_KEY ? 'AI' : 'Template',
      message: `Generated ${questions.length} ${difficulty} ${type} questions`
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to generate questions', 
      error: error.message 
    });
  }
});

/**
 * Get template examples
 */
export const getTemplates = asyncHandler(async (req, res) => {
  const templates = getTemplateExamples();
  
  res.json({
    templates,
    formats: ['mcq', 'coding', 'mixed', 'csv'],
    message: 'Use these templates to format your questions'
  });
});

/**
 * Validate questions
 */
export const validateQuestionsEndpoint = asyncHandler(async (req, res) => {
  const { questions } = req.body;

  if (!Array.isArray(questions)) {
    return res.status(400).json({ message: 'Questions must be an array' });
  }

  const validation = validateQuestions(questions);

  res.json({
    validation,
    count: questions.length,
    validCount: questions.length - validation.errors.length
  });
});
