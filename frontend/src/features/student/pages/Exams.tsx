import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, Calendar, FileText } from 'lucide-react';
import { fetchApi } from '../../../api/client';
import '../../teacher/exam-editor/examEditor.css';

interface Exam {
  id: number;
  courseId: number;
  title: string;
  description: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  totalMarks: number;
  status: string;
}

const Exams: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await fetchApi('/exams');
        setExams(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load exams');
      } finally {
        setLoading(false);
      }
    };
    loadExams();
  }, []);

  if (loading) return <div className="p-8 text-gray-400 flex justify-center mt-20">Loading exams...</div>;
  if (error) return <div className="p-8 text-red-500 flex justify-center mt-20">Error: {error}</div>;

  return (
    <div className="ee-layout">
      <header className="ee-header px-8">
        <div className="ee-header__main">
          <div className="ee-header__title">
            <h1 className="text-2xl font-bold text-white">My Exams</h1>
            <div className="text-sm text-gray-400 mt-1">
              Available programming exams and contests
            </div>
          </div>
        </div>
      </header>

      <main className="ee-body p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {exams.length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
              <FileText size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-300">No exams available</h3>
              <p className="text-gray-500 mt-2">There are currently no active or upcoming exams for your courses.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {exams.map((exam) => {
                const isEnded = exam.status === 'ENDED';
                const isOngoing = exam.status === 'ONGOING';
                
                return (
                  <div
                    key={exam.id}
                    onClick={() => navigate(`/student/exams/${exam.id}`)}
                    className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 flex flex-col hover:border-teal-500/50 hover:bg-gray-800/80 transition-all shadow-xl cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          {isEnded && <AlertCircle size={16} className="text-gray-500" />}
                          {exam.title}
                        </h3>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                        exam.status === 'PUBLISHED' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' :
                        isOngoing ? 'bg-green-900/50 text-green-400 border border-green-800' :
                        isEnded ? 'bg-gray-800 text-gray-400 border border-gray-700' :
                        'bg-yellow-900/50 text-yellow-500 border border-yellow-800'
                      }`}>
                        {exam.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">
                      {exam.description || 'No description provided.'}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock size={16} className="text-gray-500" />
                        {exam.durationMinutes} mins
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar size={16} className="text-gray-500" />
                        {exam.startTime ? new Date(exam.startTime).toLocaleDateString() : 'Unscheduled'}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-800 flex justify-between items-center mt-auto">
                      <div className="text-sm text-gray-400">
                        <strong className="text-gray-200">{exam.totalMarks}</strong> Total Marks
                      </div>
                      <div className="text-teal-400 text-sm font-bold flex items-center">
                        {isOngoing ? 'Enter Exam →' : 'View Details →'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Exams;
