import React from 'react';
import { Work, WorkRank } from '../types';
import { formatNumber } from '../utils';
import { TrendingUp, Sparkles, DollarSign, MessageCircle, Heart, Eye, Disc } from 'lucide-react';

interface Props {
  works: Work[];
  onPolish: (workId: string) => void;
  onPromote: (workId: string) => void;
  canAffordPolish: boolean;
  canAffordPromote: boolean;
}

const WorkList: React.FC<Props> = ({ works, onPolish, onPromote, canAffordPolish, canAffordPromote }) => {
  if (works.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
        <p>还没有作品，快去产粮吧！</p>
      </div>
    );
  }

  const getRankColor = (rank: WorkRank) => {
    switch (rank) {
      case WorkRank.SSR: return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-200';
      case WorkRank.S: return 'bg-purple-100 text-purple-700 border-purple-200 border';
      case WorkRank.A: return 'bg-blue-50 text-blue-600 border-blue-200 border';
      case WorkRank.B: return 'bg-gray-50 text-gray-500 border-gray-200 border';
    }
  };

  return (
    <div className="space-y-4">
      {works.slice().reverse().map((work) => (
        <div key={work.id} className={`relative p-4 bg-white rounded-xl shadow-sm border ${work.isViral ? 'border-yellow-400 shadow-yellow-100 ring-2 ring-yellow-100' : 'border-gray-100'}`}>
          {work.isViral && (
            <div className="absolute -top-3 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce shadow-sm">
              爆款 🔥
            </div>
          )}
          
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${getRankColor(work.rank)}`}>
                  {work.rank}
                </span>
                <h3 className="font-bold text-gray-800 line-clamp-1">{work.title}</h3>
              </div>
              <p className="text-xs text-gray-400 mt-1">质量: {work.quality}/100 | 潜力系数: {work.potential.toFixed(1)}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-emerald-600 flex items-center justify-end gap-1">
                <DollarSign size={12} />
                {formatNumber(work.income)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center bg-gray-50 p-2 rounded-lg">
              <Eye size={14} className="text-gray-400 mb-1" />
              <span className="text-xs font-medium text-gray-600">{formatNumber(work.views)}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-50 p-2 rounded-lg">
              <Heart size={14} className="text-rose-400 mb-1" />
              <span className="text-xs font-medium text-gray-600">{formatNumber(work.likes)}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-50 p-2 rounded-lg">
              <MessageCircle size={14} className="text-blue-400 mb-1" />
              <span className="text-xs font-medium text-gray-600">{formatNumber(work.comments)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onPolish(work.id)}
              disabled={!canAffordPolish || work.quality >= 100}
              className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-lg transition-colors
                ${!canAffordPolish || work.quality >= 100 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
            >
              <Sparkles size={14} />
              精修 (-1 AP)
            </button>
            <button
              onClick={() => onPromote(work.id)}
              disabled={!canAffordPromote}
              className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-lg transition-colors
                ${!canAffordPromote ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-pink-50 text-pink-600 hover:bg-pink-100'}`}
            >
              <TrendingUp size={14} />
              买热度
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkList;