import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function GradeProgressChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Complete some exams to see your progress!</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="examName" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="percentage" 
          stroke="#3b82f6" 
          strokeWidth={3}
          name="Score (%)" 
          dot={{ fill: '#3b82f6', r: 5 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SubjectPerformanceChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No subject data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="subject" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="avgScore" name="Average Score (%)" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SkillRadarChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Keep taking exams to build your skill profile!</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="skill" />
        <PolarRadiusAxis domain={[0, 100]} />
        <Radar 
          name="Your Performance" 
          dataKey="score" 
          stroke="#3b82f6" 
          fill="#3b82f6" 
          fillOpacity={0.6} 
        />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function ComparisonChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Take more exams to see comparisons!</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="examName" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="yourScore" fill="#3b82f6" name="Your Score (%)" />
        <Bar dataKey="classAvg" fill="#10b981" name="Class Average (%)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
