import { RoleType, WorkRank, CreatorRank, Course, CreationStage, WorkEvent } from './types';

export const MAX_MONTHS = 24; 

// Initial ranges for random generation
export const ROLE_CONFIG = {
  [RoleType.ARTIST]: {
    moneyRange: [1500, 2500],
    inspirationRange: [20, 40],
    skillRange: [15, 25],
    desc: "初始资金较多，擅长视觉表现。"
  },
  [RoleType.WRITER]: {
    moneyRange: [800, 1200],
    inspirationRange: [50, 70],
    skillRange: [20, 30],
    desc: "初始灵感充沛，擅长剧情铺设。"
  },
  [RoleType.COSPLAYER]: {
    moneyRange: [4000, 6000],
    inspirationRange: [5, 15],
    skillRange: [10, 20],
    desc: "启动资金高，依赖装备还原。"
  }
};

export const ACTION_COSTS = {
  CREATE: { ap: 30, inspiration: 30, money: 0 }, 
  POLISH: { ap: 15, money: 0, inspiration: 0 },
  PROMOTE: { ap: 5, money: 800, inspiration: 0 }, 
  REST: { ap: 20, money: 0, inspiration: 0 }
};

export const RANDOM_NAMES = [
  "老番茄", "甚至有点想笑", "此时一位路人", "不知名太太", 
  "熬夜冠军", "秃头画师", "也就是个写手", "咕咕精", 
  "为了搞CP", "产粮大户", "冷圈难民", "大大大", 
  "只想搞钱", "画不完了", "文思泉涌", "北极圈圈主"
];

export const TITLES = [
  "关于我转生变成史莱姆这档事",
  "绝美CP同人图",
  "OOC慎入！",
  "深夜发疯产粮",
  "摸鱼一张",
  "万字长文车",
  "冷圈自割腿肉",
  "S级向导的自我修养",
  "这个设定太带感了",
  "全员恶人设定",
  "ABO设定科普",
  "前世今生梗",
  "校园paro",
  "娱乐圈文学",
  "赛博朋克设定",
  "克苏鲁跑团记录",
  "BE美学赏析"
];

export const CREATION_STAGES: CreationStage[] = [
  {
    id: 'stage1',
    title: '构思阶段',
    description: '你要确立作品的核心基调...',
    options: [
      { text: '紧跟热点 (流量+，质量-)', qualityMod: -5, potentialMod: 0.5, risk: 10, fameMod: 2 },
      { text: '独特脑洞 (潜力+，风险+)', qualityMod: 5, potentialMod: 0.8, risk: 40, fameMod: 5 },
      { text: 'AI辅助生成 (速度快，嫌疑+)', qualityMod: 0, potentialMod: 0.2, risk: 0, aiSuspicionMod: 15, fameMod: -2 },
      { text: '大师致敬 (需技巧50)', qualityMod: 20, potentialMod: 0.3, risk: 20, reqSkill: 50, fameMod: 10 }
    ]
  },
  {
    id: 'stage2',
    title: '打磨阶段',
    description: '创作过程中遇到了瓶颈...',
    options: [
      { text: '查阅资料 (质量+)', qualityMod: 15, potentialMod: 0.1, risk: 10 },
      { text: '放飞自我 (潜力+，质量波动)', qualityMod: -5, potentialMod: 0.6, risk: 30 },
      { text: '使用AI细化 (质量+，嫌疑+)', qualityMod: 10, potentialMod: 0, risk: 5, aiSuspicionMod: 10 },
      { text: '通宵爆肝 (进度快，心情-)', qualityMod: 5, potentialMod: 0.2, risk: 50 }
    ]
  },
  {
    id: 'stage3',
    title: '发布准备',
    description: '作品即将完成，最后一步是...',
    options: [
      { text: '标题党 (点击+，口碑-)', qualityMod: -10, potentialMod: 0.7, risk: 20, fameMod: -5 },
      { text: '精美排版 (质量+)', qualityMod: 10, potentialMod: 0.2, risk: 0 },
      { text: '发布过程图 (名气+，嫌疑-)', qualityMod: 0, potentialMod: 0.1, risk: 0, aiSuspicionMod: -10, fameMod: 5 },
      { text: '玄学发布 (运气?)', qualityMod: 0, potentialMod: 1.0, risk: 60 }
    ]
  }
];

export const CREATOR_RANKS: CreatorRank[] = [
  { title: "透明小扑街", minFans: 0, benefit: "无" },
  { title: "努力产粮人", minFans: 500, benefit: "基础流量+10%" },
  { title: "圈内小有名气", minFans: 2000, benefit: "基础流量+20%" },
  { title: "神仙太太", minFans: 10000, benefit: "爆款概率提升" },
  { title: "镇圈之宝", minFans: 50000, benefit: "全属性加成" },
  { title: "传说级巨佬", minFans: 200000, benefit: "无敌" }
];

export const TRAINING_COURSES: Course[] = [
  {
    id: 'c1',
    name: '基础技巧训练',
    description: '巩固基本功，稳扎稳打。',
    costMoney: 200,
    costAp: 15,
    effectDesc: '技巧+5',
    effect: (s) => ({ skill: s.skill + 5 })
  },
  {
    id: 'c2',
    name: '寻找灵感之旅',
    description: '去美术馆或图书馆逛逛。',
    costMoney: 100,
    costAp: 15,
    effectDesc: '灵感+25, 心情+10',
    effect: (s) => ({ inspiration: s.inspiration + 25, mood: Math.min(100, s.mood + 10) })
  },
  {
    id: 'c3',
    name: '大师进修班',
    description: '斥巨资报名的大师课程。',
    costMoney: 2000,
    costAp: 30,
    effectDesc: '技巧+15, 灵感+30, 名气+5',
    effect: (s) => ({ skill: s.skill + 15, inspiration: s.inspiration + 30, fame: s.fame + 5 })
  },
  {
    id: 'c4',
    name: '健身房锻炼',
    description: '身体是革命的本钱！',
    costMoney: 500,
    costAp: 20,
    effectDesc: '行动点上限+10 (永久)',
    effect: (s) => ({ maxActionPoints: Math.min(150, s.maxActionPoints + 10) })
  }
];

export const FAKE_COMMENTS = [
  "太太好棒！吃粮吃饱了！",
  "这是什么神仙产粮！",
  "啊啊啊啊我死了！",
  "下次更新是什么时候？GKD！",
  "虽然但是，这个剧情有点虐...",
  "画风好绝，爱了爱了。",
  "大大看我！",
  "沙发！",
  "这也太好看了吧，泪目。",
  "这种好东西是我免费能看的吗？",
  "有点OOC了，不过还是好香。",
  "太太饿饿饭饭！",
  "这个手画的有点奇怪...是AI吗？",
  "一眼顶真，鉴定为神作。"
];

