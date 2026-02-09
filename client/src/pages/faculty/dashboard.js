import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import api, { setAccessToken } from '../../lib/api';
import { ScoreDistributionChart, ExamCompletionChart, TrendChart } from '../../components/dashboard/PerformanceChart';
import CalendarView from '../../components/dashboard/CalendarView';
import NotificationsPanel from '../../components/dashboard/NotificationsPanel';
import EngagementMetrics from '../../components/dashboard/EngagementMetrics';

export default function FacultyDashboard() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState({
    totalExams: 0,
    publishedExams: 0,
    draftExams: 0,
    totalSubjects: 0,
    totalSubmissions: 0,
    pendingGrading: 0,
    totalMaterials: 0,
    totalAnnouncements: 0,
  });
  const [recentExams, setRecentExams] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    scoreDistribution: [],
    examCompletion: [],
    trends: []
  });
  const [engagementMetrics, setEngagementMetrics] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setAccessToken(token);
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user info
      const meRes = await api.get('/auth/me');
      setMe(meRes.data.user);

      // Fetch all data in parallel
      const [examsRes, subjectsRes, materialsRes, announcementsRes] = await Promise.all([
        api.get('/faculty/exams'),
        api.get('/faculty/subjects'),
        api.get('/faculty/materials'),
        api.get('/faculty/announcements'),
      ]);

      const exams = examsRes.data.exams || [];
      const subjects = subjectsRes.data.subjects || [];
      const materials = materialsRes.data.materials || [];
      const announcements = announcementsRes.data.announcements || [];

      // Calculate stats
      const publishedExams = exams.filter(e => e.isPublished);
      const draftExams = exams.filter(e => !e.isPublished);

      // Get submissions for all exams
      let allSubmissions = [];
      let pendingCount = 0;
      
      for (const exam of exams) {
        try {
          const subRes = await api.get(`/faculty/submissions/${exam.id}`);
          const examSubmissions = subRes.data.submissions || [];
          allSubmissions = [...allSubmissions, ...examSubmissions.map(s => ({ ...s, examTitle: exam.title }))];
          pendingCount += examSubmissions.filter(s => s.status === 'submitted' && !s.score).length;
        } catch (e) {
          console.error(`Failed to fetch submissions for exam ${exam.id}`);
        }
      }

      setStats({
        totalExams: exams.length,
        publishedExams: publishedExams.length,
        draftExams: draftExams.length,
        totalSubjects: subjects.length,
        totalSubmissions: allSubmissions.length,
        pendingGrading: pendingCount,
        totalMaterials: materials.length,
        totalAnnouncements: announcements.length,
      });

      // Set recent exams (top 5)
      setRecentExams(exams.slice(0, 5));

      // Set recent submissions (top 5)
      const sortedSubmissions = allSubmissions.sort((a, b) => 
        new Date(b.submittedAt || b.startedAt) - new Date(a.submittedAt || a.startedAt)
      );
      setRecentSubmissions(sortedSubmissions.slice(0, 5));

      // Calculate chart data
      calculateChartData(exams, allSubmissions);
      
      // Calculate engagement metrics
      calculateEngagementMetrics(allSubmissions, exams);
      
      // Generate notifications
      generateNotifications(exams, allSubmissions, pendingCount);
      
      // Get upcoming exams
      const upcoming = exams.filter(exam => {
        if (!exam.startsAt) return false;
        const startDate = new Date(exam.startsAt);
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return startDate > now && startDate <= thirtyDaysFromNow;
      });
      setUpcomingExams(upcoming);

    } catch (e) {
      console.error('Failed to fetch dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  const calculateChartData = (exams, submissions) => {
    // Score Distribution
    const scoreRanges = {
      '0-25%': 0,
      '26-50%': 0,
      '51-75%': 0,
      '76-100%': 0
    };

    submissions.forEach(sub => {
      if (sub.status === 'submitted' && sub.score !== undefined && sub.maxScore) {
        const percentage = (sub.score / sub.maxScore) * 100;
        if (percentage <= 25) scoreRanges['0-25%']++;
        else if (percentage <= 50) scoreRanges['26-50%']++;
        else if (percentage <= 75) scoreRanges['51-75%']++;
        else scoreRanges['76-100%']++;
      }
    });

    const scoreDistribution = Object.keys(scoreRanges).map(range => ({
      range,
      count: scoreRanges[range]
    }));

    // Exam Completion
    const completed = submissions.filter(s => s.status === 'submitted').length;
    const inProgress = submissions.filter(s => s.status === 'in_progress').length;
    const notStarted = Math.max(0, exams.reduce((acc, exam) => acc + (exam.enrolledStudents?.length || 0), 0) - submissions.length);

    const examCompletion = [
      { name: 'Completed', value: completed },
      { name: 'In Progress', value: inProgress },
      { name: 'Not Started', value: notStarted }
    ].filter(item => item.value > 0);

    // Trends (last 5 exams)
    const examTrends = exams.slice(0, 5).reverse().map(exam => {
      const examSubs = submissions.filter(s => s.examId === exam.id);
      const avgScore = examSubs.length > 0
        ? examSubs.reduce((acc, s) => acc + ((s.score || 0) / (s.maxScore || 1)) * 100, 0) / examSubs.length
        : 0;
      
      return {
        name: exam.title.substring(0, 15) + (exam.title.length > 15 ? '...' : ''),
        avgScore: parseFloat(avgScore.toFixed(1)),
        submissions: examSubs.length
      };
    });

    setChartData({
      scoreDistribution,
      examCompletion,
      trends: examTrends
    });
  };

  const calculateEngagementMetrics = (submissions, exams) => {
    const uniqueStudents = new Set(submissions.map(s => s.studentId));
    const totalEnrolled = exams.reduce((acc, exam) => acc + (exam.enrolledStudents?.length || 0), 0);
    
    const completedSubmissions = submissions.filter(s => s.status === 'submitted');
    const avgScore = completedSubmissions.length > 0
      ? completedSubmissions.reduce((acc, s) => acc + ((s.score || 0) / (s.maxScore || 1)) * 100, 0) / completedSubmissions.length
      : 0;

    const submissionRate = totalEnrolled > 0 ? (completedSubmissions.length / totalEnrolled) * 100 : 0;

    // Calculate average completion time
    const completionTimes = completedSubmissions
      .filter(s => s.startedAt && s.submittedAt)
      .map(s => {
        const start = new Date(s.startedAt);
        const end = new Date(s.submittedAt);
        return (end - start) / (1000 * 60); // minutes
      });
    
    const avgCompletionTime = completionTimes.length > 0
      ? Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length)
      : 0;

    // Top performers
    const studentScores = {};
    completedSubmissions.forEach(sub => {
      if (!studentScores[sub.studentId]) {
        studentScores[sub.studentId] = {
          name: sub.studentName,
          totalScore: 0,
          count: 0
        };
      }
      const percentage = (sub.score || 0) / (sub.maxScore || 1) * 100;
      studentScores[sub.studentId].totalScore += percentage;
      studentScores[sub.studentId].count += 1;
    });

    const topPerformers = Object.values(studentScores)
      .map(s => ({
        name: s.name,
        score: (s.totalScore / s.count).toFixed(1)
      }))
      .sort((a, b) => b.score - a.score);

    // Students needing attention (low scores or no submissions)
    const needsAttention = Object.values(studentScores)
      .map(s => ({
        name: s.name,
        avgScore: s.totalScore / s.count,
        reason: s.totalScore / s.count < 50 ? 'Low score' : 'Needs support'
      }))
      .filter(s => s.avgScore < 60)
      .sort((a, b) => a.avgScore - b.avgScore);

    setEngagementMetrics({
      totalStudents: Math.max(totalEnrolled, uniqueStudents.size),
      activeStudents: uniqueStudents.size,
      averageScore: avgScore,
      submissionRate,
      averageCompletionTime: avgCompletionTime,
      topPerformers,
      needsAttention
    });
  };

  const generateNotifications = (exams, submissions, pendingCount) => {
    const notifs = [];

    // Pending grading notification
    if (pendingCount > 0) {
      notifs.push({
        type: 'warning',
        title: 'Pending Submissions',
        message: `You have ${pendingCount} submission${pendingCount > 1 ? 's' : ''} waiting to be graded.`,
        time: 'Now',
        action: {
          label: 'Review',
          onClick: () => router.push('/faculty/exams')
        }
      });
    }

    // Upcoming exams
    const upcoming = exams.filter(exam => {
      if (!exam.startsAt) return false;
      const startDate = new Date(exam.startsAt);
      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      return startDate > now && startDate <= threeDaysFromNow;
    });

    if (upcoming.length > 0) {
      notifs.push({
        type: 'info',
        title: 'Upcoming Exams',
        message: `${upcoming.length} exam${upcoming.length > 1 ? 's' : ''} scheduled in the next 3 days.`,
        time: 'Next 3 days'
      });
    }

    // Draft exams reminder
    const drafts = exams.filter(e => !e.isPublished);
    if (drafts.length > 0) {
      notifs.push({
        type: 'info',
        title: 'Draft Exams',
        message: `You have ${drafts.length} unpublished exam${drafts.length > 1 ? 's' : ''}.`,
        action: {
          label: 'View',
          onClick: () => router.push('/faculty/exams')
        }
      });
    }

    // Low engagement alert
    const completedSubmissions = submissions.filter(s => s.status === 'submitted');
    const totalPossible = exams.reduce((acc, exam) => acc + (exam.enrolledStudents?.length || 0), 0);
    if (totalPossible > 0 && (completedSubmissions.length / totalPossible) < 0.5) {
      notifs.push({
        type: 'warning',
        title: 'Low Student Engagement',
        message: 'Less than 50% of students have completed their exams. Consider sending a reminder.',
        time: 'Action needed'
      });
    }

    // Success message if all is well
    if (notifs.length === 0) {
      notifs.push({
        type: 'success',
        title: 'All Systems Go!',
        message: 'Everything is running smoothly. Keep up the great work!',
        time: 'Today'
      });
    }

    setNotifications(notifs);
  };

  const getExamStatus = (exam) => {
    if (!exam.startsAt || !exam.endsAt) return 'Available';
    const now = new Date();
    const start = new Date(exam.startsAt);
    const end = new Date(exam.endsAt);
    
    if (now < start) return 'Upcoming';
    if (now > end) return 'Closed';
    return 'Active';
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Loading...</div>
      </Layout>
    );
  }

  if (!me) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card title="Faculty Dashboard">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900">Welcome back, {me.name}! 👨‍🏫</h2>
            <p className="text-gray-600 mt-1">Here's what's happening with your courses today.</p>
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{stats.totalExams}</div>
              <div className="text-sm text-gray-600 mt-1">Total Exams</div>
              <div className="text-xs text-gray-500 mt-2">
                {stats.publishedExams} Published • {stats.draftExams} Draft
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{stats.totalSubjects}</div>
              <div className="text-sm text-gray-600 mt-1">Subjects Teaching</div>
              <div className="mt-3">
                <Button 
                  variant="secondary" 
                  onClick={() => router.push('/faculty/exams')}
                  className="text-xs"
                >
                  Manage
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">{stats.totalSubmissions}</div>
              <div className="text-sm text-gray-600 mt-1">Total Submissions</div>
              <div className="text-xs text-gray-500 mt-2">
                {stats.pendingGrading > 0 && (
                  <span className="text-orange-600 font-semibold">
                    {stats.pendingGrading} Pending Review
                  </span>
                )}
                {stats.pendingGrading === 0 && (
                  <span className="text-green-600">All Graded ✓</span>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">{stats.totalMaterials}</div>
              <div className="text-sm text-gray-600 mt-1">Study Materials</div>
              <div className="text-xs text-gray-500 mt-2">
                {stats.totalAnnouncements} Announcements
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => router.push('/faculty/exams')}
              className="flex flex-col items-center justify-center py-6"
            >
              <span className="text-2xl mb-2">📝</span>
              <span className="text-sm">Create Exam</span>
            </Button>
            <Button 
              onClick={() => router.push('/faculty/materials')}
              className="flex flex-col items-center justify-center py-6"
              variant="secondary"
            >
              <span className="text-2xl mb-2">📚</span>
              <span className="text-sm">Upload Material</span>
            </Button>
            <Button 
              onClick={() => router.push('/faculty/announcements')}
              className="flex flex-col items-center justify-center py-6"
              variant="secondary"
            >
              <span className="text-2xl mb-2">📢</span>
              <span className="text-sm">Post Announcement</span>
            </Button>
            <Button 
              onClick={() => router.push('/faculty/exams')}
              className="flex flex-col items-center justify-center py-6"
              variant="secondary"
            >
              <span className="text-2xl mb-2">📊</span>
              <span className="text-sm">View Analytics</span>
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Exams */}
          <Card 
            title="Recent Exams"
            actions={
              <Button 
                variant="secondary" 
                onClick={() => router.push('/faculty/exams')}
                className="text-sm"
              >
                View All
              </Button>
            }
          >
            {recentExams.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No exams created yet</p>
            ) : (
              <div className="space-y-3">
                {recentExams.map((exam) => {
                  const status = getExamStatus(exam);
                  return (
                    <div 
                      key={exam.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => router.push(`/faculty/exams/${exam.id}`)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{exam.title}</div>
                        <div className="text-sm text-gray-600">
                          {exam.type.toUpperCase()} • {exam.durationMinutes} min • {exam.totalMarks} marks
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          exam.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {exam.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          status === 'Active' ? 'bg-blue-100 text-blue-800' :
                          status === 'Upcoming' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recent Submissions */}
          <Card 
            title="Recent Submissions"
            actions={
              stats.pendingGrading > 0 && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                  {stats.pendingGrading} Pending
                </span>
              )
            }
          >
            {recentSubmissions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No submissions yet</p>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((submission) => (
                  <div 
                    key={submission.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/faculty/submissions/${submission.id}`)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{submission.studentName}</div>
                      <div className="text-sm text-gray-600">{submission.examTitle}</div>
                      <div className="text-xs text-gray-500">
                        {submission.submittedAt ? 
                          new Date(submission.submittedAt).toLocaleString() : 
                          'In Progress'
                        }
                      </div>
                    </div>
                    <div className="text-right">
                      {submission.status === 'submitted' && submission.score !== undefined ? (
                        <div className="text-lg font-bold text-green-600">
                          {submission.score}/{submission.maxScore}
                        </div>
                      ) : (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          submission.status === 'submitted' ? 'bg-orange-100 text-orange-800' :
                          submission.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {submission.status === 'submitted' ? 'Needs Grading' :
                           submission.status === 'in_progress' ? 'In Progress' :
                           'Graded'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Notifications Panel */}
        <Card title="📢 Notifications & Alerts">
          <NotificationsPanel notifications={notifications} />
        </Card>

        {/* Student Engagement Metrics */}
        <Card title="📊 Student Engagement Overview">
          <EngagementMetrics metrics={engagementMetrics} />
        </Card>

        {/* Performance Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Score Distribution">
            <ScoreDistributionChart data={chartData.scoreDistribution} />
          </Card>
          
          <Card title="Exam Completion Status">
            <ExamCompletionChart data={chartData.examCompletion} />
          </Card>
        </div>

        {/* Performance Trends */}
        <Card title="📈 Performance Trends (Recent Exams)">
          <TrendChart data={chartData.trends} />
        </Card>

        {/* Calendar View */}
        <Card title="📅 Exam Calendar">
          <CalendarView exams={upcomingExams} />
          {upcomingExams.length === 0 && (
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">No exams scheduled in the next 30 days</p>
              <Button 
                onClick={() => router.push('/faculty/exams')}
                className="mt-3"
                variant="secondary"
              >
                Schedule an Exam
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
