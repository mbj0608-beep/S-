import React, { useState } from 'react';
import { CreationStage, RoleType, WorkRank } from '../types';
import { CREATION_STAGES } from '../constants';
import { calculateRank, generateId, getRandomTitle } from '../utils';
import { BrainCircuit, Sparkles, AlertTriangle, ArrowRight, Lock, Crown, AlertOctagon } from 'lucide-react';

interface Props {
  role: RoleType;
  skill: number;
  inspiration: number;
  onComplete: (quality: number, potential: number, title: string, fameMod: number, aiSuspicionMod: number) => void;
  onCancel: () => void;
}

const CreationWizard: React.FC<Props> = ({ role, skill, inspiration, onComplete, onCancel }) => {
  const [step, setStep] = useState(0); // 0: Title Input, 1-3: Stages
  const [title, setTitle] = useState('');
  const [accumulatedQuality, setAccumulatedQuality] = useState(0);
  const [accumulatedPotential, setAccumulatedPotential] = useState(1.0);
  const [accumulatedFame, setAccumulatedFame] = useState(0);
  const [accumulatedAiSuspicion, setAccumulatedAiSuspicion] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Initialize random title
  useState(() => {
    setTitle(getRandomTitle());
  });

  const handleStageChoice = (
    qualityMod: number, 
    potentialMod: number, 
    risk: number, 
    text: string, 
    fameMod: number = 0, 
    aiSuspicionMod: number = 0
  ) => {
    let actualQuality = qualityMod;
    let actualPotential = potentialMod;
    let logMsg = `选择了【${text}】: `;

    // Risk Check
    const roll = Math.random() * 100;
    if (roll < risk) {
      actualQuality = Math.floor(qualityMod * 0.5); // Penalty on failure
      actualPotential = potentialMod * 0.8;
      logMsg += `遇到困难！效果打折。`;
    } else {
      logMsg += `进行顺利！`;
    }

    setAccumulatedQuality(prev => prev + actualQuality);
    setAccumulatedPotential(prev => prev + actualPotential);
    setAccumulatedFame(prev => prev + fameMod);
    setAccumulatedAiSuspicion(prev => prev + aiSuspicionMod);
    setLogs(prev => [...prev, logMsg]);
  };

  const renderStage = (stageIndex: number) => {
    const stage = CREATION_STAGES[stageIndex];
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold">
           <BrainCircuit size={20} /> 阶段 {stageIndex + 1}/{CREATION_STAGES.length}: {stage.title}
        </div>
        <p className="text-gray-600 mb-6">{stage.description}</p>
        
        <div className="space-y-3">
          {stage.options.map((opt, idx) => {
            const reqSkillMet = !opt.reqSkill || skill >= opt.reqSkill;
            const reqInspMet = !opt.reqInspiration || inspiration >= opt.reqInspiration;
            const isLocked = !reqSkillMet || !reqInspMet;

            return (
              <button
                key={idx}
                onClick={() => {
                  if (isLocked) {
                    let msg = "条件不足: ";
                    if (!reqSkillMet) msg += `需要技巧 ${opt.reqSkill} `;
                    if (!reqInspMet) msg += `需要灵感 ${opt.reqInspiration}`;
                    setFeedback(msg);
                    setTimeout(() => setFeedback(null), 2000);
                    return;
                  }
                  
                  handleStageChoice(opt.qualityMod, opt.potentialMod, opt.risk, opt.text, opt.fameMod, opt.aiSuspicionMod);
                  setStep(s => s + 1);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all group relative ${
                  isLocked 
                    ? 'bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed' 
                    : 'bg-white border-gray-200 hover:border-emerald-500 hover:bg-emerald-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="font-bold text-gray-800">{opt.text}</div>
                  {isLocked && <Lock size={16} className="text-gray-400"/>}
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  {opt.qualityMod !== 0 && (
                     <span className={opt.qualityMod > 0 ? "text-green-600" : "text-red-500"}>
                       质量{opt.qualityMod > 0 ? '+' : ''}{opt.qualityMod}
                     </span>
                  )}
                  {opt.potentialMod !== 0 && (
                     <span className="text-blue-600">
                       潜力{opt.potentialMod > 0 ? '+' : ''}{opt.potentialMod}
                     </span>
                  )}
                  {opt.risk > 0 && (
                     <span className="text-orange-500 flex items-center gap-1">
                       <AlertTriangle size={10} /> 风险 {opt.risk}%
                     </span>
                  )}
                  {opt.fameMod && opt.fameMod !== 0 && (
                    <span className="text-purple-600 flex items-center gap-1">
                      <Crown size={10} /> 名气{opt.fameMod > 0 ? '+' : ''}{opt.fameMod}
                    </span>
                  )}
                  {opt.aiSuspicionMod && opt.aiSuspicionMod > 0 && (
                    <span className="text-red-600 flex items-center gap-1">
                      <AlertOctagon size={10} /> 嫌疑+{opt.aiSuspicionMod}
                    </span>
                  )}
                  {opt.aiSuspicionMod && opt.aiSuspicionMod < 0 && (
                    <span className="text-green-600 flex items-center gap-1">
                      <AlertOctagon size={10} /> 嫌疑{opt.aiSuspicionMod}
                    </span>
                  )}
                </div>
                
                {isLocked && (
                  <div className="mt-2 text-xs text-red-500 font-bold bg-red-50 p-1 rounded inline-block">
                    {!reqSkillMet ? `需技巧 ${opt.reqSkill}` : ''} {!reqInspMet ? `需灵感 ${opt.reqInspiration}` : ''}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {feedback && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in z-[60]">
            {feedback}
          </div>
        )}
      </div>
    );
  };

  if (step === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">开始新创作</h2>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">作品标题</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button 
              onClick={() => setTitle(getRandomTitle())}
              className="text-xs text-emerald-600 mt-2 hover:underline"
            >
              随机标题
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-3 text-gray-500 hover:bg-gray-100 rounded-xl">取消</button>
            <button 
              onClick={() => setStep(1)}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700"
            >
              下一步
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Summary / Finalizing Logic wrapper
  if (step > CREATION_STAGES.length) {
    return (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-fade-in text-center">
          <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">创作完成！</h2>
          <p className="text-gray-500 mb-6">正在生成最终作品...</p>
          <button 
            onClick={() => onComplete(accumulatedQuality, accumulatedPotential, title, accumulatedFame, accumulatedAiSuspicion)}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold"
          >
            查看结果
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Progress */}
        <div className="flex gap-1 mb-6">
          {CREATION_STAGES.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i < step - 1 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* Current Stats */}
        <div className="flex justify-between bg-gray-50 p-3 rounded-xl mb-6 text-sm">
           <div className="text-gray-600">当前累计:</div>
           <div className="font-bold text-emerald-600">质量 {accumulatedQuality > 0 ? '+' : ''}{accumulatedQuality}</div>
           <div className="font-bold text-blue-600">潜力 x{accumulatedPotential.toFixed(1)}</div>
        </div>

        {/* Stage Content */}
        {renderStage(step - 1)}

        {/* Logs */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1">
           {logs.map((log, i) => <div key={i}>• {log}</div>)}
        </div>
      </div>
    </div>
  );
};

export default CreationWizard;