export const EVENTS_DATA = [
  {
    id: 'e1',
    title: '深夜灵感',
    description: '半夜三点突然想到了绝妙的梗，但是身体很疲惫...',
    options: [
      { text: '爬起来写！(AP-20, 灵感+40)', effect: (s: any) => ({ actionPoints: Math.max(0, s.actionPoints - 20), inspiration: s.inspiration + 40 }) },
      { text: '睡觉要紧 (心情+10)', effect: (s: any) => ({ mood: Math.min(100, s.mood + 10) }) }
    ]
  },
  {
    id: 'e2',
    title: '键盘侠出没',
    description: '评论区出现了一条莫名其妙的恶评，心情很糟糕。',
    options: [
      { text: '怼回去！(心情+10, 粉丝-50)', effect: (s: any) => ({ mood: s.mood + 10, fans: Math.max(0, s.fans - 50) }) },
      { text: '忍气吞声 (心情-20)', effect: (s: any) => ({ mood: s.mood - 20 }) }
    ]
  },
  {
    id: 'e3',
    title: '约稿邀请',
    description: '有人私信想要约稿，价格还不错。',
    options: [
      { text: '接单 (金币+1000, AP-15)', effect: (s: any) => ({ money: s.money + 1000, actionPoints: Math.max(0, s.actionPoints - 15) }) },
      { text: '婉拒 (无事发生)', effect: (s: any) => ({}) }
    ]
  },
  {
    id: 'e4',
    title: '软件崩溃',
    description: 'SAI/Word突然未响应，还没保存...',
    options: [
      { text: '崩溃大哭 (心情-30, 灵感-10)', effect: (s: any) => ({ mood: s.mood - 30, inspiration: s.inspiration - 10 }) },
      { text: '重头再来 (AP-15)', effect: (s: any) => ({ actionPoints: Math.max(0, s.actionPoints - 15) }) }
    ]
  },
  {
    id: 'e5',
    title: '科技诱惑',
    description: '发现了一款新的AI生成工具，能极大提高效率...',
    options: [
      { text: '尝试一下 (AP-5, 灵感+20, 嫌疑+15)', effect: (s: any) => ({ actionPoints: Math.max(0, s.actionPoints - 5), inspiration: s.inspiration + 20, aiSuspicion: s.aiSuspicion + 15 }) },
      { text: '坚决抵制 (名气+5)', effect: (s: any) => ({ fame: s.fame + 5 }) }
    ]
  },
  {
    id: 'e6',
    title: '平台活动',
    description: '官方举办了同人创作征集活动。',
    options: [
      { text: '积极参加 (粉丝+200, 名气+10)', effect: (s: any) => ({ fans: s.fans + 200, fame: s.fame + 10 }) },
      { text: '没时间 (无事发生)', effect: (s: any) => ({}) }
    ]
  }
];

// Events that target specific existing works
export const WORK_EVENTS_DATA: WorkEvent[] = [
  {
    id: 'we1',
    title: '被大V转发',
    description: (name) => `你的作品《${name}》被圈内知名大V转发推荐了！`,
    effect: (work, state) => ({
      workUpdate: { views: work.views + 5000 + (state.fans * 0.5), likes: work.likes + 1000 },
      stateUpdate: { fans: state.fans + 500, fame: state.fame + 10 },
      log: `《${work.title}》被大V转发，热度暴涨！`
    })
  },
  {
    id: 'we2',
    title: '遭遇盗图/文',
    description: (name) => `有人在闲鱼上发现了你的作品《${name}》被做成周边售卖。`,
    effect: (work, state) => ({
      workUpdate: {},
      stateUpdate: { mood: state.mood - 15, fame: state.fame + 5 }, // Sad but famous?
      log: `《${work.title}》被盗用，心情变差了，但名气略微提升。`
    })
  },
  {
    id: 'we3',
    title: '鉴抄风波',
    description: (name) => `有人发帖挂你的作品《${name}》涉嫌抄袭/过度借鉴。`,
    effect: (work, state) => {
      // If AI suspicion is high, this hits harder
      const damage = state.aiSuspicion > 30 ? 2000 : 500;
      return {
        workUpdate: { views: work.views + 1000 }, // Controversy brings views
        stateUpdate: { fans: Math.max(0, state.fans - damage), fame: state.fame - 10, aiSuspicion: state.aiSuspicion + 5 },
        log: `《${work.title}》陷入争议，掉粉了...`
      };
    }
  },
  {
    id: 'we4',
    title: '长尾效应',
    description: (name) => `你的旧作《${name}》突然被考古党挖出来了。`,
    effect: (work, state) => ({
      workUpdate: { views: work.views + 2000, income: work.income + 500 },
      stateUpdate: {},
      log: `《${work.title}》被考古，焕发第二春。`
    })
  }
];

export const RANK_PROBS = {
  [WorkRank.B]: 0.5,
  [WorkRank.A]: 0.3,
  [WorkRank.S]: 0.15,
  [WorkRank.SSR]: 0.05
};
