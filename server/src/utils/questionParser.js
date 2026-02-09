/**
 * Smart Question Parser
 * Automatically detects question type and parses from text
 */

/**
 * Parse bulk questions from text
 * Supports multiple formats:
 * 1. Simple copy-paste from Word/PDF
 * 2. CSV format
 * 3. JSON format
 * 4. Custom template format
 */
export const parseBulkQuestions = (text, format = 'auto') => {
  if (format === 'auto') {
    format = detectFormat(text);
  }

  switch (format) {
    case 'csv':
      return parseCSV(text);
    case 'json':
      return parseJSON(text);
    case 'template':
      return parseTemplate(text);
    default:
      return parseSmartText(text);
  }
};

/**
 * Detect format of input text
 */
const detectFormat = (text) => {
  const trimmed = text.trim();
  
  // Check JSON
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch (e) {
      // Not JSON
    }
  }

  // Check CSV (has commas and consistent columns)
  const lines = trimmed.split('\n');
  const firstLine = lines[0];
  if (firstLine.includes(',') && lines.length > 1) {
    const commaCount = (firstLine.match(/,/g) || []).length;
    if (lines.slice(1, 3).every(line => (line.match(/,/g) || []).length === commaCount)) {
      return 'csv';
    }
  }

  // Check template format (has Q1., Q2., etc.)
  if (/Q\d+[.:]|Question\s+\d+/i.test(trimmed)) {
    return 'template';
  }

  return 'smart';
};

/**
 * Parse CSV format
 * Format: Type, Question, Option1, Option2, Option3, Option4, Answer, Marks
 */
const parseCSV = (text) => {
  const lines = text.trim().split('\n');
  const questions = [];

  // Skip header if exists
  let startIndex = 0;
  if (lines[0].toLowerCase().includes('type') || lines[0].toLowerCase().includes('question')) {
    startIndex = 1;
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',').map(p => p.trim());
    
    if (parts.length < 2) continue;

    const type = detectQuestionType(parts[0]);
    const questionText = parts[1];

    let question = {
      type,
      question: questionText,
      marks: parts[parts.length - 1] && !isNaN(parts[parts.length - 1]) 
        ? parseInt(parts[parts.length - 1]) 
        : 1
    };

    if (type === 'mcq') {
      question.options = parts.slice(2, 6).filter(o => o);
      question.correctAnswer = parseInt(parts[6]) || 0;
    } else if (type === 'coding') {
      question.language = parts[2] || 'javascript';
      question.testCases = [];
    }

    questions.push(question);
  }

  return questions;
};

/**
 * Parse JSON format
 */
const parseJSON = (text) => {
  try {
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

/**
 * Parse template format
 * Example:
 * Q1. What is JavaScript?
 * a) Programming language
 * b) Markup language
 * c) Database
 * d) OS
 * Answer: a
 * 
 * Q2. Write a function to reverse a string
 * [CODING]
 * Language: JavaScript
 */
const parseTemplate = (text) => {
  const questions = [];
  const questionBlocks = text.split(/Q\d+[.:]|Question\s+\d+/i).filter(b => b.trim());

  questionBlocks.forEach(block => {
    const lines = block.trim().split('\n').filter(l => l.trim());
    if (lines.length === 0) return;

    const questionText = lines[0].trim();
    let type = 'theory';
    let question = {
      question: questionText,
      marks: 1
    };

    // Check for [CODING] or [MCQ] markers
    if (block.includes('[CODING]') || block.includes('[CODE]')) {
      type = 'coding';
      question.type = 'coding';
      
      // Extract language
      const langMatch = block.match(/Language:\s*(\w+)/i);
      question.language = langMatch ? langMatch[1].toLowerCase() : 'javascript';
      question.testCases = [];
      
      // Extract starter code if present
      const codeMatch = block.match(/```(\w+)?\n([\s\S]*?)```/);
      if (codeMatch) {
        question.starterCode = codeMatch[2].trim();
      }
    } 
    else if (block.includes('[MCQ]') || /^[a-d]\)/mi.test(block) || /^[A-D]\)/m.test(block)) {
      type = 'mcq';
      question.type = 'mcq';
      
      // Extract options
      const options = [];
      const optionRegex = /^([a-d])\)\s*(.+)$/gmi;
      let match;
      while ((match = optionRegex.exec(block)) !== null) {
        options.push(match[2].trim());
      }
      question.options = options;

      // Extract answer
      const answerMatch = block.match(/Answer:\s*([a-d])/i);
      if (answerMatch) {
        question.correctAnswer = answerMatch[1].toLowerCase().charCodeAt(0) - 97; // a=0, b=1, etc.
      }
    } else {
      question.type = 'theory';
    }

    // Extract marks
    const marksMatch = block.match(/Marks?:\s*(\d+)/i);
    if (marksMatch) {
      question.marks = parseInt(marksMatch[1]);
    }

    questions.push(question);
  });

  return questions;
};

/**
 * Smart text parser - tries to intelligently parse any format
 */
