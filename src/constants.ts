import { GameState, DayEvent, NightProposal, Ending } from "./types";

export const INITIAL_STATE: GameState = {
  currentDay: 1,
  phase: "START",
  hero: {
    level: 1,
    health: 100,
    stamina: 30,
    mana: 20,
    affection: 0,
    suspicion: 0,
  },
  maxStats: {
    health: 100,
    stamina: 30,
    mana: 20,
  },
  demonKing: {
    resources: 50,
    military: 50,
    morale: 50,
    climate: 50,
  },
  inventory: [],
  history: [],
  flags: {},
};

export const DAY_EVENTS: DayEvent[] = [
  {
    id: "v_1_slime",
    region: "starter_village",
    minLevel: 1,
    text: "草丛里跳出一只史莱姆！勇者吓得闭着眼睛挥小拳拳。",
    choices: [
      {
        text: "“抓住史莱姆丢进锅里煮汤”",
        resultText: "史莱姆汤的味道出奇地鲜美，勇者打了个饱嗝，感觉浑身充满了力量（和一点点负罪感）。",
        effect: (state) => ({ 
          hero: { ...state.hero, health: state.hero.health + 5, stamina: state.hero.stamina - 5 },
          flags: { ...state.flags, ate_slime: true }
        }),
      },
      {
        text: "“鼓励她用木剑戳它”",
        resultText: "在你的调教下，勇者发出了软绵绵的呐喊并成功刺穿了史莱姆。虽然它很快就重组了，但勇者的眼里闪烁着成就感。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 10, affection: state.hero.affection + 5 } }),
      },
    ],
  },
  {
    id: "v_2_lost_cat",
    region: "starter_village",
    minLevel: 1,
    text: "一位老奶奶在找猫。勇者想帮忙，但她看起来比猫还容易迷路。",
    choices: [
      {
        text: "“带她去爬树找猫”",
        resultText: "猫没找着，你们倒是在树梢看了一场绝美的日落。虽然下树的时候勇者灰头土脸的，但她笑得很开心。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina - 15, affection: state.hero.affection + 2 }, flags: { ...state.flags, found_cat: true } }),
      },
      {
        text: "“告诉她猫可能去魔王阵营了”",
        resultText: "勇者认真考虑了这种可能性，甚至开始研究如何策反那只猫。她的眼神变得深邃了，虽然方向似乎不太对。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 5, mana: state.hero.mana + 5 } }),
      },
    ],
  },
  {
    id: "v_cat_reward",
    region: "starter_village",
    minLevel: 5,
    text: "那个丢猫的老奶奶送来了一块自家烤的饼干，感谢你们之前的帮助。",
    choices: [
      {
        text: "“分一半给勇者”",
        effect: (state) => ({ hero: { ...state.hero, health: 100, affection: state.hero.affection + 10 } }),
      },
    ],
  },
  {
    id: "v_3_training_dummy",
    region: "starter_village",
    minLevel: 1,
    text: "村口有个木头桩子。勇者盯着它看了十分钟，试图进行『眼神杀』。",
    choices: [
      {
        text: "“手把手教她标准的劈砍动作”",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 15, affection: state.hero.affection + 8, stamina: state.hero.stamina - 10 } }),
      },
      {
        text: "“坐在旁边若无其事地喝红茶”",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 5, suspicion: state.hero.suspicion + 2 } }),
      },
    ],
  },
  {
    id: "f_1_mushrooms",
    region: "misty_forest",
    minLevel: 30,
    text: "森林里长满了五颜六色的蘑菇。勇者伸手要去摘那个看起来最鲜艳的。",
    choices: [
      {
        text: "“大喊一声‘有毒！’并拍掉她的手”",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 5, affection: state.hero.affection + 5 } }),
      },
      {
        text: "“看着她吃下去，然后在她晕倒前背她走”",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health - 20, affection: state.hero.affection + 20 } }),
      },
    ],
  },
  {
    id: "c_1_skeleton",
    region: "dragon_bone_canyon",
    minLevel: 75,
    text: "峡谷里到处是骸骨。一个骷髅兵突然重组，勇者吓得跳到了你怀里。",
    choices: [
      {
        text: "“抱着她用单手解决骷髅”",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25, suspicion: state.hero.suspicion + 10 } }),
      },
      {
        text: "“把她扔向骷髅并喊‘去吧我的王牌！’”",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 25, stamina: state.hero.stamina - 40 } }),
      },
    ],
  },
  {
    id: "s_1_hot_spring",
    region: "ice_field",
    minLevel: 45,
    text: "居然在冰原发现了一个天然温泉！勇者犹豫要不要进去泡一下。",
    choices: [
      {
        text: "“为了健康着想，一起进去暖暖身子”",
        effect: (state) => ({ hero: { ...state.hero, health: 100, stamina: 100, affection: state.hero.affection + 30 } }),
      },
      {
        text: "“拒绝并在旁边生一堆火”",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina + 20, affection: state.hero.affection + 5 } }),
      },
    ],
  },
  {
    id: "r_city_recovery",
    region: "imperial_city",
    minLevel: 1,
    repeatable: true,
    text: "回到了繁华的王城。这里的神圣洗礼和特训虽然枯燥且耗时，但能让勇者焕然一新。",
    choices: [
      {
        text: "“接受王室洗礼与全方位特训”",
        resultText: "圣水洗刷了疲惫，高强度的特训虽然让勇者哀号连连，但那暴涨的等级证明了一切辛劳都是值得的。",
        effect: (state) => ({
          hero: {
            ...state.hero,
            health: Math.round(state.hero.health + (state.maxStats.health - state.hero.health) * 0.5),
            stamina: Math.round(state.hero.stamina + (state.maxStats.stamina - state.hero.stamina) * 0.5),
            mana: Math.round(state.hero.mana + (state.maxStats.mana - state.hero.mana) * 0.5),
            level: state.hero.level + 4, // Event gives +4, day end gives +1, total +5
          },
        }),
      },
    ],
  },
  {
    id: "ic_1_parade",
    region: "imperial_city",
    minLevel: 1,
    text: "王城正在举办凯旋大游行。勇者看着那些光鲜亮丽的骑士，眼中充满了向往。",
    choices: [
      {
        text: "“告诉她那些盔甲其实很重”",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 2 } }),
      },
      {
        text: "“偷偷用幻术让她也穿上闪烁的铠甲”",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
    ],
  },
  {
    id: "ic_2_library",
    region: "imperial_city",
    minLevel: 10,
    text: "王城大图书馆。这里的空气中弥漫着陈旧的书卷气，勇者似乎对禁忌法术产生了好奇。",
    choices: [
      {
        text: "“推荐她读《勇者自我修养》”",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 5, suspicion: state.hero.suspicion - 5 } }),
      },
      {
        text: "“指引她看向那本《深渊语入门》”",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 15, suspicion: state.hero.suspicion + 20 } }),
      },
    ],
  },
  {
    id: "v_generic_1",
    region: "starter_village",
    minLevel: 1,
    repeatable: true,
    text: "在这祥和的村庄里，勇者又开始对着路边的史莱姆比划起还没入门的剑招。作为导师，你打算？",
    choices: [
      {
        text: "“亲自示范一下简单的突刺”",
        resultText: "你随意拨弄了一下木枝，那种凌厉的气息让勇者崇拜不已。她模仿得有模有样，力量感上升了！",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 1, stamina: state.hero.stamina - 5 } }),
      },
      {
        text: "“鼓励她继续努力”",
        resultText: "“加油哦，未来的勇者大人！”你的一句话让她红了脸，挥剑的速度都变快了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 2 } }),
      },
    ],
  },
  {
    id: "v_4_harvest",
    region: "starter_village",
    minLevel: 5,
    text: "村里正在秋收。勇者想帮忙割麦子，但她显然把这当成了某种剑法训练。",
    choices: [
      {
        text: "“纠正她的用力方式”",
        resultText: "割麦子也是体力活。勇者虽然累得够呛，但对力量的运用似乎更得心应手了。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 3, stamina: state.hero.stamina - 20 } }),
      },
      {
        text: "“在旁边偷吃刚烤好的红薯”",
        resultText: "你在树荫下大快朵颐。勇者闻着味儿跑过来，满脸怨念地分享了你的一半——这也是某种程度的同步？",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 5 } }),
      },
    ],
  },
  {
    id: "cf_generic",
    region: "country_forest",
    minLevel: 15,
    repeatable: true,
    text: "郊野森林的空气十分湿润。勇者似乎正在练习辨识足迹，但在那之前她差点被藤蔓绊倒。",
    choices: [
      {
        text: "“耐心地教她分辨各种野兽踪迹”",
        resultText: "原来这分叉的脚印是兔子的，不是哥布林的……勇者感觉自己变聪明了一点。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 1 } }),
      },
      {
        text: "“默默地帮她解开缠住脚的藤蔓”",
        resultText: "当你蹲下身子时，勇者紧张得连呼吸都停了一瞬。虽然森林有些阴冷，她的脸却红透了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 3 } }),
      },
    ],
  },
  {
    id: "cf_1_goblin",
    region: "country_forest",
    minLevel: 15,
    text: "一群哥布林正在路边打劫旅行商。勇者跃跃欲试，但手心在冒汗。",
    choices: [
      {
        text: "“去吧！你可以的！”",
        resultText: "在一阵尖叫和混乱中，勇者成功驱逐了哥布林。商人送了一枚神秘戒指作为谢礼。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 5, stamina: state.hero.stamina - 15 }, inventory: [...state.inventory, "merchant_ring"] }),
      },
      {
        text: "“暗中施放恐惧术吓跑哥布林”",
        resultText: "哥布林突然四散而逃。勇者挠挠头：“难道这把木剑自带圣光威压？”她对你的崇拜莫名增加了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 5, suspicion: state.hero.suspicion + 5 } }),
      },
    ],
  },
  {
    id: "cf_3_giant_egg",
    region: "country_forest",
    minLevel: 20,
    text: "在一个废弃的树洞里，勇者发现了一颗巨大的、闪着金光的蛋。她想把它煮了吃。",
    choices: [
      {
        text: "“快住手！这可能是某种龙的后代”",
        resultText: "还好你拦住了她。勇者抱着蛋像抱枕一样睡了一觉，体内莫名涌动起一股奇特的力量。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 10 }, flags: { ...state.flags, has_egg: true } }),
      },
      {
        text: "“其实煎蛋卷确实不错”",
        resultText: "就在你们生火时，蛋裂开了……跳出一只秃头的小鸡。勇者的母性（？）爆发，决定把它当宠物。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
    ],
  },
  {
    id: "ic_generic",
    region: "imperial_city",
    minLevel: 1,
    repeatable: true,
    text: "王城的街道总是这么繁华。勇者在武器店橱窗前盯着那把圣剑看了很久，那是她买不起的东西。",
    choices: [
      {
        text: "“买下那把剑（其实是附魔的假货）”",
        resultText: "勇者拿到剑的那一刻，那光辉几乎刺瞎了她的眼。虽然那只是你的地狱魔法，但她现在信心爆棚。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 10, affection: state.hero.affection + 20 }, demonKing: { ...state.demonKing, resources: state.demonKing.resources - 5 } }),
      },
      {
        text: "“告诉她真正的强大在内心”",
        resultText: "她似懂非懂地点点头。你那高深莫测的样子让她觉得你肯定是个退隐的传说级人物。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 2, affection: state.hero.affection + 5 } }),
      },
    ],
  },
  {
    id: "ic_3_back_alley",
    region: "imperial_city",
    minLevel: 25,
    text: "走在王城阴暗的小巷里，一个斗篷男向你们推销‘能够看穿真身的药剂’。他死死盯着你。",
    choices: [
      {
        text: "“悄悄打个响指让他消失”",
        resultText: "没等他开口，那人就掉进坑里了。勇者觉得你只是在变戏法，开心地鼓起了掌。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 2 } }),
      },
      {
        text: "“买下来让勇者试喝”",
        resultText: "药剂是假醋。勇者酸得满地找牙。老板趁机溜了，勇者发誓要学会鉴定法术。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 8, stamina: state.hero.stamina - 5 } }),
      },
    ],
  },
  {
    id: "mf_generic",
    region: "misty_forest",
    minLevel: 30,
    repeatable: true,
    text: "迷雾笼罩着四周。勇者紧紧抓着你的衣角，任何风吹草动都会让她发出一声‘嘿哈’的怪叫。",
    choices: [
      {
        text: "“牵住她的手一起走”",
        resultText: "雾似乎变淡了些，或者只是她不再害怕了。一路上勇者出奇地安静。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10 } }),
      },
      {
        text: "“故意在雾中制造鬼火吓她”",
        resultText: "勇者飞快地躲到你身后并把你当成盾牌。这不仅锻炼了她的反射神经，还让她觉得你是世界上最靠谱的人。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 2, suspicion: state.hero.suspicion + 5 } }),
      },
    ],
  },
  {
    id: "if_generic",
    region: "ice_field",
    minLevel: 45,
    repeatable: true,
    text: "极地的寒风如刀割一般。勇者正在尝试用摩擦起火的方式取暖，但她的剑快冒烟了火也没生起来。",
    choices: [
      {
        text: "“弹指间升起一团永恒之火”",
        resultText: "橙红色的火光中，勇者看向你的眼神里不仅仅是崇拜。即使是魔王，此刻也感觉到了一丝暖意。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 5, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“教她如何用斗气御寒”",
        resultText: "在那艰苦的教导下，她终于掌握了一点呼吸法。虽然浑身是汗但在雪地里也不再发抖了。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 8, stamina: state.hero.stamina + 20 } }),
      },
    ],
  },
  {
    id: "d_generic",
    region: "desert",
    minLevel: 60,
    repeatable: true,
    text: "烈日当头。勇者正试图向一棵仙人掌咨询水源的位置，她大概是出现幻觉了。",
    choices: [
      {
        text: "“喂她喝下一瓶神圣甘露（其实是冰镇可乐）”",
        resultText: "气泡冲上鼻尖的那一刻，勇者彻底复活了。她觉得这是你从神界求来的秘宝。",
        effect: (state) => ({ hero: { ...state.hero, health: 100, affection: state.hero.affection + 10 } }),
      },
      {
        text: "“让她继续跟仙人掌聊天”",
        resultText: "神奇的是，仙人掌竟然倒向了水源的方向……勇者的【运气】增加了一点。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 5, mana: state.hero.mana + 2 } }),
      },
    ],
  },
  {
    id: "c_generic",
    region: "dragon_bone_canyon",
    minLevel: 75,
    repeatable: true,
    text: "峡谷的风啸声像极了龙吼。勇者正在那陡峭的骨脊上爬行，看起来相当危险。",
    choices: [
      {
        text: "“在下方张开浮游法阵以防万一”",
        resultText: "你那不易察觉的温柔被她捕捉到了。在踏入深渊之前，她知道你会托住她。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“趁机教授她如何感应魔力流动”",
        resultText: "极限环境是最好的老师。在这种生死边缘，她感受到了那名为‘以太’的力量。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 45 } }),
      },
    ],
  },
  {
    id: "vol_generic",
    region: "volcano",
    minLevel: 90,
    repeatable: true,
    text: "岩浆在地表之下奔腾。勇者的靴子甚至开始冒烟了，但她依然眼神坚定地向前走着。",
    choices: [
      {
        text: "“为她的脚部施加绝对冰冻”",
        resultText: "冷热交替的咔嚓声不断响起。多亏了这个，她才能如履平地般横过熔岩湖。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina + 10, affection: state.hero.affection + 5 } }),
      },
      {
        text: "“冷酷地催促她加快脚步”",
        resultText: "“这就是勇者的修行吗？”她咬紧牙关，在那种非人的温度下，意志品质得到了蜕变。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 20, mana: state.hero.mana + 5 } }),
      },
    ],
  },
  {
    id: "mf_1_wicked_witch",
    region: "misty_forest",
    minLevel: 30,
    text: "迷雾森林深处，一位自称‘导师同事’的女巫正邀请勇者去她家喝茶。",
    choices: [
      {
        text: "“那是你的幻觉，快走”",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana - 2 } }),
      },
      {
        text: "“去喝茶（顺便偷她的魔法卷轴）”",
        effect: (state) => ({ hero: { ...state.hero, mana: 100, suspicion: state.hero.suspicion + 15, inventory: [...state.inventory, "witch_scroll"] } }),
      },
    ],
  },
  {
    id: "mf_2_mirror_lake",
    region: "misty_forest",
    minLevel: 35,
    text: "森林中有一面能照出内心的镜子。勇者盯着镜子里的自己，陷入了沉思。",
    choices: [
      {
        text: "“引导她感悟真理”",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana - 5 } }),
      },
      {
        text: "“用石头砸碎镜子（因为里面照出了你的魔王真身）”",
        resultText: "镜子碎了，你的真身躲入黑暗。勇者虽然疑惑你的暴力行为，但那一刻的杀气让她对你产生了些许畏惧。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 10, affection: state.hero.affection - 5 } }),
      },
    ],
  },
  {
    id: "mf_generic_1",
    region: "misty_forest",
    minLevel: 30,
    repeatable: true,
    text: "迷雾笼罩着四周。勇者紧紧抓着你的衣角，任何风吹草动都会让她发出一声‘嘿哈’的怪叫。",
    choices: [
      {
        text: "“牵住她的手一起走”",
        resultText: "雾似乎变淡了些，或者只是她不再害怕了。一路上勇者出奇地安静。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10 } }),
      },
      {
        text: "“故意在雾中制造鬼火吓她”",
        resultText: "勇者飞快地躲到你身后并把你当成盾牌。这不仅锻炼了她的反射神经，还让她觉得你是世界上最靠谱的人。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 2, suspicion: state.hero.suspicion + 5 } }),
      },
    ],
  },
  {
    id: "mf_generic_2",
    region: "misty_forest",
    minLevel: 35,
    repeatable: true,
    text: "你们在森林里迷路了三次，居然回到了同一个奇怪的松果堆旁边。",
    choices: [
      {
        text: "“这是迷魂阵，坐下冥想找到生机”",
        resultText: "在你的引导下，勇者第一次感受到了自然界的脉动。虽然耗费了一整天，但她的心境提升了。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 23, stamina: state.hero.stamina - 20 } }),
      },
    ],
  },
  {
    id: "if_generic_1",
    region: "ice_field",
    minLevel: 45,
    repeatable: true,
    text: "极地的寒风如刀割一般。勇者正在尝试用摩擦起火的方式取暖，但她的木剑快烧着了火也没生起来。",
    choices: [
      {
        text: "“弹指间升起一团永恒之火”",
        resultText: "橙红色的火光中，勇者看向你的眼神里不仅仅是崇拜。即使是魔王，此刻也感觉到了一丝暖意。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 5, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“教她如何用斗气御寒”",
        resultText: "在那艰苦的教导下，她终于掌握了一点呼吸法。虽然浑身是汗但在雪地里也不再发抖了。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 8, stamina: state.hero.stamina + 20 } }),
      },
    ],
  },
  {
    id: "if_generic_2",
    region: "ice_field",
    minLevel: 50,
    repeatable: true,
    text: "你发现了一只冻僵的极地史莱姆。它看起来像一块巨大的蓝冰碎冰冰。",
    choices: [
      {
        text: "“让勇者把它背回营地当冷气机”",
        resultText: "虽然勇者被冻得哆嗦，但这种负重训练极大地锻炼了她的意志。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 5, stamina: state.hero.stamina - 15, affection: state.hero.affection + 2 } }),
      },
    ],
  },
  {
    id: "d_generic_1",
    region: "desert",
    minLevel: 60,
    repeatable: true,
    text: "这里的沙尘暴说来就来。勇者正试图把脑袋埋进沙子里避风（她大概是跟鸵鸟学的）。",
    choices: [
      {
        text: "“张开守护屏障屏蔽风沙”",
        resultText: "风沙在屏障外狂暴地肆虐，勇者在屏障内安稳地睡着了。她开始觉得你无所不能。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10, mana: state.hero.mana - 20 } }),
      },
      {
        text: "“教她如何在风沙中锁定敌人的位置”",
        resultText: "“听，那是沙粒撞击盔甲的声音……”在你的指导下，她学会了用心眼感知。感悟能力上升了。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 12 } }),
      },
    ],
  },
  {
    id: "d_generic_2",
    region: "desert",
    minLevel: 62,
    repeatable: true,
    text: "一场突如其来的强烈沙尘暴将你们卷入。视线甚至不足一米。",
    choices: [
      {
        text: "“紧紧抓牢对方的手不要走散”",
        resultText: "在漫天黄沙中，紧握的手心是唯一的依靠。勇者的心跳跳得比风暴还快。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25 } }),
      },
    ],
  },
  {
    id: "c_generic_1",
    region: "dragon_bone_canyon",
    minLevel: 75,
    repeatable: true,
    text: "峡谷的风啸声像极了龙吼。勇者正在那陡峭的骨脊上爬行，看起来相当危险。",
    choices: [
      {
        text: "“在下方悄悄张开浮游法阵以防万一”",
        resultText: "你那不易察觉的温柔被她捕捉到了。在踏入深渊之前，她知道你会托住她。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“趁机教授她如何感应魔力流动”",
        resultText: "极限环境是最好的老师。在这种生死边缘，她感受到了那名为‘以太’的力量。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 45 } }),
      },
    ],
  },
  {
    id: "c_generic_2",
    region: "dragon_bone_canyon",
    minLevel: 80,
    repeatable: true,
    text: "你们发现了一个龙蛋化石。勇者试图用它来练习‘头槌’。",
    choices: [
      {
        text: "“拦住她，脑袋会疼的”",
        resultText: "由于你的阻止，她幸免于难（化石真的很硬）。她觉得你对他关怀备至。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 5, mana: state.hero.mana + 2 } }),
      },
    ],
  },
  {
    id: "vol_generic_1",
    region: "volcano",
    minLevel: 90,
    repeatable: true,
    text: "岩浆在地表之下奔腾。勇者的靴子甚至开始冒烟了，但她依然眼神坚定地向前走着。",
    choices: [
      {
        text: "“为她的脚部施加绝对冰冻”",
        resultText: "冷热交替的咔嚓声不断响起。多亏了这个，她才能如履平地般横过熔岩湖。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina + 10, affection: state.hero.affection + 5 } }),
      },
      {
        text: "“冷酷地催促她加快脚步”",
        resultText: "“这就是勇者的修行吗？”她咬紧牙关，在那种非人的温度下，意志品质得到了蜕变。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 20, mana: state.hero.mana + 5 } }),
      },
    ],
  },
  {
    id: "ic_generic_3",
    region: "imperial_city",
    minLevel: 1,
    repeatable: true,
    text: "王城的广场上有艺人在表演幻术。勇者看得目瞪口呆，不停地拍手叫好。",
    choices: [
      {
        text: "“这种低级幻术，你也信？”",
        resultText: "你随意指出了幻术的破绽。勇者有些失望，但对你展现出的知识感到非常敬佩。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 8, suspicion: state.hero.suspicion + 5 } }),
      },
      {
        text: "“给她买个冰淇淋，一起看”",
        resultText: "甜食果然是消除疲劳的良药。她在欢声笑语中度过了愉快的一天。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 12, stamina: state.hero.stamina + 10 } }),
      },
    ],
  },
  {
    id: "ic_generic_4",
    region: "imperial_city",
    minLevel: 5,
    repeatable: true,
    text: "王城最有名的面包店推出了新品。勇者在门口犹豫了很久，因为排队的人实在太多了。",
    choices: [
      {
        text: "“用魔力制造一点小小的局部降雨混乱”",
        resultText: "人群由于突如其来的阵雨而散去，你趁机帮她抢到了最后一个限定款。勇者一边大口啃着香喷喷的面包，一边崇拜地看着总是能在关键时刻解决难题的你。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, suspicion: state.hero.suspicion + 10 } }),
      },
      {
        text: "“耐心地陪她排队，聊聊王城的八卦”",
        resultText: "在漫长的等待中，你们从街角的一棵树聊到了王室的秘闻。虽然腿酸得不行，但勇者紧紧攥着你的衣角，这种平凡的快乐让她觉得冒险并不只是苦差事。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina - 15, affection: state.hero.affection + 12 } }),
      },
    ],
  },
  {
    id: "cf_generic_4",
    region: "country_forest",
    minLevel: 15,
    repeatable: true,
    text: "森林中有一座看上去摇摇欲坠的吊桥。勇者站在桥头，腿有点发抖。",
    choices: [
      {
        text: "“直接把她扛过去”",
        resultText: "“呀！”她发出一声惊呼，随后紧紧搂住你的脖子。到了岸边，她的脸红得像熟透的苹果。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 20 } }),
      },
      {
        text: "“在后面推她一把”",
        resultText: "虽然很粗暴，但她被迫克服了恐惧。在那种极限状态下，她的平衡感得到了质的飞跃。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 8, stamina: state.hero.stamina - 10 } }),
      },
    ],
  },
  {
    id: "cf_generic_5",
    region: "country_forest",
    minLevel: 15,
    repeatable: true,
    text: "森林中似乎有稀有的药草。但是周围长满了刺人的荆棘。",
    choices: [
      {
        text: "“只有通过痛苦才能获得回报”",
        resultText: "她强忍着被刺痛的痛苦采摘了药草。虽然受了点轻伤，但意志变得更加坚强了。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health - 5, stamina: state.hero.stamina + 15 } }),
      },
    ],
  },
  {
    id: "cf_generic_6",
    region: "country_forest",
    minLevel: 15,
    repeatable: true,
    text: "郊野森林的树木似乎比平常更加茂密。这里非常适合进行潜行训练。",
    choices: [
      {
        text: "“屏住呼吸，潜伏在这个阴影处”",
        resultText: "你耐心地纠正着她的呼吸节奏。一刻钟后，她的气息已经完美融入了森林。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 5, suspicion: state.hero.suspicion + 2 } }),
      },
    ],
  },
  {
    id: "c_1_bone_dragon",
    region: "dragon_bone_canyon",
    minLevel: 75,
    text: "远古龙骨在一阵邪风中苏醒，甚至还保留着生前的吐息能力。",
    choices: [
      {
        text: "“这是一场名为‘生死’的试炼”",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health - 10 } }),
      },
      {
        text: "“直接用上位魔力将其再次瓦解”",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 30, mana: state.hero.mana + 10 } }),
      },
    ],
  },
  {
    id: "c_2_gravity_well",
    region: "dragon_bone_canyon",
    minLevel: 80,
    text: "峡谷底部存在天然的重力扭曲，每走一步都沉重万分。",
    choices: [
      {
        text: "“负重特训是变强的捷径”",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 20, stamina: state.hero.stamina - 60 } }),
      },
      {
        text: "“帮她施加轻灵之翼”",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana - 30, affection: state.hero.affection + 15 } }),
      },
    ],
  },
  {
    id: "vol_1_fire_dragon",
    region: "volcano",
    minLevel: 90,
    text: "这里是禁忌的火山，也是火龙莉莎的巢穴。空气中的温度高得能点燃衣物。",
    choices: [
      {
        text: "“屠龙吧，虽然那是我的旧识”",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health - 10 }, demonKing: { ...state.demonKing, military: state.demonKing.military - 5 } }),
      },
      {
        text: "“展现出凌驾于巨龙之上的恐怖气息”",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 50, affection: state.hero.affection + 10 } }),
      },
    ],
  },
  {
    id: "vol_2_lava_bath",
    region: "volcano",
    minLevel: 95,
    text: "一条岩浆河挡住了唯一的去路。勇者竟然在考虑能不能跳过去。",
    choices: [
      {
        text: "“跳吧，我会接着你”",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 10, affection: state.hero.affection + 40 } }),
      },
      {
        text: "“挥手冻结岩浆（虽然极度消耗魔力）”",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 50, mana: 50 } }),
      },
    ],
  },
  {
    id: "d_3_oasis_dust",
    region: "desert",
    minLevel: 60,
    text: "风暴渐息，你们终于发现了一个真正的绿洲。池水清澈，但周围满是沙尘暴留下的残骸。",
    choices: [
      {
        text: "“清理水源，在这里举办小型篝火会”",
        resultText: "在干净的泉水边，勇者终于露出了久违的笑容。你们在星空下享受了一段宁静时光，关系更近了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 35 } }),
      },
      {
        text: "“利用残骸加固营地，防止二次风暴”",
        resultText: "你展现出的生存经验让勇者佩服不已。虽然体力消耗巨大，但你们的安全感得到了极大增强。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina - 20, mana: state.hero.mana + 10 } }),
      },
    ],
  },
  {
    id: "vol_3_obsidian",
    region: "volcano",
    minLevel: 90,
    text: "火山喷发后的冷却岩浆形成了锋利的黑曜石。这对勇者而言是极佳的附魔素材。",
    choices: [
      {
        text: "“冒着高温去采集一些”",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 10, inventory: [...state.inventory, "obsidian"] } }),
      },
      {
        text: "“算了，命要紧”",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 5 } }),
      },
    ],
  },
  {
    id: "cf_generic_2",
    region: "country_forest",
    minLevel: 16,
    repeatable: true,
    text: "一群野猪冲向了正在发呆的勇者。这可是实战的好机会！",
    choices: [
      {
        text: "“在旁边大喊鼓励她发动冲锋”",
        resultText: "在你振聋发聩的助威下，勇者发出了撕心裂肺的战吼冲向野猪群。那一刻，她的木剑仿佛带上了残影，野猪们被撞得满天乱飞。事后她揉着发红的手腕，眼里跳动着从未有过的战士火光。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 6, stamina: state.hero.stamina - 20 } }),
      },
    ],
  },
  {
    id: "cf_generic_3",
    region: "country_forest",
    minLevel: 15,
    repeatable: true,
    text: "森林里下起了淅淅沥沥的小雨。你们被迫躲在一棵冠盖如云的古树下，听着雨滴击打叶片的节奏。",
    choices: [
      {
        text: "“讲一段关于老魔王的悲伤往事”",
        resultText: "你用低沉的嗓音描述着那个孤独的灵魂。勇者听得眼眶湿润，甚至下意识地靠在你的肩头试图安慰你。她觉得自己正在慢慢揭开你那神秘而忧伤的过往。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 12, mana: state.hero.mana + 2 } }),
      },
    ],
  },
  {
    id: "mf_generic_4",
    region: "misty_forest",
    minLevel: 30,
    repeatable: true,
    text: "在迷雾深处，你们发现了一块刻满古代文字的石碑。",
    choices: [
      {
        text: "“尝试解读上面的信息”",
        resultText: "“……当黑暗笼罩，星辰将指引归途。”虽然语法古怪，但勇者似乎从中领悟到了某种魔力流动的规律。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 25 } }),
      },
    ],
  },
  {
    id: "if_generic_3",
    region: "ice_field",
    minLevel: 45,
    repeatable: true,
    text: "巨大的雪怪在远处咆哮。勇者由于寒冷，身体有些僵硬。",
    choices: [
      {
        text: "“围着篝火讲一些南方的故事”",
        resultText: "温暖的火焰和你的声音让她渐渐松弛下来。她做了一个关于向日葵的美梦。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina + 20, affection: state.hero.affection + 10 } }),
      },
    ],
  },
  {
    id: "v_generic_3",
    region: "starter_village",
    minLevel: 1,
    repeatable: true,
    text: "午后的阳光洒在村口的草堆上。勇者靠在上面，突然侧过头问你：‘魔王真的像书里写的那么可怕吗？’",
    choices: [
      {
        text: "“也许他只是在这个岗位上太久了，有点职业倦怠”",
        resultText: "勇者若有所思地望着云朵。“如果是这样的话，那他还挺可怜的。”她嘀咕着，全然不知旁边这位“本人”正拼命憋笑。这一刻，一段微妙的共鸣在你们之间悄然产生。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 5, affection: state.hero.affection + 8 } }),
      },
    ],
  },
  {
    id: "ic_generic_4",
    region: "imperial_city",
    minLevel: 5,
    repeatable: true,
    text: "王城最有名的面包店推出了新品。勇者在门口犹豫了很久，因为排队的人实在太多了。",
    choices: [
      {
        text: "“用魔力制造一点小小的局部降雨混乱”",
        resultText: "人群由于突如其来的阵雨而散去，你趁机帮她抢到了最后一个限定款。勇者一边大口啃着香喷喷的面包，一边崇拜地看着总是能在关键时刻解决难题的你。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, suspicion: state.hero.suspicion + 10 } }),
      },
      {
        text: "“耐心地陪她排队，聊聊王城的八卦”",
        resultText: "在漫长的等待中，你们从街角的一棵树聊到了王室的秘闻。虽然腿酸得不行，但勇者紧紧攥着你的衣角，这种平凡的快乐让她觉得冒险并不只是苦差事。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina - 15, affection: state.hero.affection + 12 } }),
      },
    ],
  },
  {
    id: "cf_generic_4",
    region: "country_forest",
    minLevel: 15,
    repeatable: true,
    text: "森林中有一座看上去摇摇欲坠的吊桥。勇者站在桥头，腿有点发抖。",
    choices: [
      {
        text: "“直接把她扛过去”",
        resultText: "“呀！”她发出一声惊呼，随后紧紧搂住你的脖子。到了岸边，她的脸红得像熟透的苹果。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 20 } }),
      },
      {
        text: "“在后面推她一把”",
        resultText: "虽然很粗暴，但她被迫克服了恐惧。在那种极限状态下，她的平衡感得到了质的飞跃。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 8, stamina: state.hero.stamina - 10 } }),
      },
    ],
  },
  {
    id: "mf_generic_5",
    region: "misty_forest",
    minLevel: 30,
    repeatable: true,
    text: "迷雾中似乎传来了熟悉的声音在呼唤勇者的名字。她有些失神，正要往深处走去。",
    choices: [
      {
        text: "“用力拉住她的手，那是塞壬的幻听！”",
        resultText: "你宽厚的手掌有力地握住了她。勇者猛然惊醒，心有余悸地靠在你的怀里。那一刻，你身上那股令人安心的咸鱼味（？）让她彻底清醒了过来。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 10, affection: state.hero.affection + 8 } }),
      },
    ],
  },
  {
    id: "if_generic_4",
    region: "ice_field",
    minLevel: 45,
    repeatable: true,
    text: "难得的雪停时刻。勇者兴致勃勃地堆起了一个长得有点像你的雪人，还给它围上了你那条旧围巾。",
    choices: [
      {
        text: "“偷偷给雪人注入一丝灵魂魔力”",
        resultText: "雪人居然笨拙地朝勇者鞠了一躬，甚至还试图把围巾递还给她。勇者被这奇妙的一幕逗得哈哈大笑，在这冰天雪地里，她的心却像被炉火烘烤般温暖。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 27 } }),
      },
    ],
  },
  {
    id: "d_sandstorm_3",
    region: "desert",
    minLevel: 65,
    repeatable: true,
    text: "漫天的风沙中，隐约出现了一座古老神庙的轮廓。勇者觉得那是传说中的财宝库。",
    choices: [
      {
        text: "“陪她探险，顺便清理一下里面的魔物”",
        resultText: "里面的陷阱对你来说是儿戏，但对她来说是极佳的试炼。你们收获了不少古币（其实是你刚才洒在那里的）。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 20, mana: state.hero.mana + 10, affection: state.hero.affection + 5 } }),
      },
    ],
  },
  {
    id: "c_generic_3",
    region: "dragon_bone_canyon",
    minLevel: 75,
    repeatable: true,
    text: "峡谷底部的裂缝中闪烁着紫色的光芒。那是极不稳定的纯粹魔力矿石。",
    choices: [
      {
        text: "“教她如何安全地吸收这些魔力”",
        resultText: "在你的护航下，勇者感受到了从未有过的强大。她的魔力储备得到了永久提升。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 65 } }),
      },
    ],
  },
  {
    id: "vol_generic_2",
    region: "volcano",
    minLevel: 90,
    repeatable: true,
    text: "岩浆湖里跳出了一些火红色的‘鱼’。勇者觉得它们看起来很好吃（？）。",
    choices: [
      {
        text: "“虽然危险，但还是帮她抓了一只”",
        resultText: "这鱼真的能吃吗？虽然口感很像烧红的铁块，但其中蕴含的生命力让她的身体素质再次飞跃。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 130, stamina: state.hero.stamina + 20 } }),
      },
    ],
  },
  {
    id: "v_repeatable_rest",
    region: "starter_village",
    minLevel: 1,
    repeatable: true,
    text: "午后的绿叶村非常潮湿。勇者靠在老槐树下打盹，嘴角甚至流出了一丝晶莹。",
    choices: [
      {
        text: "“偷偷帮她擦掉口水”",
        resultText: "你轻手轻脚地帮她打理形象。她似乎在梦里嘿嘿笑了一声，对你的信任感（迷糊中）增加了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 3 } }),
      },
    ],
  },
  {
    id: "ic_repeatable_explore",
    region: "imperial_city",
    minLevel: 1,
    repeatable: true,
    text: "王城的街道上人来人往。勇者在那琳琅满目的小摊前看花了眼。",
    choices: [
      {
        text: "“买下一串糖葫芦送给她”",
        resultText: "酸甜的味道让她幸福得眯起了眼。这种简单的快乐最能让她恢复精神。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 15), affection: state.hero.affection + 5 } }),
      },
    ],
  },
  {
    id: "cf_repeatable_hunt",
    region: "country_forest",
    minLevel: 15,
    repeatable: true,
    text: "森林里的一群野兔跑过。勇者正考虑要不要追上去，这可是绝佳的敏捷训练。",
    choices: [
      {
        text: "“鼓励她去追逐那些兔子”",
        resultText: "在一阵翻滚和冲刺后，她虽然没抓到兔子，但身手明显比刚才矫健了一些。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 2, stamina: Math.max(0, state.hero.stamina - 10) } }),
      },
    ],
  },
  {
    id: "mf_repeatable_meditation",
    region: "misty_forest",
    minLevel: 30,
    repeatable: true,
    text: "迷雾中的宁静感让人想要坐下来思考。勇者觉得这里的氛围很神秘。",
    choices: [
      {
        text: "“教她如何冥想以感应周围的魔力”",
        resultText: "在你的引导下，她第一次感觉到空气中游离的蓝紫色光点。这是魔法力量的基础。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 23 } }),
      },
    ],
  },
  {
    id: "if_repeatable_survival",
    region: "ice_field",
    minLevel: 45,
    repeatable: true,
    text: "刺骨的寒风。勇者发抖的时候，你发现了一处背风的小山洞。",
    choices: [
      {
        text: "“在这里生个小火堆暂时避寒”",
        resultText: "跳动的火苗映红了她的脸。这种共同生存的经历极大地消释了她对你身份的怀疑。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 10), affection: state.hero.affection + 8, suspicion: Math.max(0, state.hero.suspicion - 5) } }),
      },
    ],
  },
  {
    id: "d_repeatable_water",
    region: "desert",
    minLevel: 60,
    repeatable: true,
    text: "燥热难耐。这块巨大的岩石下有一丝阴凉，勇者已经渴得在说胡话了。",
    choices: [
      {
        text: "“用魔力凭空凝结出凉爽的纯净水”",
        resultText: "“这就是神迹吗……”勇者大口吞咽着甘霖，恢复了元气。她看你的眼神已经带上了几分神圣感。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 20), stamina: Math.min(100, state.hero.stamina + 20), affection: state.hero.affection + 10 } }),
      },
    ],
  },
  {
    id: "c_repeatable_training",
    region: "dragon_bone_canyon",
    minLevel: 75,
    repeatable: true,
    text: "峡谷的风压非常强大。这正是特训防御剑术的最佳场所。",
    choices: [
      {
        text: "“让她在狂风中练习稳定的架势”",
        resultText: "双腿深陷泥土，对抗着风暴。虽然极其辛苦，但她的力量根基已经坚如磐石。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 10, stamina: Math.max(0, state.hero.stamina - 30) } }),
      },
    ],
  },
  {
    id: "vol_repeatable_fishing",
    region: "volcano",
    minLevel: 90,
    repeatable: true,
    text: "流淌的岩浆中竟然有罕见的火灵在跳动。勇者好奇这些能不能用来附魔。",
    choices: [
      {
        text: "“冒着高温帮她捕捉那些灵火”",
        resultText: "你的手在数千度的高温中安然无恙，犹如探入微温的水中。勇者瞠目结舌地看着你捧出那一簇簇如红宝石般的火苗。这一刻，她在你身上看到了某种名为“救赎”的神性（其实只是免火咒）。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 30), affection: state.hero.affection + 15 } }),
      },
    ],
  },
];

