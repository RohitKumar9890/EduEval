'use client';

import React, { useState, useEffect } from 'react';
import { useFaculty } from '@/context/FacultyContext';
import { motion } from 'framer-motion';
import { FileEdit, Plus, Calendar, Clock, BookOpen, Hash, Copy, CheckCircle, Eye, Trash2, ToggleLeft, ArrowLeft, Wand2, FileText, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SAMPLE_QUESTIONS: Record<string, any[]> = {
   'Computer Science': [
      { id: Date.now() + 1, title: 'What is the time complexity of searching in a Balanced Binary Search Tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], correctOption: 2, marks: 10 },
      { id: Date.now() + 2, title: 'Which of the following is NOT a reserved keyword in JavaScript?', options: ['interface', 'throws', 'program', 'short'], correctOption: 2, marks: 10 },
      { id: Date.now() + 3, title: 'What does HTTP stand for?', options: ['High Text Transfer Protocol', 'HyperText Transfer Protocol', 'Hyperlink Text Transfer Protocol', 'None of these'], correctOption: 1, marks: 10 }
   ],
   'Mathematics': [
      { id: Date.now() + 4, title: 'Solve for x: 2x + 5 = 15', options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 2'], correctOption: 0, marks: 10 },
      { id: Date.now() + 5, title: 'What is the value of Pi to 2 decimal places?', options: ['3.12', '3.14', '3.16', '3.18'], correctOption: 1, marks: 10 },
      { id: Date.now() + 6, title: 'What is the square root of 144?', options: ['12', '14', '16', '10'], correctOption: 0, marks: 10 }
   ]
};

type ViewState = 'list' | 'details' | 'questions';

export default function ExamsPage() {
   const { exams, subjects, addExam, deleteExam, toggleExamStatus, publishResults } = useFaculty();
   const [view, setView] = useState<ViewState>('list');
   const [showBulkImport, setShowBulkImport] = useState(false);
   const [bulkText, setBulkText] = useState('');

   const [formData, setFormData] = useState({
      title: '',
      type: 'multiple_choice',
      subjectId: '',
      durationMinutes: 60,
      totalMarks: 100,
      startDate: '',
      endDate: '',
      questions: [] as any[]
   });

   // Sync subjectId when subjects load
   useEffect(() => {
      if (subjects.length > 0 && !formData.subjectId) {
         setFormData(prev => ({ ...prev, subjectId: subjects[0].id }));
      }
   }, [subjects, formData.subjectId]);

   const handleCopy = (code: string | undefined) => {
      if (!code) return;
      navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!');
   };

   const handleDetailsSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title || !formData.startDate || !formData.endDate) {
         toast.error('Please fill in all required fields');
         return;
      }

      let needsReset = false;
      if (formData.questions.length === 0) {
         needsReset = true;
      } else {
         // If type changed, old questions array might not have appropriate fields
         const q = formData.questions[0];
         if ((formData.type === 'multiple_choice' || formData.type === 'quiz') && !q.options) needsReset = true;
         if (formData.type === 'coding' && !q.testCases) needsReset = true;
      }

      if (needsReset) {
         let templates: any[] = [];
         if (formData.type === 'multiple_choice' || formData.type === 'quiz') {
            templates = [{ id: 1, title: '', marks: 10, options: ['', '', '', ''], correctOption: 0 }];
         } else if (formData.type === 'coding') {
            templates = [{ id: 1, title: '', marks: 50, testCases: [{ input: '', output: '' }] }];
         } else {
            templates = [{ id: 1, title: '', marks: 20 }];
         }

         setFormData({ ...formData, questions: templates });
         setView('questions');
         return;
      }

      setView('questions');
   };

   const handleDeploy = () => {
      // Validate
      if (formData.questions.length === 0) {
         toast.error('Please add at least one question.');
         return;
      }

      addExam({
         title: formData.title,
         type: formData.type,
         subjectId: formData.subjectId,
         durationMinutes: formData.durationMinutes,
         totalMarks: formData.totalMarks,
         startDate: formData.startDate,
         endDate: formData.endDate,
         status: 'published',
         questionsCount: formData.questions.length,
         questions: formData.questions
      });

      toast.success('Exam successfully deployed & published!');
      resetForm();
   };

   const handleMagicFill = () => {
      const subject = subjects.find(s => s.id === formData.subjectId);
      const subjectName = subject?.name || '';

      const samples = SAMPLE_QUESTIONS[subjectName] || SAMPLE_QUESTIONS['Computer Science'];
      const newQuestions = samples.map(q => ({
         ...q,
         id: Math.random(),
         // Ensure we don't end up with reference issues
         options: [...q.options]
      }));

      setFormData({
         ...formData,
         questions: [...formData.questions, ...newQuestions]
      });
      toast.success(`Added ${newQuestions.length} sample questions for ${subjectName || 'Computer Science'}`);
   };

   const handleBulkImport = () => {
      if (!bulkText.trim()) {
         toast.error("Please enter some text to import.");
         return;
      }

      const lines = bulkText.split('\n').filter(l => l.trim().includes('|'));
      const newQs = lines.map(line => {
         const parts = line.split('|').map(s => s.trim());
         return {
            id: Math.random(),
            title: parts[0] || 'New Question',
            options: [parts[1] || 'Opt 1', parts[2] || 'Opt 2', parts[3] || 'Opt 3', parts[4] || 'Opt 4'],
            correctOption: parseInt(parts[5]) || 0,
            marks: 10
         };
      });

      if (newQs.length > 0) {
         setFormData({ ...formData, questions: [...formData.questions, ...newQs] });
         toast.success(`Successfully imported ${newQs.length} questions!`);
         setBulkText('');
         setShowBulkImport(false);
      } else {
         toast.error('Invalid format. Ensure lines have pipes: Q | A | B | C | D | 0');
      }
   };

   const resetForm = () => {
      setFormData({
         title: '',
         type: 'multiple_choice',
         subjectId: subjects[0]?.id || '',
         durationMinutes: 60,
         totalMarks: 100,
         startDate: '',
         endDate: '',
         questions: []
      });
      setView('list');
   };

   return (
      <div className="space-y-6 max-w-7xl mx-auto">

         {/* Header */}
         <div className="flex items-center justify-between mb-8">
            <div>
               <h1 className="text-3xl font-extrabold text-[#1D1D35] flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                     <FileEdit size={28} />
                  </div>
                  Exam Management
               </h1>
               <p className="text-slate-500 font-medium mt-2">Deploy, manage, and distribute your academic assessments.</p>
            </div>
            {view === 'list' && (
               <button
                  onClick={() => setView('details')}
                  className="bg-[#0B4CEB] hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-200"
               >
                  <Plus size={20} />
                  Create Exam
               </button>
            )}
         </div>

         {view === 'list' && (
            <motion.div
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
               className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden"
            >
               <div className="overflow-x-auto min-h-[400px]">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider font-extrabold">
                           <th className="p-5 font-bold">Title</th>
                           <th className="p-5 font-bold">Code</th>
                           <th className="p-5 font-bold">Type</th>
                           <th className="p-5 font-bold">Subject</th>
                           <th className="p-5 font-bold">Questions</th>
                           <th className="p-5 font-bold">Duration</th>
                           <th className="p-5 font-bold">Marks</th>
                           <th className="p-5 font-bold">Status</th>
                           <th className="p-5 font-bold text-center">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 text-sm">
                        {exams.map(exam => {
                           const subject = subjects.find(s => s.id === exam.subjectId);
                           return (
                              <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors group">
                                 <td className="p-5 font-bold text-[#1D1D35]">{exam.title}</td>
                                 <td className="p-5">
                                    {exam.examCode ? (
                                       <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-100/50 font-mono text-xs font-bold tracking-widest">
                                          {exam.examCode}
                                          <button onClick={() => handleCopy(exam.examCode)} className="text-indigo-400 hover:text-indigo-600 transition" title="Copy Code">
                                             <Copy size={14} />
                                          </button>
                                       </div>
                                    ) : (
                                       <span className="text-slate-400 font-medium">-</span>
                                    )}
                                 </td>
                                 <td className="p-5">
                                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                       {exam.type === 'multiple_choice' ? 'MCQ' : exam.type}
                                    </span>
                                 </td>
                                 <td className="p-5 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{subject?.name || 'N/A'}</td>
                                 <td className="p-5 text-slate-600 font-medium">{exam.questionsCount || 0}</td>
                                 <td className="p-5 text-slate-600 font-medium">{exam.durationMinutes} min</td>
                                 <td className="p-5 text-slate-600 font-medium">{exam.totalMarks}</td>
                                 <td className="p-5">
                                    <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${exam.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                       {exam.status === 'published' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                       {exam.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                 </td>
                                 <td className="p-5">
                                    <div className="flex flex-col gap-1.5 items-center">
                                       <button onClick={() => toast("View Exam Mode not implemented in mockup")} className="w-24 py-1.5 bg-[#0B4CEB] hover:bg-blue-700 text-white text-xs font-bold rounded shadow-sm transition">Edit/View</button>
                                       <button onClick={() => toggleExamStatus(exam.id)} className="w-24 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded shadow-sm transition">
                                          {exam.status === 'published' ? 'Unpublish' : 'Publish'}
                                       </button>
                                       {exam.status === 'published' && !exam.resultsPublished && (
                                          <button
                                             onClick={() => { if (confirm('Publish results for all students?')) publishResults(exam.id) }}
                                             className="w-24 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded shadow-sm transition"
                                          >
                                             Publish Results
                                          </button>
                                       )}
                                       <button onClick={() => { if (confirm('Delete this exam?')) deleteExam(exam.id) }} className="w-24 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded shadow-sm transition">Delete</button>
                                    </div>
                                 </td>
                              </tr>
                           );
                        })}
                        {exams.length === 0 && (
                           <tr>
                              <td colSpan={9} className="p-12 text-center text-slate-400 font-medium">No exams configured yet.</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </motion.div>
         )}

         {view === 'details' && (
            <motion.div
               initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
               className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-4xl mx-auto"
            >
               <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-[#1D1D35]">Step 1: Exam Details</h2>
                  <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 font-medium text-sm flex items-center gap-1"><ArrowLeft size={16} /> Cancel</button>
               </div>
               <form onSubmit={handleDetailsSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Exam Title</label>
                        <input type="text" required placeholder="e.g., Midterm Evaluation" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Exam Type</label>
                        <select className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                           <option value="multiple_choice">Multiple Choice</option>
                           <option value="quiz">Quiz Form</option>
                           <option value="coding">Coding Assessment</option>
                           <option value="subjective">Subjective / Essay</option>
                        </select>
                     </div>
                     <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">Subject Area</label>
                        <select className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.subjectId} onChange={e => setFormData({ ...formData, subjectId: e.target.value })}>
                           {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Duration (mins)</label>
                        <input type="number" min="1" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.durationMinutes} onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Total Marks</label>
                        <input type="number" min="1" className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.totalMarks} onChange={e => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Start Window</label>
                        <input type="datetime-local" required className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">End Window</label>
                        <input type="datetime-local" required className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                     </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                     <button type="submit" className="px-8 py-3 rounded-xl font-bold text-white bg-[#1D1D35] hover:bg-black transition shadow-lg">
                        Next: Draft Questions
                     </button>
                  </div>
               </form>
            </motion.div>
         )}

         {view === 'questions' && (
            <motion.div
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
               className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-4xl mx-auto"
            >
               <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                  <div>
                     <h2 className="text-xl font-bold text-[#1D1D35]">Step 2: Exam Builder</h2>
                     <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-1">{formData.type.replace('_', ' ')} Format</p>
                  </div>

                  <div className="flex items-center gap-4">
                     <button
                        onClick={handleMagicFill}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition text-sm font-bold shadow-md"
                     >
                        <Wand2 size={18} />
                        ✨ Magic Fill
                     </button>
                     <button
                        onClick={() => setShowBulkImport(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-bold shadow-md"
                     >
                        <FileText size={18} />
                        📄 Bulk Import
                     </button>
                     <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                     <button onClick={() => setView('details')} className="text-slate-500 hover:text-slate-800 font-bold text-sm flex items-center gap-1 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"><ArrowLeft size={16} /> Back</button>
                  </div>
               </div>

               {/* Bulk Import Modal */}
               {showBulkImport && (
                  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                     <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
                           <div>
                              <h3 className="text-lg font-bold">Bulk Question Import</h3>
                              <p className="text-xs text-indigo-100 opacity-80 mt-1">Paste multiple questions using the format below</p>
                           </div>
                           <button onClick={() => setShowBulkImport(false)} className="hover:bg-indigo-500 p-2 rounded-full transition"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Format Guide</p>
                              <code className="text-xs text-indigo-600 font-mono font-bold block bg-white p-2 rounded border border-indigo-50">
                                 Question | Opt1 | Opt2 | Opt3 | Opt4 | CorrectIndex(0-3)
                              </code>
                              <p className="text-[10px] text-slate-500 mt-2 italic">Example: What is 2+2? | 3 | 4 | 5 | 6 | 1</p>
                           </div>
                           <textarea
                              className="w-full h-64 bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                              placeholder="Paste questions here... (one per line)"
                              value={bulkText}
                              onChange={(e) => setBulkText(e.target.value)}
                           />
                           <div className="flex gap-3 justify-end pt-2">
                              <button onClick={() => setShowBulkImport(false)} className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-700">Cancel</button>
                              <button onClick={handleBulkImport} className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Parse & Import</button>
                           </div>
                        </div>
                     </motion.div>
                  </div>
               )}

               <div className="space-y-6">
                  {formData.questions.map((q, qIndex) => (
                     <div key={q.id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative group">

                        <div className="flex gap-4">
                           <div className="flex-1 space-y-4">
                              {/* Question Title */}
                              <div>
                                 <label className="text-xs font-bold text-slate-500">Question {qIndex + 1}</label>
                                 <input type="text" placeholder="Enter question description..." className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none" value={q.title} onChange={e => {
                                    const qs = [...formData.questions];
                                    qs[qIndex].title = e.target.value;
                                    setFormData({ ...formData, questions: qs });
                                 }} />
                              </div>

                              {/* MCQ specific format */}
                              {(formData.type === 'multiple_choice' || formData.type === 'quiz') && (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    {(q.options || []).map((opt: string, oIndex: number) => {
                                       const isCorrect = q.correctOption === oIndex;
                                       return (
                                          <div
                                             key={oIndex}
                                             className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer group/opt ${isCorrect ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-100 hover:border-blue-200 hover:bg-white'
                                                }`}
                                             onClick={() => {
                                                const qs = [...formData.questions];
                                                qs[qIndex].correctOption = oIndex;
                                                setFormData({ ...formData, questions: qs });
                                             }}
                                          >
                                             <div className="relative flex items-center justify-center">
                                                <input
                                                   type="radio"
                                                   readOnly
                                                   name={`correct-${qIndex}`}
                                                   checked={isCorrect}
                                                   className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer accent-emerald-600"
                                                />
                                             </div>
                                             <div className="flex-1 min-w-0">
                                                <input
                                                   type="text"
                                                   placeholder={`Option ${oIndex + 1}`}
                                                   className={`w-full text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isCorrect ? 'border-emerald-200' : ''
                                                      }`}
                                                   value={opt}
                                                   onClick={(e) => e.stopPropagation()}
                                                   onChange={e => {
                                                      const qs = [...formData.questions];
                                                      qs[qIndex].options[oIndex] = e.target.value;
                                                      setFormData({ ...formData, questions: qs });
                                                   }}
                                                />
                                             </div>
                                             {isCorrect && (
                                                <div className="shrink-0">
                                                   <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 shadow-sm">
                                                      Correct
                                                   </span>
                                                </div>
                                             )}
                                          </div>
                                       );
                                    })}
                                 </div>
                              )}

                              {/* Coding specific format */}
                              {formData.type === 'coding' && (
                                 <div className="space-y-3 pt-2">
                                    <div className="p-4 bg-slate-900 rounded-xl space-y-3">
                                       <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">
                                          <span>Test Cases Array</span>
                                          <button type="button" className="text-emerald-400 hover:text-emerald-300" onClick={() => {
                                             const qs = [...formData.questions];
                                             qs[qIndex].testCases.push({ input: '', output: '' });
                                             setFormData({ ...formData, questions: qs });
                                          }}>+ Add Case</button>
                                       </div>
                                       {(q.testCases || []).map((tc: any, tcIndex: number) => (
                                          <div key={tcIndex} className="flex gap-4">
                                             <input type="text" placeholder="Expected Input (e.g., [2,7,11,15], 9)" className="flex-1 bg-slate-800 border border-slate-700 text-emerald-300 font-mono text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500" value={tc.input} onChange={e => {
                                                const qs = [...formData.questions];
                                                qs[qIndex].testCases[tcIndex].input = e.target.value;
                                                setFormData({ ...formData, questions: qs });
                                             }} />
                                             <input type="text" placeholder="Expected Output (e.g., [0,1])" className="flex-1 bg-slate-800 border border-slate-700 text-emerald-300 font-mono text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500" value={tc.output} onChange={e => {
                                                const qs = [...formData.questions];
                                                qs[qIndex].testCases[tcIndex].output = e.target.value;
                                                setFormData({ ...formData, questions: qs });
                                             }} />
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              )}

                           </div>

                           <div className="w-24 shrink-0">
                              <label className="text-xs font-bold text-slate-500">Marks</label>
                              <input type="number" min="1" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-center font-bold text-[#1D1D35]" value={q.marks} onChange={e => {
                                 const qs = [...formData.questions];
                                 qs[qIndex].marks = parseInt(e.target.value);
                                 setFormData({ ...formData, questions: qs });
                              }} />
                           </div>
                        </div>

                        <button type="button" onClick={() => {
                           const qs = formData.questions.filter((_, i) => i !== qIndex);
                           setFormData({ ...formData, questions: qs });
                        }} className="absolute -right-3 -top-3 w-8 h-8 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow hover:bg-rose-500 hover:text-white">
                           <Trash2 size={14} />
                        </button>
                     </div>
                  ))}

                  <button type="button" className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 transition flex justify-center items-center gap-2" onClick={() => {
                     const qs = [...formData.questions];
                     if (formData.type === 'multiple_choice' || formData.type === 'quiz') qs.push({ id: Math.random(), title: '', marks: 10, options: ['', '', '', ''], correctOption: 0 });
                     else if (formData.type === 'coding') qs.push({ id: Math.random(), title: '', marks: 50, testCases: [{ input: '', output: '' }] });
                     else qs.push({ id: Math.random(), title: '', marks: 20 });
                     setFormData({ ...formData, questions: qs });
                  }}>
                     <Plus size={20} />
                     Append Question block
                  </button>
               </div>

               <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
                  <button onClick={handleDeploy} className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-lg shadow-blue-600/30">
                     Deploy Exam
                  </button>
               </div>
            </motion.div>
         )}

      </div>
   );
}
