
import React from 'react';
import { User } from '../types';

const CodingExam: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="h-full flex flex-col overflow-hidden -m-8">
      {/* Sub-header Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex gap-8 overflow-x-auto no-scrollbar flex-shrink-0">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            className={`pb-3 pt-5 border-b-[3px] text-xs font-black uppercase tracking-widest transition-all
              ${i === 1 ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-primary'}
            `}
          >
            Problem {i}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Description */}
        <div className="w-1/2 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar">
          <div className="p-10 space-y-8">
            <div>
              <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight mb-2">Array Manipulator</h1>
              <div className="flex gap-4">
                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-100 dark:border-amber-900/30">Medium</span>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Points: 100</span>
              </div>
            </div>

            <article className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4">Problem Description</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Given an integer array <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-primary">nums</code> and an integer <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-primary">k</code>, return the k-th most frequent element. You may return the answer in any order.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                The problem requires an algorithm with a time complexity better than <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-primary">O(n log n)</code>, where <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-primary">n</code> is the size of the array.
              </p>

              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4 mt-8">Examples</h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Example 1</p>
                  <p className="font-mono text-xs text-slate-700 dark:text-slate-300"><span className="text-primary font-bold">Input:</span> nums = [1,1,1,2,2,3], k = 2</p>
                  <p className="font-mono text-xs text-slate-700 dark:text-slate-300 mt-1"><span className="text-primary font-bold">Output:</span> [1,2]</p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Example 2</p>
                  <p className="font-mono text-xs text-slate-700 dark:text-slate-300"><span className="text-primary font-bold">Input:</span> nums = [1], k = 1</p>
                  <p className="font-mono text-xs text-slate-700 dark:text-slate-300 mt-1"><span className="text-primary font-bold">Output:</span> [1]</p>
                </div>
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4 mt-8">Constraints</h3>
              <ul className="text-xs text-slate-500 space-y-2 list-disc pl-5">
                <li>1 &lt;= nums.length &lt;= 10<sup>5</sup></li>
                <li>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></li>
                <li>k is in the range [1, the number of unique elements in the array].</li>
                <li>It is guaranteed that the answer is unique.</li>
              </ul>
            </article>
          </div>
        </div>

        {/* Right Pane: Code Editor Mockup */}
        <div className="w-1/2 flex flex-col bg-[#0f172a] overflow-hidden">
          {/* Editor Header */}
          <div className="h-12 bg-slate-900 flex items-center justify-between px-4 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <select className="bg-slate-800 text-white text-[10px] font-black uppercase border-none rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary/40">
                <option>Python 3</option>
                <option>Java 17</option>
                <option>C++ 20</option>
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
          <div className="flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed custom-scrollbar bg-[#0f172a]">
            <div className="flex gap-6">
              <div className="text-slate-600 text-right select-none pr-4 border-r border-slate-800">
                {Array.from({length: 12}).map((_, i) => <div key={i}>{i+1}</div>)}
              </div>
              <div className="text-slate-300 whitespace-pre">
                <span className="text-pink-400">class</span> <span className="text-yellow-200">Solution</span>:<br/>
                {'    '}<span className="text-pink-400">def</span> <span className="text-blue-400">topKFrequent</span>(self, nums: List[int], k: int) -&gt; List[int]:<br/>
                {'        '}<span className="text-slate-500"># Use hash map to count frequencies</span><br/>
                {'        '}count = {'{}'}<br/>
                {'        '}<span className="text-pink-400">for</span> n <span className="text-pink-400">in</span> nums:<br/>
                {'            '}count[n] = 1 + count.get(n, 0)<br/>
                <br/>
                {'        '}freq = [[] <span className="text-pink-400">for</span> i <span className="text-pink-400">in</span> <span className="text-blue-400">range</span>(<span className="text-blue-400">len</span>(nums) + 1)]<br/>
                {'        '}<span className="text-pink-400">for</span> n, c <span className="text-pink-400">in</span> count.items():<br/>
                {'            '}freq[c].append(n)<br/>
                {'        '}<span className="inline-block w-2 h-5 bg-primary animate-pulse align-middle"></span>
              </div>
            </div>
          </div>

          {/* Console / Results Area */}
          <div className="h-[35%] bg-slate-900 border-t border-slate-800 flex flex-col">
            <div className="flex px-6 border-b border-slate-800 gap-8 h-12 flex-shrink-0">
              <button className="text-[10px] font-black uppercase tracking-widest text-white border-b-2 border-primary">Console</button>
              <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white">Test Cases (3)</button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-green-900/30 text-green-400 rounded-lg border border-green-900/40 shadow-sm">SUCCESS</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Run time: 24ms</span>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800 transition-colors hover:border-slate-700">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Case {i}</span>
                    <div className="flex gap-2 items-center">
                      <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
                      <span className="text-slate-300 text-xs font-mono">
                        {i === 1 ? 'Input: [1,1,1,2,2,3], k=2 | Output: [1,2]' : i === 2 ? 'Input: [1], k=1 | Output: [1]' : 'Input: [4,4,4,6,6,6,1], k=2 | Output: [4,6]'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-8 py-2 flex justify-between items-center text-[9px] text-slate-400 font-black uppercase tracking-[0.15em] flex-shrink-0">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> System Online</span>
          <span>Cloud Sync Active</span>
        </div>
        <div className="flex items-center gap-6">
          <span>User ID: ST-29401</span>
          <span className="text-primary/60">Exam Ref: FINAL-CS-101</span>
        </div>
      </footer>
    </div>
  );
};

export default CodingExam;
