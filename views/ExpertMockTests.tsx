
import React, { useState } from 'react';
import { MOCK_SPEAKING_TESTS } from '../data/mockSpeakingTests';

const ExpertMockTests: React.FC = () => {
  const [selectedTestId, setSelectedTestId] = useState(1);
  const [activeTab, setActiveTab] = useState<'questions' | 'samples' | 'feedback'>('questions');

  const selectedTest = MOCK_SPEAKING_TESTS.find(t => t.id === selectedTestId) || MOCK_SPEAKING_TESTS[0];

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Examiner's Choice Series</h2>
          <p className="text-gray-500 mt-2 text-lg italic">Curated full-length speaking simulations with high-band sample responses.</p>
        </div>
        <div className="flex gap-2">
          {MOCK_SPEAKING_TESTS.map(t => (
            <button
              key={t.id}
              onClick={() => { setSelectedTestId(t.id); setActiveTab('questions'); }}
              className={`w-10 h-10 rounded-full font-bold transition-all ${
                selectedTestId === t.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100'
              }`}
            >
              {t.id}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex bg-gray-50 border-b border-gray-100">
          {[
            { id: 'questions', label: 'Exam Questions', icon: '❓' },
            { id: 'samples', label: 'Band 8.5+ Sample Answers', icon: '💎' },
            { id: 'feedback', label: 'Examiner Feedback', icon: '📋' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-5 px-6 font-bold text-sm flex items-center justify-center gap-2 transition-all border-b-4 ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600 bg-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-10 flex-1 overflow-y-auto">
          {activeTab === 'questions' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Part 1</span>
                  <h3 className="text-xl font-bold text-gray-900">Introduction & Interview</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTest.part1.questions.map((q, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium text-gray-700">
                      {i + 1}. {q}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Part 2</span>
                  <h3 className="text-xl font-bold text-gray-900">The Long Turn (Cue Card)</h3>
                </div>
                <div className="bg-yellow-50/50 border-2 border-dashed border-yellow-200 p-8 rounded-2xl">
                  <p className="text-xl font-bold text-gray-900 italic mb-4">Describe {selectedTest.part2.cueCard.topic}</p>
                  <p className="text-sm font-bold text-gray-400 uppercase mb-3">You should say:</p>
                  <ul className="space-y-2">
                    {selectedTest.part2.cueCard.bullets.map((b, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                        <span className="text-yellow-600">•</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Part 3</span>
                  <h3 className="text-xl font-bold text-gray-900">Two-way Discussion</h3>
                </div>
                <div className="space-y-3">
                  {selectedTest.part3.questions.map((item, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm font-medium text-gray-700">
                      • {item.q}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 max-w-4xl mx-auto">
              <div>
                <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Part 2 Sample Response</h4>
                <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm relative">
                  <span className="absolute -top-4 -left-4 text-4xl">🎙️</span>
                  <p className="text-gray-800 leading-relaxed italic text-lg font-serif">
                    "{selectedTest.part2.sampleAnswer}"
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Part 3 Discussion Analysis</h4>
                <div className="space-y-6">
                  {selectedTest.part3.questions.map((item, i) => (
                    <div key={i} className="group">
                      <p className="font-bold text-gray-900 mb-2">{item.q}</p>
                      <div className="p-6 bg-blue-50/30 rounded-2xl border border-blue-50 text-gray-700 leading-relaxed border-l-4 border-l-blue-500">
                        {item.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-gray-900 text-white p-10 rounded-3xl mb-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-3xl shadow-xl shadow-blue-500/20">🎓</div>
                  <div>
                    <h3 className="text-2xl font-bold">Examiner's Report</h3>
                    <p className="text-blue-400 font-medium">Standard Simulation Feedback</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FeedbackItem title="Fluency & Coherence" content={selectedTest.feedback.fluency} />
                  <FeedbackItem title="Lexical Resource" content={selectedTest.feedback.vocabulary} />
                  <FeedbackItem title="Grammatical Range" content={selectedTest.feedback.grammar} />
                  <FeedbackItem title="Pronunciation" content={selectedTest.feedback.pronunciation} />
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-100 p-8 rounded-3xl">
                <h4 className="text-orange-900 font-bold text-lg mb-2 flex items-center gap-2">
                  <span>💡</span> Strategy to reach Band 8.5+
                </h4>
                <p className="text-orange-800 leading-relaxed font-medium">{selectedTest.feedback.suggestions}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeedbackItem = ({ title, content }: { title: string, content: string }) => (
  <div className="space-y-2">
    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</p>
    <p className="text-gray-200 text-sm leading-relaxed">{content}</p>
  </div>
);

export default ExpertMockTests;
