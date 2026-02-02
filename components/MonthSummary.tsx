import React from 'react';
import { GameLog, GameState } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowRight, MessageCircle } from 'lucide-react';

interface Props {
  gameState: GameState;
  onNextMonth: () => void;
  monthlyIncome: number;
  monthlyFans: number;
  newCommentsCount: number;
}

const MonthSummary: React.FC<Props> = ({ gameState, onNextMonth, monthlyIncome, monthlyFans, newCommentsCount }) => {
  const data = gameState.monthlyStats.slice(-6); // Show last 6 months

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div className="p-6 bg-emerald-600 text-white shrink-0">
          <h2 className="text-2xl font-bold text-center">第 {gameState.month} 月总结</h2>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center">
              <div className="text-emerald-200 text-xs">本月收入</div>
              <div className="text-xl font-bold">+{monthlyIncome}</div>
            </div>
            <div className="text-center">
              <div className="text-emerald-200 text-xs">新增粉丝</div>
              <div className="text-xl font-bold">+{monthlyFans}</div>
            </div>
            <div className="text-center">
              <div className="text-emerald-200 text-xs">新增互动</div>
              <div className="text-xl font-bold flex items-center justify-center gap-1">
                 <MessageCircle size={14}/> {newCommentsCount}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="font-bold text-gray-700 mb-4">近期趋势</h3>
          <div className="h-40 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="month" hide />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="fans" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <h3 className="font-bold text-gray-700 mb-2">本月动态</h3>
          <div className="space-y-2 mb-6">
            {gameState.logs.filter(l => l.month === gameState.month).map((log, idx) => (
              <div key={idx} className={`text-sm p-2 rounded ${
                log.type === 'positive' ? 'bg-green-50 text-green-700' :
                log.type === 'negative' ? 'bg-red-50 text-red-700' :
                log.type === 'viral' ? 'bg-yellow-50 text-yellow-800 font-bold border border-yellow-200' :
                log.type === 'rankup' ? 'bg-purple-50 text-purple-800 font-bold border border-purple-200' :
                'bg-gray-50 text-gray-600'
              }`}>
                {log.message}
              </div>
            ))}
            {gameState.logs.filter(l => l.month === gameState.month).length === 0 && (
              <div className="text-center text-gray-400 text-sm italic">本月无事发生</div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
           <button
            onClick={onNextMonth}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-200"
          >
            开始下个月 <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthSummary;