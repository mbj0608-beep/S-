import React, { useState, useEffect } from 'react';
import { RoleType } from '../types';
import { ROLE_CONFIG } from '../constants';
import { generateInitialStats, getRandomName } from '../utils';
import { PenTool, BookOpen, User, Dices, RefreshCw } from 'lucide-react';

interface Props {
  onStartGame: (role: RoleType, name: string, stats: { money: number, inspiration: number, skill: number }) => void;
}

const StartScreen: React.FC<Props> = ({ onStartGame }) => {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType>(RoleType.ARTIST);
  const [stats, setStats] = useState({ money: 0, inspiration: 0, skill: 0 });

  // Roll stats whenever role changes
  useEffect(() => {
    rollStats(selectedRole);
  }, [selectedRole]);

  const rollStats = (role: RoleType) => {
    setStats(generateInitialStats(role));
  };

  const handleRandomName = () => {
    setName(getRandomName());
  };

  const getIcon = (role: RoleType) => {
    switch (role) {
      case RoleType.ARTIST: return <PenTool className="w-6 h-6" />;
      case RoleType.WRITER: return <BookOpen className="w-6 h-6" />;
      case RoleType.COSPLAYER: return <User className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">S级太太：产粮模拟器</h1>
        <p className="text-center text-gray-500 mb-6">创建你的创作者档案</p>
        
        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">昵称</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入你的ID"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button 
              onClick={handleRandomName}
              className="bg-emerald-100 text-emerald-700 p-3 rounded-xl hover:bg-emerald-200 transition-colors"
            >
              <Dices size={24} />
            </button>
          </div>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">选择身份</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(RoleType).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  selectedRole === role 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-emerald-200'
                }`}
              >
                {getIcon(role)}
                <span className="text-sm font-bold mt-1">{role}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 italic text-center">
            {ROLE_CONFIG[selectedRole].desc}
          </p>
        </div>

        {/* Stats Preview */}
        <div className="mb-8 bg-gray-50 rounded-2xl p-5 border border-gray-100 relative">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-bold text-gray-700">初始属性 (随机)</label>
            <button 
              onClick={() => rollStats(selectedRole)}
              className="flex items-center gap-1 text-xs text-emerald-600 bg-white px-2 py-1 rounded-full shadow-sm hover:shadow active:scale-95 transition-all"
            >
              <RefreshCw size={12} /> 重置
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-400 mb-1">资金</div>
              <div className="font-bold text-lg text-gray-800">{stats.money}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">灵感</div>
              <div className="font-bold text-lg text-blue-600">{stats.inspiration}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">技巧</div>
              <div className="font-bold text-lg text-purple-600">{stats.skill}</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (!name) return alert("请输入名字");
            onStartGame(selectedRole, name, stats);
          }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95"
        >
          开始产粮
        </button>
      </div>
    </div>
  );
};

export default StartScreen;