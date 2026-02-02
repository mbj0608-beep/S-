import React, { useState, useEffect, useRef } from 'react';
import { GameState, RoleType, Work, GameLog, GameEvent, Course, Comment, WorkRank } from './types';
import { MAX_MONTHS, ACTION_COSTS, EVENTS_DATA, WORK_EVENTS_DATA, CREATOR_RANKS } from './constants';
import { formatNumber, generateComments, getCurrentRank, generateId } from './utils';
import StartScreen from './components/StartScreen';
import WorkList from './components/WorkList';
import MonthSummary from './components/MonthSummary';
import UserProfile from './components/UserProfile';
import TrainingCenter from './components/TrainingCenter';
import CreationWizard from './components/CreationWizard';
import NavBar, { ViewType } from './components/NavBar';
import { Heart, Zap, Coins, Star, AlertCircle, Clock, Circle, Disc, Skull } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    isGameOver: false,
    gameStarted: false,
    playerName: '',
    role: null,
    month: 1,
    rankTitle: CREATOR_RANKS[0].title,
    money: 0,
    actionPoints: 100,
    maxActionPoints: 100,
    inspiration: 0,
    skill: 0,
    fans: 0,
    mood: 100,
    fame: 0,
    aiSuspicion: 0,
    works: [],
    inbox: [],
    logs: [],
    monthlyStats: []
  });

  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [tempMonthlyData, setTempMonthlyData] = useState({ income: 0, fans: 0, newComments: 0 });
  const [currentView, setCurrentView] = useState<ViewType>('create');

  const startGame = (role: RoleType, name: string, stats: { money: number, inspiration: number, skill: number }) => {
    setGameState({
      ...gameState,
      gameStarted: true,
      role,
      playerName: name,
      money: stats.money,
      inspiration: stats.inspiration,
      skill: stats.skill,
      fans: 100,
      logs: [{ month: 1, message: `你开始了你的${role}生涯！`, type: 'neutral' }]
    });
  };

  const addLog = (message: string, type: GameLog['type'] = 'neutral') => {
    setGameState(prev => ({
      ...prev,
      logs: [...prev.logs, { month: prev.month, message, type }]
    }));
  };

  const checkAp = (cost: number) => {
    if (gameState.actionPoints < cost) {
      alert("行动点不足！请结束本月进入下一回合。");
      return false;
    }
    return true;
  };

  const handleCreateStart = () => {
    const cost = ACTION_COSTS.CREATE;
    if (!checkAp(cost.ap)) return;
    if (gameState.inspiration < cost.inspiration) {
      alert("灵感枯竭！请去采风学习。");
      return;
    }
    setIsCreating(true);
  };

  const handleCreateComplete = (
    qualityMod: number, 
    potentialMod: number, 
    title: string, 
    fameMod: number, 
    aiSuspicionMod: number
  ) => {
    setIsCreating(false);
    const cost = ACTION_COSTS.CREATE;
    
    setGameState(prev => {
      let baseQuality = 40 + (prev.skill * 0.5) + qualityMod;
      baseQuality = Math.min(100, Math.max(10, Math.floor(baseQuality)));
      
      let basePotential = 1.0 + potentialMod;
      
      let rank = WorkRank.B;
      if (baseQuality > 90) rank = WorkRank.SSR;
      else if (baseQuality > 75) rank = WorkRank.S;
      else if (baseQuality > 60) rank = WorkRank.A;

      const newWork: Work = {
        id: generateId(),
        title: title,
        type: prev.role!,
        rank: rank,
        quality: baseQuality,
        potential: basePotential,
        views: 0,
        likes: 0,
        comments: 0,
        income: 0,
        isViral: false,
        createdAtMonth: prev.month
      };

      addLog(`创作了《${title}》，评级：${rank} (质量${baseQuality})`, 'positive');

      return {
        ...prev,
        actionPoints: prev.actionPoints - cost.ap,
        inspiration: prev.inspiration - cost.inspiration,
        fame: prev.fame + fameMod,
        aiSuspicion: Math.max(0, prev.aiSuspicion + aiSuspicionMod),
        works: [...prev.works, newWork]
      };
    });
    
    setCurrentView('works');
  };

  const handleRest = () => {
    const cost = ACTION_COSTS.REST;
    if (!checkAp(cost.ap)) return;

    setGameState(prev => ({
      ...prev,
      actionPoints: prev.actionPoints - cost.ap,
      mood: Math.min(100, prev.mood + 20),
      inspiration: prev.inspiration + 5
    }));
    addLog(`好好休息了一阵，心情和灵感恢复了。`, 'neutral');
  };

  const handleCourse = (course: Course) => {
    if (!checkAp(course.costAp)) return;
    
    setGameState(prev => {
      const effect = course.effect(prev);
      return {
        ...prev,
        ...effect,
        actionPoints: prev.actionPoints - course.costAp,
        money: prev.money - course.costMoney,
        logs: [...prev.logs, { month: prev.month, message: `完成了${course.name}，${course.effectDesc}`, type: 'positive' }]
      };
    });
  };

  const handlePolish = (workId: string) => {
    const cost = ACTION_COSTS.POLISH;
    if (!checkAp(cost.ap)) return;
    
    setGameState(prev => ({
      ...prev,
      actionPoints: prev.actionPoints - cost.ap,
      works: prev.works.map(w => {
        if (w.id === workId) {
          const qualityGain = Math.floor(Math.random() * 8) + 3;
          return { ...w, quality: Math.min(100, w.quality + qualityGain) };
        }
        return w;
      })
    }));
    addLog("精修了作品，质量提升了！", 'neutral');
  };

  const handlePromote = (workId: string) => {
    const cost = ACTION_COSTS.PROMOTE;
    if (gameState.money < cost.money) return alert("资金不足");
    if (cost.ap > 0 && !checkAp(cost.ap)) return;

    setGameState(prev => ({
      ...prev,
      money: prev.money - cost.money,
      actionPoints: prev.actionPoints - cost.ap,
      works: prev.works.map(w => {
        if (w.id === workId) {
          return { ...w, views: w.views + 2000 + (prev.fans * 3) };
        }
        return w;
      })
    }));
    addLog("购买了流量包，浏览量提升了！", 'neutral');
  };

  const handleInteractComment = (commentId: string, action: 'like' | 'reply') => {
     setGameState(prev => ({
       ...prev,
       mood: action === 'like' ? Math.min(100, prev.mood + 1) : prev.mood,
       fans: action === 'reply' ? prev.fans + 10 : prev.fans,
       inbox: prev.inbox.map(c => {
         if (c.id === commentId) {
           return {
             ...c,
             isLiked: action === 'like' ? true : c.isLiked,
             isReplied: action === 'reply' ? true : c.isReplied,
             rewardClaimed: true
           };
         }
         return c;
       })
     }));
  };

  // --- 修改重点：全新的回合结束逻辑 ---
  const endMonth = () => {
    // 1. 游戏结束检查 (AI 嫌疑值过高)
    if (gameState.aiSuspicion >= 100) {
      setGameState(prev => ({ ...prev, isGameOver: true, gameOverReason: "你的AI创作行为引起了公愤，被全平台封杀，名声扫地！" }));
      return;
    }

    let monthlyIncome = 0;
    let monthlyFans = 0;
    let newWorks = [...gameState.works];

    // 2. 计算作品自然流量收益
    newWorks = newWorks.map(work => {
      const age = gameState.month - work.createdAtMonth;
      const decay = Math.max(0.1, 1 - (age * 0.2)); 
      
      let viralBonus = 1;
      if (!work.isViral && Math.random() < (work.potential * work.quality / 3000)) {
         work.isViral = true;
         addLog(`作品《${work.title}》突然爆火了！全网热议！`, 'viral');
      }
      if (work.isViral) viralBonus = 4; 

      const newViews = Math.floor((150 + (gameState.fans * 0.15)) * work.potential * decay * viralBonus);
      const newLikes = Math.floor(newViews * (work.quality / 150));
      const newComments = Math.floor(newLikes * 0.15);
      
      const income = Math.floor((newViews * 0.02) + (newLikes * 0.1));

      monthlyIncome += income;
      monthlyFans += Math.floor(newLikes * 0.3);

      return {
        ...work,
        views: work.views + newViews,
        likes: work.likes + newLikes,
        comments: work.comments + newComments,
        income: work.income + income
      };
    });

    // 3. 计算作品突发事件 (0-3个)
    let eventFansChange = 0;
    let eventFameChange = 0;
    let eventMoodChange = 0;
    let eventAiChange = 0;

    // 随机决定本月触发几个作品事件 (0 到 3 个)
    const numWorkEvents = Math.floor(Math.random() * 4); 

    for (let i = 0; i < numWorkEvents; i++) {
      if (newWorks.length === 0) break; // 如果没作品就不触发
      
      // 随机选一个作品，再随机选一个事件
      const targetWorkIndex = Math.floor(Math.random() * newWorks.length);
      const workEvent = WORK_EVENTS_DATA[Math.floor(Math.random() * WORK_EVENTS_DATA.length)];
      
      // 执行事件效果
      const targetWork = newWorks[targetWorkIndex];
      const result = workEvent.effect(targetWork, gameState);
      
      // 更新作品状态
      newWorks[targetWorkIndex] = { ...targetWork, ...result.workUpdate };
      
      // 累加事件带来的主角属性变化
      if (result.stateUpdate.fans !== undefined) eventFansChange += (result.stateUpdate.fans - gameState.fans);
      if (result.stateUpdate.fame !== undefined) eventFameChange += (result.stateUpdate.fame - gameState.fame);
      if (result.stateUpdate.mood !== undefined) eventMoodChange += (result.stateUpdate.mood - gameState.mood);
      if (result.stateUpdate.aiSuspicion !== undefined) eventAiChange += (result.stateUpdate.aiSuspicion - gameState.aiSuspicion);

      addLog(result.log, 'neutral');
    }

    // 4. 生成新评论
    const totalNewFans = monthlyFans + eventFansChange;
    const newCommentsCount = Math.max(1, Math.floor(totalNewFans / 40));
    const newComments = generateComments(Math.min(6, newCommentsCount)); 

    // 5. 检查段位升级
    const newTotalFans = gameState.fans + totalNewFans;
    const newRank = getCurrentRank(newTotalFans);
    let rankUpMsg = "";
    if (newRank.title !== gameState.rankTitle) {
      rankUpMsg = `恭喜！你的创作等级提升为【${newRank.title}】！`;
    }

    // 6. 必然触发每月大事件
    const event = EVENTS_DATA[Math.floor(Math.random() * EVENTS_DATA.length)];
    setActiveEvent(event);

    // 7. 更新UI显示数据
    setTempMonthlyData({ income: monthlyIncome, fans: totalNewFans, newComments: newComments.length });
    setShowSummary(true);

    // 8. 统一更新游戏状态
    setGameState(prev => {
      if (rankUpMsg) addLog(rankUpMsg, 'rankup');
      
      return {
        ...prev,
        works: newWorks,
        money: prev.money + monthlyIncome,
        fans: Math.max(0, prev.fans + totalNewFans),
        fame: prev.fame + eventFameChange,
        mood: Math.min(100, Math.max(0, prev.mood + eventMoodChange)),
        aiSuspicion: Math.max(0, prev.aiSuspicion + eventAiChange),
        inbox: [...newComments, ...prev.inbox].slice(0, 50),
        rankTitle: newRank.title,
        actionPoints: prev.maxActionPoints, // 每月回满体力
        monthlyStats: [...prev.monthlyStats, { month: prev.month, income: monthlyIncome, fans: totalNewFans }]
      };
    });
  };
  // --- 回合结束逻辑修改完毕 ---

  const handleNextMonth = () => {
    setShowSummary(false);
    setGameState(prev => ({
      ...prev,
      month: prev.month + 1,
    }));
    
    if (gameState.month >= MAX_MONTHS) {
       setGameState(prev => ({...prev, isGameOver: true, gameOverReason: `游戏结束！最终粉丝数：${gameState.fans}，总资产：${gameState.money}`}));
    }
  };

  const handleEventChoice = (effect: (state: GameState) => Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...effect(prev) }));
    setActiveEvent(null);
  };

  if (!gameState.gameStarted) {
    return <StartScreen onStartGame={startGame} />;
  }

  // Game Over Screen
  if (gameState.isGameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-fade-in">
           <div className="flex justify-center mb-4 text-red-500">
             <Skull size={64} />
           </div>
           <h2 className="text-3xl font-bold text-gray-800 mb-4">GAME OVER</h2>
           <p className="text-gray-600 mb-8">{gameState.gameOverReason}</p>
           <div className="grid grid-cols-2 gap-4 text-left bg-gray-50 p-4 rounded-xl mb-6">
             <div>
               <div className="text-xs text-gray-500">最终名气</div>
               <div className="font-bold">{gameState.fame}</div>
             </div>
             <div>
               <div className="text-xs text-gray-500">最终粉丝</div>
               <div className="font-bold">{formatNumber(gameState.fans)}</div>
             </div>
           </div>
           <button onClick={() => window.location.reload()} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">
             重新开始
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden relative flex flex-col">
      
      {/* Sticky Header */}
      <div className="bg-white px-4 pt-4 pb-2 shadow-sm z-30 sticky top-0 border-b border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">第{gameState.month}月</span>
            <div className="flex flex-col leading-tight">
               <span className="text-gray-800 font-bold text-sm">{gameState.playerName}</span>
               <span className="text-gray-500 text-xs">{gameState.rankTitle}</span>
            </div>
          </div>
          <div className="text-emerald-700 font-bold flex items-center gap-1">
             <Coins size={14} /> {formatNumber(gameState.money)}
          </div>
        </div>

        {/* AP Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className="flex items-center gap-1 font-bold"><Disc size={12}/> 行动点 (AP)</span>
            <span>{gameState.actionPoints}/{gameState.maxActionPoints}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-300 ${gameState.actionPoints < 20 ? 'bg-red-500' : 'bg-emerald-500'}`} 
              style={{ width: `${(gameState.actionPoints / gameState.maxActionPoints) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Attribute Pills */}
        <div className="flex justify-between gap-2 mt-2">
          <div className="flex-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs flex items-center justify-center gap-1">
            <Zap size={12}/> 灵感 {gameState.inspiration}
          </div>
          <div className="flex-1 bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs flex items-center justify-center gap-1">
            <Star size={12}/> 技巧 {gameState.skill}
          </div>
          <div className="flex-1 bg-pink-50 text-pink-700 px-2 py-1 rounded text-xs flex items-center justify-center gap-1">
            <Heart size={12}/> 心情 {gameState.mood}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 pb-24 overflow-y-auto">
        {currentView === 'create' && (
          <div className="space-y-6 animate-fade-in">
             {/* Main Actions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                <Clock size={18} className="text-emerald-500" /> 本月安排
              </h2>
              <div className="space-y-3">
                <button 
                  onClick={handleCreateStart}
                  className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-100 text-emerald-800 p-4 rounded-xl flex justify-between items-center transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎨</span>
                    <div className="text-left">
                      <div className="font-bold">进行创作</div>
                      <div className="text-xs text-emerald-600 mt-0.5">三阶段创作模式</div>
                    </div>
                  </div>
                  <div className="text-right text-xs opacity-60 group-hover:opacity-100">
                    <div className="flex items-center gap-1 justify-end"> <Disc size={10} /> -{ACTION_COSTS.CREATE.ap} AP</div>
                    <div className="text-blue-600">-{ACTION_COSTS.CREATE.inspiration} 灵感</div>
                  </div>
                </button>

                <button 
                  onClick={handleRest}
                  className="w-full bg-orange-50 hover:bg-orange-100 border border-orange-100 text-orange-800 p-4 rounded-xl flex justify-between items-center transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">☕</span>
                    <div className="text-left">
                      <div className="font-bold">摸鱼休息</div>
                      <div className="text-xs text-orange-600 mt-0.5">恢复行动力与心情</div>
                    </div>
                  </div>
                  <div className="text-right text-xs opacity-60 group-hover:opacity-100">
                    <div className="flex items-center gap-1 justify-end"> <Disc size={10} /> -{ACTION_COSTS.REST.ap} AP</div>
                    <div className="text-green-600">灵感+5</div>
                  </div>
                </button>
              </div>
            </div>

            <button 
              onClick={endMonth}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-gray-200 transition-all"
            >
              <span className="text-xl">🌙</span> 结束本月 (结算)
            </button>
          </div>
        )}

        {currentView === 'works' && (
          <div className="animate-fade-in">
            <h2 className="text-gray-800 font-bold mb-3 px-1">作品管理</h2>
            <WorkList 
              works={gameState.works}
              onPolish={handlePolish}
              onPromote={handlePromote}
              canAffordPolish={gameState.actionPoints >= ACTION_COSTS.POLISH.ap}
              canAffordPromote={gameState.money >= ACTION_COSTS.PROMOTE.money}
            />
          </div>
        )}

        {currentView === 'study' && (
          <TrainingCenter gameState={gameState} onTakeCourse={handleCourse} />
        )}

        {currentView === 'profile' && (
          <UserProfile gameState={gameState} onInteractComment={handleInteractComment} />
        )}
      </div>

      {/* Navigation Bar */}
      <NavBar currentView={currentView} onChangeView={setCurrentView} />

      {/* Creation Wizard Modal */}
      {isCreating && (
        <CreationWizard 
          role={gameState.role!} 
          skill={gameState.skill} 
          inspiration={gameState.inspiration}
          month={gameState.month}
          onComplete={handleCreateComplete}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {/* Event Modal */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-fade-in border-t-4 border-emerald-500">
            <div className="flex items-center gap-2 text-emerald-600 mb-2 font-bold">
              <AlertCircle size={20} /> 突发事件
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{activeEvent.title}</h3>
            <p className="text-gray-600 mb-6">{activeEvent.description}</p>
            <div className="space-y-3">
              {activeEvent.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleEventChoice(opt.effect)}
                  className="w-full p-3 bg-gray-50 hover:bg-emerald-50 text-gray-800 hover:text-emerald-700 font-medium rounded-xl transition-colors border border-gray-200 text-left"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>
