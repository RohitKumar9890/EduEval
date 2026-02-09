import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export function ScoreDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#3b82f6" name="Students" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ExamCompletionChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="avgScore" stroke="#3b82f6" name="Average Score" strokeWidth={2} />
        <Line type="monotone" dataKey="submissions" stroke="#10b981" name="Submissions" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
