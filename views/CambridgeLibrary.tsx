
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CambridgeLibrary: React.FC = () => {
  const navigate = useNavigate();
  const books = Array.from({ length: 20 }, (_, i) => 20 - i); // Books 20 down to 1

  const handleStartTest = (book: number, test: number, module: string) => {
    const path = `/${module.toLowerCase()}`;
    navigate(path, { state: { cambridgeContext: { book, test } } });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-gray-900">Cambridge IELTS Series</h2>
        <p className="text-gray-500 mt-2 text-lg">Official practice materials simulated from Books 1 to 20.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((bookNum) => (
          <BookCard 
            key={bookNum} 
            number={bookNum} 
            onSelect={(test, module) => handleStartTest(bookNum, test, module)}
          />
        ))}
      </div>
    </div>
  );
};

interface BookCardProps {
  number: number;
  onSelect: (test: number, module: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ number, onSelect }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedTest, setSelectedTest] = useState(1);
  const isModern = number >= 11;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <div className={`h-48 flex items-center justify-center relative overflow-hidden ${
        isModern ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-gray-700 to-gray-900'
      }`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="text-center text-white relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Cambridge</p>
          <p className="text-6xl font-black">{number}</p>
          <p className="text-xs mt-2 font-medium bg-white/20 px-2 py-0.5 rounded-full inline-block">
            {isModern ? 'Modern Syllabus' : 'Classic Series'}
          </p>
        </div>
      </div>
      
      <div className="p-4">
        {!showOptions ? (
          <button 
            onClick={() => setShowOptions(true)}
            className="w-full py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors"
          >
            Practice This Book
          </button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
               <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Select Test</p>
               <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(t => (
                  <button 
                    key={t}
                    onClick={() => setSelectedTest(t)}
                    className={`py-1 rounded-lg text-xs font-bold transition-colors ${
                      selectedTest === t 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    T{t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-1">
              {['Reading', 'Listening', 'Writing'].map(module => (
                <button
                  key={module}
                  onClick={() => onSelect(selectedTest, module)}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg flex justify-between items-center transition-colors"
                >
                  {module} Practice <span>→</span>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowOptions(false)}
              className="w-full text-center text-[10px] text-gray-400 font-bold uppercase hover:text-gray-600"
            >
              Back to Preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CambridgeLibrary;
