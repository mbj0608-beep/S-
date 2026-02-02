import React from 'react';
import { GameState } from '../types';
import { formatNumber, getNextRank } from '../utils';
import { Heart, MessageCircle, Share2, ThumbsUp, Medal, Trophy, Crown, AlertTriangle } from 'lucide-react';

interface Props {
  gameState: GameState;
  onInteractComment: (commentId: string, action: 'like' | 'reply') => void;
}

const UserProfile: React.FC<Props> = ({ gameState, onInteractComment }) => {
  const nextRank = getNextRank(gameState.fans);
  
  // Calculate total interaction stats
  const totalLikes = gameState.works.reduce((acc, curr) => acc + curr.likes, 0);
  const totalComments = gameState.works.reduce((acc, curr) => acc + curr.comments, 0);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center text-2xl shadow-lg text-white font-bold">
            {gameState.playerName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-800">{gameState.playerName}</h2>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold border border-yellow-200">
                  {gameState.rankTitle}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{gameState.role} | 入圈 {gameState.month} 个月</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6 border-b border-gray-50 pb-6">
          <div className="text-center">
            <div className="text-gray-400 text-xs mb-1">粉丝</div>
            <div className="font-bold text-lg text-gray-800">{formatNumber(gameState.fans)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-xs mb-1">获赞</div>
            <div className="font-bold text-lg text-gray-800">{formatNumber(totalLikes)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-xs mb-1">总收入</div>
            <div className="font-bold text-lg text-emerald-600">{formatNumber(gameState.money)}</div>
          </div>
        </div>
        
        {/* New Attributes: Fame & AI Suspicion */}
        <div className="grid grid-cols-2 gap-4 mb-6">
           <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
             <div className="flex items-center gap-2 text-purple-700 text-sm font-bold mb-1">
               <Crown size={16} /> 圈内名气
             </div>
             <div className="text-2xl font-bold text-purple-800">{gameState.fame}</div>
             <div className="text-xs text-purple-400">越高越容易触发好事件</div>
           </div>
           
           <div className={`p-3 rounded-xl border ${gameState.aiSuspicion > 50 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
             <div className={`flex items-center gap-2 text-sm font-bold mb-1 ${gameState.aiSuspicion > 50 ? 'text-red-700' : 'text-gray-600'}`}>
               <AlertTriangle size={16} /> 涉嫌AI
             </div>
             <div className={`text-2xl font-bold ${gameState.aiSuspicion > 50 ? 'text-red-800' : 'text-gray-800'}`}>
               {gameState.aiSuspicion}%
             </div>
             <div className="text-xs text-gray-400">达到100%会人人喊打</div>
           </div>
        </div>

        {/* Growth Progress */}
        {nextRank ? (
          <div className="bg-gray-50 rounded-xl p-4">
             <div className="flex justify-between text-xs mb-2">
               <span className="text-gray-500">距离下一级 <span className="font-bold text-gray-700">{nextRank.title}</span></span>
               <span className="text-emerald-600 font-bold">{formatNumber(gameState.fans)} / {formatNumber(nextRank.minFans)} 粉丝</span>
             </div>
             <div className="w-full bg-gray-200 rounded-full h-2">
               <div 
                 className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                 style={{ width: `${Math.min(100, (gameState.fans / nextRank.minFans) * 100)}%` }}
               ></div>
             </div>
             <p className="text-xs text-gray-400 mt-2">下一级特权: {nextRank.benefit}</p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl text-center border border-yellow-100">
             <Trophy className="mx-auto text-yellow-500 mb-2" size={24}/>
             <p className="text-yellow-800 font-bold">你已经是传说级巨佬了！</p>
          </div>
        )}
      </div>

      {/* Comment Interaction Zone */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageCircle size={18} className="text-blue-500"/>
          互动消息 <span className="text-xs text-gray-400 font-normal">(点赞/回复评论可获得属性)</span>
        </h3>
        
        {gameState.inbox.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">暂无新消息，快去发作品吧~</div>
        ) : (
          <div className="space-y-4">
            {gameState.inbox.map(comment => (
              <div key={comment.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm text-gray-700">{comment.userName}</span>
                  {!comment.rewardClaimed && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                </div>
                <p className="text-sm text-gray-600 mb-3">{comment.content}</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => onInteractComment(comment.id, 'like')}
                    disabled={comment.isLiked}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-colors ${
                      comment.isLiked ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <ThumbsUp size={12} /> {comment.isLiked ? '已赞' : '点赞'}
                  </button>
                  <button 
                    onClick={() => onInteractComment(comment.id, 'reply')}
                    disabled={comment.isReplied}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-colors ${
                      comment.isReplied ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <Share2 size={12} /> {comment.isReplied ? '已回' : '回复'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;