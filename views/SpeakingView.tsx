
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { generateSpeakingCueCard } from '../services/geminiService';

const SpeakingView: React.FC = () => {
  const location = useLocation();
  const cambridgeContext = location.state?.cambridgeContext;

  const [isActive, setIsActive] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'active'>('idle');
  const [cueCard, setCueCard] = useState<{ topic: string, bulletPoints: string[] } | null>(null);
  const [loadingCueCard, setLoadingCueCard] = useState(false);
  
  // Preparation Timer States
  const [showPrepChoice, setShowPrepChoice] = useState(false);
  const [prepSecondsLeft, setPrepSecondsLeft] = useState<number | null>(null);

  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Preparation Countdown Logic
  useEffect(() => {
    let interval: any;
    if (prepSecondsLeft !== null && prepSecondsLeft > 0) {
      interval = setInterval(() => {
        setPrepSecondsLeft(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (prepSecondsLeft === 0) {
      setPrepSecondsLeft(null);
    }
    return () => clearInterval(interval);
  }, [prepSecondsLeft]);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
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

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const createBlob = (data: Float32Array): Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const fetchCueCard = async () => {
    setLoadingCueCard(true);
    setCueCard(null);
    setShowPrepChoice(false);
    setPrepSecondsLeft(null);
    try {
      const data = await generateSpeakingCueCard(cambridgeContext);
      setCueCard(data);
      setShowPrepChoice(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCueCard(false);
    }
  };

  const handleStartNow = () => {
    setShowPrepChoice(false);
    setPrepSecondsLeft(null);
    startSession();
  };

  const handleStartPrep = () => {
    setShowPrepChoice(false);
    setPrepSecondsLeft(60);
  };

  const startSession = async () => {
    if (status !== 'idle') return;

    // Check for API Key Selection
    try {
      // @ts-ignore
      if (typeof window.aistudio !== 'undefined' && !(await window.aistudio.hasSelectedApiKey())) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
    } catch (e) {
      console.error("Key selection check failed", e);
    }

    setStatus('connecting');
    setTranscripts([]);
    setPrepSecondsLeft(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const baseInstruction = 'You are an IELTS Speaking Examiner. Conduct a realistic interview. Be strict, academic, and professional.';
      const modeInstruction = cueCard 
        ? `The user has just seen a Part 2 Cue Card: "${cueCard.topic}". Instruct the user that they should speak for 1 to 2 minutes on this topic. After they finish, ask follow-up questions for Part 3 based on their talk.` 
        : 'Conduct a Part 1 interview about the user\'s hometown or hobbies.';

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.debug('Session opened');
            setStatus('active');
            setIsActive(true);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                try { session.sendRealtimeInput({ media: pcmBlob }); } catch (err) {}
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioPart = message.serverContent?.modelTurn?.parts.find(p => p.inlineData);
            const base64Audio = audioPart?.inlineData?.data;
            
            if (base64Audio) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.outputTranscription) {
              setTranscripts(prev => [...prev, "Examiner: " + (message.serverContent?.outputTranscription?.text || '')]);
            } else if (message.serverContent?.inputTranscription) {
              setTranscripts(prev => [...prev, "You: " + (message.serverContent?.inputTranscription?.text || '')]);
            }
          },
          onerror: (e) => {
            console.error('Session error:', e);
            if (e.message?.includes("Requested entity was not found")) {
              // @ts-ignore
              if (typeof window.aistudio !== 'undefined') {
                // @ts-ignore
                window.aistudio.openSelectKey().catch(console.error);
              }
            }
            stopSession();
          },
          onclose: (e) => {
            console.debug('Session closed:', e);
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `${baseInstruction} ${modeInstruction}`,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (err) {
      console.error('Failed to start speaking session:', err);
      setStatus('idle');
      alert("Could not connect to the AI Examiner. Please ensure your microphone is enabled and you have a stable connection.");
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setStatus('idle');

    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      inputAudioContextRef.current.close().catch(() => {});
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
      outputAudioContextRef.current.close().catch(() => {});
    }
    
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();

    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(s => { try { s.close(); } catch(e) {} });
      sessionPromiseRef.current = null;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col items-center min-h-[90vh] space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Speaking Interview</h2>
        <p className="text-gray-500 mt-2">Practice for your 1-on-1 speaking test with our AI examiner</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {/* Left: Session Control */}
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 flex flex-col items-center relative overflow-hidden">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 relative transition-colors duration-500 ${
            status === 'active' ? 'bg-red-50' : status === 'connecting' ? 'bg-yellow-50' : 'bg-blue-50'
          }`}>
            {status === 'active' && (
              <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-25"></div>
            )}
            <span className="text-5xl">{status === 'active' ? '🎙️' : status === 'connecting' ? '⌛' : '🤖'}</span>
          </div>

          <h3 className="text-xl font-bold mb-6 text-center">
            {status === 'idle' && (prepSecondsLeft !== null ? 'Preparing...' : 'Ready to begin your session?')}
            {status === 'connecting' && 'Establishing secure connection...'}
            {status === 'active' && 'Examiner is listening.'}
          </h3>

          <div className="flex flex-col w-full gap-3">
            {status === 'idle' ? (
              <>
                {prepSecondsLeft !== null ? (
                  <div className="w-full text-center space-y-4">
                    <div className="text-5xl font-mono font-black text-blue-600">
                      00:{prepSecondsLeft.toString().padStart(2, '0')}
                    </div>
                    <button
                      onClick={startSession}
                      className="bg-blue-600 text-white w-full py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                    >
                      Start Speaking Now
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={startSession}
                      className="bg-blue-600 text-white w-full py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                    >
                      {cueCard ? 'Start Part 2 & 3' : 'Start Part 1 Interview'}
                    </button>
                    <p className="text-[10px] text-gray-400 mt-2 text-center">
                      Note: Session requires a <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline text-blue-500">paid API key</a>.
                    </p>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={stopSession}
                className="bg-red-600 text-white w-full py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg"
              >
                Finish Session
              </button>
            )}
          </div>

          {/* Prep Choice Modal Overlay */}
          {showPrepChoice && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
              <span className="text-4xl mb-4">⏱️</span>
              <h4 className="text-xl font-bold text-gray-900 mb-2">New Cue Card Ready</h4>
              <p className="text-sm text-gray-500 mb-8">In a real test, you get 1 minute to prepare. What would you like to do?</p>
              <div className="w-full space-y-3">
                <button 
                  onClick={handleStartPrep}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700"
                >
                  Prepare for 1 Minute
                </button>
                <button 
                  onClick={handleStartNow}
                  className="w-full border-2 border-gray-200 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-50"
                >
                  Start Speaking Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Cue Card Panel */}
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">Part 2 Cue Card</h4>
            <button 
              onClick={fetchCueCard}
              disabled={loadingCueCard || isActive}
              className="text-blue-600 text-xs font-bold hover:underline disabled:opacity-30"
            >
              {loadingCueCard ? 'Generating...' : 'Get New Card'}
            </button>
          </div>

          <div className={`flex-1 rounded-2xl border-2 border-dashed border-gray-200 p-6 flex flex-col ${!cueCard ? 'items-center justify-center' : ''}`}>
            {cueCard ? (
              <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                <p className="text-gray-900 font-bold text-lg leading-tight italic">Describe {cueCard.topic}</p>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase">You should say:</p>
                  <ul className="space-y-1">
                    {cueCard.bulletPoints.map((bp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-blue-500">•</span> {bp}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-gray-400 mt-4 italic font-medium">And explain why you chose this topic.</p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <span className="text-3xl opacity-20">🗂️</span>
                <p className="text-gray-400 text-sm">Click "Get New Card" to simulate Speaking Part 2.</p>
              </div>
            )}
          </div>
          {cueCard && !isActive && prepSecondsLeft === null && !showPrepChoice && (
            <p className="text-[10px] text-orange-500 font-bold uppercase mt-4 text-center">Take 1 minute to prepare before starting the session.</p>
          )}
        </div>
      </div>

      <div className="w-full">
        <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-4 px-2">Real-time Transcript</h4>
        <div className="bg-gray-100 rounded-3xl p-8 min-h-[300px] border border-gray-200 shadow-inner">
          {transcripts.length === 0 ? (
            <p className="text-gray-400 italic text-center mt-20">The conversation transcript will appear here in real-time...</p>
          ) : (
            <div className="space-y-4">
              {transcripts.map((text, i) => (
                <div key={i} className={`p-4 rounded-2xl shadow-sm ${text.startsWith('You:') ? 'bg-white ml-12 border-l-4 border-blue-500' : 'bg-blue-50 mr-12 border-l-4 border-gray-500'}`}>
                  <p className="text-gray-800 text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakingView;
