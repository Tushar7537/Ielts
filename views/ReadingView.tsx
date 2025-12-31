import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { generateReadingTest } from '../services/geminiService';
import { ReadingTest, Question } from '../types';
import Timer from '../components/Timer';

const ReadingView: React.FC = () => {
  const location = useLocation();
  const cambridgeContext = location.state?.cambridgeContext;
  
  const [testData, setTestData] = useState<ReadingTest | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePassageIndex, setActivePassageIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (cambridgeContext) {
      startNewSession(cambridgeContext);
    }
  }, [cambridgeContext]);

  const startNewSession = async (context?: { book: number, test: number }) => {
    setLoading(true);
    setShowResults(false);
    setUserAnswers({});
    setIsTestRunning(false);
    setActivePassageIndex(0);
    setShowExitConfirm(false);
    try {
      const data = await generateReadingTest(undefined, context);
      setTestData(data);
      setIsTestRunning(true);
    } catch (error) {
      console.error("Failed to generate reading test", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = useCallback(() => {
    setIsTestRunning(false);
    setShowResults(true);
  }, []);

  const finishTest = () => {
    setShowExitConfirm(true);
  };

  const confirmFinish = () => {
    setIsTestRunning(false);
    setShowResults(true);
    setShowExitConfirm(false);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    if (showResults) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const scrollToQuestion = (questionId: string, passageIdx: number) => {
    setActivePassageIndex(passageIdx);
    setSelectedQuestionId(questionId);
    setTimeout(() => {
      questionRefs.current[questionId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const isAnswerCorrect = useCallback((questionId: string, correctAnswer: any) => {
    const userAns = userAnswers[questionId];
    if (!userAns || !correctAnswer) return false;
    const normalizedUser = String(userAns).trim().toLowerCase();
    const normalizedCorrect = String(correctAnswer).trim().toLowerCase();
    return normalizedUser === normalizedCorrect;
  }, [userAnswers]);

  const scoreInfo = useMemo(() => {
    if (!testData) return { correct: 0, total: 0 };
    let correct = 0;
    let total = 0;
    testData.passages.forEach(p => {
      p.questions.forEach(q => {
        total++;
        if (isAnswerCorrect(q.id, q.answer)) {
          correct++;
        }
      });
    });
    return { correct, total };
  }, [testData, isAnswerCorrect]);

  const convertScoreToBand = (score: number) => {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 33) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 27) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 19) return 5.5;
    return 5.0;
  };

  const getGlobalQuestionIndex = (passageIdx: number, questionIdx: number) => {
    let index = 0;
    if (!testData) return 0;
    for (let i = 0; i < passageIdx; i++) {
      index += testData.passages[i].questions.length;
    }
    return index + questionIdx + 1;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <p className="text-white text-xl font-bold">Secure Exam Environment Loading...</p>
          <p className="text-gray-400 mt-2">Simulating Official Cambridge Style</p>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 p-8">
        <div className="bg-white rounded-3xl p-12 max-w-2xl w-full text-center shadow-2xl border border-gray-100">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-8">📚</div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Official Reading Practice</h2>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            This simulation uses advanced AI to mirror the exact difficulty and style of the <b>Cambridge IELTS</b> series.
            The 60-minute timer will start once you click begin.
          </p>
          <button 
            onClick={() => startNewSession(cambridgeContext)}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 shadow-xl transition-all transform hover:-translate-y-1"
          >
            Start Test Simulation
          </button>
        </div>
      </div>
    );
  }

  const currentPassage = testData.passages[activePassageIndex];
  const totalQuestions = scoreInfo.total;
  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k].trim().length > 0).length;

  return (
    <div className="h-screen flex flex-col bg-gray-200 overflow-hidden font-sans relative">
      {/* Official Header Bar */}
      <div className="bg-[#1a1a1a] text-white px-8 py-3 flex justify-between items-center shadow-lg z-[60]">
        <div className="flex items-center gap-8">
          <div className="flex flex-col shrink-0">
            <h2 className="text-sm font-black uppercase tracking-widest text-blue-400">Academic Reading</h2>
            <p className="text-[11px] font-bold text-gray-500">Official Cambridge Simulation</p>
          </div>
          
          <div className="flex gap-1 shrink-0">
            {testData.passages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActivePassageIndex(idx)}
                className={`px-5 py-2 rounded-md text-xs font-black transition-all ${
                  activePassageIndex === idx ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                PASSAGE {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* CENTRAL TIMER */}
        <div className="absolute left-1/2 -translate-x-1/2">
          {isTestRunning && (
            <Timer durationMinutes={60} onTimeUp={handleTimeUp} isActive={isTestRunning} />
          )}
          {showResults && <span className="text-green-500 font-black uppercase text-xs tracking-widest">Review Mode Active</span>}
        </div>

        <div className="flex items-center gap-8 shrink-0">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Questions Answered</span>
            <span className="text-sm font-black text-white">{answeredCount} of {totalQuestions}</span>
          </div>
          {!showResults && (
            <button 
              onClick={finishTest}
              className="bg-white text-black px-6 py-2.5 rounded font-black text-xs hover:bg-blue-50 transition-all uppercase tracking-widest cursor-pointer shadow-lg active:scale-95"
            >
              Finish Test
            </button>
          )}
        </div>
      </div>

      {/* Test Environment Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Reading Passage Pane */}
        <div className="flex-1 bg-white overflow-y-auto p-16 border-r-2 border-gray-300 custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-black mb-10 text-gray-900 border-l-8 border-blue-600 pl-6 py-2 leading-tight">
              {currentPassage.title}
            </h1>
            <div className="prose prose-xl max-w-none text-gray-800 leading-[1.8] space-y-8 font-serif selection:bg-yellow-200">
              {currentPassage.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Questions Pane */}
        <div className="w-[500px] bg-[#f8fafc] overflow-y-auto p-10 custom-scrollbar border-l border-gray-300">
          <div className="space-y-12 pb-32">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs text-blue-800 mb-4">
              <p className="font-bold uppercase tracking-widest mb-1">Passage {activePassageIndex + 1} Questions</p>
              <p>{showResults ? "Review your answers below. Correct answers are marked in green." : "Type your answer or select an option for multiple-choice."}</p>
            </div>
            
            {currentPassage.questions.map((q, idx) => {
              const globalIdx = getGlobalQuestionIndex(activePassageIndex, idx);
              const isCorrect = isAnswerCorrect(q.id, q.answer);
              const isCompletion = !q.options || q.options.length === 0;

              return (
                <div 
                  key={q.id} 
                  ref={el => { questionRefs.current[q.id] = el; }}
                  className={`p-8 rounded-3xl border-2 transition-all relative ${
                    selectedQuestionId === q.id ? 'bg-white border-blue-500 ring-8 ring-blue-50' : 'bg-white border-transparent shadow-sm'
                  } ${showResults ? (isCorrect ? 'border-green-500 bg-green-50/30' : 'border-red-500 bg-red-50/30') : ''}`}
                >
                  {showResults && (
                    <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                      {isCorrect ? '✓' : '✕'}
                    </div>
                  )}

                  <div className="flex gap-4 mb-6">
                    <span className="bg-black text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0">
                      {globalIdx}
                    </span>
                    <p className="font-bold text-lg text-gray-900 leading-snug">{q.text}</p>
                  </div>

                  <div className="space-y-3">
                    {isCompletion ? (
                      <div className="space-y-2">
                         <input
                           type="text"
                           value={userAnswers[q.id] || ''}
                           disabled={showResults}
                           onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                           placeholder="Type your answer..."
                           className={`w-full p-5 rounded-2xl border-2 text-sm font-medium transition-all outline-none ${
                             userAnswers[q.id] 
                               ? 'border-blue-600 bg-blue-50 text-blue-800' 
                               : 'border-gray-100 bg-gray-50 focus:border-blue-500'
                           } ${showResults && isCorrect ? 'bg-green-50 border-green-500' : ''} 
                             ${showResults && !isCorrect ? 'bg-red-50 border-red-500' : ''}`}
                         />
                      </div>
                    ) : (
                      q.options?.map((opt) => {
                        const isSelected = userAnswers[q.id] === opt;
                        const isActuallyCorrect = String(opt).trim().toLowerCase() === String(q.answer).trim().toLowerCase();
                        
                        return (
                          <button
                            key={opt}
                            disabled={showResults}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`w-full text-left p-5 rounded-2xl border-2 text-sm font-medium transition-all ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50 text-blue-800'
                                : 'border-gray-100 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30'
                            } ${showResults && isActuallyCorrect ? 'bg-green-100 border-green-500 text-green-900 font-bold' : ''}
                              ${showResults && isSelected && !isActuallyCorrect ? 'bg-red-50 border-red-500 text-red-900' : ''}
                            `}
                          >
                            {opt}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {showResults && (
                    <div className={`mt-6 p-6 rounded-2xl text-sm border leading-relaxed ${isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                      <p className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-2">Review & Feedback</p>
                      <p className="mb-2 text-gray-900 font-black">Correct Answer: <span className="text-green-700">{q.answer}</span></p>
                      <p className="text-gray-600 italic">"{q.explanation}"</p>
                    </div>
                  )}
                </div>
              );
            })}
            
            {!showResults && (
               <button 
                 onClick={finishTest}
                 className="w-full py-6 rounded-3xl bg-gray-900 text-white font-black hover:bg-black transition-all shadow-xl"
               >
                 Submit All Answers
               </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Grid */}
      <div className="bg-white border-t-2 border-gray-300 p-4 px-8 flex items-center justify-between z-50">
        <div className="flex gap-2 overflow-x-auto items-center no-scrollbar">
          {testData.passages.map((p, pIdx) => (
            <div key={pIdx} className="flex gap-1 items-center">
              <span className="text-[10px] font-black text-gray-400 mr-2 uppercase">Passage {pIdx+1}</span>
              {p.questions.map((q, qIdx) => {
                const globalIdx = getGlobalQuestionIndex(pIdx, qIdx);
                const isAnswered = !!userAnswers[q.id] && userAnswers[q.id].trim() !== '';
                const isCorrect = showResults && isAnswerCorrect(q.id, q.answer);
                const isActive = activePassageIndex === pIdx && selectedQuestionId === q.id;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => scrollToQuestion(q.id, pIdx)}
                    className={`w-9 h-9 rounded-md text-xs font-black flex items-center justify-center transition-all border-2 ${
                      showResults 
                        ? (isCorrect ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500')
                        : isAnswered 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : isActive
                            ? 'bg-blue-50 text-blue-600 border-blue-500'
                            : 'bg-white text-gray-400 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {globalIdx}
                  </button>
                );
              })}
              {pIdx < 2 && <div className="w-px h-8 bg-gray-300 mx-4"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Finish Confirmation Overlay */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-8">
           <div className="bg-white rounded-[2rem] p-10 max-w-md w-full text-center shadow-3xl">
             <div className="text-4xl mb-4">⚠️</div>
             <h3 className="text-2xl font-black text-gray-900 mb-2">Finish Test?</h3>
             <p className="text-gray-500 font-medium mb-8">
               Are you sure you want to submit your answers? You won't be able to change them after this.
             </p>
             <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={() => setShowExitConfirm(false)}
                 className="py-4 rounded-xl font-bold border-2 border-gray-100 text-gray-500 hover:bg-gray-50"
               >
                 Go Back
               </button>
               <button 
                 onClick={confirmFinish}
                 className="py-4 rounded-xl font-black bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100"
               >
                 Yes, Submit
               </button>
             </div>
           </div>
        </div>
      )}

      {/* Result Modal */}
      {showResults && (
        <div className="fixed inset-0 z-[200] bg-[#0a0a0a]/90 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="bg-white rounded-[2.5rem] p-16 max-w-2xl w-full text-center shadow-3xl animate-in zoom-in duration-500">
            <div className="text-blue-600 text-6xl mb-6">🏁</div>
            <h3 className="text-5xl font-black text-gray-900 mb-2 italic">Test Finished</h3>
            <p className="text-gray-500 text-xl font-medium mb-12 uppercase tracking-widest">Official Mock Result</p>
            
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="bg-blue-50 p-10 rounded-[2rem] border-2 border-blue-100">
                <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Raw Score</span>
                <p className="text-6xl font-black text-blue-900 mt-2">{scoreInfo.correct} / {scoreInfo.total}</p>
              </div>
              <div className="bg-green-50 p-10 rounded-[2rem] border-2 border-green-100">
                <span className="text-xs font-black text-green-600 uppercase tracking-[0.2em]">Band Score</span>
                <p className="text-6xl font-black text-green-900 mt-2">{convertScoreToBand(scoreInfo.correct)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => {
                  const modal = document.querySelector('.fixed.z-\\[200\\]');
                  if (modal) modal.classList.add('hidden');
                }}
                className="bg-blue-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl"
              >
                Review All Answers
              </button>
              <button 
                onClick={() => startNewSession(cambridgeContext)}
                className="text-gray-400 font-bold hover:text-gray-600 mt-4"
              >
                Try Another Test
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border: 3px solid transparent; background-clip: content-box; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; border: 3px solid transparent; background-clip: content-box; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ReadingView;