export const NIGHT_PROPOSALS: NightProposal[] = [
  {
    id: "n_1_tax",
    speaker: "贪婪的地精财务官",
    text: "大人，我们应该向魔物们征收‘午睡税’，这笔钱够我们买好几个新的哥特式王座！",
    swipeLeft: { text: "荒谬！滚出去。", effects: { resources: -1, morale: +3 } },
    swipeRight: { text: "准了。我也想要新王座。", effects: { resources: +10, morale: -8 } },
  },
  {
    id: "n_2_training",
    speaker: "严肃的魔族将军",
    text: "前线士兵太懒了！我要求进行地狱特训，死亡率控制在50%以内即可。",
    swipeLeft: { text: "魔命也是命。", effects: { military: -3, morale: +5 } },
    swipeRight: { text: "强者生存。去办吧。", effects: { military: +12, morale: -10 } },
  },
  {
    id: "n_3_party",
    speaker: "轻浮的魅魔公关",
    text: "最近大家心情沉重，不如举办一场‘魔王城泳池派对’？这对士气大有裨益。",
    swipeLeft: { text: "没钱办这种聚会。", effects: { morale: -3 } },
    swipeRight: { text: "好主意，我要粉色的救生圈。", effects: { morale: +15, resources: -8 } },
  },
  {
    id: "n_4_propaganda",
    speaker: "狡猾的骷髅记者",
    text: "大人，我们需要在魔界时报上大肆吹嘘您的功绩，顺便给勇者抹黑。",
    swipeLeft: { text: "多此一举。", effects: { morale: -3, resources: +2 } },
    swipeRight: { text: "让我看起来更凶一点。", effects: { morale: +5, climate: +8 } },
  },
  {
    id: "n_5_espionage",
    speaker: "阴森的影之术士",
    text: "我们抓到了勇者阵营的一个间谍。是就地处决，还是尝试洗脑成我们的双面间谍？",
    swipeLeft: { text: "处决示众。", effects: { military: +3, morale: +2, climate: +5 } },
    swipeRight: { text: "洗脑比较有趣。", effects: { military: +5, resources: -3, climate: +8 } },
  },
  {
    id: "n_20_cerberus",
    speaker: "地狱三头犬",
    text: "三个脑袋因为想吃不同的东西打起来了。",
    swipeLeft: { text: "饿它们一顿。", effects: { military: -3 } },
    swipeRight: { text: "准备全席宴。", effects: { resources: -8, military: +8 } },
  },
  {
    id: "n_11",
    speaker: "猫奴小妖精",
    text: "城堡里的猫太多了，快要把库存的干鱼吃光了！",
    swipeLeft: { text: "放逐流浪猫。", effects: { resources: +3, morale: -5 } },
    swipeRight: { text: "扩建猫舍。", effects: { resources: -5, morale: +8 } },
  },
  { id: "n_12", speaker: "兽人厨师长", text: "肉类供应不足，要不要吃那火龙？", swipeLeft: { text: "那是开国功勋！", effects: { military: +3, morale: +5 } }, swipeRight: { text: "吃！", effects: { resources: +8, military: -5, morale: -3 } } },
  { id: "n_13", speaker: "吸血鬼公爵", text: "建造私人血库。", swipeLeft: { text: "自己解决。", effects: { climate: +3, morale: -2 } }, swipeRight: { text: "拨给你吧。", effects: { resources: -5, climate: -5, morale: +3 } } },
  { id: "n_50", speaker: "深渊史莱姆", text: "布噜……布噜布噜……（它似乎在求职）", swipeLeft: { text: "没听懂。", effects: { morale: -1 } }, swipeRight: { text: "雇你了。", effects: { resources: -1, morale: +3 } } },
  {
    id: "n_16_library",
    speaker: "沉稳的巫妖学者",
    text: "大人，我们需要建立一个‘大魔王图书馆’。书中自有黄金屋，书中自有……禁术模板。",
    swipeLeft: { text: "打打杀杀才是魔界本质。", effects: { military: +5, morale: -5 } },
    swipeRight: { text: "准了，多买点言情小说。", effects: { resources: -15, morale: +20 } },
  },
  {
    id: "n_17_garden",
    speaker: "绿皮肤的小妖精",
    text: "我们发现了一种能发光的蘑菇，非常适合装饰走廊。只要一点点肥料资金……",
    swipeLeft: { text: "我不喜欢发光的玩意。", effects: { morale: -2 } },
    swipeRight: { text: "以后晚上不用点火把了。", effects: { resources: -5, climate: +10, morale: +5 } },
  },
  {
    id: "n_18_tourism",
    speaker: "眼光独到的魅魔导游",
    text: "魔王城有很多空房间，可以改造成‘恐怖主题民宿’，吸引那些寻求刺激的冒险者。",
    swipeLeft: { text: "我的私人城堡不接待外客。", effects: { resources: -5 } },
    swipeRight: { text: "记得多收点门票钱。", effects: { resources: +30, morale: -10, climate: +15 } },
  },
];