const parseSmartText = (text) => {
  const questions = [];
  const lines = text.split('\n');
  
  let currentQuestion = null;
  let currentOptions = [];
  let inCodeBlock = false;
  let codeContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Detect question start (number followed by dot or parenthesis)
    const questionMatch = line.match(/^(\d+)[.)\s]+(.+)$/);
    
    if (questionMatch) {
      // Save previous question
      if (currentQuestion) {
        if (currentOptions.length > 0) {
          currentQuestion.options = currentOptions;
          currentQuestion.type = 'mcq';
        }
        questions.push(currentQuestion);
      }

      // Start new question
      currentQuestion = {
        question: questionMatch[2].trim(),
        type: 'theory',
        marks: 1
      };
      currentOptions = [];
      inCodeBlock = false;
    }
    // Detect MCQ options (a), b), c), d) or A), B), C), D)
    else if (/^[a-dA-D][.)]\s*/.test(line)) {
      const option = line.replace(/^[a-dA-D][.)]\s*/, '').trim();
      currentOptions.push(option);
    }
    // Detect answer
    else if (/^Answer:\s*([a-dA-D0-9])/i.test(line)) {
      const answerMatch = line.match(/^Answer:\s*([a-dA-D0-9])/i);
      if (answerMatch && currentQuestion) {
        const answer = answerMatch[1].toLowerCase();
        if (answer >= 'a' && answer <= 'd') {
          currentQuestion.correctAnswer = answer.charCodeAt(0) - 97;
        } else {
          currentQuestion.correctAnswer = parseInt(answer);
        }
      }
    }
    // Detect code blocks
    else if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (!inCodeBlock && currentQuestion) {
        currentQuestion.type = 'coding';
        currentQuestion.starterCode = codeContent.trim();
        currentQuestion.language = 'javascript';
        currentQuestion.testCases = [];
        codeContent = '';
      }
    }
    else if (inCodeBlock) {
      codeContent += line + '\n';
    }
    // Detect coding question markers
    else if (/write|implement|create|code|program|function/i.test(line) && currentQuestion) {
      currentQuestion.type = 'coding';
      currentQuestion.language = 'javascript';
      currentQuestion.testCases = [];
    }
  }

  // Add last question
  if (currentQuestion) {
    if (currentOptions.length > 0) {
      currentQuestion.options = currentOptions;
      currentQuestion.type = 'mcq';
    }
    questions.push(currentQuestion);
  }

  return questions;
};

/**
 * Detect question type from keyword
 */
const detectQuestionType = (typeText) => {
  const lower = typeText.toLowerCase();
  if (lower.includes('mcq') || lower.includes('multiple') || lower.includes('choice')) {
    return 'mcq';
  }
  if (lower.includes('cod') || lower.includes('prog')) {
    return 'coding';
  }
  if (lower.includes('theory') || lower.includes('descriptive') || lower.includes('short')) {
    return 'theory';
  }
  return 'theory';
};

/**
 * Validate parsed questions
 */
export const validateQuestions = (questions) => {
  const errors = [];
  
  questions.forEach((q, index) => {
    if (!q.question || q.question.trim().length < 5) {
      errors.push(`Question ${index + 1}: Question text is too short`);
    }

    if (q.type === 'mcq') {
      if (!q.options || q.options.length < 2) {
        errors.push(`Question ${index + 1}: MCQ needs at least 2 options`);
      }
      if (q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
        errors.push(`Question ${index + 1}: Invalid correct answer index`);
      }
    }

    if (q.type === 'coding') {
      if (!q.language) {
        errors.push(`Question ${index + 1}: Programming language not specified`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate example templates
 */
export const getTemplateExamples = () => {
  return {
    mcq: `Q1. What is the capital of France?
a) London
b) Paris
c) Berlin
d) Madrid
Answer: b
Marks: 1

Q2. Which programming language is used for web development?
a) Python
b) Java
c) JavaScript
d) C++
Answer: c
Marks: 1`,

    coding: `Q1. Write a function to reverse a string
[CODING]
Language: JavaScript
Marks: 5

\`\`\`javascript
function reverseString(str) {
  // Your code here
}
\`\`\`

Q2. Implement a function to check if a number is prime
[CODING]
Language: Python
Marks: 5`,

    mixed: `Q1. What is Object-Oriented Programming?
[THEORY]
Marks: 3

Q2. Which of the following is a JavaScript framework?
a) Django
b) React
c) Laravel
d) Rails
Answer: b
Marks: 1

Q3. Write a function to find the factorial of a number
[CODING]
Language: JavaScript
Marks: 5`,

    csv: `Type,Question,Option1,Option2,Option3,Option4,Answer,Marks
MCQ,What is 2+2?,3,4,5,6,1,1
MCQ,Capital of India?,Mumbai,Delhi,Kolkata,Chennai,1,1
Coding,Reverse a string,JavaScript,,,,0,5
Theory,Explain OOP concepts,,,,,0,3`
  };
};
