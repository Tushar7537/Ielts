
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Reading', score: 7.5, color: '#3b82f6' },
  { name: 'Listening', score: 8.0, color: '#10b981' },
  { name: 'Writing', score: 6.5, color: '#f59e0b' },
  { name: 'Speaking', score: 7.0, color: '#ef4444' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, Scholar!</h2>
        <p className="text-gray-500 mt-2 text-lg">Your journey to a Band 9.0 starts here.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {data.map((item) => (
          <div key={item.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{item.name}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-bold text-gray-900">{item.score}</span>
              <span className="text-gray-400">/ 9.0</span>
            </div>
            <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ width: `${(item.score / 9) * 100}%`, backgroundColor: item.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6">Performance Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 9]} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Quick Start Practice</h3>
          </div>
          <div className="space-y-4">
            <div 
              onClick={() => navigate('/listening', { state: { cambridgeContext: { book: 20, test: 1 } } })}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:shadow-lg transition-all cursor-pointer group scale-100 hover:scale-[1.02]"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl shadow-lg shadow-black/20 group-hover:rotate-12 transition-transform">🎧</div>
              <div className="flex-1">
                <h4 className="font-black italic">CAMBRIDGE 20 - TEST 1</h4>
                <p className="text-xs text-white/70">Authentic 40-Question Practice</p>
              </div>
              <span className="px-2 py-1 bg-yellow-400 text-black text-[10px] font-black rounded uppercase">Featured</span>
            </div>
            <div 
              onClick={() => navigate('/speaking')}
              className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-red-200">🎙️</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">AI Speaking Coach</h4>
                <p className="text-sm text-gray-500">Real-time interview simulation</p>
              </div>
              <span className="text-red-600 text-sm font-bold">Live</span>
            </div>
            <div 
              onClick={() => navigate('/writing')}
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">✍️</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Writing Review</h4>
                <p className="text-sm text-gray-500">Automated band score grading</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
