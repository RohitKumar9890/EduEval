import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CodingExam() {
  const router = useRouter();
  const [selectedProblem, setSelectedProblem] = useState(0);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(`class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        # Use hash map to count frequencies
        count = {}
        for n in nums:
            count[n] = 1 + count.get(n, 0)
        
        freq = [[] for i in range(len(nums) + 1)]
        for n, c in count.items():
            freq[c].append(n)
        `);
  const [output, setOutput] = useState({
    success: true,
    runtime: '24ms',
    cases: [
      { id: 1, input: '[1,1,1,2,2,3], k=2', output: '[1,2]', passed: true },
      { id: 2, input: '[1], k=1', output: '[1]', passed: true },
      { id: 3, input: '[4,4,4,6,6,6,1], k=2', output: '[4,6]', passed: true },
    ]
  });

  const problems = [
    { id: 1, title: 'Problem 1', active: true },
    { id: 2, title: 'Problem 2', active: false },
    { id: 3, title: 'Problem 3', active: false },
    { id: 4, title: 'Problem 4', active: false },
    { id: 5, title: 'Problem 5', active: false },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="h-16 flex items-center justify-between bg-white dark:bg-slate-900 px-6 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">arrow_back</span>
          </button>
          <div>
            <h1 className="text-slate-900 dark:text-white text-lg font-black">Coding Assessment</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">CS101 - Final Exam</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-2 font-bold text-sm">
            <span className="material-symbols-outlined text-base">timer</span>
            1:23:45
          </div>
        </div>
      </header>

      {/* Sub-header Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex gap-8 overflow-x-auto no-scrollbar flex-shrink-0">
        {problems.map((problem) => (
          <button
            key={problem.id}
            onClick={() => setSelectedProblem(problem.id - 1)}
            className={`pb-3 pt-5 border-b-[3px] text-xs font-black uppercase tracking-widest transition-all
              ${selectedProblem === problem.id - 1 ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-primary'}
            `}
          >
            Problem {problem.id}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Description */}
        <div className="w-1/2 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar">
          <div className="p-10 space-y-8">
            <div>
              <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight mb-2">
                Array Manipulator
              </h1>
              <div className="flex gap-4">
                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-100 dark:border-amber-900/30">
                  Medium
                </span>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                  Points: 100
                </span>
              </div>
            </div>

            <article className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4">
                Problem Description
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Given an integer array <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-primary">nums</code> and an integer <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-primary">k</code>, return the k-th most frequent element. You may return the answer in any order.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                The problem requires an algorithm with a time complexity better than <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-primary">O(n log n)</code>, where <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-primary">n</code> is the size of the array.
              </p>

              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4 mt-8">
                Examples
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Example 1</p>
                  <p className="font-mono text-xs text-slate-700 dark:text-slate-300">
                    <span className="text-primary font-bold">Input:</span> nums = [1,1,1,2,2,3], k = 2
                  </p>
                  <p className="font-mono text-xs text-slate-700 dark:text-slate-300 mt-1">
                    <span className="text-primary font-bold">Output:</span> [1,2]
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Example 2</p>
                  <p className="font-mono text-xs text-slate-700 dark:text-slate-300">
                    <span className="text-primary font-bold">Input:</span> nums = [1], k = 1
                  </p>
                  <p className="font-mono text-xs text-slate-700 dark:text-slate-300 mt-1">
                    <span className="text-primary font-bold">Output:</span> [1]
                  </p>
                </div>
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4 mt-8">
                Constraints
              </h3>
              <ul className="text-xs text-slate-500 space-y-2 list-disc pl-5">
                <li>1 &lt;= nums.length &lt;= 10<sup>5</sup></li>
                <li>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></li>
                <li>k is in the range [1, the number of unique elements in the array].</li>
                <li>It is guaranteed that the answer is unique.</li>
              </ul>
            </article>
          </div>
        </div>

        {/* Right Pane: Code Editor */}
        <div className="w-1/2 flex flex-col bg-[#0f172a] overflow-hidden">
          {/* Editor Header */}
          <div className="h-12 bg-slate-900 flex items-center justify-between px-4 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-4">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-800 text-white text-[10px] font-black uppercase border-none rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary/40"
              >
                <option value="python">Python 3</option>
                <option value="java">Java 17</option>
                <option value="cpp">C++ 20</option>
                <option value="javascript">JavaScript</option>
              </select>
              <button className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">settings</span>
              </button>
            </div>
            <button className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase px-5 py-2 rounded-lg flex items-center gap-2 transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">play_arrow</span>
              Run Code
            </button>
          </div>

          {/* Code Area */}
          <div className="flex-1 overflow-auto custom-scrollbar bg-[#0f172a]">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-6 font-mono text-sm leading-relaxed bg-transparent text-slate-300 resize-none focus:outline-none"
              spellCheck="false"
            />
          </div>

          {/* Console / Results Area */}
          <div className="h-[35%] bg-slate-900 border-t border-slate-800 flex flex-col flex-shrink-0">
            <div className="flex px-6 border-b border-slate-800 gap-8 h-12 flex-shrink-0">
              <button className="text-[10px] font-black uppercase tracking-widest text-white border-b-2 border-primary">
                Console
              </button>
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white">
                Test Cases ({output.cases.length})
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {output.success && (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-green-900/30 text-green-400 rounded-lg border border-green-900/40 shadow-sm">
                      SUCCESS
                    </span>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      Run time: {output.runtime}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {output.cases.map(testCase => (
                      <div 
                        key={testCase.id} 
                        className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800 transition-colors hover:border-slate-700"
                      >
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                          Case {testCase.id}
                        </span>
                        <div className="flex gap-2 items-center">
                          <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
                          <span className="text-slate-300 text-xs font-mono">
                            Input: {testCase.input} | Output: {testCase.output}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-8 py-2 flex justify-between items-center text-[9px] text-slate-400 font-black uppercase tracking-[0.15em] flex-shrink-0">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> 
            System Online
          </span>
          <span>Cloud Sync Active</span>
        </div>
        <div className="flex items-center gap-6">
          <span>User ID: ST-29401</span>
          <span className="text-primary/60">Exam Ref: FINAL-CS-101</span>
        </div>
      </footer>
    </div>
  );
}
