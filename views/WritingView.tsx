
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { gradeWritingTask, generateWritingPrompt } from '../services/geminiService';
import { WritingFeedback } from '../types';
import Timer from '../components/Timer';

const WritingView: React.FC = () => {
  const location = useLocation();
  const cambridgeContext = location.state?.cambridgeContext;

  const [taskType, setTaskType] = useState<'Task 1' | 'Task 2'>('Task 2');
  const [prompt, setPrompt] = useState('Some people believe that the best way to control traffic congestion is to increase the price of fuel. To what extent do you agree or disagree?');
  const [submission, setSubmission] = useState('');
  const [loading, setLoading] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [isTestRunning, setIsTestRunning] = useState(false);

  useEffect(() => {
    if (cambridgeContext) {
      fetchNewPrompt();
    }
  }, [cambridgeContext, taskType]);

  const fetchNewPrompt = async () => {
    setPromptLoading(true);
    setFeedback(null);
    setSubmission('');
    setIsTestRunning(false);
    try {
      const newPrompt = await generateWritingPrompt(taskType, cambridgeContext);
      setPrompt(newPrompt);
      if (cambridgeContext) setIsTestRunning(true);
    } catch (err) {
      console.error(err);
    } finally {
      setPromptLoading(false);
    }
  };

  const handleTimeUp = useCallback(() => {
    setIsTestRunning(false);
    handleSubmit();
    alert("Time is up! Your essay has been submitted for grading.");
  }, [prompt, submission, taskType]);

  const wordCount = submission.trim() ? submission.trim().split(/\s+/).length : 0;

  const handleSubmit = async () => {
    if (wordCount < 10) return;
    setLoading(true);
    setIsTestRunning(false);
    try {
      const result = await gradeWritingTask(prompt, submission, taskType);
      setFeedback(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center sticky top-0 z-20 bg-gray-50/95 backdrop-blur py-4 border-b border-gray-200">
        <div>
          <h2 className="text-3xl font-bold">IELTS Writing Practice</h2>
          {cambridgeContext ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded">OFFICIAL SIMULATION</span>
              <p className="text-orange-600 font-bold text-sm">Cambridge IELTS {cambridgeContext.book}, Test {cambridgeContext.test}</p>
            </div>
          ) : (
            <p className="text-gray-500 mt-1 text-sm">Submit your essay for an AI-powered band score assessment.</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isTestRunning && (
            <Timer durationMinutes={taskType === 'Task 2' ? 40 : 20} onTimeUp={handleTimeUp} isActive={isTestRunning} />
          )}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setTaskType('Task 1')}
              disabled={isTestRunning}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${taskType === 'Task 1' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 opacity-50'}`}
            >
              Task 1 (20m)
            </button>
            <button
              onClick={() => setTaskType('Task 2')}
              disabled={isTestRunning}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${taskType === 'Task 2' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 opacity-50'}`}
            >
              Task 2 (40m)
            </button>
          </div>
        </div>
      </header>

      {!feedback ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Prompt</h3>
              {promptLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  Generating prompt...
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed italic border-l-4 border-orange-600 pl-4">
                  "{prompt}"
                </p>
              )}
              {!isTestRunning && (
                <button 
                  onClick={fetchNewPrompt}
                  className="mt-6 text-orange-600 text-sm font-bold hover:underline"
                >
                  Get New Prompt
                </button>
              )}
            </div>
            
            <div className="bg-orange-50 p-6 rounded-2xl">
              <h4 className="font-bold text-orange-900 mb-2">Simulation Rules</h4>
              <ul className="text-orange-800 text-sm space-y-2 list-disc list-inside">
                <li>Automatic submission at 00:00</li>
                <li>Aim for {taskType === 'Task 2' ? '250+' : '150+'} words</li>
                <li>No spell-checker (simulated)</li>
                <li>Focus on Task Response</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Essay Submission</span>
                <span className={`text-sm font-bold ${wordCount < (taskType === 'Task 2' ? 250 : 150) ? 'text-orange-500' : 'text-green-500'}`}>
                  {wordCount} words
                </span>
              </div>
              <textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                disabled={feedback !== null}
                placeholder="Start typing your official response..."
                className="w-full h-96 p-6 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none leading-relaxed font-serif text-lg"
              ></textarea>
              <button
                onClick={handleSubmit}
                disabled={loading || promptLoading || wordCount < 10}
                className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg"
              >
                {loading ? 'Examiner is reviewing...' : 'Submit for Final Grading'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
          {/* Feedback UI remains the same */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
            <div className="w-40 h-40 rounded-full border-8 border-blue-600 flex flex-col items-center justify-center bg-blue-50 shrink-0">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Estimated Band</span>
              <span className="text-5xl font-black text-blue-900">{feedback.bandScore}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Examiner Feedback</h3>
              <p className="text-gray-600 leading-relaxed">{feedback.overallComments}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-lg mb-2">Suggested Correction</h4>
              <p className="text-sm text-gray-500 whitespace-pre-wrap">{feedback.suggestedCorrection}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-lg mb-2">Criteria Breakdown</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Response:</strong> {feedback.taskResponse}</p>
                <p><strong>Cohesion:</strong> {feedback.coherenceAndCohesion}</p>
                <p><strong>Vocab:</strong> {feedback.lexicalResource}</p>
                <p><strong>Grammar:</strong> {feedback.grammaticalRange}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700"
          >
            New Practice
          </button>
        </div>
      )}
    </div>
  );
};

export default WritingView;
