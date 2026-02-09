import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import api, { setAccessToken } from '../../lib/api';
import { GradeProgressChart, SubjectPerformanceChart, SkillRadarChart, ComparisonChart } from '../../components/dashboard/StudentPerformanceChart';
import StudentCalendar from '../../components/dashboard/StudentCalendar';
import StudentNotifications from '../../components/dashboard/StudentNotifications';
import AchievementBadges from '../../components/dashboard/AchievementBadges';
import StudyStreak from '../../components/dashboard/StudyStreak';
import GoalSetting from '../../components/dashboard/GoalSetting';
import ProgressReport from '../../components/dashboard/ProgressReport';

export default function StudentDashboard() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState({
    totalExams: 0,
    completedExams: 0,
    inProgressExams: 0,
    averageScore: 0,
    highestScore: 0,
    totalMaterials: 0,
    totalAnnouncements: 0,
  });
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [achievements, setAchievements] = useState({});
  const [chartData, setChartData] = useState({
    gradeProgress: [],
    subjectPerformance: [],
    skillRadar: [],
    comparison: []
  });
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState({});
  const [goals, setGoals] = useState([]);

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
      const [examsRes, progressRes, materialsRes, announcementsRes] = await Promise.all([
        api.get('/student/my-exams'),
        api.get('/student/progress'),
        api.get('/student/materials'),
        api.get('/student/announcements'),
      ]);

      const myExams = examsRes.data.exams || [];
      const mySubmissions = progressRes.data.submissions || [];
      const materials = materialsRes.data.materials || [];
      const announcements = announcementsRes.data.announcements || [];

      setExams(myExams);
      setSubmissions(mySubmissions);

      // Calculate stats
      const completedSubs = mySubmissions.filter(s => s.status === 'submitted' || s.status === 'graded');
      const inProgressSubs = mySubmissions.filter(s => s.status === 'in_progress');
      
      const scores = completedSubs
        .filter(s => s.maxScore > 0)
        .map(s => (s.score / s.maxScore) * 100);
      
      const avgScore = scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0;
      
      const highScore = scores.length > 0 ? Math.max(...scores) : 0;

      setStats({
        totalExams: myExams.length,
        completedExams: completedSubs.length,
        inProgressExams: inProgressSubs.length,
        averageScore: avgScore,
        highestScore: highScore,
        totalMaterials: materials.length,
        totalAnnouncements: announcements.length,
      });

      // Calculate chart data
      calculateChartData(myExams, mySubmissions);

      // Calculate achievements
      calculateAchievements(mySubmissions, avgScore);

      // Generate notifications
      generateNotifications(myExams, mySubmissions, announcements);

      // Calculate streak data
      calculateStreakData(mySubmissions);

      // Load goals from localStorage
      loadGoals();

    } catch (e) {
      console.error('Failed to fetch dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };


  const calculateStreakData = (submissions) => {
    // Calculate activity dates from submissions
    const activityDates = submissions
      .filter(s => s.submittedAt || s.startedAt)
      .map(s => {
        const date = s.submittedAt || s.startedAt;
        return new Date(date.seconds ? date.seconds * 1000 : date);
      })
      .sort((a, b) => b - a);

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Simple streak calculation (can be enhanced)
    const uniqueDates = [...new Set(activityDates.map(d => d.toDateString()))];
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const date = new Date(uniqueDates[i]);
      const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
      }
    }

    longestStreak = Math.max(currentStreak, Math.floor(uniqueDates.length / 2));

    setStreakData({
      currentStreak,
      longestStreak,
      lastActivity: activityDates[0] || null,
      weeklyActivity: activityDates.slice(0, 7),
      totalDaysActive: uniqueDates.length
    });
  };

  const loadGoals = () => {
    try {
      const savedGoals = localStorage.getItem('studentGoals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    } catch (e) {
      console.error('Failed to load goals');
    }
  };

  const handleSetGoal = (newGoal) => {
    const updatedGoals = [...goals, { ...newGoal, id: Date.now(), current: 0 }];
    setGoals(updatedGoals);
    localStorage.setItem('studentGoals', JSON.stringify(updatedGoals));
  };

  const handleUpdateGoal = (goalId, updates) => {
    const updatedGoals = goals.map(g => g.id === goalId ? { ...g, ...updates } : g);
    setGoals(updatedGoals);
    localStorage.setItem('studentGoals', JSON.stringify(updatedGoals));
  };


  const calculateChartData = (exams, submissions) => {
    // Grade Progress over time
    const gradeProgress = submissions
      .filter(s => (s.status === 'submitted' || s.status === 'graded') && s.maxScore > 0)
      .slice(-10) // Last 10 submissions
      .map((sub, index) => ({
        examName: `Exam ${index + 1}`,
        percentage: parseFloat(((sub.score / sub.maxScore) * 100).toFixed(1)),
        score: sub.score,
        maxScore: sub.maxScore
      }));

    // Subject Performance (group by exam type as proxy for subjects)
    const subjectMap = {};
    submissions
      .filter(s => (s.status === 'submitted' || s.status === 'graded') && s.maxScore > 0)
      .forEach(sub => {
        // Use exam title or type to group
        const examInfo = exams.find(e => e.id === sub.examId);
        const subject = examInfo?.subject?.name || examInfo?.type || 'General';
        
        if (!subjectMap[subject]) {
          subjectMap[subject] = { totalScore: 0, count: 0 };
        }
        subjectMap[subject].totalScore += (sub.score / sub.maxScore) * 100;
        subjectMap[subject].count += 1;
      });

    const subjectPerformance = Object.keys(subjectMap).map(subject => ({
      subject: subject.substring(0, 10),
      avgScore: parseFloat((subjectMap[subject].totalScore / subjectMap[subject].count).toFixed(1)),
      examsCount: subjectMap[subject].count
    }));

    // Skill Radar (based on question difficulty or exam types)
    const skillRadar = [
      { skill: 'MCQ', score: calculateSkillScore(submissions, 'mcq') },
      { skill: 'Coding', score: calculateSkillScore(submissions, 'coding') },
      { skill: 'Quiz', score: calculateSkillScore(submissions, 'quiz') },
      { skill: 'Theory', score: calculateSkillScore(submissions, 'theory') },
      { skill: 'Practice', score: calculateSkillScore(submissions, 'practice') },
    ].filter(s => s.score > 0);

    // Comparison with class average (simulated for demo)
    const comparison = submissions
      .filter(s => (s.status === 'submitted' || s.status === 'graded') && s.maxScore > 0)
      .slice(-5)
      .map((sub, index) => {
        const yourScore = (sub.score / sub.maxScore) * 100;
        // Simulate class average (in real app, this would come from backend)
        const classAvg = yourScore > 50 ? yourScore - (Math.random() * 10) : yourScore + (Math.random() * 15);
        
        return {
          examName: `Exam ${index + 1}`,
          yourScore: parseFloat(yourScore.toFixed(1)),
          classAvg: parseFloat(classAvg.toFixed(1))
        };
      });

    setChartData({
      gradeProgress,
      subjectPerformance,
      skillRadar,
      comparison
    });
  };

  const calculateSkillScore = (submissions, type) => {
    const typeSubs = submissions.filter(s => {
      // This is simplified - in real app, you'd match with exam type
      return s.maxScore > 0 && (s.status === 'submitted' || s.status === 'graded');
    });
    
    if (typeSubs.length === 0) return 0;
    
    const avgScore = typeSubs.reduce((acc, s) => acc + (s.score / s.maxScore) * 100, 0) / typeSubs.length;
    return parseFloat(avgScore.toFixed(1));
  };

  const calculateAchievements = (submissions, avgScore) => {
    const completedSubs = submissions.filter(s => s.status === 'submitted' || s.status === 'graded');
    
    const hasPerfectScore = completedSubs.some(s => 
      s.maxScore > 0 && (s.score / s.maxScore) * 100 === 100
    );

    // Check for improving streak
    let hasStreak = false;
    if (completedSubs.length >= 3) {
      const lastThree = completedSubs.slice(-3);
      const scores = lastThree.map(s => s.maxScore > 0 ? (s.score / s.maxScore) * 100 : 0);
      hasStreak = scores[0] < scores[1] && scores[1] < scores[2];
    }

    setAchievements({
      firstExam: completedSubs.length >= 1,
      perfectScore: hasPerfectScore,
      fiveExams: completedSubs.length >= 5,
      tenExams: completedSubs.length >= 10,
      highAverage: avgScore >= 85,
      streak: hasStreak,
      earlyBird: false, // Can be calculated based on exam start times
      ninetyPlus: completedSubs.filter(s => s.maxScore > 0 && (s.score / s.maxScore) * 100 >= 90).length >= 3,
      twentyExams: completedSubs.length >= 20,
      weekStreak: (streakData.currentStreak || 0) >= 7,
      monthStreak: (streakData.currentStreak || 0) >= 30,
      speedDemon: false, // Would need exam completion time data
      comebackKid: hasStreak, // Reusing streak logic for simplicity
      nightOwl: false, // Would need submission time data
      allSubjects: false // Would need subject-specific data
    });
  };

  const generateNotifications = (exams, submissions, announcements) => {
    const notifs = [];
    const now = new Date();

    // Upcoming exams (next 7 days)
    const upcomingExams = exams.filter(exam => {
      if (!exam.startsAt) return false;
      const startDate = new Date(exam.startsAt);
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return startDate > now && startDate <= sevenDaysFromNow;
    });

    upcomingExams.forEach(exam => {
      const startDate = new Date(exam.startsAt);
      const daysUntil = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
      
      notifs.push({
        type: 'exam',
        title: `Upcoming: ${exam.title}`,
        message: `Starts in ${daysUntil} day${daysUntil > 1 ? 's' : ''} on ${startDate.toLocaleDateString()}`,
        time: 'Upcoming',
        action: {
          label: 'View Details',
          onClick: () => router.push(`/student/exams/${exam.id}`)
        }
      });
    });

    // Active exams
    const activeExams = exams.filter(exam => {
      if (!exam.startsAt || !exam.endsAt) return false;
      const start = new Date(exam.startsAt);
      const end = new Date(exam.endsAt);
      return now >= start && now <= end;
    });

    if (activeExams.length > 0) {
      notifs.push({
        type: 'deadline',
        title: `${activeExams.length} Active Exam${activeExams.length > 1 ? 's' : ''}`,
        message: 'You have exams available to take right now!',
        time: 'Active',
        action: {
          label: 'Start Now',
          onClick: () => router.push('/student/exams')
        }
      });
    }

    // Recent announcements
    const recentAnnouncements = announcements.slice(0, 2);
    recentAnnouncements.forEach(announcement => {
      notifs.push({
        type: 'announcement',
        title: announcement.title || 'New Announcement',
        message: announcement.content?.substring(0, 80) + (announcement.content?.length > 80 ? '...' : ''),
        time: 'Recent',
        action: {
          label: 'Read More',
          onClick: () => router.push('/student/announcements')
        }
      });
    });

    // Grade updates
    const recentGrades = submissions
      .filter(s => s.status === 'graded')
      .slice(0, 2);
    
    recentGrades.forEach(sub => {
      const percentage = sub.maxScore > 0 ? (sub.score / sub.maxScore) * 100 : 0;
      notifs.push({
        type: 'grade',
        title: 'Exam Graded',
        message: `Your exam has been graded: ${sub.score}/${sub.maxScore} (${percentage.toFixed(1)}%)`,
        time: 'New',
        action: {
          label: 'View Results',
          onClick: () => router.push('/student/progress')
        }
      });
    });

    // Achievement unlocked
    const recentlyUnlocked = [];
    if (achievements.perfectScore && !localStorage.getItem('achievement_perfect_shown')) {
      recentlyUnlocked.push('Perfectionist');
      localStorage.setItem('achievement_perfect_shown', 'true');
    }
    
    recentlyUnlocked.forEach(achievement => {
      notifs.push({
        type: 'achievement',
        title: '🏆 Achievement Unlocked!',
        message: `Congratulations! You've earned the "${achievement}" badge!`,
        time: 'New'
      });
    });

    // Motivational message if nothing else
    if (notifs.length === 0) {
      notifs.push({
        type: 'info',
        title: 'Keep Learning!',
        message: 'Check out available exams and study materials to boost your performance.',
        time: 'Today'
      });
    }

    setNotifications(notifs.slice(0, 5)); // Show top 5 notifications
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

  const getGradeEmoji = (percentage) => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '⭐';
    if (percentage >= 70) return '👍';
    if (percentage >= 60) return '📝';
    return '📚';
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Loading your dashboard...</div>
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
        <Card title="Student Dashboard">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900">Welcome back, {me.name}! 🎓</h2>
            <p className="text-gray-600 mt-1">Ready to learn and excel today?</p>
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{stats.totalExams}</div>
              <div className="text-sm text-gray-600 mt-1">Enrolled Exams</div>
              <div className="text-xs text-gray-500 mt-2">
                {stats.completedExams} completed
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">
                {stats.averageScore.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Average Score</div>
              <div className="text-xs text-gray-500 mt-2">
                {getGradeEmoji(stats.averageScore)}
                {stats.averageScore >= 80 ? ' Excellent!' : stats.averageScore >= 60 ? ' Good job!' : ' Keep going!'}
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">
                {stats.highestScore.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Highest Score</div>
              <div className="text-xs text-gray-500 mt-2">
                {stats.highestScore === 100 ? '🎯 Perfect!' : 'Best performance'}
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">{stats.inProgressExams}</div>
              <div className="text-sm text-gray-600 mt-1">In Progress</div>
              <div className="text-xs text-gray-500 mt-2">
                {stats.inProgressExams > 0 ? 'Finish them!' : 'All caught up'}
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => router.push('/student/exams')}
              className="flex flex-col items-center justify-center py-6"
            >
              <span className="text-2xl mb-2">📝</span>
              <span className="text-sm">Take Exam</span>
            </Button>
            <Button 
              onClick={() => router.push('/student/progress')}
              className="flex flex-col items-center justify-center py-6"
              variant="secondary"
            >
              <span className="text-2xl mb-2">📊</span>
              <span className="text-sm">View Progress</span>
            </Button>
            <Button 
              onClick={() => router.push('/student/materials')}
              className="flex flex-col items-center justify-center py-6"
              variant="secondary"
            >
              <span className="text-2xl mb-2">📚</span>
              <span className="text-sm">Study Materials</span>
            </Button>
            <Button 
              onClick={() => router.push('/student/join-exam')}
              className="flex flex-col items-center justify-center py-6"
              variant="secondary"
            >
              <span className="text-2xl mb-2">➕</span>
              <span className="text-sm">Join Exam</span>
            </Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card title="📬 Notifications">
          <StudentNotifications notifications={notifications} />
        </Card>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="📈 Your Grade Progress">
            <GradeProgressChart data={chartData.gradeProgress} />
          </Card>

          <Card title="📊 Subject Performance">
            <SubjectPerformanceChart data={chartData.subjectPerformance} />
          </Card>
        </div>

        {/* Skill Radar & Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="🎯 Skill Analysis">
            <SkillRadarChart data={chartData.skillRadar} />
          </Card>

          <Card title="📉 You vs Class Average">
            <ComparisonChart data={chartData.comparison} />
          </Card>
        </div>

        {/* Study Streak */}
        <Card title="🔥 Study Streak">
          <StudyStreak streakData={streakData} />
        </Card>

        {/* Goals */}
        <Card title="🎯 My Goals">
          <GoalSetting 
            goals={goals} 
            onSetGoal={handleSetGoal} 
            onUpdateGoal={handleUpdateGoal} 
          />
        </Card>

        {/* Achievements */}
        <Card title="🏆 Achievements & Badges">
          <AchievementBadges achievements={achievements} />
        </Card>

        {/* Calendar */}
        <Card title="📅 Exam Schedule">
          <StudentCalendar exams={exams} />
        </Card>

        {/* Progress Report */}
        <Card title="📄 Progress Report">
          <ProgressReport 
            studentData={{
              name: me?.name,
              email: me?.email,
              stats,
              submissions,
              achievements
            }}
          />
        </Card>

        {/* Recent Exams */}
        <Card 
          title="Recent Exams"
          actions={
            <Button 
              variant="secondary" 
              onClick={() => router.push('/student/exams')}
              className="text-sm"
            >
              View All
            </Button>
          }
        >
          {exams.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No exams enrolled yet</p>
              <Button onClick={() => router.push('/student/join-exam')}>
                Join Your First Exam
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {exams.slice(0, 5).map((exam) => {
                const status = getExamStatus(exam);
                const submission = submissions.find(s => s.examId === exam.id);
                
                return (
                  <div 
                    key={exam.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/student/exams/${exam.id}`)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{exam.title}</div>
                      <div className="text-sm text-gray-600">
                        {exam.type?.toUpperCase()} • {exam.durationMinutes} min • {exam.totalMarks} marks
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {submission && submission.status === 'submitted' && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        status === 'Active' ? 'bg-green-100 text-green-800' :
                        status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
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
      </div>
    </Layout>
  );
}
