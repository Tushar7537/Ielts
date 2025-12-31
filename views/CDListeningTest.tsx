
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_LISTENING_FULL_TEST } from '../data/mockListeningFullTest';

const CDListeningTest: React.FC = () => {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0); // 0 to 39
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isPlaying, setIsPlaying] = useState(false);

  // Derived state
  const activeSectionIdx = Math.floor(activeQuestionIdx / 10);
  const currentSection = MOCK_LISTENING_FULL_TEST.sections[activeSectionIdx];
  const totalQuestions = 40;

  // Question IDs are q1, q2... q40
  const getQuestionId = (idx: number) => `q${idx + 1}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (qId: string, val: string) => {
    if (isFinished) return;
    setUserAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const calculateScore = () => {
    let score = 0;
    MOCK_LISTENING_FULL_TEST.sections.forEach(s => {
      s.questions.forEach(q => {
        if ((userAnswers[q.id] || '').trim().toLowerCase() === q.answer.toLowerCase()) {
          score++;
        }
      });
    });
    return score;
  };

  const scrollToQuestion = (idx: number) => {
    setActiveQuestionIdx(idx);
    const element = document.getElementById(`q-container-${idx + 1}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="h-screen flex flex-col bg-[#E5E7EB] font-sans overflow-hidden select-none">
      {/* Official Top Bar */}
      <div className="bg-[#1F2937] text-white h-14 flex items-center justify-between px-6 shrink-0 border-b border-gray-700 shadow-md">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold tracking-tight">IELTS Listening Practice</span>
          <div className="h-6 w-px bg-gray-600"></div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Candidate:</span>
            <span className="text-xs font-bold uppercase">ALEX SCHOLAR (102938)</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-black/30 px-4 py-1.5 rounded border border-gray-600">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Time Left:</span>
            <span className={`font-mono text-lg font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-[10px] font-bold uppercase transition-colors">Help</button>
            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-[10px] font-bold uppercase transition-colors">Hide</button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Scrollable Questions List (Center-Left) */}
        <div className="flex-1 overflow-y-auto bg-white m-4 rounded shadow-sm border border-gray-300 custom-scrollbar">
          <div className="max-w-4xl mx-auto p-12 space-y-16">
            {MOCK_LISTENING_FULL_TEST.sections.map((section, sIdx) => (
              <section key={section.id} className="space-y-10">
                <div className="border-b-4 border-black pb-4">
                  <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic">
                    Section {section.id}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 font-medium">{section.instructions}</p>
                </div>

                <div className="space-y-12">
                  {section.questions.map((q, qIdx) => {
                    const globalIdx = (sIdx * 10) + qIdx + 1;
                    const isCorrect = (userAnswers[q.id] || '').trim().toLowerCase() === q.answer.toLowerCase();

                    return (
                      <div 
                        id={`q-container-${globalIdx}`} 
                        key={q.id}
                        className={`p-6 rounded-lg transition-all border-l-4 ${
                          activeQuestionIdx === globalIdx - 1 ? 'bg-blue-50/50 border-blue-600' : 'border-transparent'
                        }`}
                        onClick={() => setActiveQuestionIdx(globalIdx - 1)}
                      >
                        <div className="flex gap-4">
                          <span className="w-8 h-8 rounded bg-black text-white flex items-center justify-center text-xs font-black shrink-0">
                            {globalIdx}
                          </span>
                          <div className="flex-1">
                            <p className="text-lg font-bold text-gray-900 mb-6">{q.text}</p>
                            
                            {q.type === 'completion' ? (
                              <input
                                type="text"
                                value={userAnswers[q.id] || ''}
                                disabled={isFinished}
                                onChange={(e) => handleAnswer(q.id, e.target.value)}
                                className={`w-full max-w-sm p-3 border-2 font-bold text-lg outline-none transition-all ${
                                  isFinished 
                                    ? (isCorrect ? 'border-green-500 bg-green-50 text-green-900' : 'border-red-500 bg-red-50 text-red-900')
                                    : 'border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100'
                                }`}
                              />
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {q.options?.map(opt => (
                                  <button
                                    key={opt}
                                    disabled={isFinished}
                                    onClick={() => handleAnswer(q.id, opt)}
                                    className={`text-left p-4 border-2 font-bold rounded transition-all flex items-center gap-3 ${
                                      userAnswers[q.id] === opt 
                                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm' 
                                        : 'border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-white'
                                    } ${isFinished && opt === q.answer ? 'border-green-500 bg-green-50' : ''}`}
                                  >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${userAnswers[q.id] === opt ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                                      {userAnswers[q.id] === opt && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                    </div>
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {isFinished && (
                              <div className={`mt-4 p-4 rounded text-sm font-bold flex items-center gap-2 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {isCorrect ? '✓ Correct' : `✗ Correct Answer: ${q.answer}`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Audio Simulation Panel (Right Sidebar) */}
        <div className="w-80 bg-[#F3F4F6] border-l border-gray-300 p-6 space-y-6 shrink-0">
          <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Media Control</h3>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`w-full py-4 rounded font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isPlaying ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isPlaying ? '⏹ STOP AUDIO' : '▶ START AUDIO'}
              </button>
              <div className="bg-gray-100 h-2 rounded-full overflow-hidden mt-4">
                <div className={`h-full bg-blue-600 transition-all duration-1000 ${isPlaying ? 'w-full' : 'w-0'}`} style={{ transitionDuration: '30s' }}></div>
              </div>
              <p className="text-[10px] text-gray-400 text-center font-bold">Simulating Section {activeSectionIdx + 1} Audio</p>
            </div>
          </div>

          <div className="bg-[#1F2937] text-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Exam Context</h3>
            <p className="text-sm font-medium leading-relaxed italic text-gray-300">
              "{currentSection.context}"
            </p>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-200 rounded transition-colors"
            >
              {showTranscript ? 'Hide Transcript' : 'Show Transcript (Review)'}
            </button>
            {showTranscript && (
              <div className="p-4 bg-white border border-gray-300 rounded text-[11px] leading-relaxed max-h-48 overflow-y-auto font-serif">
                {currentSection.transcript}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Official Bottom Navigation (1-40) */}
      <div className="bg-[#1F2937] h-20 px-6 flex items-center gap-4 border-t border-gray-700 shrink-0">
        <div className="flex-1 flex gap-1.5 overflow-x-auto no-scrollbar py-2">
          {Array.from({ length: 40 }).map((_, idx) => {
            const qId = getQuestionId(idx);
            const isAnswered = !!userAnswers[qId] && userAnswers[qId].trim() !== '';
            const isActive = activeQuestionIdx === idx;
            
            return (
              <button
                key={idx}
                onClick={() => scrollToQuestion(idx)}
                className={`w-9 h-9 shrink-0 rounded text-[11px] font-black transition-all flex items-center justify-center border-b-4 ${
                  isActive 
                    ? 'bg-white text-black border-blue-500 scale-110' 
                    : isAnswered 
                      ? 'bg-blue-600 text-white border-blue-800' 
                      : 'bg-gray-700 text-gray-400 border-gray-800 hover:bg-gray-600'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-700">
          <button 
            disabled={activeQuestionIdx === 0}
            onClick={() => scrollToQuestion(activeQuestionIdx - 1)}
            className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded font-black text-xs text-white uppercase tracking-widest disabled:opacity-30"
          >
            Previous
          </button>
          {activeQuestionIdx === 39 ? (
            <button 
              onClick={() => setIsFinished(true)}
              className="px-10 py-2.5 bg-blue-600 hover:bg-blue-700 rounded font-black text-xs text-white uppercase tracking-widest shadow-lg shadow-blue-900/40"
            >
              Finish Test
            </button>
          ) : (
            <button 
              onClick={() => scrollToQuestion(activeQuestionIdx + 1)}
              className="px-10 py-2.5 bg-blue-600 hover:bg-blue-700 rounded font-black text-xs text-white uppercase tracking-widest"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Result Backdrop */}
      {isFinished && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-8">
          <div className="bg-white rounded-[2rem] p-16 max-w-2xl w-full text-center shadow-3xl animate-in zoom-in duration-500">
            <div className="text-6xl mb-6">🎓</div>
            <h3 className="text-4xl font-black text-gray-900 mb-2">Practice Complete</h3>
            <p className="text-gray-500 font-bold mb-12">IELTS Official Listening Simulation Result</p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="bg-blue-50 p-10 rounded-[2rem] border-2 border-blue-100">
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Score</span>
                <p className="text-6xl font-black text-blue-900 mt-2">{calculateScore()} / 40</p>
              </div>
              <div className="bg-green-50 p-10 rounded-[2rem] border-2 border-green-100">
                <span className="text-xs font-black text-green-600 uppercase tracking-widest">Band</span>
                <p className="text-6xl font-black text-green-900 mt-2">
                  {calculateScore() >= 39 ? '9.0' : calculateScore() >= 37 ? '8.5' : calculateScore() >= 35 ? '8.0' : calculateScore() >= 32 ? '7.5' : calculateScore() >= 30 ? '7.0' : '6.5+'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setIsFinished(false)}
                className="bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all"
              >
                Review Answers
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="text-blue-600 font-bold text-sm hover:underline"
              >
                Take Another Full Mock
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </div>
  );
};

export default CDListeningTest;
