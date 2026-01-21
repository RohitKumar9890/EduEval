import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import api, { setAccessToken } from '../../../lib/api';
import { toast } from 'react-toastify';

export default function SubmissionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    score: '',
    feedback: ''
  });

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setAccessToken(token);
    
    if (id) {
      fetchSubmission();
    }
  }, [id, router]);

  const fetchSubmission = async () => {
    try {
      const res = await api.get(`/faculty/submissions/${id}`);
      setSubmission(res.data.submission);
      setGradeForm({
        score: res.data.submission.score || 0,
        feedback: res.data.submission.feedback || ''
      });
    } catch (e) {
      toast.error('Failed to load submission');
      router.push('/faculty/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (e) => {
    e.preventDefault();
    setGrading(true);
    
    try {
      await api.post(`/faculty/submissions/${id}/grade`, gradeForm);
      toast.success('Submission graded successfully!');
      fetchSubmission();
    } catch (e) {
      toast.error('Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Loading...</div>
      </Layout>
    );
  }

  if (!submission) {
    return (
      <Layout>
        <Card title="Error">
          <p className="text-red-600">Submission not found</p>
        </Card>
      </Layout>
    );
  }

  const percentage = submission.maxScore > 0 
    ? ((submission.score / submission.maxScore) * 100).toFixed(1) 
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{submission.examTitle}</h1>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p><strong>Student:</strong> {submission.studentName} ({submission.studentEmail})</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                    submission.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {submission.status}
                  </span>
                </p>
                {submission.submittedAt && (
                  <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
            <div>
              <Button variant="secondary" onClick={() => router.back()}>
                ← Back
              </Button>
            </div>
          </div>
        </Card>

        {/* Score Card */}
        <Card title="Score">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-600">{submission.score}</p>
              <p className="text-sm text-gray-600">Score</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-purple-600">{submission.maxScore}</p>
              <p className="text-sm text-gray-600">Max Score</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-600">{percentage}%</p>
              <p className="text-sm text-gray-600">Percentage</p>
            </div>
          </div>

          <form onSubmit={handleGrade} className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Manual Grading</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Override Score"
                type="number"
                min="0"
                max={submission.maxScore}
                value={gradeForm.score}
                onChange={(e) => setGradeForm({ ...gradeForm, score: parseFloat(e.target.value) })}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
                value={gradeForm.feedback}
                onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                placeholder="Provide feedback to the student..."
              />
            </div>
            <Button type="submit" disabled={grading} className="mt-4">
              {grading ? 'Saving...' : 'Save Grade & Feedback'}
            </Button>
          </form>
        </Card>

        {/* MCQ Answers */}
        {submission.mcqQuestions && submission.mcqQuestions.length > 0 && (
          <Card title="MCQ Answers">
            <div className="space-y-4">
              {submission.mcqQuestions.map((q, qIdx) => {
                const studentAnswer = submission.answers.find(a => a.questionIndex === qIdx);
                const isCorrect = studentAnswer?.selectedOptionIndex === q.correctOptionIndex;
                
                return (
                  <div key={qIdx} className={`p-4 border-2 rounded-lg ${
                    isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-gray-900">Q{qIdx + 1}. {q.prompt}</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? `✓ Correct (+${q.marks})` : '✗ Incorrect (0)'}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {q.options?.map((opt, i) => {
                        const isStudentAnswer = studentAnswer?.selectedOptionIndex === i;
                        const isCorrectAnswer = i === q.correctOptionIndex;
                        
                        return (
                          <div 
                            key={i} 
                            className={`p-2 rounded ${
                              isCorrectAnswer ? 'bg-green-200 border-2 border-green-600' :
                              isStudentAnswer ? 'bg-red-200 border-2 border-red-600' :
                              'bg-white'
                            }`}
                          >
                            <span className="text-sm">
                              {String.fromCharCode(65 + i)}. {opt}
                              {isCorrectAnswer && <span className="ml-2 text-xs text-green-700 font-semibold">✓ Correct Answer</span>}
                              {isStudentAnswer && !isCorrectAnswer && <span className="ml-2 text-xs text-red-700 font-semibold">Student's Answer</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Coding Answers */}
        {submission.codingQuestions && submission.codingQuestions.length > 0 && (
          <Card title="Coding Answers">
            <div className="space-y-6">
              {submission.codingQuestions.map((q, qIdx) => {
                const studentAnswer = submission.answers.find(
                  a => a.questionIndex === qIdx + (submission.mcqQuestions?.length || 0)
                );
                
                return (
                  <div key={qIdx} className="border-2 rounded-lg p-4">
                    <div className="mb-3">
                      <p className="font-semibold text-gray-900">Q{qIdx + 1}. {q.prompt}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Language: {q.language} | Marks: {q.marks}
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Student's Code:</p>
                      <pre className="p-3 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto">
                        <code>{studentAnswer?.code || '// No code submitted'}</code>
                      </pre>
                    </div>

                    {q.testCases && q.testCases.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Test Cases:</p>
                        <div className="space-y-2">
                          {q.testCases.map((tc, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded text-xs">
                              <p><strong>Input:</strong> {tc.input}</p>
                              <p><strong>Expected:</strong> {tc.expectedOutput}</p>
                              <p className="text-gray-500">(Manual testing required)</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
