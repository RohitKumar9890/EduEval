import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import api, { setAccessToken } from '../../lib/api';
import { toast } from 'react-toastify';

export default function StudentAnnouncements() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setAccessToken(token);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      // Fetch all announcements
      const announcementsRes = await api.get('/student/announcements');
      setAnnouncements(announcementsRes.data.announcements || []);
      
      // Get unique subjects from announcements
      const uniqueSubjects = Array.from(
        new Set(announcementsRes.data.announcements?.map(a => a.subjectId).filter(Boolean))
      );
      
      // Fetch subject details
      if (uniqueSubjects.length > 0) {
        const subjectPromises = uniqueSubjects.map(id => 
          api.get(`/student/subjects/${id}`).catch(() => null)
        );
        const subjectResults = await Promise.all(subjectPromises);
        const validSubjects = subjectResults
          .filter(res => res?.data?.subject)
          .map(res => res.data.subject);
        setSubjects(validSubjects);
      }
    } catch (e) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId || s._id === subjectId);
    return subject ? `${subject.name} (${subject.code})` : 'Unknown Subject';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'normal':
        return '🔵';
      case 'low':
        return '⚪';
      default:
        return '🔵';
    }
  };

  const filteredAnnouncements = selectedSubject === 'all' 
    ? announcements 
    : announcements.filter(a => a.subjectId === selectedSubject);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card title="Announcements">
        {/* Filter by subject */}
        {subjects.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Subject</label>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id || subject._id} value={subject.id || subject._id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>
        )}

        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <p className="mt-2 text-gray-500">No announcements yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id || announcement._id}
                className={`border-2 rounded-lg p-5 transition-all hover:shadow-md ${
                  announcement.priority === 'high' ? 'border-red-300 bg-red-50' :
                  announcement.priority === 'normal' ? 'border-blue-300 bg-blue-50' :
                  'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-2xl">{getPriorityIcon(announcement.priority)}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-600">
                          {getSubjectName(announcement.subjectId)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(announcement.priority)}`}>
                          {announcement.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {announcement.createdAt && (
                      <span>
                        {new Date(
                          announcement.createdAt.seconds 
                            ? announcement.createdAt.seconds * 1000 
                            : announcement.createdAt
                        ).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>

                {announcement.createdBy && (
                  <div className="mt-4 pt-3 border-t border-gray-300">
                    <p className="text-xs text-gray-500">
                      Posted by Faculty
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </Layout>
  );
}
