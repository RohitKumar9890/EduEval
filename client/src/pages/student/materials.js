import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import api, { setAccessToken } from '../../lib/api';
import { toast } from 'react-toastify';

export default function StudentMaterials() {
  const router = useRouter();
  const [materials, setMaterials] = useState([]);
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
      // Fetch all materials (we'll need to add a student endpoint)
      const materialsRes = await api.get('/student/materials');
      setMaterials(materialsRes.data.materials || []);
      
      // Get unique subjects from materials
      const uniqueSubjects = Array.from(
        new Set(materialsRes.data.materials?.map(m => m.subjectId).filter(Boolean))
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
      toast.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId || s._id === subjectId);
    return subject ? `${subject.name} (${subject.code})` : 'Unknown Subject';
  };

  const filteredMaterials = selectedSubject === 'all' 
    ? materials 
    : materials.filter(m => m.subjectId === selectedSubject);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card title="Course Materials">
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

        {filteredMaterials.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-gray-500">No materials available yet</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMaterials.map((material) => (
              <div
                key={material.id || material._id}
                className="border-2 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{material.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">{getSubjectName(material.subjectId)}</p>
                  </div>
                  <div className="ml-2">
                    {material.fileType === 'pdf' && (
                      <svg className="h-8 w-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {material.fileType === 'video' && (
                      <svg className="h-8 w-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    )}
                    {(!material.fileType || material.fileType === 'url') && (
                      <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                {material.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{material.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  {material.fileSize && (
                    <span>{(material.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  )}
                  {material.createdAt && (
                    <span>
                      {new Date(
                        material.createdAt.seconds 
                          ? material.createdAt.seconds * 1000 
                          : material.createdAt
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Material
                </a>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Layout>
  );
}