export const ENDINGS: Ending[] = [
  { 
    id: "ending_a", 
    title: "结局 A", 
    text: "魔王城的黑色大门在一阵轰鸣声中缓缓开启。这本该是史诗级的最终决战，但王座上的魔王此时正忍着打哈欠的冲动，在脑海里疯狂拨算盘。\n\n“一年了……只要这孩子今天能稳稳当当地捅我一剑，我的‘带薪退休计划’就算完美收官了！”魔王维持着威严的表情，眼神早已飘向了桌上的的海景度假村海报。\n\n差分剧情：\n勇者才刚跨过魔王城的门槛，整个人就“啪叽”一声平地摔在了地板上。\n\n魔王的表情僵住了。她原本计划让勇者打掉她 1%血量就装死，可现在的状况是，如果不手动撤掉防御阵法，勇者可能会被直接震碎。\n\n勇者趴在地上，一边喘气一边给自己打气：“露比姐姐说过……坚持就是胜利……”\n\n魔王终于忍不住从王座上跳了下来，一把拎起勇者的后领，像拎着一只虚弱的猫：“坚持个鬼啊！你连这儿的空气阻力都打不赢吧？退款！这届勇者我要退款！”\n\n于是，退休计划惨遭滑铁卢。魔王骂骂咧咧地收起了海报，认命地开始准备下一年的魔鬼训练方案。", 
    condition: (state) => (state.hero.health + state.hero.stamina + state.hero.mana) < 220
  },
  { 
    id: "ending_b", 
    title: "结局 B", 
    text: "魔王城的黑色大门在一阵轰鸣声中缓缓开启。这本该是史诗级的最终决战，但王座上的魔王此时正忍着打哈欠的冲动，在脑海里疯狂拨算盘。\n\n“一年了……只要这孩子今天能稳稳当当地捅我一剑，我的‘带薪退休计划’就算完美收官了！”魔王维持着威严的表情，眼神早已飘向了桌上的的海景度假村海报。\n\n差分剧情：\n魔王优雅地施展了一个特效拉满、伤害为零的魔法，然后完美地演技爆发，顺着勇者的剑锋“倒地不起”。\n\n“啊，我败了，世界是你的了……”魔王心里的小人已经开始跳草裙舞了。\n\n可下一秒，迎接她的不是胜利的欢呼，而是勇者撕心裂肺的哭声。她丢掉剑，一头扎进魔王怀里，把鼻涕眼泪全蹭在了裙子上：“露比姐姐！你不要死！我都明白了……你故意教我怎么恢复战力，就是为了让我杀掉你来换取世界的和平对吗？这种沉重的爱，我怎么承受得起啊！”\n\n“既然你不想当魔王，那我也不当勇者了！这魔王城挺大的，我们把它改成‘勇者与魔王的主题度假村’怎么样？”\n\n于是，世界上最奇葩的创业组合诞生了。", 
    condition: (state) => (state.hero.health + state.hero.stamina + state.hero.mana) >= 220 && state.hero.affection > 50 && state.hero.suspicion > 50
  },
  { 
    id: "ending_c", 
    title: "结局 C", 
    text: "魔王城的黑色大门在一阵轰鸣声中缓缓开启。这本该是史诗级的最终决战，但王座上的魔王此时正忍着打哈欠的冲动，在脑海里疯狂拨算盘。\n\n“一年了……只要这孩子今天能稳稳当当地捅我一剑，我的‘带薪退休计划’就算完美收官了！”魔王维持着威严的表情，眼神早已飘向了桌上的的海景度假村海报。\n\n差分剧情：\n这是魔王算盘里最完美的一局。\n\n勇者带着满腔的正义感打败了魔王，带着对“失踪的露比姐姐”的淡淡忧伤回到了王城。而在大洋彼岸，魔王换上了太阳镜，正对着一桌子海鲜大快朵颐。她偶尔会看到报纸上关于“伟大勇者”的新闻，嘴角露出一抹深藏功与名的微笑。\n\n“数值算尽，退休归我。”魔王喝了一口果汁，满足地叹了口气。\n\n于是，勇者拯救了世界，魔王拯救了假期。", 
    condition: (state) => (state.hero.health + state.hero.stamina + state.hero.mana) >= 220 && state.hero.affection <= 50 && state.hero.suspicion <= 50
  },
  { 
    id: "ending_d", 
    title: "结局 D", 
    text: "魔王城的黑色大门在一阵轰鸣声中缓缓开启。这本该是史诗级的最终决战，但王座上的魔王此时正忍着打哈欠的冲动，在脑海里疯狂拨算盘。\n\n“一年了……只要这孩子今天能稳稳当当地捅我一剑，我的‘带薪退休计划’就算完美收官了！”魔王维持着威严的表情，眼神早已飘向了桌上的的海景度假村海报。\n\n差分剧情：\n小勇挥动手中的神剑指向王座：“魔王，受死吧！为了露比姐姐的期待，我一定要终结这一切！”\n\n魔王忍住笑意，利用瞬移逃走，留下一个写着“我被干掉了”的稻草人。\n\n不久后，在温暖的海边沙滩上，穿着泳装的“露比”正躺在躺椅上吸着椰子水。勇者在远处挥舞她钓上来的大鱼：“露比姐姐！我们今晚有烤鱼吃了！”\n\n“露比”拍了拍旁边的位置，心满意足地闭上眼：“干得好……现在世界和平了，我们可以一直幸福下去了。”", 
    condition: (state) => (state.hero.health + state.hero.stamina + state.hero.mana) >= 220 && state.hero.affection > 50 && state.hero.suspicion <= 50
  },
  { 
    id: "ending_e", 
    title: "结局 E", 
    text: "魔王城的黑色大门在一阵轰鸣声中缓缓开启。这本该是史诗级的最终决战，但王座上的魔王此时正忍着打哈欠的冲动，在脑海里疯狂拨算盘。\n\n“一年了……只要这孩子今天能稳稳当当地捅我一剑，我的‘带薪退休计划’就算完美收官了！”魔王维持着威严的表情，眼神早已飘向了桌上的的海景度假村海报。\n\n差分剧情：\n这一场的空气里没有粉红泡泡，只有冷冰冰的杀气。\n\n当勇者发现所谓“命运般的相遇”只是魔王为了退休的把戏时，她手里的剑也挥出了破纪录的数值。魔王试图解释：“其实我们这叫双赢……”\n\n“赢你个头！”小勇的剑刃划破了空气，“把我的感动还给我啊！”\n\n这一剑，魔王没能躲开。于是，魔王城塌了，退休计划也随之灰飞烟灭。她躺在废墟里，看着勇者头也不回离去的背影，终于明白：感情账，是这世上最难算的数值。", 
    condition: (state) => (state.hero.health + state.hero.stamina + state.hero.mana) >= 220 && state.hero.affection <= 50 && state.hero.suspicion > 50
  },
];

