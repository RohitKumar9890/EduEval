import OpenAI from 'openai';

// Initialize OpenAI (optional - works without API key for manual mode)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * Generate questions from syllabus using AI
 */
export const generateQuestionsFromSyllabus = async (syllabusText, options = {}) => {
  const {
    type = 'mixed', // 'mcq', 'coding', 'theory', 'mixed'
    count = 10,
    difficulty = 'medium', // 'easy', 'medium', 'hard'
    language = 'javascript', // for coding questions
    includeExplanations = false,
  } = options;

  if (!openai) {
    // Return template-based generation if no API key
    return generateTemplateQuestions(syllabusText, options);
  }

  const prompt = buildPrompt(syllabusText, type, count, difficulty, language, includeExplanations);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator creating high-quality exam questions. Generate questions in valid JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      return questions;
    }

    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('AI generation error:', error);
    // Fallback to template generation
    return generateTemplateQuestions(syllabusText, options);
  }
};

/**
 * Build prompt for AI
 */
const buildPrompt = (syllabus, type, count, difficulty, language, includeExplanations) => {
  let prompt = `Generate ${count} ${difficulty} difficulty ${type} questions based on this syllabus:\n\n${syllabus}\n\n`;

  prompt += 'Return ONLY a JSON array with this exact structure:\n\n';

  if (type === 'mcq' || type === 'mixed') {
    prompt += `For MCQ questions:
{
  "type": "mcq",
  "question": "Question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "marks": 1${includeExplanations ? ',\n  "explanation": "Why this answer is correct"' : ''}
}\n\n`;
  }

  if (type === 'coding' || type === 'mixed') {
    prompt += `For coding questions:
{
  "type": "coding",
  "question": "Problem description",
  "language": "${language}",
  "starterCode": "function template() { }",
  "testCases": [
    {"input": "test input", "expectedOutput": "expected result"}
  ],
  "marks": 5${includeExplanations ? ',\n  "explanation": "Solution approach"' : ''}
}\n\n`;
  }

  if (type === 'theory' || type === 'mixed') {
    prompt += `For theory questions:
{
  "type": "theory",
  "question": "Theoretical question text",
  "marks": 3${includeExplanations ? ',\n  "explanation": "Key points to cover"' : ''}
}\n\n`;
  }

  prompt += 'Ensure questions are:\n';
  prompt += '- Clear and unambiguous\n';
  prompt += '- Appropriate for the difficulty level\n';
  prompt += '- Covering different topics from the syllabus\n';
  prompt += '- Properly formatted as valid JSON\n';

  return prompt;
};

/**
 * Template-based question generation (fallback without AI)
 */
const generateTemplateQuestions = (syllabusText, options) => {
  const { type = 'mixed', count = 10, difficulty = 'medium' } = options;
  
  // Extract topics from syllabus
  const topics = extractTopics(syllabusText);
  const questions = [];

  const questionTemplates = {
    mcq: [
      (topic) => ({
        type: 'mcq',
        question: `What is ${topic}?`,
        options: [`Definition A`, `Definition B`, `Definition C`, `Definition D`],
        correctAnswer: 0,
        marks: 1,
        note: 'Please update options and correct answer'
      }),
      (topic) => ({
        type: 'mcq',
        question: `Which of the following is true about ${topic}?`,
        options: [`Statement 1`, `Statement 2`, `Statement 3`, `Statement 4`],
        correctAnswer: 0,
        marks: 1,
        note: 'Please update options and correct answer'
      }),
    ],
    coding: [
      (topic) => ({
        type: 'coding',
        question: `Write a function to implement ${topic}`,
        language: options.language || 'javascript',
        starterCode: `// Implement ${topic}\nfunction solve() {\n  // Your code here\n}`,
        testCases: [],
        marks: 5,
        note: 'Please add test cases'
      }),
    ],
    theory: [
      (topic) => ({
        type: 'theory',
        question: `Explain ${topic} in detail.`,
        marks: 3,
        note: 'Students will write descriptive answer'
      }),
      (topic) => ({
        type: 'theory',
        question: `Discuss the importance of ${topic}.`,
        marks: 3,
        note: 'Students will write descriptive answer'
      }),
    ],
  };

  for (let i = 0; i < count; i++) {
    const topic = topics[i % topics.length];
    
    if (type === 'mixed') {
      const questionType = i % 3 === 0 ? 'mcq' : i % 3 === 1 ? 'coding' : 'theory';
      const templates = questionTemplates[questionType];
      const template = templates[Math.floor(Math.random() * templates.length)];
      questions.push(template(topic));
    } else {
      const templates = questionTemplates[type];
      const template = templates[Math.floor(Math.random() * templates.length)];
      questions.push(template(topic));
    }
  }

  return questions;
};

/**
 * Extract topics from syllabus text
 */
const extractTopics = (syllabusText) => {
  // Simple topic extraction - looks for bullet points, numbers, or capitalized phrases
  const lines = syllabusText.split('\n');
  const topics = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) continue;

    // Extract from bullet points or numbered lists
    const bulletMatch = trimmed.match(/^[•\-\*\d]+[.)]\s*(.+)$/);
    if (bulletMatch) {
      topics.push(bulletMatch[1].trim());
      continue;
    }

    // Extract capitalized phrases (likely headings)
    if (trimmed.length > 5 && trimmed.length < 100) {
      topics.push(trimmed);
    }
  }

  // If no topics found, split by common delimiters
  if (topics.length === 0) {
    const parts = syllabusText.split(/[,;:]/).map(p => p.trim()).filter(p => p.length > 5 && p.length < 100);
    topics.push(...parts);
  }

  // Default topics if still empty
  if (topics.length === 0) {
    topics.push('the main concepts', 'key principles', 'core topics', 'fundamental ideas');
  }

  return topics.slice(0, 20); // Max 20 topics
};

/**
 * Generate questions from example text (smart detection)
 */
export const generateFromExample = (exampleText) => {
  // This function analyzes an example question and generates similar ones
  const topics = extractTopics(exampleText);
  
  // Detect the type from example
  let type = 'theory';
  if (/[a-d]\)/i.test(exampleText)) {
    type = 'mcq';
  } else if (/function|code|implement|write/i.test(exampleText)) {
    type = 'coding';
  }

  return generateTemplateQuestions(topics.join('\n'), { type, count: 5 });
};
