import { useRef } from 'react';

export default function ProgressReport({ studentData, onExport }) {
  const reportRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    if (onExport) {
      onExport('pdf');
    } else {
      // Fallback to print
      window.print();
    }
  };

  const handleExportCSV = () => {
    if (onExport) {
      onExport('csv');
    } else {
      // Generate CSV
      const csvData = generateCSV(studentData);
      downloadCSV(csvData, `progress-report-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  const generateCSV = (data) => {
    const headers = ['Exam', 'Date', 'Score', 'Max Score', 'Percentage', 'Status'];
    const rows = data.submissions.map(sub => [
      sub.examTitle || 'N/A',
      sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'N/A',
      sub.score || 0,
      sub.maxScore || 0,
      sub.maxScore > 0 ? ((sub.score / sub.maxScore) * 100).toFixed(1) + '%' : 'N/A',
      sub.status
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const { name, email, stats, submissions, achievements } = studentData;

  return (
    <div className="space-y-4">
      {/* Export Buttons */}
      <div className="flex flex-wrap gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm"
        >
          🖨️ Print Report
        </button>
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium text-sm"
        >
          📄 Export PDF
        </button>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm"
        >
          📊 Export CSV
        </button>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="bg-white border-2 border-gray-300 rounded-lg p-6 print:border-0">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Student Progress Report</h1>
          <p className="text-sm text-gray-600 mt-1">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Student Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Student Information</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Name:</span>
              <span className="ml-2 text-gray-900">{name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <span className="ml-2 text-gray-900">{email}</span>
            </div>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Overall Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-sm text-blue-600 font-medium">Total Exams</div>
              <div className="text-2xl font-bold text-blue-900">{stats.totalExams}</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-sm text-green-600 font-medium">Completed</div>
              <div className="text-2xl font-bold text-green-900">{stats.completedExams}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <div className="text-sm text-purple-600 font-medium">Average Score</div>
              <div className="text-2xl font-bold text-purple-900">{stats.averageScore.toFixed(1)}%</div>
            </div>
            <div className="bg-orange-50 p-3 rounded">
              <div className="text-sm text-orange-600 font-medium">Highest Score</div>
              <div className="text-2xl font-bold text-orange-900">{stats.highestScore.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {achievements && Object.values(achievements).some(a => a) && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Achievements Unlocked</h2>
            <div className="flex flex-wrap gap-2">
              {achievements.firstExam && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">🎯 First Step</span>}
              {achievements.perfectScore && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">💯 Perfectionist</span>}
              {achievements.fiveExams && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">📚 Dedicated</span>}
              {achievements.tenExams && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">🔥 Committed</span>}
              {achievements.highAverage && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">⭐ Excellence</span>}
              {achievements.streak && <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">📈 Consistent</span>}
            </div>
          </div>
        )}

        {/* Exam Details Table */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Exam Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Exam</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Score</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Percentage</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions && submissions.length > 0 ? (
                  submissions.map((sub, index) => {
                    const percentage = sub.maxScore > 0 ? ((sub.score / sub.maxScore) * 100).toFixed(1) : 'N/A';
                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-3 py-2">{sub.examTitle || 'N/A'}</td>
                        <td className="border border-gray-300 px-3 py-2">
                          {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center">
                          {sub.score || 0}/{sub.maxScore || 0}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center font-semibold">
                          {percentage}%
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center">
                          <span className={`px-2 py-1 rounded text-xs ${
                            sub.status === 'graded' ? 'bg-green-100 text-green-800' :
                            sub.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                      No exam submissions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 border-t pt-4 mt-6">
          <p>This is an official progress report generated by the Educational Platform</p>
          <p className="mt-1">Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
