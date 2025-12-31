
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { generateListeningExercise, generateListeningAudio } from '../services/geminiService';
import { ListeningExercise, ListeningSection } from '../types';
import Timer from '../components/Timer';
import { CAMBRIDGE_20_LISTENING_TEST_1 } from '../data/cambridge20Mock';

const ListeningView: React.FC = () => {
  const location = useLocation();
  const cambridgeContext = location.state?.cambridgeContext;

  const [testData, setTestData] = useState<ListeningExercise | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioBuffers, setAudioBuffers] = useState<Record<number, AudioBuffer>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [playedSections, setPlayedSections] = useState<Set<number>>(new Set());
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cambridgeContext?.book === 20 && cambridgeContext?.test === 1) {
      loadStaticTest(CAMBRIDGE_20_LISTENING_TEST_1);
    } else if (cambridgeContext) {
      startNewSession(cambridgeContext);
    }
  }, [cambridgeContext]);

  const loadStaticTest = async (data: ListeningExercise) => {
    setLoading(true);
    setTestData(data);
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = ctx;
    // We don't auto-load AI audio if it's a known simulation; wait for user to upload or decide
    if (!data.sections[0].audioUrl) {
       await loadAudioForSection(0, data.sections[0]);
    }
    setIsTestRunning(true);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !audioContextRef.current) return;

    setAudioLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      setAudioBuffers(prev => ({ ...prev, [activeSectionIdx]: buffer }));
    } catch (err) {
      console.error("Failed to decode local file", err);
      alert("Error decoding audio file. Please ensure it is a valid MP3 or WAV.");
    } finally {
      setAudioLoading(false);
    }
  };

  const startNewSession = async (context?: { book: number, test: number }) => {
    setLoading(true);
    setAudioLoading(true);
    setShowResults(false);
    setUserAnswers({});
    setAudioBuffers({});
    setPlayedSections(new Set());
    setIsTestRunning(false);
    setActiveSectionIdx(0);
    
    try {
      const data = await generateListeningExercise(undefined, context);
      setTestData(data);
      
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = ctx;

      await loadAudioForSection(0, data.sections[0]);
      setIsTestRunning(true);
    } catch (error) {
      console.error("Failed to generate listening session", error);
    } finally {
      setLoading(false);
      setAudioLoading(false);
    }
  };

  const loadAudioForSection = async (idx: number, section: ListeningSection) => {
    if (audioBuffers[idx]) return;
    setAudioLoading(true);
    try {
      if (section.audioUrl) {
        const response = await fetch(section.audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        if (audioContextRef.current) {
          const buffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
          setAudioBuffers(prev => ({ ...prev, [idx]: buffer }));
        }
      } else {
        const audioData = await generateListeningAudio(section.transcript);
        const decoded = atob(audioData);
        const bytes = new Uint8Array(decoded.length);
        for(let i=0; i<decoded.length; i++) bytes[i] = decoded.charCodeAt(i);

        if (audioContextRef.current) {
          const buffer = await decodeRawPCM(bytes, audioContextRef.current, 24000, 1);
          setAudioBuffers(prev => ({ ...prev, [idx]: buffer }));
        }
      }
    } catch (err) {
      console.error("Audio loading/generation failed", err);
    } finally {
      setAudioLoading(false);
    }
  };

  const decodeRawPCM = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const togglePlay = () => {
    const buffer = audioBuffers[activeSectionIdx];
    if (!buffer || !audioContextRef.current) {
      alert("No audio loaded for this section yet. Use 'Load Local Audio' if you have the file.");
      return;
    }

    if (isPlaying) {
      currentSourceRef.current?.stop();
      setIsPlaying(false);
    } else {
      if (cambridgeContext && playedSections.has(activeSectionIdx)) {
        alert("In simulation mode, you can only listen to the recording once.");
        return;
      }
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        setIsPlaying(false);
        setPlayedSections(prev => new Set(prev).add(activeSectionIdx));
      };
      source.start(0);
      currentSourceRef.current = source;
      setIsPlaying(true);
    }
  };

  const handleSectionChange = async (idx: number) => {
    if (isPlaying) {
      currentSourceRef.current?.stop();
      setIsPlaying(false);
    }
    setActiveSectionIdx(idx);
    if (!audioBuffers[idx] && testData) {
      await loadAudioForSection(idx, testData.sections[idx]);
    }
  };

  const handleTimeUp = useCallback(() => {
    setIsTestRunning(false);
    setShowResults(true);
  }, []);

  const finishTest = () => {
    if (window.confirm("Finish test and see results?")) {
      setIsTestRunning(false);
      setShowResults(true);
      if (isPlaying) {
        currentSourceRef.current?.stop();
        setIsPlaying(false);
      }
    }
  };

  const calculateScore = () => {
    if (!testData) return 0;
    let score = 0;
    testData.sections.forEach(s => {
      s.questions.forEach(q => {
        const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
        const correctAns = String(q.answer).trim().toLowerCase();
        if (userAns === correctAns && userAns !== "") {
          score++;
        }
      });
    });
    return score;
  };

  const currentSection = testData?.sections[activeSectionIdx];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 space-y-6">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-black text-xl">Loading Official Cambridge Content...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-black">L</div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Listening Master</h2>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black rounded uppercase">Academic</span>
              {cambridgeContext && <p className="text-gray-500 font-bold text-xs italic">Book {cambridgeContext.book}, Test {cambridgeContext.test}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {[0, 1, 2, 3].map(i => (
              <button
                key={i}
                onClick={() => handleSectionChange(i)}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                  activeSectionIdx === i ? 'bg-white shadow-sm text-green-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                PART {i + 1}
              </button>
            ))}
          </div>
          {isTestRunning && <Timer durationMinutes={30} onTimeUp={handleTimeUp} isActive={isTestRunning} />}
          {!testData && (
             <button onClick={() => startNewSession(cambridgeContext)} className="bg-green-600 text-white px-6 py-2 rounded-xl font-black text-sm hover:bg-green-700">
               Start Simulation
             </button>
          )}
        </div>
      </header>

      {testData && currentSection && (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-white">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="border-b-4 border-gray-900 pb-4">
                <h3 className="text-3xl font-black text-gray-900 uppercase italic">Part {currentSection.id}</h3>
                <p className="text-sm font-bold text-gray-600 mt-2">{currentSection.instructions}</p>
              </div>

              <div className="space-y-12">
                {currentSection.questions.map((q, qIdx) => {
                  const globalIdx = activeSectionIdx * 10 + qIdx + 1;
                  const isCorrect = (userAnswers[q.id] || '').trim().toLowerCase() === String(q.answer).trim().toLowerCase();
                  const isCompletion = !q.options || q.options.length === 0;

                  return (
                    <div key={q.id} className="space-y-6">
                      <div className="flex gap-4">
                        <span className="w-8 h-8 rounded bg-gray-900 text-white flex items-center justify-center text-xs font-black shrink-0">
                          {globalIdx}
                        </span>
                        <div className="flex-1">
                          <p className="text-lg font-bold text-gray-900 mb-6">{q.text}</p>
                          
                          {isCompletion ? (
                            <input
                              type="text"
                              value={userAnswers[q.id] || ''}
                              disabled={showResults}
                              onChange={(e) => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                              placeholder="Your answer..."
                              className={`w-full max-w-md p-4 rounded-xl border-2 font-bold transition-all outline-none ${
                                userAnswers[q.id] ? 'border-green-600 bg-green-50' : 'border-gray-100 bg-gray-50 focus:border-green-600'
                              } ${showResults ? (isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-50 border-red-500') : ''}`}
                            />
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {q.options?.map(opt => (
                                <button
                                  key={opt}
                                  disabled={showResults}
                                  onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                  className={`text-left p-4 rounded-xl border-2 font-bold transition-all flex items-center gap-3 ${
                                    userAnswers[q.id] === opt ? 'border-green-600 bg-green-50 text-green-900' : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-300'
                                  } ${showResults && opt === q.answer ? 'border-green-500 bg-green-100' : ''}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}

                          {showResults && (
                            <div className={`mt-4 p-4 rounded-xl text-xs font-bold ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                              {isCorrect ? '✓ Correct' : `✗ Correct Answer: ${q.answer}`}
                              <p className="mt-1 opacity-70 italic font-medium">"{q.explanation}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="h-40"></div>
          </div>

          <div className="w-80 bg-gray-100 border-l border-gray-200 p-6 space-y-6 shrink-0 flex flex-col">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Media Lab</h4>
              
              <div className="space-y-3">
                <button
                  onClick={togglePlay}
                  disabled={audioLoading || (cambridgeContext && playedSections.has(activeSectionIdx) && !isPlaying)}
                  className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all ${
                    isPlaying ? 'bg-red-600 text-white shadow-xl shadow-red-200' : 'bg-green-600 text-white shadow-xl shadow-green-200'
                  } disabled:opacity-30`}
                >
                  {audioLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isPlaying ? '⏹ STOP' : '▶ PLAY')}
                </button>

                {!audioBuffers[activeSectionIdx] && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 bg-white border-2 border-gray-200 rounded-xl text-[10px] font-black text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all uppercase tracking-widest"
                  >
                    📂 Load Local Audio File
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="audio/*" 
                  className="hidden" 
                />
              </div>

              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full bg-green-600 transition-all ${isPlaying ? 'w-full animate-pulse' : 'w-0'}`}></div>
              </div>
              <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-tight">
                {audioBuffers[activeSectionIdx] ? "Audio Source Active" : "Waiting for Audio Source"}
              </p>
            </div>

            <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-sm">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Context</h4>
              <p className="text-sm font-medium leading-relaxed italic text-gray-300">"{currentSection.context}"</p>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Answer Map</h4>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 40 }).map((_, i) => {
                  const qId = `q${i + 1}`;
                  const isAnswered = !!userAnswers[qId];
                  return (
                    <div 
                      key={i} 
                      className={`w-full aspect-square rounded flex items-center justify-center text-[10px] font-black border ${
                        isAnswered ? 'bg-green-600 text-white border-green-700' : 'bg-white text-gray-400 border-gray-200'
                      }`}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {!showResults && (
              <button 
                onClick={finishTest}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-black/20"
              >
                FINISH TEST
              </button>
            )}
          </div>
        </div>
      )}

      {showResults && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="bg-white rounded-[3rem] p-16 max-w-3xl w-full text-center shadow-3xl animate-in zoom-in duration-500">
             <div className="text-6xl mb-6">🏆</div>
             <h3 className="text-5xl font-black text-gray-900 mb-2">Exam Result</h3>
             <p className="text-gray-500 text-xl font-bold mb-12 uppercase tracking-widest">IELTS Practice Complete</p>
             
             <div className="grid grid-cols-2 gap-8 mb-12">
               <div className="bg-green-50 p-12 rounded-[2.5rem] border-2 border-green-100">
                 <span className="text-xs font-black text-green-600 uppercase tracking-widest">Questions Correct</span>
                 <p className="text-7xl font-black text-green-900 mt-2">{calculateScore()} / 40</p>
               </div>
               <div className="bg-blue-50 p-12 rounded-[2.5rem] border-2 border-blue-100">
                 <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Estimated Band</span>
                 <p className="text-7xl font-black text-blue-900 mt-2">
                   {calculateScore() >= 39 ? '9.0' : calculateScore() >= 37 ? '8.5' : calculateScore() >= 35 ? '8.0' : calculateScore() >= 32 ? '7.5' : calculateScore() >= 30 ? '7.0' : '6.5+'}
                 </p>
               </div>
             </div>

             <div className="flex flex-col gap-4">
               <button 
                 onClick={() => { setShowResults(false); }}
                 className="bg-gray-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-black"
               >
                 Review Questions
               </button>
               <button 
                 onClick={() => startNewSession(cambridgeContext)}
                 className="text-green-600 font-bold hover:underline"
               >
                 Take Another Mock
               </button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ListeningView;
