import React from 'react';
import { GameState, Course } from '../types';
import { TRAINING_COURSES } from '../constants';
import { School, ArrowUpCircle, Disc } from 'lucide-react';

interface Props {
  gameState: GameState;
  onTakeCourse: (course: Course) => void;
}

const TrainingCenter: React.FC<Props> = ({ gameState, onTakeCourse }) => {
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <School className="text-blue-200" /> 进修中心
        </h2>
        <p className="text-blue-100 text-sm">通过学习提升技巧和灵感，为创作更高质量的作品打下基础。</p>
      </div>

      <div className="grid gap-4">
        {TRAINING_COURSES.map(course => {
          const canAfford = gameState.money >= course.costMoney;
          const hasAp = gameState.actionPoints >= course.costAp;
          
          return (
            <button
              key={course.id}
              onClick={() => onTakeCourse(course)}
              disabled={!canAfford || !hasAp}
              className={`relative bg-white p-5 rounded-xl shadow-sm border text-left transition-all ${
                !canAfford || !hasAp 
                  ? 'opacity-60 grayscale border-gray-200 cursor-not-allowed' 
                  : 'border-blue-100 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800 text-lg">{course.name}</h3>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold">
                  {course.effectDesc}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{course.description}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <span className={`font-medium flex items-center gap-1 ${hasAp ? 'text-gray-600' : 'text-red-500'}`}>
                   <Disc size={14} /> -{course.costAp} AP
                </span>
                <span className={`font-medium ${canAfford ? 'text-gray-600' : 'text-red-500'}`}>
                   💰 -{course.costMoney} 金币
                </span>
              </div>

              {(!canAfford || !hasAp) && (
                <div className="absolute top-2 right-2 text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">
                  {!hasAp ? 'AP不足' : '金币不足'}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-xs text-orange-700">
        <h4 className="font-bold mb-1 flex items-center gap-1"><ArrowUpCircle size={14}/> 提示</h4>
        技巧属性越高，越容易产出S级和SSR级作品；灵感是创作的消耗品；心情值过低会增加创作失败率。
      </div>
    </div>
  );
};

export default TrainingCenter;