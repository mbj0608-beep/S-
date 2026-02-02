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
  "只想搞钱", "画不完了", "文思泉涌", "北极圈圈主",
  "电子越共", "绝赞爬墙中", "存稿是不存在的", "刀子精"
];

export const TITLES = [
  "关于我转生变成史莱姆这档事", "绝美CP同人图", "OOC慎入！",
  "深夜发疯产粮", "摸鱼一张", "万字长文车",
  "冷圈自割腿肉", "S级向导的自我修养", "这个设定太带感了",
  "全员恶人设定", "ABO设定科普", "前世今生梗",
  "校园paro", "娱乐圈文学", "赛博朋克设定",
  "克苏鲁跑团记录", "BE美学赏析", "哨向paro",
  "无限流设定", "强制爱（慎）", "婚后日常甜饼",
  "论坛体：818那个...", "如果你能成为光"
];

export const CREATION_STAGES: CreationStage[] = [
  {
    id: 'stage1',
    title: '构思阶段',
    description: '你要确立作品的核心基调...',
    options: [
      { text: '紧跟热点 (流量+，质量-)', qualityMod: -5, potentialMod: 0.5, risk: 10, fameMod: 2 },
      { text: '独特脑洞 (潜力+，风险+)', qualityMod: 5, potentialMod: 0.8, risk: 40, fameMod: 5 },
      { text: 'AI辅助生成 (速度快，嫌疑+)', qualityMod: 0, potentialMod: 0.2, risk: 0, aiSuspicionMod: 25, fameMod: -2 },
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
      { text: '使用AI细化 (质量+，嫌疑+)', qualityMod: 10, potentialMod: 0, risk: 5, aiSuspicionMod: 15 },
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
      { text: '发布过程图 (名气+，嫌疑-)', qualityMod: 0, potentialMod: 0.1, risk: 0, aiSuspicionMod: -20, fameMod: 5 },
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
  "太太好棒！吃粮吃饱了！", "这是什么神仙产粮！", "啊啊啊啊我死了！",
  "下次更新是什么时候？GKD！", "虽然但是，这个剧情有点虐...",
  "画风好绝，爱了爱了。", "大大看我！", "沙发！",
  "这也太好看了吧，泪目。", "这种好东西是我免费能看的吗？",
  "有点OOC了，不过还是好香。", "太太饿饿饭饭！",
  "这个手画的有点奇怪...是AI吗？", "一眼顶真，鉴定为神作。",
  "我是新粉，请问太太有群吗？", "大大出本吗？我想买！",
  "虽然是冷门CP，但是太太写得好有张力！", "太强了，膝盖给你。",
  "这就是大佬的世界吗？"
];

// ------------------------------------------------------------------
// 扩充后的事件库：包含更多网络梗、正负面事件、Lofter/微博生态
// ------------------------------------------------------------------

export const EVENTS_DATA = [
  // --- 正面/中性事件 ---
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
    id: 'e_crazy_thurs',
    title: '疯狂星期四',
    description: '今天是周四，群友突然艾特你：V me 50。',
    options: [
      { text: '发个红包 (金钱-50, 心情+20)', effect: (s: any) => ({ money: s.money - 50, mood: Math.min(100, s.mood + 20) }) },
      { text: '复制文案刷屏 (灵感+10)', effect: (s: any) => ({ inspiration: s.inspiration + 10 }) }
    ]
  },
  {
    id: 'e_collab',
    title: '神仙联文/联画',
    description: '一位互关的大佬邀请你进行“合绘”或“联文”企划。',
    options: [
      { text: '接受邀请 (AP-25, 名气+30, 技巧+5)', effect: (s: any) => ({ actionPoints: Math.max(0, s.actionPoints - 25), fame: s.fame + 30, skill: s.skill + 5 }) },
      { text: '社恐发作婉拒 (心情-5)', effect: (s: any) => ({ mood: s.mood - 5 }) }
    ]
  },
  {
    id: 'e_cold_circle',
    title: '北极圈的温暖',
    description: '你搞的CP太冷了，但你产的粮被仅有的几个同好疯狂赞美。',
    options: [
      { text: '我就是圈子的神！(心情+30, 灵感+20)', effect: (s: any) => ({ mood: Math.min(100, s.mood + 30), inspiration: s.inspiration + 20 }) },
      { text: '含泪坚持 (名气+5)', effect: (s: any) => ({ fame: s.fame + 5 }) }
    ]
  },
  
  // --- 负面/压力事件 ---
  {
    id: 'e2',
    title: '键盘侠出没',
    description: '评论区出现了一条莫名其妙的恶评：“就这也配叫粮？”。',
    options: [
      { text: '怼回去！(心情+10, 粉丝-50)', effect: (s: any) => ({ mood: s.mood + 10, fans: Math.max(0, s.fans - 50) }) },
      { text: '忍气吞声 (心情-20)', effect: (s: any) => ({ mood: s.mood - 20 }) }
    ]
  },
  {
    id: 'e_review_lock',
    title: '审核不通过',
    description: '你的作品因为“不符合相关法规”被锁定了，其实明明很清水。',
    options: [
      { text: '疯狂申诉 (AP-10, 心情-15)', effect: (s: any) => ({ actionPoints: Math.max(0, s.actionPoints - 10), mood: s.mood - 15 }) },
      { text: '转战外网/微博 (有风险, 粉丝+10)', effect: (s: any) => ({ fans: s.fans + 10 }) }
    ]
  },
  {
    id: 'e_hand_pain',
    title: '腱鞘炎预警',
    description: '高强度的创作让你的手腕隐隐作痛。',
    options: [
      { text: '带病坚持 (AP-10, 技巧+5, 健康隐患)', effect: (s: any) => ({ actionPoints: Math.max(0, s.actionPoints - 10), skill: s.skill + 5, mood: s.mood - 10 }) },
      { text: '强制休息一周 (AP归零, 心情+20)', effect: (s: any) => ({ actionPoints: 0, mood: Math.min(100, s.mood + 20) }) }
    ]
  },
  
  // --- AI 与 争议 ---
  {
    id: 'e5',
    title: '科技诱惑',
    description: '发现了一款新的AI生成工具，能极大提高效率，但圈内风评不好...',
    options: [
      { text: '偷偷用 (AP-5, 灵感+20, 嫌疑+20)', effect: (s: any) => ({ actionPoints: Math.max(0, s.actionPoints - 5), inspiration: s.inspiration + 20, aiSuspicion: s.aiSuspicion + 20 }) },
      { text: '坚决抵制 (名气+10, 粉丝+20)', effect: (s: any) => ({ fame: s.fame + 10, fans: s.fans + 20 }) }
    ]
  },
  {
    id: 'e_platform_drama',
    title: '平台瓜田',
    description: '首页突然爆发了一个大瓜，关于某位大大抄袭/翻车。',
    options: [
      { text: '吃瓜看戏 (AP-15, 心情+10)', effect: (s: any) => ({ actionPoints: Math.max(0, s.actionPoints - 15), mood: Math.min(100, s.mood + 10) }) },
      { text: '蹭热度发图 (名气+20, 风险+)', effect: (s: any) => ({ fame: s.fame + 20, aiSuspicion: s.aiSuspicion + 5 }) }
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
    id: 'e6',
    title: '平台活动',
    description: '官方举办了“全职高手/盗笔/原神”同人创作征集活动。',
    options: [
      { text: '积极参加 (粉丝+300, 名气+15)', effect: (s: any) => ({ fans: s.fans + 300, fame: s.fame + 15 }) },
      { text: '没时间 (无事发生)', effect: (s: any) => ({}) }
    ]
  }
];

// ------------------------------------------------------------------
// 作品专属事件：增加了挂人、鉴抄、推文号、二创等
// ------------------------------------------------------------------

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
    id: 'we_rec_account',
    title: '推文/推图号推荐',
    description: (name) => `一个专注于推粮的Bot号发了你的《${name}》。`,
    effect: (work, state) => ({
      workUpdate: { views: work.views + 2000, likes: work.likes + 300 },
      stateUpdate: { fans: state.fans + 100 },
      log: `《${work.title}》被Bot推荐，吸引了一些新粉。`
    })
  },
  {
    id: 'we2',
    title: '遭遇盗图/文',
    description: (name) => `有人在闲鱼/拼多多上发现了你的作品《${name}》被做成周边售卖。`,
    effect: (work, state) => ({
      workUpdate: {},
      stateUpdate: { mood: state.mood - 20, fame: state.fame + 5 }, 
      log: `《${work.title}》被无良商家盗用，气得发抖，但也在挂人中出名了。`
    })
  },
  {
    id: 'we_ai_accuse',
    title: 'AI 猎巫',
    description: (name) => `由于画风精致/更新太快，一群人围攻《${name}》说是AI生成的。`,
    effect: (work, state) => {
      // 如果嫌疑值本身就高，伤害加倍
      const isGuilty = state.aiSuspicion > 20;
      const fanLoss = isGuilty ? 1000 : 200;
      return {
        workUpdate: { views: work.views + 5000 }, // 黑红也是红
        stateUpdate: { 
          fans: Math.max(0, state.fans - fanLoss), 
          fame: state.fame - 5, 
          mood: state.mood - 25,
          aiSuspicion: state.aiSuspicion + 10 
        },
        log: `《${work.title}》被质疑是AI作品，评论区乌烟瘴气。`
      };
    }
  },
  {
    id: 'we3',
    title: '鉴抄风波',
    description: (name) => `调色盘来了！有人发帖挂《${name}》涉嫌抄袭/过度借鉴某位大神。`,
    effect: (work, state) => {
      return {
        workUpdate: { views: work.views + 2000 },
        stateUpdate: { fans: Math.max(0, state.fans - 500), fame: state.fame - 15, mood: state.mood - 30 },
        log: `《${work.title}》陷入抄袭争议，即使澄清了也掉了一层皮。`
      };
    }
  },
  {
    id: 'we_cp_war',
    title: 'CP大乱斗',
    description: (name) => `你的作品《${name}》下的评论区变成了逆家/拆家CP粉的战场。`,
    effect: (work, state) => ({
      workUpdate: { views: work.views + 8000, likes: work.likes + 200 },
      stateUpdate: { mood: state.mood - 10, fame: state.fame + 20 },
      log: `《${work.title}》引发了CP大战，热度极高但不敢看评论。`
    })
  },
  {
    id: 'we_god_edit',
    title: '神仙二创',
    description: (name) => `B站有大佬用你的《${name}》剪辑了一个百万播放的手书/视频！`,
    effect: (work, state) => ({
      workUpdate: { views: work.views + 10000, likes: work.likes + 5000 },
      stateUpdate: { fans: state.fans + 2000, fame: state.fame + 50, mood: Math.min(100, state.mood + 30) },
      log: `《${work.title}》被神仙二创带飞，全网爆火！`
    })
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
