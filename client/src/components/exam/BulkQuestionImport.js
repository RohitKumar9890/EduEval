import { useState } from 'react';
import Button from '../Button';
import Modal from '../Modal';

export default function BulkQuestionImport({ onImport, onClose }) {
  const [mode, setMode] = useState('paste'); // 'paste', 'ai', 'template'
  const [inputText, setInputText] = useState('');
  const [syllabusText, setSyllabusText] = useState('');
  const [aiOptions, setAiOptions] = useState({
    type: 'mixed',
    count: 10,
    difficulty: 'medium',
    language: 'javascript',
  });
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const templates = {
    mcq: `Q1. What is the capital of France?
a) London
b) Paris
c) Berlin
d) Madrid
Answer: b

Q2. Which programming language is used for web development?
a) Python
b) Java
c) JavaScript
d) C++
Answer: c`,

    coding: `Q1. Write a function to reverse a string
Language: JavaScript
Marks: 5

Q2. Implement a function to check if a number is prime
Language: Python
Marks: 5`,

    mixed: `Q1. What is Object-Oriented Programming?
Marks: 3

Q2. Which of the following is a JavaScript framework?
a) Django
b) React
c) Laravel
d) Rails
Answer: b

Q3. Write a function to find factorial of a number
Language: JavaScript
Marks: 5`,

    csv: `Type,Question,Option1,Option2,Option3,Option4,Answer,Marks
MCQ,What is 2+2?,3,4,5,6,1,1
MCQ,Capital of India?,Mumbai,Delhi,Kolkata,Chennai,1,1
Coding,Reverse a string,JavaScript,,,,0,5`
  };

  const handleParse = async () => {
    setLoading(true);
    setError('');

    try {
      // In real implementation, call API
      const response = await fetch('/api/faculty/questions/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, format: 'auto' })
      });

      if (!response.ok) throw new Error('Failed to parse questions');

      const data = await response.json();
      setParsedQuestions(data.questions);
    } catch (err) {
      setError(err.message || 'Failed to parse questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/faculty/questions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabus: syllabusText,
          ...aiOptions
        })
      });

      if (!response.ok) throw new Error('Failed to generate questions');

      const data = await response.json();
      setParsedQuestions(data.questions);
    } catch (err) {
      setError(err.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (parsedQuestions.length > 0) {
      onImport(parsedQuestions);
      onClose();
    }
  };

  const loadTemplate = (templateType) => {
    setInputText(templates[templateType]);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="📋 Bulk Question Import" size="large">
      <div className="space-y-4">
        {/* Mode Selection */}
        <div className="flex space-x-2 border-b pb-4">
          <Button
            variant={mode === 'paste' ? 'primary' : 'secondary'}
            onClick={() => setMode('paste')}
            className="flex-1"
          >
            📝 Copy-Paste
          </Button>
          <Button
            variant={mode === 'ai' ? 'primary' : 'secondary'}
            onClick={() => setMode('ai')}
            className="flex-1"
          >
            🤖 AI Generate
          </Button>
          <Button
            variant={mode === 'template' ? 'primary' : 'secondary'}
            onClick={() => setMode('template')}
            className="flex-1"
          >
            📄 Templates
          </Button>
        </div>

        {/* Copy-Paste Mode */}
        {mode === 'paste' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Your Questions Here
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste questions in any format... The system will auto-detect the format!"
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
              <strong>💡 Supported Formats:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Simple numbered questions (1., 2., 3.)</li>
                <li>MCQ with options (a), b), c), d) and Answer: b</li>
                <li>CSV format (Type, Question, Options...)</li>
                <li>Coding questions with Language: JavaScript</li>
                <li>Any mix of the above!</li>
              </ul>
            </div>

            <Button onClick={handleParse} disabled={!inputText || loading} className="w-full">
              {loading ? 'Parsing...' : '🔍 Parse Questions'}
            </Button>
          </div>
        )}

        {/* AI Generate Mode */}
        {mode === 'ai' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste Your Syllabus / Topics
              </label>
              <textarea
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                placeholder={`Example syllabus:
- JavaScript Fundamentals
- Functions and Scope
- Object-Oriented Programming
- Asynchronous Programming
- Error Handling

The AI will generate questions automatically!`}
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                <select
                  value={aiOptions.type}
                  onChange={(e) => setAiOptions({ ...aiOptions, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="mixed">Mixed (MCQ + Coding + Theory)</option>
                  <option value="mcq">MCQ Only</option>
                  <option value="coding">Coding Only</option>
                  <option value="theory">Theory Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={aiOptions.difficulty}
                  onChange={(e) => setAiOptions({ ...aiOptions, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
                <input
                  type="number"
                  value={aiOptions.count}
                  onChange={(e) => setAiOptions({ ...aiOptions, count: parseInt(e.target.value) })}
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coding Language</label>
                <select
                  value={aiOptions.language}
                  onChange={(e) => setAiOptions({ ...aiOptions, language: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded p-3">
              <strong>🤖 AI Magic:</strong>
              <p className="text-sm mt-1">
                Just paste your syllabus topics, and AI will generate {aiOptions.count} {aiOptions.difficulty} questions automatically!
              </p>
            </div>

            <Button onClick={handleAIGenerate} disabled={!syllabusText || loading} className="w-full">
              {loading ? 'Generating...' : '✨ Generate Questions with AI'}
            </Button>
          </div>
        )}

        {/* Template Mode */}
        {mode === 'template' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <strong>📄 Use Templates:</strong>
              <p className="text-sm mt-1">Click a template below to load example format, then modify it with your questions!</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => loadTemplate('mcq')} className="py-3">
                📝 MCQ Template
              </Button>
              <Button variant="secondary" onClick={() => loadTemplate('coding')} className="py-3">
                💻 Coding Template
              </Button>
              <Button variant="secondary" onClick={() => loadTemplate('mixed')} className="py-3">
                🔀 Mixed Template
              </Button>
              <Button variant="secondary" onClick={() => loadTemplate('csv')} className="py-3">
                📊 CSV Template
              </Button>
            </div>

            {inputText && (
              <>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
                <Button onClick={handleParse} disabled={loading} className="w-full">
                  {loading ? 'Parsing...' : '🔍 Parse Questions'}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 text-red-800">
            ❌ {error}
          </div>
        )}

        {/* Parsed Questions Preview */}
        {parsedQuestions.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                ✅ Parsed {parsedQuestions.length} Questions
              </h4>
              <Button onClick={handleImport} variant="primary">
                Import All →
              </Button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {parsedQuestions.map((q, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded p-3 text-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="font-semibold text-gray-700">Q{index + 1}.</span>{' '}
                      <span className="text-gray-900">{q.question}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      q.type === 'mcq' ? 'bg-blue-100 text-blue-800' :
                      q.type === 'coding' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {q.type.toUpperCase()}
                    </span>
                  </div>
                  {q.note && (
                    <div className="text-xs text-orange-600 mt-1">⚠️ {q.note}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex space-x-2 pt-4 border-t">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          {parsedQuestions.length > 0 && (
            <Button onClick={handleImport} className="flex-1">
              Import {parsedQuestions.length} Questions
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
