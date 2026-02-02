import { WorkRank, Work, RoleType, Comment, CreatorRank } from './types';
import { TITLES, RANK_PROBS, FAKE_COMMENTS, CREATOR_RANKS, RANDOM_NAMES, ROLE_CONFIG } from './constants';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getRandomTitle = () => TITLES[Math.floor(Math.random() * TITLES.length)];

export const getRandomName = () => RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];

export const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateInitialStats = (role: RoleType) => {
  const config = ROLE_CONFIG[role];
  return {
    money: getRandomInt(config.moneyRange[0], config.moneyRange[1]),
    inspiration: getRandomInt(config.inspirationRange[0], config.inspirationRange[1]),
    skill: getRandomInt(config.skillRange[0], config.skillRange[1]),
  };
};

export const calculateRank = (skill: number, finalQuality: number): WorkRank => {
  const rand = Math.random() * 100;
  // Quality and Skill both improve rank chances
  const bonus = (skill * 0.3) + (finalQuality * 0.1); 
  
  if (rand > 95 - (bonus * 0.1)) return WorkRank.SSR;
  if (rand > 80 - (bonus * 0.2)) return WorkRank.S;
  if (rand > 50 - (bonus * 0.5)) return WorkRank.A;
  return WorkRank.B;
};

export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  return num.toString();
};

export const generateComments = (count: number): Comment[] => {
  const comments: Comment[] = [];
  for (let i = 0; i < count; i++) {
    comments.push({
      id: generateId(),
      userName: `用户${Math.floor(Math.random() * 10000)}`,
      content: FAKE_COMMENTS[Math.floor(Math.random() * FAKE_COMMENTS.length)],
      isReplied: false,
      isLiked: false,
      rewardClaimed: false
    });
  }
  return comments;
};

export const getCurrentRank = (fans: number): CreatorRank => {
  return [...CREATOR_RANKS].reverse().find(r => fans >= r.minFans) || CREATOR_RANKS[0];
};

export const getNextRank = (fans: number): CreatorRank | null => {
  return CREATOR_RANKS.find(r => r.minFans > fans) || null;
};