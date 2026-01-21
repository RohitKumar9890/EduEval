import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import Modal from '../../../components/Modal';
import api, { setAccessToken } from '../../../lib/api';
import { toast } from 'react-toastify';

export default function ExamDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details'); // details, mcq, coding, submissions
  const [showMCQModal, setShowMCQModal] = useState(false);
  const [showCodingModal, setShowCodingModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const [mcqForm, setMcqForm] = useState({
    prompt: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    marks: 1,
    difficulty: 'medium'
  });

  const [codingForm, setCodingForm] = useState({
    prompt: '',
    starterCode: '',
    language: 'javascript',
    marks: 10,
    difficulty: 'medium',
    testCases: []
  });

  const [testCaseForm, setTestCaseForm] = useState({
    input: '',
    expectedOutput: '',
    isHidden: false
  });

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setAccessToken(token);
    
    if (id) {
      fetchExam();
      fetchSubmissions();
    }
  }, [id, router]);

  const fetchExam = async () => {
    try {
      const res = await api.get(`/faculty/exams/${id}`);
      setExam(res.data.exam);
    } catch (e) {
      toast.error('Failed to load exam');
      router.push('/faculty/exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await api.get(`/faculty/submissions/exam/${id}`);
      setSubmissions(res.data.submissions || []);
    } catch (e) {
      // Submissions endpoint might not exist yet
      console.error('Failed to load submissions');
    }
  };

  const handleAddMCQ = async (e) => {
    e.preventDefault();
    
    const updatedMCQs = [...(exam.mcqQuestions || [])];
    if (editingIndex !== null) {
      updatedMCQs[editingIndex] = mcqForm;
    } else {
      updatedMCQs.push(mcqForm);
    }

    try {
      await api.patch(`/faculty/exams/${id}`, {
        mcqQuestions: updatedMCQs
      });
      toast.success(editingIndex !== null ? 'Question updated!' : 'Question added!');
      setShowMCQModal(false);
      setMcqForm({
        prompt: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        marks: 1,
        difficulty: 'medium'
      });
      setEditingIndex(null);
      fetchExam();
    } catch (e) {
      toast.error('Failed to save question');
    }
  };

  const handleAddCoding = async (e) => {
    e.preventDefault();
    
    const updatedCoding = [...(exam.codingQuestions || [])];
    if (editingIndex !== null) {
      updatedCoding[editingIndex] = codingForm;
    } else {
      updatedCoding.push(codingForm);
    }

    try {
      await api.patch(`/faculty/exams/${id}`, {
        codingQuestions: updatedCoding
      });
      toast.success(editingIndex !== null ? 'Question updated!' : 'Question added!');
      setShowCodingModal(false);
      setCodingForm({
        prompt: '',
        starterCode: '',
        language: 'javascript',
        marks: 10,
        difficulty: 'medium',
        testCases: []
      });
      setEditingIndex(null);
      fetchExam();
    } catch (e) {
      toast.error('Failed to save question');
    }
  };

  const handleDeleteMCQ = async (index) => {
    if (!confirm('Delete this question?')) return;
    
    const updatedMCQs = exam.mcqQuestions.filter((_, i) => i !== index);
    try {
      await api.patch(`/faculty/exams/${id}`, {
        mcqQuestions: updatedMCQs
      });
      toast.success('Question deleted');
      fetchExam();
    } catch (e) {
      toast.error('Failed to delete question');
    }
  };

  const handleDeleteCoding = async (index) => {
    if (!confirm('Delete this question?')) return;
    
    const updatedCoding = exam.codingQuestions.filter((_, i) => i !== index);
    try {
      await api.patch(`/faculty/exams/${id}`, {
        codingQuestions: updatedCoding
      });
      toast.success('Question deleted');
      fetchExam();
    } catch (e) {
      toast.error('Failed to delete question');
    }
  };

  const handleEditMCQ = (index) => {
    setMcqForm(exam.mcqQuestions[index]);
    setEditingIndex(index);
    setShowMCQModal(true);
  };

  const handleEditCoding = (index) => {
    setCodingForm(exam.codingQuestions[index]);
    setEditingIndex(index);
    setShowCodingModal(true);
  };

  const handlePublishToggle = async () => {
    try {
      if (exam.isPublished) {
        await api.post(`/faculty/exams/${id}/unpublish`);
        toast.success('Exam unpublished');
      } else {
        await api.post(`/faculty/exams/${id}/publish`);
        toast.success('Exam published! Students can now access it.');
      }
      fetchExam();
    } catch (e) {
      toast.error('Failed to update exam status');
    }
  };

  const addTestCase = () => {
    setCodingForm(prev => ({
      ...prev,
      testCases: [...prev.testCases, testCaseForm]
    }));
    setTestCaseForm({ input: '', expectedOutput: '', isHidden: false });
  };

  const removeTestCase = (index) => {
    setCodingForm(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Loading...</div>
      </Layout>
    );
  }

  if (!exam) {
    return (
      <Layout>
        <Card title="Error">
          <p className="text-red-600">Exam not found</p>
        </Card>
      </Layout>
    );
  }

  const totalMarks = (exam.mcqQuestions || []).reduce((sum, q) => sum + (q.marks || 0), 0) +
                     (exam.codingQuestions || []).reduce((sum, q) => sum + (q.marks || 0), 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p><strong>Type:</strong> {exam.type?.toUpperCase()}</p>
                <p><strong>Duration:</strong> {exam.durationMinutes} minutes</p>
                <p><strong>Total Marks:</strong> {totalMarks}</p>
                <p><strong>Exam Code:</strong> <span className="font-mono font-bold text-blue-600">{exam.examCode}</span></p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    exam.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {exam.isPublished ? 'Published' : 'Draft'}
                  </span>
                </p>
              </div>
            </div>
            <div className="space-x-2">
              <Button
                onClick={handlePublishToggle}
                variant={exam.isPublished ? 'secondary' : 'primary'}
              >
                {exam.isPublished ? 'Unpublish' : 'Publish'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/faculty/exams')}
              >
                Back to Exams
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-8">
              {['details', 'mcq', 'coding', 'submissions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'mcq' ? 'MCQ Questions' : 
                   tab === 'coding' ? 'Coding Questions' :
                   tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'mcq' && ` (${exam.mcqQuestions?.length || 0})`}
                  {tab === 'coding' && ` (${exam.codingQuestions?.length || 0})`}
                  {tab === 'submissions' && ` (${submissions.length})`}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Exam Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{exam.mcqQuestions?.length || 0}</p>
                  <p className="text-sm text-gray-600">MCQ Questions</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{exam.codingQuestions?.length || 0}</p>
                  <p className="text-sm text-gray-600">Coding Questions</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{exam.enrolledStudents?.length || 0}</p>
                  <p className="text-sm text-gray-600">Enrolled Students</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{totalMarks}</p>
                  <p className="text-sm text-gray-600">Total Marks</p>
                </div>
              </div>
              {exam.startsAt && (
                <p className="text-sm text-gray-600">
                  <strong>Start Time:</strong> {new Date(exam.startsAt).toLocaleString()}
                </p>
              )}
              {exam.endsAt && (
                <p className="text-sm text-gray-600">
                  <strong>End Time:</strong> {new Date(exam.endsAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {activeTab === 'mcq' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">MCQ Questions</h3>
                <Button onClick={() => { setEditingIndex(null); setShowMCQModal(true); }}>
                  + Add MCQ Question
                </Button>
              </div>

              {(!exam.mcqQuestions || exam.mcqQuestions.length === 0) ? (
                <p className="text-gray-500 text-center py-8">No MCQ questions yet. Click "Add MCQ Question" to create one.</p>
              ) : (
                <div className="space-y-4">
                  {exam.mcqQuestions.map((q, idx) => (
                    <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Q{idx + 1}. {q.prompt}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Marks: {q.marks} | Difficulty: {q.difficulty}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Button onClick={() => handleEditMCQ(idx)} className="text-xs">Edit</Button>
                          <Button onClick={() => handleDeleteMCQ(idx)} variant="danger" className="text-xs">Delete</Button>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        {q.options?.map((opt, i) => (
                          <div key={i} className={`p-2 rounded ${i === q.correctOptionIndex ? 'bg-green-100 border-2 border-green-600' : 'bg-white'}`}>
                            <span className="text-sm">{String.fromCharCode(65 + i)}. {opt}</span>
                            {i === q.correctOptionIndex && <span className="ml-2 text-xs text-green-700 font-semibold">✓ Correct</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'coding' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Coding Questions</h3>
                <Button onClick={() => { setEditingIndex(null); setShowCodingModal(true); }}>
                  + Add Coding Question
                </Button>
              </div>

              {(!exam.codingQuestions || exam.codingQuestions.length === 0) ? (
                <p className="text-gray-500 text-center py-8">No coding questions yet. Click "Add Coding Question" to create one.</p>
              ) : (
                <div className="space-y-4">
                  {exam.codingQuestions.map((q, idx) => (
                    <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Q{idx + 1}. {q.prompt}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Language: {q.language} | Marks: {q.marks} | Difficulty: {q.difficulty}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Button onClick={() => handleEditCoding(idx)} className="text-xs">Edit</Button>
                          <Button onClick={() => handleDeleteCoding(idx)} variant="danger" className="text-xs">Delete</Button>
                        </div>
                      </div>
                      {q.starterCode && (
                        <pre className="mt-2 p-2 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto">
                          <code>{q.starterCode}</code>
                        </pre>
                      )}
                      {q.testCases && q.testCases.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-gray-700">Test Cases: {q.testCases.length}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'submissions' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Student Submissions</h3>
              {submissions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No submissions yet</p>
              ) : (
                <div className="space-y-2">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-semibold">{sub.studentName || 'Student'}</p>
                        <p className="text-sm text-gray-600">Score: {sub.score}/{totalMarks}</p>
                      </div>
                      <Button onClick={() => router.push(`/faculty/submissions/${sub.id}`)} className="text-xs">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* MCQ Modal */}
      <Modal isOpen={showMCQModal} onClose={() => { setShowMCQModal(false); setEditingIndex(null); }} title={editingIndex !== null ? "Edit MCQ Question" : "Add MCQ Question"}>
        <form onSubmit={handleAddMCQ}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Prompt</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              value={mcqForm.prompt}
              onChange={(e) => setMcqForm({ ...mcqForm, prompt: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
            {mcqForm.options.map((opt, i) => (
              <Input
                key={i}
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                value={opt}
                onChange={(e) => {
                  const newOpts = [...mcqForm.options];
                  newOpts[i] = e.target.value;
                  setMcqForm({ ...mcqForm, options: newOpts });
                }}
                required
                className="mb-2"
              />
            ))}
          </div>

          <Select
            label="Correct Answer"
            value={mcqForm.correctOptionIndex}
            onChange={(e) => setMcqForm({ ...mcqForm, correctOptionIndex: parseInt(e.target.value) })}
          >
            {mcqForm.options.map((opt, i) => (
              <option key={i} value={i}>Option {String.fromCharCode(65 + i)}</option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input
              label="Marks"
              type="number"
              min="1"
              value={mcqForm.marks}
              onChange={(e) => setMcqForm({ ...mcqForm, marks: parseInt(e.target.value) })}
              required
            />
            <Select
              label="Difficulty"
              value={mcqForm.difficulty}
              onChange={(e) => setMcqForm({ ...mcqForm, difficulty: e.target.value })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          </div>

          <div className="flex space-x-2 mt-6">
            <Button type="submit">{editingIndex !== null ? 'Update' : 'Add'} Question</Button>
            <Button type="button" variant="secondary" onClick={() => { setShowMCQModal(false); setEditingIndex(null); }}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Coding Question Modal */}
      <Modal isOpen={showCodingModal} onClose={() => { setShowCodingModal(false); setEditingIndex(null); }} title={editingIndex !== null ? "Edit Coding Question" : "Add Coding Question"}>
        <form onSubmit={handleAddCoding}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Prompt</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={4}
              value={codingForm.prompt}
              onChange={(e) => setCodingForm({ ...codingForm, prompt: e.target.value })}
              placeholder="Describe the problem..."
              required
            />
          </div>

          <Select
            label="Programming Language"
            value={codingForm.language}
            onChange={(e) => setCodingForm({ ...codingForm, language: e.target.value })}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </Select>

          <div className="mb-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Starter Code (Optional)</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
              rows={6}
              value={codingForm.starterCode}
              onChange={(e) => setCodingForm({ ...codingForm, starterCode: e.target.value })}
              placeholder="// Starter code template"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Marks"
              type="number"
              min="1"
              value={codingForm.marks}
              onChange={(e) => setCodingForm({ ...codingForm, marks: parseInt(e.target.value) })}
              required
            />
            <Select
              label="Difficulty"
              value={codingForm.difficulty}
              onChange={(e) => setCodingForm({ ...codingForm, difficulty: e.target.value })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
          </div>

          {/* Test Cases */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Cases</label>
            {codingForm.testCases.map((tc, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded mb-2 text-sm">
                <div className="flex justify-between">
                  <div>
                    <p><strong>Input:</strong> {tc.input}</p>
                    <p><strong>Expected:</strong> {tc.expectedOutput}</p>
                    <p><strong>Hidden:</strong> {tc.isHidden ? 'Yes' : 'No'}</p>
                  </div>
                  <button type="button" onClick={() => removeTestCase(i)} className="text-red-600 text-xs">Remove</button>
                </div>
              </div>
            ))}

            <div className="mt-2 p-3 border-2 border-dashed border-gray-300 rounded">
              <Input
                label="Test Input"
                type="text"
                value={testCaseForm.input}
                onChange={(e) => setTestCaseForm({ ...testCaseForm, input: e.target.value })}
                placeholder="e.g., [1, 2, 3]"
              />
              <Input
                label="Expected Output"
                type="text"
                value={testCaseForm.expectedOutput}
                onChange={(e) => setTestCaseForm({ ...testCaseForm, expectedOutput: e.target.value })}
                placeholder="e.g., 6"
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={testCaseForm.isHidden}
                  onChange={(e) => setTestCaseForm({ ...testCaseForm, isHidden: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Hidden from students</label>
              </div>
              <Button type="button" onClick={addTestCase} className="mt-2 text-xs" variant="secondary">
                + Add Test Case
              </Button>
            </div>
          </div>

          <div className="flex space-x-2 mt-6">
            <Button type="submit">{editingIndex !== null ? 'Update' : 'Add'} Question</Button>
            <Button type="button" variant="secondary" onClick={() => { setShowCodingModal(false); setEditingIndex(null); }}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
