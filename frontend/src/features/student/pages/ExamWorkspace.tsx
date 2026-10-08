import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchApi, API_BASE_URL, getAuthToken } from '../../../api/client';
import { getMonacoLanguage } from '../../../components/ui';
import Editor from '@monaco-editor/react';
import { Clock, CheckCircle2, Download, Save, ChevronRight, AlertTriangle } from 'lucide-react';
import '../../teacher/exam-editor/examEditor.css';

interface ExamQuestion {
  id: number;
  questionNumber: number;
  title: string;
  problemStatement: string;
  inputDescription: string;
  outputDescription: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  marks: number;
  allowedLanguage?: string;
  testCasesJson?: string;
}

const ExamWorkspace: React.FC = () => {
  const { id: examId, attemptId } = useParams<{ id: string; attemptId: string }>();
  const [exam, setExam] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [codeMap, setCodeMap] = useState<Record<number, { answerId?: number; code: string; language: string }>>({});
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (exam && exam.status === 'ONGOING' && exam.endTime) {
      if (attempt?.status === 'SUBMITTED') return;
      const updateTimer = () => {
        const endTimeMs = new Date(exam.endTime).getTime();
        const diffSeconds = Math.floor((endTimeMs - Date.now()) / 1000);
        setRemainingSeconds(diffSeconds > 0 ? diffSeconds : 0);
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    } else {
      setRemainingSeconds(null);
    }
  }, [exam, attempt?.status]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Time expired";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        const [examData, attemptData, questionsData, answersData] = await Promise.all([
          fetchApi(`/exams/${examId}`),
          fetchApi(`/exam-attempts/${attemptId}`),
          fetchApi(`/exams/${examId}/questions`),
          fetchApi(`/exam-attempts/${attemptId}/answers`),
        ]);
        
        setExam(examData);
        setAttempt(attemptData);
        setQuestions(questionsData);
        
        const newCodeMap: Record<number, { answerId?: number; code: string; language: string }> = {};
        questionsData.forEach((q: ExamQuestion) => {
          const ans = answersData.find((a: any) => a.questionId === q.id);
          if (ans) {
            newCodeMap[q.id] = { answerId: ans.id, code: ans.code || '', language: ans.language };
          } else {
            newCodeMap[q.id] = { code: '', language: q.allowedLanguage || 'JAVA' };
          }
        });
        setCodeMap(newCodeMap);
        
        if (questionsData.length > 0) setActiveQuestionId(questionsData[0].id);
      } catch (err: any) {
        setError(err.message || 'Failed to load workspace data');
      } finally {
        setLoading(false);
      }
    };
    loadWorkspace();
  }, [examId, attemptId]);

  const handleEditorChange = (value: string | undefined) => {
    if (activeQuestionId !== null && value !== undefined) {
      setCodeMap(prev => ({
        ...prev,
        [activeQuestionId]: { ...prev[activeQuestionId], code: value }
      }));
    }
  };

  const handleSaveCode = async () => {
    if (!activeQuestionId) return;
    const currentData = codeMap[activeQuestionId];
    if (!currentData) return;

    setSaveStatus('Saving...');
    try {
      if (currentData.answerId) {
        await fetchApi(`/exam-answers/${currentData.answerId}`, {
          method: 'PUT',
          body: JSON.stringify({ code: currentData.code, language: currentData.language })
        });
        setSaveStatus('Saved');
      } else {
        const newAnswer = await fetchApi(`/exam-attempts/${attemptId}/answers`, {
          method: 'POST',
          body: JSON.stringify({ questionId: activeQuestionId, code: currentData.code, language: currentData.language })
        });
        setCodeMap(prev => ({
          ...prev,
          [activeQuestionId]: { ...prev[activeQuestionId], answerId: newAnswer.id }
        }));
        setSaveStatus('Saved');
      }
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('Save failed');
    }
  };

  const downloadHelper = async (endpoint: string) => {
    const token = getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error('Download failed');
      const disposition = res.headers.get('content-disposition');
      let filename = 'download';
      if (disposition && disposition.indexOf('filename=') !== -1) {
        const matches = /filename="([^"]+)"/.exec(disposition);
        if (matches != null && matches[1]) filename = matches[1];
      }
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error(err);
      alert('Failed to download file');
    }
  };

  const isSubmitted = attempt?.status === 'SUBMITTED';
  const isTimeExpired = remainingSeconds === 0;
  const isReadOnly = isSubmitted || isTimeExpired;

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitExam = () => {
    if (isReadOnly) return;
    setShowSubmitModal(true);
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    try {
      const updatedAttempt = await fetchApi(`/exam-attempts/${attemptId}/submit`, { method: 'POST' });
      setAttempt(updatedAttempt);
      setShowSubmitModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-400 flex justify-center mt-20">Loading workspace...</div>;
  if (error) return <div className="p-8 text-red-500 flex justify-center mt-20">Error: {error}</div>;

  const activeQuestion = questions.find((q) => q.id === activeQuestionId);

  return (
    <div className="h-screen flex flex-col bg-[#0f111a] text-gray-300 font-sans overflow-hidden">
      
      {/* ─── Top Navbar ────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 h-16 bg-[#161925] border-b border-[#252a3d] px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-white font-bold text-lg leading-tight">{exam?.title || 'Exam'}</h1>
            <div className="text-xs text-gray-500 font-mono">Attempt: {attempt?.id}</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {isSubmitted ? (
            <div className="flex items-center gap-2 text-green-400 font-bold bg-green-400/10 px-4 py-2 rounded-lg border border-green-400/20">
              <CheckCircle2 size={18} />
              Exam Submitted
            </div>
          ) : remainingSeconds !== null ? (
            <div className={`flex items-center gap-2 font-mono text-lg font-bold px-4 py-1.5 rounded-lg border ${
              remainingSeconds === 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
              remainingSeconds < 300 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 animate-pulse' : 
              'bg-[#1e2233] text-teal-400 border-[#2d334a]'
            }`}>
              <Clock size={18} />
              {remainingSeconds === 0 ? 'Time expired' : formatTime(remainingSeconds)}
            </div>
          ) : null}

          <div className="w-px h-8 bg-[#252a3d]" />

          <button
            onClick={() => downloadHelper(`/exam-attempts/${attemptId}/download-all`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold"
          >
            <Download size={16} />
            Download All
          </button>
          
          <button
            onClick={handleSubmitExam}
            disabled={isReadOnly}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
              isReadOnly 
                ? 'bg-[#1e2233] text-gray-500 cursor-not-allowed' 
                : 'bg-teal-600 hover:bg-teal-500 text-white shadow-[0_0_15px_rgba(13,148,136,0.3)]'
            }`}
          >
            {isSubmitted ? 'Submitted' : 'Submit Exam'}
          </button>
        </div>
      </header>

      {/* ─── Main Workspace ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Column: Questions List */}
        <div className="w-64 flex-shrink-0 bg-[#12141e] border-r border-[#252a3d] flex flex-col z-10">
          <div className="p-4 border-b border-[#252a3d]">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Problem List</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {questions.map((q) => {
              const isActive = q.id === activeQuestionId;
              const hasCode = (codeMap[q.id]?.code || '').trim().length > 0;
              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`w-full text-left flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30 font-bold shadow-inner' 
                      : 'text-gray-400 hover:bg-[#1a1d2d] border border-transparent hover:text-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs opacity-50 font-mono">
                      {q.questionNumber.toString().padStart(2, '0')}
                    </span>
                    <span className="truncate">{q.title}</span>
                  </span>
                  {hasCode && !isActive && <CheckCircle2 size={14} className="text-green-500 opacity-50" />}
                  {isActive && <ChevronRight size={16} className="text-teal-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Column: Problem Description */}
        <div className="flex-1 flex flex-col bg-[#0f111a] border-r border-[#252a3d] min-w-[300px] max-w-[800px] z-10">
          {activeQuestion ? (
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-teal-400 font-mono text-sm mb-2 uppercase tracking-widest">
                    Problem {activeQuestion.questionNumber}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{activeQuestion.title}</h2>
                  <div className="flex gap-3 text-xs font-bold">
                    <span className="bg-[#1e2233] px-3 py-1 rounded text-purple-400 border border-purple-500/20">
                      {activeQuestion.marks} Marks
                    </span>
                    <span className="bg-[#1e2233] px-3 py-1 rounded text-blue-400 border border-blue-500/20 uppercase">
                      {activeQuestion.allowedLanguage || 'JAVA'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-invert prose-teal max-w-none space-y-8">
                <section>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-[#252a3d] pb-2">Problem Statement</h3>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap font-serif text-[15px]">
                    {activeQuestion.problemStatement}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-[#252a3d] pb-2">Input Format</h3>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-[15px]">
                    {activeQuestion.inputDescription || 'No input description provided.'}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-[#252a3d] pb-2">Output Format</h3>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-[15px]">
                    {activeQuestion.outputDescription || 'No output description provided.'}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-[#252a3d] pb-2">Constraints</h3>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-[15px] bg-[#1a1d2d] p-4 rounded-lg border border-[#252a3d] font-mono">
                    {activeQuestion.constraints || 'No constraints specified.'}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-[#252a3d] pb-2">Examples</h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="bg-[#161925] border border-[#252a3d] rounded-lg overflow-hidden">
                      <div className="bg-[#1a1d2d] px-4 py-2 border-b border-[#252a3d] text-xs font-bold text-gray-400">Sample Input</div>
                      <pre className="p-4 text-gray-300 text-sm overflow-x-auto whitespace-pre font-mono">
                        {activeQuestion.sampleInput || 'No sample input'}
                      </pre>
                    </div>
                    <div className="bg-[#161925] border border-[#252a3d] rounded-lg overflow-hidden">
                      <div className="bg-[#1a1d2d] px-4 py-2 border-b border-[#252a3d] text-xs font-bold text-gray-400">Sample Output</div>
                      <pre className="p-4 text-green-400 text-sm overflow-x-auto whitespace-pre font-mono">
                        {activeQuestion.sampleOutput || 'No sample output'}
                      </pre>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600 font-mono text-sm">
              Select a problem from the left
            </div>
          )}
        </div>

        {/* Right Column: Monaco Editor */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] min-w-[400px] relative z-0">
          {activeQuestion ? (
            <>
              {/* Editor Toolbar */}
              <div className="h-12 bg-[#252526] border-b border-[#333] px-4 flex items-center justify-between shadow-md z-10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <div className="h-4 w-px bg-[#444] mx-2" />
                  <span className="text-gray-300 text-xs font-mono bg-[#333] px-2 py-1 rounded">
                    Solution.{getMonacoLanguage(codeMap[activeQuestion.id]?.language || activeQuestion.allowedLanguage || 'JAVA')}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  {saveStatus && (
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      saveStatus === 'Saving...' ? 'text-yellow-400 bg-yellow-400/10' :
                      saveStatus === 'Saved' ? 'text-green-400 bg-green-400/10' :
                      'text-red-400 bg-red-400/10'
                    }`}>
                      {saveStatus}
                    </span>
                  )}
                  
                  <button
                    onClick={() => downloadHelper(`/exam-attempts/${attemptId}/answers/${activeQuestion.id}/download`)}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-white px-3 py-1.5 rounded bg-[#333] hover:bg-[#444] transition-colors text-xs font-bold"
                  >
                    <Download size={14} /> Code
                  </button>
                  
                  <button
                    onClick={handleSaveCode}
                    disabled={isReadOnly}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-bold transition-all ${
                      isReadOnly 
                        ? 'bg-[#333] text-gray-500 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                    }`}
                  >
                    <Save size={14} /> {isReadOnly ? 'Read Only' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Editor Instance */}
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  language={getMonacoLanguage(codeMap[activeQuestion.id]?.language || activeQuestion.allowedLanguage || 'JAVA')}
                  value={codeMap[activeQuestion.id]?.code || ''}
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  options={{
                    readOnly: isReadOnly,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    wordWrap: 'on',
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                    padding: { top: 24, bottom: 24 },
                    scrollBeyondLastLine: false,
                    lineHeight: 1.6,
                    renderWhitespace: 'selection',
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#444] font-mono text-xl select-none">
              &lt;CodeClassroom /&gt;
            </div>
          )}
        </div>
      </div>
      {/* ─── Submit Confirmation Modal ─────────────────────────────────────── */}
      {showSubmitModal && (
        <div className="ee-backdrop" onMouseDown={e => e.target === e.currentTarget && !submitting && setShowSubmitModal(false)}>
          <div className="ee-modal max-w-md bg-[#131622] border border-[#2b304c] rounded-2xl p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              <AlertTriangle size={24} />
              <h2 className="text-lg font-bold text-white">Submit Exam?</h2>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Are you sure you want to submit the exam?
              <br />
              <span className="text-gray-400 text-xs mt-2 block">
                After submission, you will not be able to edit your code. All saved answers will be finalized.
              </span>
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={confirmSubmit}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-teal-600 text-white hover:bg-teal-500 transition-colors shadow-lg shadow-teal-900/40"
              >
                {submitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamWorkspace;
