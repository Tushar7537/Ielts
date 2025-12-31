
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Reading', path: '/reading', icon: '📖' },
    { name: 'Writing', path: '/writing', icon: '✍️' },
    { name: 'Speaking', path: '/speaking', icon: '🎙️' },
    { name: 'Listening', path: '/listening', icon: '🎧' },
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <span>🎓</span> IELTS Master
        </h1>
      </div>
      <div className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-600 text-white p-4 rounded-xl">
          <p className="text-xs font-medium">Ready for the real test?</p>
          <button className="mt-2 w-full bg-white text-blue-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
            Book Mock Exam
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
