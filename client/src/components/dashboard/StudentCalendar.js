import { useState } from 'react';

export default function StudentCalendar({ exams }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, firstDay, lastDay };
  };

  const getExamsForDate = (date) => {
    return exams.filter(exam => {
      if (!exam.startsAt) return false;
      const examDate = new Date(exam.startsAt);
      return examDate.getDate() === date.getDate() &&
             examDate.getMonth() === date.getMonth() &&
             examDate.getFullYear() === date.getFullYear();
    });
  };

  const getExamStatus = (exam) => {
    if (!exam.startsAt || !exam.endsAt) return 'available';
    const now = new Date();
    const start = new Date(exam.startsAt);
    const end = new Date(exam.endsAt);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'closed';
    return 'active';
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="bg-white rounded-lg">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <button
          onClick={previousMonth}
          className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {[...Array(startingDayOfWeek)].map((_, index) => (
          <div key={`empty-${index}`} className="h-20 bg-gray-50 rounded"></div>
        ))}

        {/* Days of the month */}
        {[...Array(daysInMonth)].map((_, index) => {
          const day = index + 1;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayExams = getExamsForDate(date);
          const isTodayDate = isToday(day);

          return (
            <div
              key={day}
              className={`h-20 border rounded p-1 text-sm ${
                isTodayDate ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'
              }`}
            >
              <div className={`font-semibold text-xs ${isTodayDate ? 'text-blue-600' : 'text-gray-700'}`}>
                {day}
              </div>
              {dayExams.length > 0 && (
                <div className="mt-1 space-y-1">
                  {dayExams.slice(0, 2).map((exam, idx) => {
                    const status = getExamStatus(exam);
                    return (
                      <div
                        key={idx}
                        className={`text-xs px-1 rounded truncate ${
                          status === 'active' ? 'bg-green-100 text-green-800' :
                          status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-600'
                        }`}
                        title={exam.title}
                      >
                        {exam.title.substring(0, 8)}
                      </div>
                    );
                  })}
                  {dayExams.length > 2 && (
                    <div className="text-xs text-gray-500">+{dayExams.length - 2}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