export const PROLOGUE_DIALOGUE = [
  {
    speaker: "魔王",
    text: "第一百个年头了……预言里那个能把我打败、让我领到巨额退休金去海边钓鱼的“传说勇者”，到底死哪去了？",
    eyeClosed: false,
  },
  {
    speaker: "巴力",
    text: "魔王大人！不能再等了！我们的【兵力】已经爆表，小伙子们整天在军营里闲得抠脚，甚至开始玩起彼此的角了！",
    animation: "BARRY_ENTER",
  },
  {
    speaker: "魔王",
    text: "……所以呢？",
    eyeClosed: true,
  },
  {
    speaker: "巴力",
    text: "我提议！立刻发动对人类王国的全面进攻！我们要烧毁他们的庄稼，掠夺他们的【物资】，把恐怖的【社会风气】带到每一个角落！",
  },
  {
    type: "TUTORIAL",
    text: "【属性记录】：你的目标是平衡勇者的【健康、体力、魔力、好感、怀疑】这五项核心指标。请在 100 天内将她引导向魔王城。",
  },
  {
    speaker: "魔王",
    text: "又来了。如果我现在答应，那些好战份子绝对会把世界毁掉，到时候我连退休的地方都没了。",
  },
  {
    type: "CHOICE",
    speaker: "巴力",
    text: "面对巴力的激进建议，你的魔王之心将如何共鸣？",
    swipeLeft: {
      text: "“这种提议绝不通过！”",
      effects: { morale: -15, climate: -5 },
    },
    swipeRight: {
      text: "“……我会再考虑的。”",
      effects: { resources: -5, military: +5 },
    },
  },
  {
    speaker: "魔王",
    text: "巴力，这种小事以后再说。比起这些，我更关心那个预言中的勇者。",
    animation: "MIRROR_SHOW",
  },
  {
    type: "CG",
    src: "/upload/cg1.png",
    text: "水镜中，一个少女正拿着一把木剑，闭着眼睛疯狂乱挥，对面的史莱姆甚至在打瞌睡……",
  },
  {
    speaker: "魔王",
    text: "……这就是那一届的勇者？",
  },
  {
    speaker: "巴力",
    text: "是的，大人。根据我们侦察兵的回报，这位少女的【好感】阈值极低（容易被骗），且【魔力】只有 1。昨天她甚至试图用面包去喂食石像鬼。",
  },
  {
    speaker: "魔王",
    text: "她的【总战力】呢？",
    eyeClosed: true,
  },
  {
    speaker: "巴力",
    text: "极低。按照这个进度，她大概需要 500 年才能走到魔王城门口。",
  },
  {
    speaker: "魔王",
    text: "不行！500 年？那时候我的鱼竿都烂了！",
  },
  {
    speaker: "魔王",
    text: "看来，指望这孩子自己开窍是不行了。巴力，准备好我的伪装！",
  },
  {
    speaker: "巴力",
    text: "大人，您要去哪？",
  },
  {
    speaker: "魔王",
    text: "去当一个流浪的【吟游诗人】。我要亲手把那个废柴，调教成最强的屠魔英雄！",
    background: "/upload/demon_city.jpg",
  },
  {
    speaker: "勇者",
    text: "呜……连史莱姆的皮都戳不动，我果然……不是当勇者的料吧。爸爸说得对，我还是回去种地算了……",
    background: "/upload/background.png",
  },
  {
    speaker: "魔王",
    text: "哎呀呀，这孩子比我想象中还要脆弱。这要是让她回去种地，我那片海边别墅的定金可就打水漂了。",
    background: "/upload/background.png",
  },
  {
    speaker: "魔王",
    text: "这位迷茫的少女哟，在这个充满史莱姆黏液的午后，为何要露出这种像被扣了年终奖一样的表情？",
    background: "/upload/background.png",
  },
  {
    speaker: "勇者",
    text: "哇！你是？还是……",
    background: "/upload/background.png",
  },
  {
    speaker: "露比",
    text: "我只是个路过的吟游诗人。你可以叫我“露比”。",
    useBardPortrait: true,
    background: "/upload/background.png",
  },
  {
    text: "勇者再次挥剑，这次虽然依旧笨拙，但居然成功地把史莱姆赶跑了。",
    background: "/upload/background.png",
  },
  {
    speaker: "勇者",
    text: "我成功了！我打跑了它！好耶！",
    expression: "STAREYE",
    background: "/upload/background.png",
  },
  {
    speaker: "露比",
    text: "嗯嗯，真棒。那么，为了让你能真正配得上“勇者”的名号，接下来的训练……",
    useBardPortrait: true,
    background: "/upload/background.png",
  },
  {
    speaker: "勇者",
    text: "姐姐你要教我绝招吗？",
    expression: "STAREYE",
    background: "/upload/background.png",
  },
  {
    speaker: "露比",
    text: "不，我们先从最基础的——如何优雅地在野外生火煮饭开始。",
    useBardPortrait: true,
    expression: "CLOSED",
    background: "/upload/background.png",
  },
  {
    speaker: "露比",
    text: "（低声自语）加油吧，你越强，我就能越早脱下这身沉重的魔王铠甲，去吹海风啊……",
    useBardPortrait: true,
    expression: "CLOSED",
    background: "/upload/background.png",
  },
  {
    type: "TUTORIAL",
    text: "【勇者养成】：你的目标是提升勇者的【总战力】（健康+体力+魔力），让她能达到打败你的门槛（220点）。但要注意【好感】或【怀疑】度的波动，那将决定最终的退休结局。",
  },
  {
    type: "TUTORIAL",
    text: "现在可以安排勇者的日程了！\n初始开放地区只有【绿叶村】【王城】，每完成一项随机事件等级+1，随着等级提升会解锁更多区域。\n【王城】可以回复50%已损失数值，但会一次直升5级，请适当规划时间~",
  },
];

export const REGIONS = [
  { id: "starter_village", name: "绿叶村", minLevel: 1, x: 23, y: 77 },
  { id: "imperial_city", name: "王城", minLevel: 1, x: 40, y: 50 },
  { id: "country_forest", name: "郊野森林", minLevel: 15, x: 26, y: 55 },
  { id: "misty_forest", name: "迷雾森林", minLevel: 30, x: 48, y: 20 },
  { id: "ice_field", name: "冰原", minLevel: 45, x: 29, y: 20 },
  { id: "desert", name: "荒漠", minLevel: 60, x: 52, y: 76.5 },
  { id: "dragon_bone_canyon", name: "龙骨峡谷", minLevel: 75, x: 61, y: 47 },
  { id: "volcano", name: "火山", minLevel: 90, x: 75, y: 47 },
  { id: "demon_castle", name: "魔王城", minLevel: 100, x: 75, y: 62 },
];
