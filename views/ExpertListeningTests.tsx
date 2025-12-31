
import React, { useState } from 'react';
import { MOCK_LISTENING_FULL_TEST } from '../data/mockListeningFullTest';

const ExpertListeningTests: React.FC = () => {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const currentSection = MOCK_LISTENING_FULL_TEST.sections[activeSectionIdx];
  const totalQuestions = MOCK_LISTENING_FULL_TEST.sections.reduce((acc, s) => acc + s.questions.length, 0);

  const handleAnswerChange = (qId: string, val: string) => {
    if (showResults) return;
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

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 min-h-screen pb-32">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-gray-900">{MOCK_LISTENING_FULL_TEST.title}</h2>
          <p className="text-gray-500 font-medium">Full 40-Question Examiner Mock</p>
        </div>
        <div className="flex gap-2">
          {MOCK_LISTENING_FULL_TEST.sections.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActiveSectionIdx(i); setShowTranscript(false); }}
              className={`w-12 h-12 rounded-xl font-black transition-all ${
                activeSectionIdx === i ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              S{i + 1}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Section Info & Audio Simulation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🎧</div>
            <h3 className="text-xl font-bold mb-2">{currentSection.title}</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">{currentSection.context}</p>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10 mb-6">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Simulation Status</p>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold">Audio Ready</span>
              </div>
            </div>
            <button className="w-full bg-green-600 text-white py-4 rounded-xl font-black hover:bg-green-700 transition-all shadow-lg shadow-green-900/20">
              ▶️ Play Section {currentSection.id}
            </button>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📖</span> Instructions
            </h4>
            <p className="text-sm text-gray-600 italic leading-relaxed">{currentSection.instructions}</p>
          </div>

          <button 
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full text-center py-3 text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest"
          >
            {showTranscript ? "Hide Transcript" : "View Transcript (Review Only)"}
          </button>
          
          {showTranscript && (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-sm leading-relaxed text-gray-600 font-serif animate-in fade-in duration-300">
              {currentSection.transcript.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          )}
        </div>

        {/* Right: Question Sheet */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 min-h-[600px]">
          <div className="space-y-10">
            {currentSection.questions.map((q, idx) => {
              const globalIdx = activeSectionIdx * 10 + idx + 1;
              const isCorrect = (userAnswers[q.id] || '').trim().toLowerCase() === q.answer.toLowerCase();
              
              return (
                <div key={q.id} className="group relative">
                  <div className="flex gap-4 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-black shrink-0">
                      {globalIdx}
                    </span>
                    <p className="font-bold text-gray-900 leading-tight pt-1">{q.text}</p>
                  </div>
                  
                  <div className="ml-12">
                    {q.type === 'completion' ? (
                      <input
                        type="text"
                        value={userAnswers[q.id] || ''}
                        disabled={showResults}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder="Write answer..."
                        className={`w-full max-w-sm p-3 rounded-xl border-2 transition-all outline-none font-medium ${
                          showResults 
                            ? (isCorrect ? 'bg-green-50 border-green-500 text-green-900' : 'bg-red-50 border-red-500 text-red-900')
                            : 'bg-gray-50 border-transparent focus:bg-white focus:border-green-600'
                        }`}
                      />
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        {q.options?.map(opt => (
                          <button
                            key={opt}
                            disabled={showResults}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`px-6 py-2 rounded-xl font-bold transition-all border-2 ${
                              userAnswers[q.id] === opt 
                                ? 'bg-green-600 text-white border-green-600 shadow-md' 
                                : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'
                            } ${showResults && opt === q.answer ? 'ring-4 ring-green-200 border-green-500' : ''}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                    {showResults && (
                      <div className={`mt-2 text-xs font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                        {isCorrect ? 'Correct' : `Correct Answer: ${q.answer}`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between">
            <button 
              disabled={activeSectionIdx === 0}
              onClick={() => setActiveSectionIdx(prev => prev - 1)}
              className="px-8 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-50 disabled:opacity-30"
            >
              ← Previous Section
            </button>
            {activeSectionIdx === 3 ? (
              <button 
                onClick={() => setShowResults(true)}
                className="bg-gray-900 text-white px-10 py-3 rounded-xl font-black shadow-xl hover:bg-black transition-all"
              >
                Finish Test
              </button>
            ) : (
              <button 
                onClick={() => setActiveSectionIdx(prev => prev + 1)}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all"
              >
                Next Section →
              </button>
            )}
          </div>
        </div>
      </div>

      {showResults && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-green-600 p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom duration-500">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">🏆</div>
              <div>
                <h4 className="text-2xl font-black text-gray-900">Test Complete!</h4>
                <p className="text-gray-500 font-bold">You scored <span className="text-green-600">{calculateScore()}</span> out of {totalQuestions}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => { setShowResults(false); setUserAnswers({}); setActiveSectionIdx(0); }}
                className="px-8 py-4 rounded-2xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Retake Exam
              </button>
              <button 
                onClick={() => setShowResults(false)}
                className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-green-200"
              >
                Review Answers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertListeningTests;
