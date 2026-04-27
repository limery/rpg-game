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
        resultText: "史莱姆汤的味道出奇地鲜美。虽然抓捕时被溅了一身粘液，但勇者感觉力量涌上来了！",
        failText: "史莱姆太滑了！它不仅逃跑了，还在勇者脸上蹦了一下。勇者被撞得晕乎乎的，精神受到了打击。",
        failChance: 0.1,
        effect: (state) => ({ 
          hero: { ...state.hero, health: Math.max(0, state.hero.health - 1), stamina: Math.min(100, state.hero.stamina + 5) },
          flags: { ...state.flags, ate_slime: true }
        }),
        failEffect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 2), suspicion: state.hero.suspicion + 2 } })
      },
      {
        text: "“鼓励她用木剑戳它”",
        resultText: "在你的调教下，勇者发出了软绵绵的呐喊并成功刺穿了史莱姆。虽然它很快就重组了，但她对战斗的领悟加深了。",
        failText: "勇者还没戳到，史莱姆就先发动了冲击！她被撞倒在草地上，疼得眼泪汪汪。",
        failChance: 0.2,
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health - 1, stamina: state.hero.stamina + 2, affection: state.hero.affection + 3, suspicion: state.hero.suspicion - 1 } }),
        failEffect: (state) => ({ hero: { ...state.hero, health: state.hero.health - 3, affection: state.hero.affection - 1, suspicion: state.hero.suspicion + 1 } })
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
        resultText: "猫没找着，你们倒是在树梢看了一场绝美的日落。勇者得到了锻炼，心情也变好了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina + 2, affection: state.hero.affection + 4, suspicion: state.hero.suspicion - 1 }, flags: { ...state.flags, found_cat: true } }),
      },
      {
        text: "“告诉她猫可能去魔王阵营了”",
        resultText: "勇者认真考虑了这种可能性。为了解析这种魔力波动，她尝试运用了平时你教的秘法，魔力有所提升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 4, mana: Math.min(100, state.hero.mana + 2) } }),
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
        resultText: "你细心地把饼干掰开，金黄的碎屑落在指尖。勇者幸福地嚼着，甚至偷偷把多出的那一点奶油也塞到了你嘴里。这一刻，疲惫似乎都消失了。",
        effect: (state) => ({ 
          hero: { 
            ...state.hero, 
            health: Math.min(100, state.hero.health + 15), 
            stamina: Math.min(100, state.hero.stamina + 5),
            affection: state.hero.affection + 10 
          } 
        }),
      },
      {
        text: "“当面全部吃掉”",
        resultText: "你一边大嚼特嚼，一边冷冷地告诉她：‘这是属于强者的战利品。’勇者的眼泪在眼眶里打转，虽然内心很受伤，但她对你身为‘严师’的力量更感畏惧了。",
        effect: (state) => ({ 
          hero: { 
            ...state.hero, 
            affection: Math.max(0, state.hero.affection - 15),
            suspicion: state.hero.suspicion + 8 
          } 
        }),
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
        resultText: "在你的纠正下，勇者的动作规范了许多。虽腰酸背痛，但对武器的掌控力变强了。",
        failText: "由于姿势用力过猛，勇者竟然把自己的腰闪了！这下不仅练习没法继续，还得躺平休息。",
        failChance: 0.15,
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 3), stamina: Math.min(100, state.hero.stamina + 12), affection: state.hero.affection + 8 } }),
        failEffect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 10), stamina: Math.max(0, state.hero.stamina - 3), affection: Math.max(0, state.hero.affection - 5) } })
      },
      {
        text: "“坐在旁边若无其事地喝红茶”",
        resultText: "勇者在你的静默中感到了一种神秘的玄奥。她试图通过冥想来沟通元素的呼吸，魔力意外提升了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 4), suspicion: state.hero.suspicion + 10 } }),
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
        resultText: "你成功阻止了她，顺便趁机讲了讲野外生存知识。勇者的魔力感知似乎敏锐了一点。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 5), affection: state.hero.affection + 5 } }),
      },
      {
        text: "“看着她吃下去，然后在她晕倒前背她走”",
        resultText: "勇者在幻觉中看到了很多五彩的小人，醒来后虽然虚弱，但对你的信任度爆表了。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 12), affection: state.hero.affection + 25 } }),
      },
    ],
  },
  {
    id: "s_ice_spirit_mischief",
    region: "ice_field",
    minLevel: 45,
    repeatable: true,
    text: "一个半透明的冰精灵突然出现，它嘻嘻笑着向勇者的后颈丢了一个冰球！",
    choices: [
      {
        text: "“帮她把冰块取出来”",
        resultText: "你温柔地帮她处理了恶作剧，勇者脸红了，虽然被冻了一下但心里暖暖的。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 3), affection: state.hero.affection + 10 } }),
      },
      {
        text: "“嘲笑她刚才滑稽的反应”",
        resultText: "冰精灵见你哈哈大笑，吐了吐舌头消失了。勇者的力量被寒气短暂压制了，甚至有些意志消沉。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.max(0, state.hero.stamina - 10), suspicion: state.hero.suspicion + 5 } }),
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
        resultText: "你的强大让她无比安心，甚至开始觉得‘露比姐姐’简直无所不能。",
        failText: "你单手挥剑时脚下打滑，两人差点一起摔进骨堆。场面一度非常尴尬。",
        failChance: 0.1,
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 30, suspicion: state.hero.suspicion + 5 } }),
        failEffect: (state) => ({ hero: { ...state.hero, affection: Math.max(0, state.hero.affection - 5), suspicion: state.hero.suspicion + 15 } })
      },
      {
        text: "“把她扔向骷髅并喊‘去吧我的王牌！’”",
        resultText: "在生死的边缘，勇者爆发出了惊人的潜力，一剑劈碎了骷髅。虽然受了点伤，但她变强了！",
        failText: "勇者被扔过去时吓得闭上了眼，没砍中骷髅反被骨爪挠了一下。她哭着跑了回来。",
        failChance: 0.25,
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 10), stamina: Math.min(100, state.hero.stamina + 20) } }),
        failEffect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 20), affection: Math.max(0, state.hero.affection - 5) } })
      },
    ],
  },
  {
    id: "c_evil_spirit_whisper",
    region: "dragon_bone_canyon",
    minLevel: 75,
    repeatable: true,
    text: "虚空中传来了峡谷恶灵的低语，它们在试图侵蚀勇者的精神。",
    choices: [
      {
        text: "“用魔力构建精神屏障”",
        resultText: "你的保护隔绝了污秽。在对抗低语的过程中，勇者的抗性得到了锻炼。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), affection: state.hero.affection + 5 } }),
      },
      {
        text: "“让她自己学会用意志力对抗”",
        resultText: (state) => {
          const totalPower = state.hero.health + state.hero.stamina + state.hero.mana;
          return totalPower >= 200 
            ? "面对邪恶的低语，勇者的眼神异常坚定。那股坚韧的意志让恶灵也为之退缩，由于精神高度集中，她的魔力感应变得更强了。"
            : "勇者的精神遭到了冲击，那些恶毒的咒语消耗了她的法力储备。她看起来非常虚弱，眼神中透着疲惫。";
        },
        effect: (state) => {
          const totalPower = state.hero.health + state.hero.stamina + state.hero.mana;
          return totalPower >= 200
            ? { hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 10) } }
            : { hero: { ...state.hero, mana: Math.max(0, state.hero.mana - 12), health: Math.max(0, state.hero.health - 3) } };
        },
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
        resultText: "泉水洗刷了疲惫。在这氤氲的水汽中，你们的关系似乎也拉近了许多。",
        effect: (state) => ({ hero: { ...state.hero, health: 100, stamina: Math.min(100, state.hero.stamina + 30), affection: state.hero.affection + 35 } }),
      },
      {
        text: "“拒绝并在旁边生一堆火”",
        resultText: "火光映照着勇者的侧脸。虽然没有泡温泉，但也让体力得到了不错的补充。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 20), affection: state.hero.affection + 5 } }),
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
        resultText: "圣水洗刷了疲惫，高强度的特训虽然让勇者哀号连连，但那提升的属性证明了一切辛劳都是值得的。体力、魔力与健康得到了回复，且提升了等级！",
        effect: (state) => ({
          hero: {
            ...state.hero,
            level: state.hero.level + 1,
            health: Math.min(100, state.hero.health + 40),
            stamina: Math.min(100, state.hero.stamina + 40),
            mana: Math.min(100, state.hero.mana + 40),
          },
        }),
      },
      {
        text: "“简单的身体调理后去逛逛王都”",
        resultText: "在你的陪同下，勇者在王都的街道上悠闲漫步。虽然没有属性的大幅飞跃，但她的心情变得非常舒畅。好感度提升了。",
        effect: (state) => ({
          hero: {
            ...state.hero,
            health: Math.min(100, state.hero.health + 30),
            stamina: Math.min(100, state.hero.stamina + 20),
            affection: state.hero.affection + 15,
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
        resultText: "你的一盆冷水泼得恰到好处。勇者开始脑补骑士们在铠甲里汗流浃背的样子，清醒了一些。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 1) } }),
      },
      {
        text: "“偷偷用幻术让她也穿上闪烁的铠甲”",
        resultText: "只有她能看到的金色铠甲笼罩在身上，勇者的腰杆瞬间挺直了。她觉得这是你给她的某种‘宿命’暗示，好感度疯狂飙升。",
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
        resultText: "那本书厚得能砸死史莱姆。勇者在枯燥的文字中昏昏欲睡，但确实学到了一些正义之道（其实是平乏的常识）。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 5), suspicion: Math.max(0, state.hero.suspicion - 5) } }),
      },
      {
        text: "“指引她看向那本《深渊语入门》”",
        resultText: "当她翻开那本书时，书页竟然发出了诡异的尖叫。勇者的魔力虽然暴涨，但她看向你的眼神也充满了惊恐。这种知识真的没问题吗？",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), suspicion: state.hero.suspicion + 20 } }),
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
        resultText: "你随意拨弄了一下木枝，那种凌厉的气息让勇者崇拜不已。她模仿得有模有样，力量感上升了。由于动作轻盈，好感度增加了。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 1), stamina: Math.min(100, state.hero.stamina + 2), affection: state.hero.affection + 2 } }),
      },
      {
        text: "“鼓励她继续努力”",
        resultText: "“加油哦，未来的勇者大人！”你的一句话让她红了脸，挥剑的速度都变快了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 3 } }),
      },
    ],
  },
  {
    id: "v_5_well",
    region: "starter_village",
    minLevel: 1,
    repeatable: true,
    text: "村头的古井旁，勇者正试图往井里丢银币许愿。她想要‘世界和平’以及‘一辈子吃不完的炸鸡’。",
    choices: [
      {
        text: "“告诉她许愿不如打怪”",
        resultText: "你抢走了她的银币并让她去跑两圈。勇者虽然委屈，但体能确实练起来了。怀疑度略微上涨。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina + 3, suspicion: state.hero.suspicion + 1 } }),
      },
      {
        text: "“偷偷在水下弄点金光让她觉得自己实现了愿望”",
        resultText: "井水瞬间金光四射。勇者惊叫着说这是神迹！她对你的神棍气质评价再次拔高，好感度疯涨。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10, mana: state.hero.mana + 1 } }),
      },
    ],
  },
  {
    id: "v_6_cow",
    region: "starter_village",
    minLevel: 5,
    text: "路边的一头奶牛看起来心情不好，勇者想通过‘剑舞’来逗它开心。这脑回路也是没谁了。",
    choices: [
      {
        text: "“教她真正的驯兽技巧”",
        resultText: "你展示了如何通过手势和气息控制动物。勇者学得很认真，魔力亲和力上升了。奶牛也被吓得产了双倍的奶。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 2 } }),
      },
      {
        text: "“让她继续舞，你在旁边画肖像画”",
        resultText: "夕阳下，废柴少女与郁闷奶牛的奇妙共舞被你画了下来。勇者看到画后非常感动，好感度增加了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 7 } }),
      },
    ],
  },
  {
    id: "v_7_hide_and_seek",
    region: "starter_village",
    minLevel: 1,
    repeatable: true,
    text: "一群小孩拉着勇者玩捉迷藏。勇者躲在了一个极其显眼的草堆里，还露着两块红色的裙边。",
    choices: [
      {
        text: "“悄悄用暗影斗篷帮她遮住”",
        resultText: "孩子们怎么也找不到她。勇者觉得自己觉醒了‘隐匿天赋’。怀疑度小幅上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 3, affection: state.hero.affection + 2 } }),
      },
      {
        text: "“直接指出她的位置”",
        resultText: "勇者被孩子们一拥而上抓住了。由于运动量大，体力有些透支，但她笑得很开心。好感度上升。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina + 2, affection: state.hero.affection + 4, health: state.hero.health - 2 } }),
      },
    ],
  },
  {
    id: "v_8_chef",
    region: "starter_village",
    minLevel: 8,
    text: "村里的厨师在大赛中缺席了。勇者决定亲自掌勺，虽然她连盐和糖都分不清。",
    choices: [
      {
        text: "“指点她精确的火候控制”",
        resultText: "这实际上是一场极佳的魔力操作练习。勇者掌控着火苗的温度，做出了一道发光的料理！魔力提升明显。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 5, health: state.hero.health + 3 } }),
      },
      {
        text: "“为了村民的生命安全，还是由你来吧”",
        resultText: "你熟练的厨艺震惊全村。勇者化身小迷妹，围着你转圈圈。好感度大幅上涨。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 12 } }),
      },
    ],
  },
  {
    id: "v_9_blacksmith",
    region: "starter_village",
    minLevel: 10,
    text: "老铁匠的炉子熄灭了。他请求你们帮忙重新点燃，这需要极高的温度。",
    choices: [
      {
        text: "“让勇者尝试注入斗气”",
        resultText: "在你的引导下，勇者满头大汗地完成了。这种对自己能量的极限压榨让她不仅提升了体能，等级也小幅提高。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina + 4, health: state.hero.health - 5, level: state.hero.level + 1 } }),
      },
      {
        text: "“随手丢进一块地狱火石”",
        resultText: "炉火瞬间变成了紫红色，甚至把老铁匠的胡子燎了一半。勇者看着那不祥的火焰，怀疑度增加了。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 15 } }),
      },
    ],
  },
  {
    id: "v_10_strange_stone",
    region: "starter_village",
    minLevel: 12,
    text: "村郊发现了一块会发出呼吸声的石头。勇者觉得这是某种远古封印，试图用头撞开它。",
    choices: [
      {
        text: "“其实那是睡着的岩石史莱姆，教她如何交流”",
        resultText: "勇者学会了与土元素沟通。这种奇特的体验让她的魔力感应变得更加开阔。魔力大幅提升。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 10, affection: state.hero.affection + 3 } }),
      },
      {
        text: "“离它远点，你在石头上感到了危险的气息”",
        resultText: "虽然失去了锻炼机会，但勇者对你的话深信不疑。她的直觉敏锐度提升了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 5 } }),
      },
    ],
  },
  {
    id: "v_11_bee_nest",
    region: "starter_village",
    minLevel: 1,
    repeatable: true,
    text: "勇者在村边的大树下发现了一个巨大的蜂巢，她居然想练习‘精准穿刺’来摘取蜂蜜。",
    choices: [
      {
        text: "“利用这个机会训练她的敏捷度”",
        resultText: "蜜蜂全飞出来了！勇者在前面跑，蜜蜂在后面追。虽然被蛰了几个包，但体能和速度确实快了不少。健康受损。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health - 5, stamina: state.hero.stamina + 5, level: state.hero.level + 1 } }),
      },
      {
        text: "“为她准备防蜂烟熏”",
        resultText: "你们顺利采集到了蜂蜜。甜美的味道让勇者感到了冒险的快乐，关系更进了一步。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 8, health: state.hero.health + 2 } }),
      },
    ],
  },
  {
    id: "v_12_lost_child",
    region: "starter_village",
    minLevel: 15,
    text: "一个孩子在村边的森林里走丢了。村长向你们求助。这是刷名声的好机会。",
    choices: [
      {
        text: "“利用搜寻咒语引导勇者独立完成”",
        resultText: "由于你暗中给的小贴士，勇者奇迹般地在狼群包围前救出了孩子。那种救英雄的成就感让她神采奕奕。全属性微调。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 3, stamina: state.hero.stamina + 3, level: state.hero.level + 2 } }),
      },
      {
        text: "“这是魔物的陷阱，直接带勇者避开”",
        resultText: "你识破了森林背后的诡异气氛。虽然村里人颇有微词，但勇者由于你的这种‘保护’感到了一种特殊的安全感。怀疑度小幅上涨。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 5, suspicion: state.hero.suspicion + 5 } }),
      },
    ],
  },
  {
    id: "ic_4_bakery",
    region: "imperial_city",
    minLevel: 1,
    repeatable: true,
    text: "王城著名的‘黄金小麦’面包店传来阵阵香气。那是只有贵族和成功勇者才吃得起的点心。",
    choices: [
      {
        text: "“买一些让她解解馋”",
        resultText: "香甜的气息让勇者幸福得像个小孩子。虽然体力只恢复了一点，但心情变得极好。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 5, stamina: state.hero.stamina + 10 } }),
      },
      {
        text: "“在这种地方排队太浪费修行时间了”",
        resultText: "勇者虽然很想吃，但还是乖乖跟着你走了。她对你的严厉感到有些无奈，但也更专注了。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, suspicion: state.hero.suspicion + 2 } }),
      },
    ],
  },
  {
    id: "ic_5_fountain",
    region: "imperial_city",
    minLevel: 5,
    repeatable: true,
    text: "中心广场的巨大的圣女喷泉正在喷涌。传闻在这里投币能获得女神的祝福。",
    choices: [
      {
        text: "“那是神圣结界的节点，引导她感应神圣力量”",
        resultText: "借着喷泉的水汽。勇者感到一阵前所未有的清明。这是一种神圣魔力的洗礼。魔力值增加不少。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 8, level: state.hero.level + 1 } }),
      },
      {
        text: "“比起许愿，不如我们在池底捞点路人掉落的硬币”",
        resultText: "这种丢人的事你怎么做得出来！勇者红着脸把你拉走了。虽然没捞到钱，但这种不正经的互动让她觉得你很有趣。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10 } }),
      },
    ],
  },
  {
    id: "ic_6_training_hall",
    region: "imperial_city",
    minLevel: 15,
    text: "王城的高级武馆。一群精英骑士正在进行实战对抗。勇者看得热血沸腾。",
    choices: [
      {
        text: "“安排她去和最优秀的扈从切磋”",
        resultText: "被揍得很惨。但那种实战经验是无价之宝。勇者的体能和等级得到了飞跃性的提升。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health - 15, stamina: state.hero.stamina + 10, level: state.hero.level + 3 } }),
      },
      {
        text: "“教她如何观察他们的破绽并以此为乐”",
        resultText: "你随口指出了那些大义凛然的骑士们动作中的缺陷。勇者对所谓的‘正义力量’产生了一丝动摇。怀疑度上涨。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 12, mana: state.hero.mana + 3 } }),
      },
    ],
  },
  {
    id: "ic_7_underground",
    region: "imperial_city",
    minLevel: 20,
    text: "王城的下水道里发现了史莱姆王。如果你不去处理，这里可能会被粘液淹没。",
    choices: [
      {
        text: "“带她去进行一场史诗级的‘清洁任务’”",
        resultText: "在恶臭与粘液中，勇者爆发出了惊人的战斗力。甚至学会了对AOE技能的防御。全属性得到强化。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina + 15, mana: state.hero.mana + 15, level: state.hero.level + 5 } }),
      },
      {
        text: "“其实史莱姆王身上有很值钱的核心，骗她说是圣物”",
        resultText: "勇者拼了命夺回了核心。当她兴奋地拿给你时，你内心的罪恶感稍微动了一下。怀疑度显著上涨，但魔力增幅巨大。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 25, mana: state.hero.mana + 20 } }),
      },
    ],
  },
  {
    id: "ic_8_opera",
    region: "imperial_city",
    minLevel: 1,
    text: "王城大剧院正在上演《最初的魔王与末代勇者的爱恋》。勇者想要门票。",
    choices: [
      {
        text: "“用幻术弄出一张假票（VIP席位）”",
        resultText: "你们坐在了最好的位置。舞台上的悲剧让勇者哭得梨花带雨。她甚至在黑暗中拉住了你的手。好感度疯涨。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25 } }),
      },
      {
        text: "“告诉她这种三流剧本全是胡说八道”",
        resultText: "你那愤慨的点评让勇者觉得你对历史很有研究。她的知识储备增加了（？）。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 5, suspicion: state.hero.suspicion + 5 } }),
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
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 5), stamina: Math.min(100, state.hero.stamina + 10) } }),
      },
      {
        text: "“在旁边偷吃刚烤好的红薯”",
        resultText: "你在树荫下大快朵颐。勇者闻着味儿跑过来，满脸怨念地分享了你的一半。",
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
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 5, stamina: state.hero.stamina - 8 }, inventory: [...state.inventory, "merchant_ring"] }),
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
  // Country Forest (郊野森林) New Events
  {
    id: "cf_4_beehive",
    region: "country_forest",
    minLevel: 15,
    text: "树上挂着一个巨大的蜂巢，勇者正盯着流出来的蜂蜜流口水。",
    choices: [
      {
        text: "“帮她把蜂巢捅下来”",
        resultText: "你一发魔力弹把蜂巢击落，两人顶着马蜂的狂轰滥炸抢走了蜂蜜。虽然被蛰得满头包，但勇者吃得很开心。",
        failText: "蜂群比想象中更疯狂！你们被一路追到了河里，勇者冻得直打喷嚏。",
        failChance: 0.3,
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 2), stamina: Math.min(100, state.hero.stamina + 5), affection: state.hero.affection + 5 } }),
        failEffect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 5), affection: Math.max(0, state.hero.affection - 2) } })
      },
      {
        text: "“严肃教育她这很危险，我们要按规律摘取”",
        resultText: "你用烟熏法弄到了一小块蜂蜜。勇者崇拜地看着你，觉得你无所不知。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 2, mana: Math.min(100, state.hero.mana + 1) } }),
      },
    ],
  },
  {
    id: "cf_5_hidden_river",
    region: "country_forest",
    minLevel: 15,
    text: "森林深处有一条清澈见底的小溪，勇者想清洗一下被粘液弄脏的软甲。",
    choices: [
      {
        text: "“帮她放哨”",
        resultText: "勇者在溪水中嬉戏，对你的体贴感到十分安心。运动量增加，她的体力也稍微上升了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 3), affection: state.hero.affection + 4 } }),
      },
      {
        text: "“趁机加入‘增强抗性’的特训”",
        resultText: "你让她在冰凉的溪水中练习出剑。勇者冷得瑟瑟发抖，但也变强了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 5), affection: state.hero.affection - 1, suspicion: state.hero.suspicion + 2 } }),
      },
    ],
  },
  {
    id: "cf_6_wild_boar",
    region: "country_forest",
    minLevel: 18,
    repeatable: true,
    text: "一只巨大的野猪正在泥潭里打滚，它是这一带的小霸主。",
    choices: [
      {
        text: "“正面硬刚！练习重击”",
        resultText: "勇者在一阵尘土飞扬中击败了野猪。力量感知提升！",
        failText: "野猪一个冲锋就把勇者顶飞了，她结结实实地撞在了树上。",
        failChance: 0.4,
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 4), health: Math.max(0, state.hero.health - 3) } }),
        failEffect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 10) } })
      },
      {
        text: "“设置陷阱，智取”",
        resultText: "由于你的指导，勇者用藤蔓做了个陷阱。野猪栽了进去。勇者的策略能力增加了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 1), affection: state.hero.affection + 2 } }),
      },
    ],
  },
  {
    id: "cf_7_storm",
    region: "country_forest",
    minLevel: 15,
    text: "暴雨突如其来。你们发现了一个干燥的岩洞。",
    choices: [
      {
        text: "“紧紧抱住瑟瑟发抖的勇者”",
        resultText: "在雷鸣声中，勇者的心跳很快。怀疑度有所下降。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10, suspicion: Math.max(0, state.hero.suspicion - 3) } }),
      },
      {
        text: "“让她在洞口站岗磨炼心志”",
        resultText: "勇者抱着剑瑟缩。虽然委屈，但生存意志变强了。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 2), stamina: Math.min(100, state.hero.stamina + 2), suspicion: state.hero.suspicion + 2 } }),
      },
    ],
  },
  {
    id: "cf_8_squirrel",
    region: "country_forest",
    minLevel: 15,
    text: "一只松鼠手里捧着松果好奇地看着你们。",
    choices: [
      {
        text: "“让勇者分享干果”",
        resultText: "勇者递过干果，松鼠碰了碰她的手。这种温馨让勇者感到治愈。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 5 } }),
      },
      {
        text: "“利用松鼠练习投掷精准度”",
        resultText: "你让勇者击落松果而不伤到松鼠。勇者精准度上升了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 2), suspicion: state.hero.suspicion + 1 } }),
      },
    ],
  },
  {
    id: "cf_9_mushrooms_soup",
    region: "country_forest",
    minLevel: 15,
    text: "勇者采了一篮子‘无毒’白蘑菇想煮汤。",
    choices: [
      {
        text: "“加入魔界香料亲自下厨”",
        resultText: "汤的味道鲜美。勇者喝完觉得浑身充满力量。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 10), mana: Math.min(100, state.hero.mana + 3), affection: state.hero.affection + 8 } }),
      },
      {
        text: "“指出里面混有剧毒丧志菇”",
        resultText: "你一脚踢翻汤锅。勇者虽然不开心但学到了新知识。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 3 } }),
      },
    ],
  },
  {
    id: "cf_10_monument",
    region: "country_forest",
    minLevel: 25,
    text: "空地中有一块刻着勇者赞歌的古老石碑。",
    choices: [
      {
        text: "“复述赞歌强化她的使命感”",
        resultText: "勇者眼中有光了！战力得到了一定提高。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 2), mana: Math.min(100, state.hero.mana + 2), affection: state.hero.affection + 2 } }),
      },
      {
        text: "“拍碎石碑：‘谎言无需多闻’”",
        resultText: "勇者被你的暴力震慑，开始怀疑那种所谓的‘正义’。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 10 } }),
      },
    ],
  },
  // Misty Forest (迷雾森林) New Events
  {
    id: "mf_4_ghost_fire",
    region: "misty_forest",
    minLevel: 30,
    text: "浓雾中出现了一团幽蓝的火焰，似乎在引导你们向深处走去。",
    choices: [
      {
        text: "“让勇者追上去，这是灵力特训”",
        resultText: "勇者在迷雾中追逐，灵觉被开发了。魔力得到提升。",
        failText: "追丢了火苗，还差点在浓雾里走散。勇者吓得大哭。",
        failChance: 0.3,
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 6), stamina: Math.min(100, state.hero.stamina + 2) } }),
        failEffect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 5), affection: Math.max(0, state.hero.affection - 2) } })
      },
      {
        text: "“拉住她的手：‘别被这些死者的余烬骗了’”",
        resultText: "你的大手非常有安全感。勇者靠在你肩膀上，怀疑度下降了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10, suspicion: Math.max(0, state.hero.suspicion - 5) } }),
      },
    ],
  },
  {
    id: "mf_5_singing_tree",
    region: "misty_forest",
    minLevel: 30,
    text: "一棵古树在风中发出了女人的歌声，令人心神荡漾。",
    choices: [
      {
        text: "“让勇者闭眼聆听并解析咒文”",
        resultText: "勇者捕捉到了那种古老的频率。魔力水平显著增长。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 8) } }),
      },
      {
        text: "“无情地砍下一截树枝：‘吵死了’”",
        resultText: "歌声戛然而止。勇者看着满地‘流血’的树皮，觉得你变得有些恐怖。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 12 } }),
      },
    ],
  },
  {
    id: "mf_6_altar",
    region: "misty_forest",
    minLevel: 35,
    text: "密林中隐藏着一座生锈的古老祭坛，上面放着一面破碎的镜子。",
    choices: [
      {
        text: "“教她在镜子前进行自我审视”",
        resultText: "勇者在破碎的镜面中看到了自己的多种可能。心智变强了。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 5), mana: Math.min(100, state.hero.mana + 5) } }),
      },
      {
        text: "“利用祭坛残余魔力强行灌顶”",
        resultText: "你的魔力粗暴地冲刷着她的经脉。勇者痛得尖叫，但等级直接提升。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 2, suspicion: state.hero.suspicion + 15 } }),
      },
    ],
  },
  {
    id: "mf_7_talking_crow",
    region: "misty_forest",
    minLevel: 30,
    text: "一只穿着燕尾服（？）的乌鸦站在枝头，向你们索要过路费。",
    choices: [
      {
        text: "“让勇者跟它讲道理”",
        resultText: "乌鸦被勇者的纯真打败了，临走前送了一根幸运羽毛。心情变好。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 5 }, flags: { ...state.flags, has_feather: true } }),
      },
      {
        text: "“把它抓起来拔毛作为魔法素材”",
        resultText: "乌鸦惨叫着逃跑了，留下一地黑毛。勇者觉得你现在像极了故事里的反派。怀疑度大涨。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 18 } }),
      },
    ],
  },
  {
    id: "mf_8_silent_lake",
    region: "misty_forest",
    minLevel: 32,
    text: "湖水如镜，静止得诡异。勇者想尝试水上行走的特训。",
    choices: [
      {
        text: "“亲自下水示范（顺便展示身材）”",
        resultText: "你的矫健身姿让勇者看呆了。原本的特训变成了大型追星现场。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“站在岸边不断朝湖心丢石头制造混乱干扰”",
        resultText: "波纹打破了宁静。勇者在颠簸的水面努力维持平衡。平衡感提升了，但也累坏了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 8), health: Math.max(0, state.hero.health - 5) } }),
      },
    ],
  },
  {
    id: "mf_9_trap_flower",
    region: "misty_forest",
    minLevel: 30,
    text: "一种巨大的食人花伪装成巨型郁金香，试图吞掉正在附近采花的勇者。",
    choices: [
      {
        text: "“表演英雄救美”",
        resultText: "在你怀里死里逃生的勇者，此时觉得你就是她的全世界。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25 } }),
      },
      {
        text: "“在旁边计时，限她10秒内逃脱”",
        resultText: "勇者由于极度恐慌爆发了非人速度。虽然最后哭得稀里哗啦，但敏捷感大幅提高。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 12), affection: Math.max(0, state.hero.affection - 10) } }),
      },
    ],
  },
  {
    id: "mf_10_moonlight",
    region: "misty_forest",
    minLevel: 35,
    text: "月光洒在林间空地。勇者有些怀念以前在村子里的舞会。",
    choices: [
      {
        text: "“邀请她跳一支只有魔界才有的华尔兹”",
        resultText: "在优雅而诡异的舞步中，勇者感到旋转的世界是那么真实。好感度巨量提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 30 } }),
      },
      {
        text: "“让她练习月光下的突刺1000次”",
        resultText: "月光拉长了她孤独练剑的身影。虽然实力增长了。但她开始怀念那个温柔的大姐姐了。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 15), suspicion: state.hero.suspicion + 8 } }),
      },
    ],
  },
  {
    id: "mf_11_shrooms_2",
    region: "misty_forest",
    minLevel: 30,
    text: "这片区域的蘑菇会喷射致幻粉末。勇者看起来已经晕眩了。",
    choices: [
      {
        text: "“用魔力过滤空气保护她”",
        resultText: "勇者清醒后，看到你由于过度消耗（装的）而略显‘苍白’的脸。感动不已。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“引导她将幻觉转化为魔法回路”",
        resultText: "在混乱的精神状态下。她竟然理解了复杂的次元理论。魔力暴涨。但由于精神受创。 怀疑度也随之上升。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), suspicion: state.hero.suspicion + 10 } }),
      },
    ],
  },
  {
    id: "mf_12_shadow_copy",
    region: "misty_forest",
    minLevel: 40,
    text: "雾气凝聚成了勇者的暗影分身。分身正无声地挑衅着她。",
    choices: [
      {
        text: "“指点她击破分身的节奏”",
        resultText: "战胜了内心的恐惧。勇者感觉战力得到了质的飞跃。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 10), stamina: Math.min(100, state.hero.stamina + 10) } }),
      },
      {
        text: "“在暗影分身消失前跟它击掌”",
        resultText: "勇者亲眼看到你和那个‘邪恶化身’谈笑风生。她吓得后退了三步。 怀疑度暴增。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 25 } }),
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
        resultText: "药剂居然是真的。勇者喝下后，视野变得无比清晰，甚至隐约感觉到你周身缭绕的魔气。",
        failText: "药剂是假醋。勇者酸得满地找牙。老板趁机溜了，勇者发誓要学会鉴定法术。",
        failChance: 0.3,
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), suspicion: state.hero.suspicion + 10 } }),
        failEffect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 2), health: Math.max(0, state.hero.health - 5) } })
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
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 5), affection: state.hero.affection + 15 } }),
      },
      {
        text: "“教她如何用斗气御寒”",
        resultText: "在那艰苦的教导下，她终于掌握了一点呼吸法。虽然浑身是汗但在雪地里也不再发抖了。",
        failText: "动作没到位，勇者不仅没变暖，反而因为出汗后吹冷风感冒了。",
        failChance: 0.2,
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 5), stamina: Math.min(100, state.hero.stamina + 20) } }),
        failEffect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 15) } })
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
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 30), affection: state.hero.affection + 10 } }),
      },
      {
        text: "“让她继续跟仙人掌聊天”",
        resultText: "神奇的是，仙人掌竟然倒向了水源的方向……勇者的【运气】增加了一点。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 5, mana: Math.min(100, state.hero.mana + 5) } }),
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
    repeatable: true,
    text: "迷雾森林深处，一位干瘪的邪恶女巫正躲在树后观察你们。她突然现身投掷了一枚诡异的魔药！",
    choices: [
      {
        text: "“挺身而出挡住魔药”",
        resultText: "魔药在你身上无效，但女巫反手给勇者补了一个衰弱诅咒。勇者的精神受到了冲击。",
        effect: (state) => {
          const isStamina = Math.random() > 0.5;
          return {
            hero: {
              ...state.hero,
              stamina: isStamina ? Math.max(0, state.hero.stamina - 15) : state.hero.stamina,
              mana: !isStamina ? Math.max(0, state.hero.mana - 15) : state.hero.mana
            }
          };
        },
      },
      {
        text: "“拉着勇者快速逃跑”",
        resultText: "你们虽然逃掉了，但在慌乱的奔跑中消耗了大量体力。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.max(0, state.hero.stamina - 10) } }),
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
        resultText: "镜中的倒影告诉了她什么是真正的勇气。虽然魔力由于过度思考而略有损耗，但她的意志得到了升华。 怀疑值有所变动。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.max(0, state.hero.mana - 3), level: state.hero.level + 1, suspicion: state.hero.suspicion + 5 } }),
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
    text: "迷雾中突然飞过一群散发着幽蓝光芒的月光蝶。勇者看得入神，甚至想伸手去捕捉。",
    choices: [
      {
        text: "“别动，那些粉末会让人陷入沉睡”",
        resultText: "你的一声断喝让勇者缩回了手。果然，前方的魔物在接触蝶粉后瞬间倒地。勇者拍着胸口，对你的博学充满了感激。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 2), affection: state.hero.affection + 3 } }),
      },
      {
        text: "“教她如何用魔力引导蝴蝶开路”",
        resultText: "在你的指导下，蝴蝶群竟然排成了指引方向的队列。这种与自然的共鸣让勇者的魔力操作变得更加丝滑。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 5) } }),
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
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 23, stamina: state.hero.stamina - 10 } }),
      },
      {
        text: "“一剑把松果堆劈个粉碎”",
        resultText: "随着暴力拆解，周边的迷雾竟然出现了一丝晃动。勇者被你的简单粗暴震撼了，虽然魔力没涨，但胆识增强了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 10), suspicion: state.hero.suspicion + 5 } }),
      },
    ],
  },
  {
    id: "if_generic_1",
    region: "ice_field",
    minLevel: 45,
    repeatable: true,
    text: "一场突如其来的特大暴风雪将你们困在了冰脊上。如果不采取行动，勇者可能会被冻僵。",
    choices: [
      {
        text: "“教她如何利用雪的隔热特性挖一个雪洞避寒”",
        resultText: "你们缩在小小的雪洞里，分享着仅剩的一块干粮。这种极端的生存体验让勇者的意志变得极其坚韧。体能大增。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 30), affection: state.hero.affection + 10 } }),
      },
      {
        text: "“直接用魔力在雪地上烧开一大锅热水”",
        resultText: "这种违背自然规律的行为虽然很暖和，但勇者看着冒着紫色魔气的沸水，陷入了沉思……无论如何，健康恢复了。",
        effect: (state) => ({ hero: { ...state.hero, health: 100, suspicion: state.hero.suspicion + 15 } }),
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
      {
        text: "“把它踢飞，别管这没用的东西”",
        resultText: "你冷淡的态度让勇者有些失落，她原本还想养起来着。她默默地跟在你身后，心里有些空落。 ",
        effect: (state) => ({ hero: { ...state.hero, affection: Math.max(0, state.hero.affection - 10), suspicion: state.hero.suspicion + 3 } }),
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
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10, mana: state.hero.mana - 10 } }),
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
        resultText: "在漫天黄沙中，紧握的手心是唯一的依靠。勇者的心跳跳得比风暴还快。当风暴过去时，她甚至舍不得松开你的手。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25 } }),
      },
      {
        text: "“用绳子把两人捆在一起，防止被风吹走”",
        resultText: "虽然这种方式既不优雅也不浪漫，但确实在狂风中保证了安全。勇者由于你的这种‘高效且冷酷’的处理方式，对你的神秘感又加深了。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 15 } }),
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
      {
        text: "“随她去吧，也许这是勇者的潜能训练”",
        resultText: "随着‘咚’的一声巨响，化石没碎，勇者捂着脑袋蹲在地上。她虽然泪流满面，但似乎由于这种撞击。魔力感应变得稍微清晰了（？）",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 5), mana: state.hero.mana + 15, affection: Math.max(0, state.hero.affection - 10) } }),
      },
    ],
  },
  {
    id: "vol_generic_1",
    region: "volcano",
    minLevel: 90,
    repeatable: true,
    text: "地表裂缝中喷出了高温的地热蒸汽。勇者摸了摸空瘪瘪的肚子，提议用它来‘蒸干粮’。",
    choices: [
      {
        text: "“顺便教她如何将魔力储存在食物中”",
        resultText: "热腾腾的干粮混合了自然能量。吃下后，勇者感到一股暖流传遍全身。不仅健康恢复了，魔力也有了增长。",
        effect: (state) => ({ hero: { ...state.hero, health: 100, mana: Math.min(100, state.hero.mana + 10) } }),
      },
      {
        text: "“斥责她这种拿修行当野餐的态度”",
        resultText: "虽然你表现得很生气。但看着她委屈的表情，你还是默默帮她挡住了刺鼻的硫磺味。勇者在赌气中反而更专注地运行起周天功法。体力上限增加了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 20), suspicion: state.hero.suspicion + 5 } }),
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
    text: "王城的街道上，一群孩子正在围捕一只看起来很凶的小花猫。",
    choices: [
      {
        text: "“教导勇者什么是真正的强者风范—去帮帮孩子们”",
        resultText: "勇者加入了孩子们的行列。虽然闹得鸡飞狗跳，但那是难得的温馨时光。她觉得你总是懂她那颗赤子之心。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 10), affection: state.hero.affection + 5 } }),
      },
      {
        text: "“告诉她强者不该插手弱者的纷争—袖手旁观”",
        resultText: "勇者的正义感被你压制了。这种对‘规则’的极端服从。让她在变得更加‘好用’的同时。看向你的眼神也多了一丝迷茫和不解。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 7 } }),
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
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health - 3, stamina: state.hero.stamina + 15 } }),
      },
      {
        text: "“用魔力切断周围的荆棘”",
        resultText: "由于你的魔法介入，采摘变得异常顺利。勇者开心地拿到了药草。但你那精准的切割手法让她有些困惑。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 2, suspicion: state.hero.suspicion + 4 } }),
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
        resultText: "你耐心地纠正着她的呼吸节奏。一刻钟后，她的气息已经完美融入了森林。她对你的潜行造诣深感敬佩。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 5, suspicion: state.hero.suspicion + 2 } }),
      },
      {
        text: "“就在这周围乱跑，吸引走森林里的魔物”",
        resultText: "勇者在前面跑，魔物在后面追。这种‘遛狗’训练极大增强了她的耐力，但也让她觉得你有些太不着调了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina + 12, affection: Math.max(0, state.hero.affection - 5) } }),
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
        resultText: "你眼睁睁看着她被枯骨包围。由于你的冷酷。勇者在绝境中领略到了真正的危机感。虽然浑身是伤。但那双眼眸里的光却犀利了数倍。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health - 12, level: state.hero.level + 1, suspicion: state.hero.suspicion + 10 } }),
      },
      {
        text: "“直接用上位魔力将其再次瓦解”",
        resultText: "你随意拨动手指，那种不可一世的压制力让勇者头皮发麻。危机解除了。但你的身份在她心里打下了一个巨大的问号。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 35, mana: state.hero.mana + 10, affection: state.hero.affection + 5 } }),
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
        resultText: "在这种极压环境下，每一个动作都千难万难。勇者虽然累得几乎虚脱，但她的肉体（Health）承受力确实变强了，意志也更加坚定。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 20, stamina: Math.max(0, state.hero.stamina - 30), level: state.hero.level + 1 } }),
      },
      {
        text: "“帮她施加轻灵之翼”",
        resultText: "“好轻！”勇者露出了如释重负的表情。在你的魔法保护下，她感觉自己像一只飞鸟。虽然没能锻炼体力，但她对你的好感度又增加了。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana - 10, affection: state.hero.affection + 15 } }),
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
        resultText: "在你的指挥下，勇者给予了莉莎解脱。虽然代价惨重，但巨龙的力量已经融入了她的剑刃。她变得前所未有的强大。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 5), level: state.hero.level + 4 }, demonKing: { ...state.demonKing, military: state.demonKing.military - 5 } }),
      },
      {
        text: "“展现出凌驾于巨龙之上的恐怖气息”",
        resultText: "你仅仅是一个眼神，原本暴虐的火龙就发出了恐惧的哀鸣。危机瞬间解除。但勇者看着瑟瑟发抖的龙，再看看你平静如水的笑容。一股寒意从脚心升起。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 30, affection: state.hero.affection + 5 } }),
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
        resultText: "在勇者跳起的一瞬，你用法则之力轻托了她一把，并稳稳地接住了她。这种生死的浪漫远超一切。她的心跳已经说明了一切。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 10), affection: state.hero.affection + 40 } }),
      },
      {
        text: "“挥手冻结岩浆（虽然极度消耗魔力）”",
        resultText: "整条岩浆河瞬间变成了黑曜石地板。这种改天换地的伟力彻底震慑了勇者。她默默走在冰冷的石面上。再也不敢抬头看你的眼睛。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 30, mana: Math.min(100, state.hero.mana + 20) } }),
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
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina - 10, mana: state.hero.mana + 10 } }),
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
        resultText: "采集过程惊险异常，但勇者最终还是得手了。她将碎片护在怀里，完全没注意自己的手指被划出了细小的伤口。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 10), inventory: [...state.inventory, "obsidian"] } }),
      },
      {
        text: "“算了，命要紧”",
        resultText: "你放弃了这种诱人的素材。虽然实力没能更进一步，但勇者感受到了你对她生命的重视，这比什么神兵利器都重要。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 5, affection: state.hero.affection + 8 } }),
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
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 6), stamina: Math.max(0, state.hero.stamina - 10) } }),
      },
      {
        text: "“伸出一只脚绊倒领头的野猪”",
        resultText: "这种有些卑鄙但有效的辅助让勇者大跌眼镜。虽然战斗赢了。但她对你那种完全不在乎骑士精神的战斗态度感到了一种深深的违和感。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, suspicion: state.hero.suspicion + 8 } }),
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
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 12, mana: Math.min(100, state.hero.mana + 2) } }),
      },
      {
        text: "“趁这机会在树干上教她练习剑术的发力”",
        resultText: "枯燥而严苛的训练。雨水打湿了她的衣服。由于你毫无温柔可言的指导。勇者的体术（Stamina）获得了长足进步。但好感度略微下降了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 20), affection: Math.max(0, state.hero.affection - 5) } }),
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
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 25) } }),
      },
      {
        text: "“直接用法力震碎石碑，取出内部的能量核心”",
        resultText: "你那暴虐的行为让石碑瞬间粉碎。一颗晶莹的紫色核心落入你手。在你将这股能量强行灌注给勇者后。她感到魔力沸腾。也感到了你那视古迹如草芥的恐怖。 怀疑度上涨。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 45), suspicion: state.hero.suspicion + 25 } }),
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
        resultText: "温暖的火焰和你的声音让她渐渐松弛下来。她做了一个关于向日葵的美梦。好感度加深了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 20), affection: state.hero.affection + 10 } }),
      },
      {
        text: "“教她如何通过控制血管收缩来御寒”",
        resultText: "这是一种极其精细的魔力操作。在你的引导下。勇者惊奇地发现自己不再颤抖了。这种对身体极致的掌控感。让她对自己变得‘非人’产生了一丝莫名的恐惧。 怀疑度上涨。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 20), suspicion: state.hero.suspicion + 15 } }),
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
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 5), affection: state.hero.affection + 15 } }),
      },
      {
        text: "“魔王就是万恶之源，你的使命就是消灭他”",
        resultText: "你面无表情地重复着那些圣殿的陈词滥调。勇者有些失望地低下了头。“露比姐姐，你说话越来越像那些无聊的神官了。”她似乎感到了你某种刻意的疏离。 怀疑度上涨了。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 10, affection: Math.max(0, state.hero.affection - 5) } }),
      },
    ],
  },
  {
    id: "ic_generic_5",
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
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 5), stamina: Math.max(0, state.hero.stamina - 15), affection: state.hero.affection + 12 } }),
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
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 10), affection: state.hero.affection + 8 } }),
      },
      {
        text: "“让她继续往前走，你倒想看看是什么东西在搞鬼”",
        resultText: "你的‘不负责任’让勇者险些坠入沼泽。虽然最后你一只手就把她拎了回来。但那种被当成诱饵的恐惧感。让她的怀疑度大幅上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 25, mana: state.hero.mana + 5 } }),
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
      {
        text: "“一发火球术破坏掉这无聊的艺术品”",
        resultText: "雪人瞬间化为了汽水。勇者看着满地的水渍，眼神呆滞。在这个寒冷的冬天。她感到了比冰层还要刺骨的某种冷绝。 怀疑度上涨了。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 20, affection: Math.max(0, state.hero.affection - 10) } }),
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
        resultText: "里面的陷阱对你来说是儿戏，但对她来说是极佳的试炼。你们收获了不少古币（其实是你刚才洒在那里的）。好感度上涨了。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 20), mana: Math.min(100, state.hero.mana + 10), affection: state.hero.affection + 15 } }),
      },
      {
        text: "“告诉她财宝都是诅咒，这是一种贪婪的诱惑”",
        resultText: "勇者被你的‘正论’吓退了。虽然她保持了心灵的纯洁。但那种由于错失财宝而产生的遗憾。让她对自己原本坚定的救世热情产生了一丝动摇。等级微升。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, suspicion: state.hero.suspicion + 5 } }),
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
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 35) } }),
      },
      {
        text: "“告诉她这是魔王的引信，离远点”",
        resultText: "勇者害怕地躲到了你身后。看着你随手扔进一颗石头就引发了巨大的爆炸。她对这个世界的危险性有了更深的认识。魔力稍微提升。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 10), suspicion: state.hero.suspicion + 15 } }),
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
        resultText: "这鱼真的能吃吗？虽然口感很像烧红的铁块，但其中蕴含的生命力让她的身体素质再次飞跃。好感度加了不少。",
        effect: (state) => ({ hero: { ...state.hero, health: 100, stamina: Math.min(100, state.hero.stamina + 20), affection: state.hero.affection + 25 } }),
      },
      {
        text: "“告诉她这些鱼是地狱的狱卒，吃了会变成怪物”",
        resultText: "勇者吓得扔掉了手里的烧烤叉。她看着那些在岩浆里游弋的‘鱼’。心中对你那个所谓的‘家乡’充满了前所未有的恐惧。 怀疑度暴涨。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 35 } }),
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
      {
        text: "“用一根狗尾巴草轻轻扫她的鼻尖”",
        resultText: "“阿嚏！”勇者猛地惊醒，茫然地看着四周。当她看到你手里晃悠的草头时，气得鼓起了腮帮子追着你打。虽然午觉没睡成，但精神好多了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 5), affection: state.hero.affection + 2 } }),
      },
    ],
  },
  {
    id: "v_5_blacksmith",
    region: "starter_village",
    minLevel: 3,
    text: "村里的铁匠大叔正在打铁，火星四溅。勇者看得入神，铁匠大叔笑着问她要不要试试拉风箱。",
    choices: [
      {
        text: "“这是一个锻炼臂力的好机会”",
        resultText: "勇者卖力地拉着风箱，虽然弄得满头大汗且灰头土脸，但她的力量（Stamina）得到了实打实的提升。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 2), stamina: Math.min(100, state.hero.stamina + 15) } }),
      },
      {
        text: "“在旁边点评铁匠的敲击节奏”",
        resultText: "铁匠认为你很有见地。勇者听着你们的交谈，对武器的理解加深了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 5), affection: state.hero.affection + 2 } }),
      },
    ],
  },
  {
    id: "v_6_field_scarecrow",
    region: "starter_village",
    minLevel: 2,
    text: "田野里立着几个稻草人。勇者突然觉得其中一个稻草人的眼神很邪恶，决定给它来一记重击。",
    choices: [
      {
        text: "“发动你的最强一击吧！”",
        resultText: "“哈！”木剑贯穿了稻草人。虽然稻草溅了一身，但勇者由于成功宣泄了破坏欲而感到很有成就感。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 2), stamina: Math.min(100, state.hero.stamina + 10) } }),
      },
      {
        text: "“那是老奶奶的稻草人，别乱砍”",
        resultText: "你阻止了这无意义的行为。勇者虽然有点小郁闷，但她学会了控制自己的冲动，心智成熟了一点。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 3) } }),
      },
    ],
  },
  {
    id: "v_7_well_whisper",
    region: "starter_village",
    minLevel: 4,
    text: "村中央的古井边传来了回声。勇者对着井口大喊：‘我是未来的大英雄！’井底传回了同样的叫声。",
    choices: [
      {
        text: "“对着井口练习发声（这是领袖的气质）”",
        resultText: "勇者喊了一下午，嗓子都快哑了。虽然听起来很傻，但她的意志力提升了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 5), mana: Math.min(100, state.hero.mana + 2) } }),
      },
      {
        text: "“告诉她井里住着名为‘回声怪’的魔物”",
        resultText: "勇者吓得立刻缩回了头，惊疑不定地盯着幽深的井口。她对未知的恐惧让她在未来的探索中变得更加谨慎。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 5, mana: Math.min(100, state.hero.mana + 4) } }),
      },
    ],
  },
  {
    id: "v_8_chicken_chase",
    region: "starter_village",
    minLevel: 1,
    repeatable: true,
    text: "一群农家鸡不知为何在大街上横冲直撞。勇者觉得这简直是某种阵法，试图通过走位避开它们。",
    choices: [
      {
        text: "“练习你的灵活动作！”",
        resultText: "鸡飞狗跳中，勇者的身法变得轻盈了一点。虽然最后被大公鸡啄了一下，但经验值到手了。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 1), stamina: Math.min(100, state.hero.stamina + 3) } }),
      },
      {
        text: "“站在远处冷眼旁观”",
        resultText: "你看着勇者被公鸡追得满街跑，甚至还记录下了她狼狈的瞬间。勇者觉得你这个导师太没同情心了，心里颇有微词。",
        effect: (state) => ({ hero: { ...state.hero, affection: Math.max(0, state.hero.affection - 5), suspicion: state.hero.suspicion + 2 } }),
      },
    ],
  },
  {
    id: "v_9_village_festival",
    region: "starter_village",
    minLevel: 8,
    text: "绿叶村正在举办丰收前的小祭典。空气中弥漫着烤香肠和麦芽酒的味道。",
    choices: [
      {
        text: "“教她一跳传统的祭典舞蹈”",
        resultText: "在欢快的鼓点中，你和勇者围着火堆起舞。虽然她踩了你三下脚，但你们的笑容从未如此灿烂。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 10), affection: state.hero.affection + 20 } }),
      },
      {
        text: "“安静地坐在角落观察人群”",
        resultText: "你教她如何观察他人的弱点和呼吸。勇者的直觉变得敏锐了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 12), suspicion: state.hero.suspicion + 5 } }),
      },
    ],
  },
  {
    id: "v_10_herb_garden",
    region: "starter_village",
    minLevel: 6,
    text: "村医的花园里种着一些稀有的止血草。村医答应只要勇者帮忙除草，就教她一些药理知识。",
    choices: [
      {
        text: "“认真除草并学习药草辨识”",
        resultText: "勇者学会了如何分辨草药，还顺便带走了一些疗伤药粉。这对未来的冒险大有好处。",
        effect: (state) => ({ 
          hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 5), health: Math.min(100, state.hero.health + 10) },
          flags: { ...state.flags, knows_herbs: true }
        }),
      },
      {
        text: "“嘲笑她认不清毒草和杂草”",
        resultText: "你那尖刻的评论让勇者自尊心受挫。虽然她在赌气之下发疯般地记住了所有目录，但对你的印象分瞬间跌落。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), affection: Math.max(0, state.hero.affection - 12) } }),
      },
    ],
  },
  {
    id: "v_11_old_knight_tomb",
    region: "starter_village",
    minLevel: 10,
    text: "在村外的墓地里，有一座被遗忘的前代骑士墓碑。勇者在这里感觉到了一股庄严的气息。",
    choices: [
      {
        text: "“在墓前宣誓你的志向”",
        resultText: "一道微弱的圣光从天而降。前代骑士残存的意志认可了少女，她的等级（Level）因此获得了突破。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 2, mana: Math.min(100, state.hero.mana + 10) } }),
      },
      {
        text: "“告诉她死人帮不了她，活下去得靠拳头”",
        resultText: "你那充满魔道气息的发言让墓园里的气氛瞬间凝固。勇者虽然被你的现实吓了一跳，但她对你那种‘不信鬼神’的力量感到深深的战栗。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 5), suspicion: state.hero.suspicion + 15 } }),
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
      {
        text: "“提醒她这里有很多扒手，让她看好钱包”",
        resultText: "由于你的提醒，勇者一路神经紧绷地捂着口袋。虽然没吃到零食，但她的警觉性（怀疑度）似乎被你传染了。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 5, mana: Math.min(100, state.hero.mana + 2) } }),
      },
    ],
  },
  {
    id: "ic_5_gladiator_arena",
    region: "imperial_city",
    minLevel: 10,
    text: "王城的大竞技场，这里正在举行新兵比武。勇者在看台上看得热血沸腾。",
    choices: [
      {
        text: "“带她下场去报名参加练习赛”",
        resultText: "在一阵激烈的肉搏后，勇者虽然被打得鼻青脸肿，但那种面对强敌的经验是无价的。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 8), stamina: Math.min(100, state.hero.stamina + 35) } }),
      },
      {
        text: "“在看台上教她如何通过微表情判断胜负”",
        resultText: "“你看那个骑士，他的重心已经乱了……”你的专业分析让勇者目眩神迷。她从未想过战斗中还有这么多弯弯绕绕。魔力感应加深了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), affection: state.hero.affection + 5 } }),
      },
    ],
  },
  {
    id: "ic_6_royal_garden",
    region: "imperial_city",
    minLevel: 5,
    text: "翻过高墙就是皇室花园。勇者由于好奇想去看看那里的‘万花之王’。",
    choices: [
      {
        text: "“用悬浮术带她飞过围墙”",
        resultText: "在高空中俯瞰灯火辉煌的王城，勇者兴奋地尖叫。在落地后，她觉得这种刺激的体验比任何课程都有趣。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 30, suspicion: state.hero.suspicion + 20 } }),
      },
      {
        text: "“这堵墙太厚了，我们下次再来”",
        resultText: "稍微敷衍一下就带她离开了。勇者有些失望，觉得你似乎在隐瞒什么。",
        effect: (state) => ({ hero: { ...state.hero, affection: Math.max(0, state.hero.affection - 10), suspicion: state.hero.suspicion + 5 } }),
      },
    ],
  },
  {
    id: "ic_7_underground_market",
    region: "imperial_city",
    minLevel: 20,
    text: "通过一个隐秘的井盖，你们进入了王城的地下黑市。这里充斥着各种违禁品。",
    choices: [
      {
        text: "“带她去见识真实的阴暗面”",
        resultText: "勇者被这里残酷的交易震撼了。她虽然有些不适，但对‘力量’的渴望变得更加现实。由于这种精神上的洗礼，她的魔力变得凝实了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), suspicion: state.hero.suspicion + 15 } }),
      },
      {
        text: "“在这里发布一个寻找遗失文物的虚假委托”",
        resultText: "你那老练的地下交易手段让勇者看得一愣一嫩的。她开始怀疑你这个‘吟游诗人’以前到底是干什么的。虽然拿到了一些情报，但信任感动摇了。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 15, mana: Math.min(100, state.hero.mana + 4) } }),
      },
    ],
  },
  {
    id: "ic_8_fountain_wish",
    region: "imperial_city",
    minLevel: 1,
    repeatable: true,
    text: "广场中央有一座许愿池。人们往里面扔铜币祈求平安。",
    choices: [
      {
        text: "“也让她投一枚币许愿”",
        resultText: "“我希望露比姐姐能一直陪着我……”她低声嘟囔着，脸蛋微红。许愿池的水面荡漾起一圈涟漪。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10 } }),
      },
      {
        text: "“这就是骗局，不如去买烤肠”",
        resultText: "你那一脸看透世俗的表情。让勇者觉得虽然你不可理喻。但你手里冒着香气的烤肠确实更有说服力。精神好了不少。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 10), affection: state.hero.affection + 2 } }),
      },
    ],
  },
  {
    id: "ic_9_hero_statue",
    region: "imperial_city",
    minLevel: 1,
    text: "广场上屹立着开国勇者的巨大石像。勇者站在石像脚下，显得无比渺小。",
    choices: [
      {
        text: "“告诉她总有一天她的雕像也会立在这里”",
        resultText: "你的鼓励让她眼中燃起了火焰。这种自信的提升比任何训练都更显成效。勇者发誓要变得像石像一样伟大。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, stamina: Math.min(100, state.hero.stamina + 5) } }),
      },
      {
        text: "“指出雕像基座上的裂纹并告诉她英雄也是人”",
        resultText: "勇者认真观察着那些岁月的痕迹。她意识到即便是传说也会陨落。在这种觉悟中，她的心境变得更加坚韧，而不是盲目崇拜。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 12), suspicion: state.hero.suspicion + 4 } }),
      },
    ],
  },
  {
    id: "ic_10_theater",
    region: "imperial_city",
    minLevel: 8,
    text: "王城大剧院正在上演《屠龙勇者传》。勇者对舞台上夸张的动作指指点点。",
    choices: [
      {
        text: "“带她去后台学习那些特技动作”",
        resultText: "剧团老板被你的（威压）魅力打动，教了勇者几招华丽的剑技。虽然华而不实，但增加了她的敏捷感。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 5), stamina: Math.min(100, state.hero.stamina + 10) } }),
      },
      {
        text: "“告诉她真正的勇者是不屑于这种表演的”",
        resultText: "你那副严师的派头。让勇者肃然起敬。虽然没能看到结局。但她决定在未来的实战中。也要保持那份属于‘勇者’的矜持。 Mana提升了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15) } }),
      },
    ],
  },
  {
    id: "ic_11_canal_boat",
    region: "imperial_city",
    minLevel: 3,
    repeatable: true,
    text: "王城的运河穿城而过。你可以租一艘小船和勇者一起游览。",
    choices: [
      {
        text: "“划船并享受宁静的时光”",
        resultText: "微风拂面，水声潺潺。勇者在船上睡着了，整个人缩成小小的一团。这种宁静极大地恢复了她的状态。你看着她的睡脸，心中也起了一丝波澜。",
        effect: (state) => ({ 
          hero: { 
            ...state.hero, 
            health: Math.min(100, state.hero.health + 10), 
            stamina: Math.min(100, state.hero.stamina + 10),
            affection: state.hero.affection + 5 
          } 
        }),
      },
      {
        text: "“租下一艘最快的小快艇横冲直撞”",
        resultText: "浪花溅了一脸！勇者兴奋地尖叫着抓紧船舷。这种肾上腺素的飙升让她彻底忘记了刚才训练的枯燥。虽然衣服湿了，但那是快乐的代价。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, health: Math.min(100, state.hero.health + 5) } }),
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
        resultText: "在一阵翻滚和冲刺后，她虽然没抓到兔子，但身手明显比刚才矫健了一些。她满头大汗地跑回来，开心地向你描述刚才的追逐。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 2, stamina: Math.max(0, state.hero.stamina - 8) } }),
      },
      {
        text: "“让她模仿野兔的这种灵动姿态”",
        resultText: "勇者蹲在地上开始奇怪地蹦跳，试图体会那种发力的方式。虽然看起来像个笨拙的小河马，但魔力与肌肉的协调性得到了意想不到的提升。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 5, level: state.hero.level + 1 } }),
      },
    ],
  },
  {
    id: "cf_7_abandoned_cottage",
    region: "country_forest",
    minLevel: 18,
    text: "森林深处有一座废弃的小平房。门半掩着，里面似乎有微弱的光芒。",
    choices: [
      {
        text: "“带她进去探索并寻找宝物”",
        resultText: "里面居然存放着一箱生锈的盔甲。虽然重，但很有研究价值。勇者在搬运过程中，力量得到了实打实的锻炼。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 2), stamina: Math.min(100, state.hero.stamina + 20) } }),
      },
      {
        text: "“觉得太阴森了还是绕路吧”",
        resultText: "勇者松了一口气。在那一刻。她看到了你由于‘胆怯’（实际上是懒）而露出的平凡一面。这种破绽反而拉近了你们的距离。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 12 } }),
      },
    ],
  },
  {
    id: "cf_8_beehive",
    region: "country_forest",
    minLevel: 16,
    text: "树上挂着一个巨大的蜂巢，浓郁的蜂蜜香味飘了过来。勇者咽了口唾沫。",
    choices: [
      {
        text: "“这是一个练习精准投掷的好机会”",
        resultText: "“准头不错！”你夸奖道。虽然最后你们被蜜蜂追了三条街，但蜂蜜的味道真的很甜。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 5), stamina: Math.min(100, state.hero.stamina + 5), affection: state.hero.affection + 10 } }),
      },
      {
        text: "“直接用法术烧掉它，省时省力”",
        resultText: "蜂蜜被烧糊了。勇者看着那一团焦黑的残骸，心疼得快哭了。她觉得你这种暴力解决问题的方式实在是太浪费了。 怀疑度上涨。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 15, mana: state.hero.mana + 5 } }),
      },
    ],
  },
  {
    id: "cf_9_whispering_stream",
    region: "country_forest",
    minLevel: 15,
    repeatable: true,
    text: "溪水潺潺流过。勇者想试着捕捉溪里游动的银色小鱼。",
    choices: [
      {
        text: "“教她如何用魔力感应鱼的运动”",
        resultText: "在你的点拨下，勇者第一次明白了‘预判’的含义。她的魔力操作变得精细了一些。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 10), affection: state.hero.affection + 5 } }),
      },
      {
        text: "“直接跳进水里跟鱼搏斗”",
        resultText: "勇者在水里扑腾得像只落汤鸡。虽然鱼基本都被吓跑了。但这种野性的训练增加她的活力（Stamina）。她湿淋淋地向你邀功的样子。让你忍不住想笑。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 15), affection: state.hero.affection + 7 } }),
      },
    ],
  },
  {
    id: "cf_10_strange_mushroom_circle",
    region: "country_forest",
    minLevel: 22,
    text: "地上出现了一圈奇怪的红蘑菇。传说进入圈内的人会听到精灵的歌声。",
    choices: [
      {
        text: "“拉着她的手一起走进去”",
        resultText: "伴随着空灵的歌声，你们感觉到精神从未有过的宁静。魔力的上限似乎被轻轻触动了。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 20), affection: state.hero.affection + 15 } }),
      },
      {
        text: "“这蘑菇有毒，离远点”",
        resultText: "勇者虽然有些不舍，但还是乖乖跟着你离开了。她对你的‘专业见解’深信不疑。甚至觉得你懂的比大百科全书还多。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 5), affection: state.hero.affection + 5 } }),
      },
    ],
  },
  {
    id: "cf_11_bandit_camp",
    region: "country_forest",
    minLevel: 25,
    text: "在那堆岩石后面，你们发现了一个小型的山贼营地。他们正在分赃。",
    choices: [
      {
        text: "“这是一个检验实力的好机会，冲吧！”",
        resultText: "在一场混乱的激战中，勇者展现出了超越以往的勇气。虽然受了点伤，但她真正感受到了‘战士’的重担。身体素质显著提升了。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 10), level: state.hero.level + 2, stamina: Math.min(100, state.hero.stamina + 15) } }),
      },
      {
        text: "“屏息凝神，从旁边的灌木丛绕过去”",
        resultText: "你紧紧捂住她的嘴，两人像壁虎一样贴在岩石后。这种潜行极其考验心跳。虽然没打架。但你们共同保守了一个‘秘密’。好感上涨了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 12, mana: state.hero.mana + 5 } }),
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
        resultText: "在你的引导下，她第一次感觉到空气中游离的蓝紫色光点。这是魔法力量的基础。她的魔力境界提升了。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 23 } }),
      },
      {
        text: "“让她蒙上眼在雾中寻找出口”",
        resultText: "这是一种极其硬核的训练方式。勇者跌跌撞撞地摸索着，在这种绝对的孤独中。她对你的声音变得极其敏锐。",
        effect: (state) => ({ hero: { ...state.hero, stamina: state.hero.stamina + 15, affection: state.hero.affection + 10 } }),
      },
    ],
  },
  {
    id: "mf_6_ancient_altar",
    region: "misty_forest",
    minLevel: 35,
    text: "雾气中耸立着一座古老的祭坛，周围布满了不知名的符文。它散发着令人不安的气息。",
    choices: [
      {
        text: "“用你的血激活祭坛来获取禁忌知识”",
        resultText: "祭坛发出了血红色的光芒。勇者得到了强大的魔力，但她的本性似乎受到了一丝侵蚀。她看向你的眼神也多了一份警惕。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 40), suspicion: state.hero.suspicion + 25 } }),
      },
      {
        text: "“离这鬼地方远点，这不属于你”",
        resultText: "你厌恶地挥袖将其摧毁。勇者虽然没能变强，但看到你为了‘保护’她而表现出的决绝。她的内心感到了莫名的安宁。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, suspicion: Math.max(0, state.hero.suspicion - 5) } }),
      },
    ],
  },
  {
    id: "mf_7_lost_traveler",
    region: "misty_forest",
    minLevel: 32,
    text: "你们遇到了一个在雾中转了好几天的旅行者。他神志不清，一直在喃喃自语。",
    choices: [
      {
        text: "“用安魂曲帮他稳定情绪”",
        resultText: "在你的魔力安抚下，旅行者清醒了过来。你的慈悲让勇者感到由衷的敬佩。她觉得你总是那么善良（误）。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, mana: Math.min(100, state.hero.mana + 5) } }),
      },
      {
        text: "“冷酷地走过去，别被弱者拖累前进的脚步”",
        resultText: "你头也不回地继续穿行在浓雾中。勇者的脚步迟疑了。在那一刻。她似乎感觉到你那吟游诗人外皮下，藏着一个极度冷漠的灵魂。",
        effect: (state) => ({ hero: { ...state.hero, affection: Math.max(0, state.hero.affection - 20), suspicion: state.hero.suspicion + 12 } }),
      },
    ],
  },
  {
    id: "mf_8_withered_tree",
    region: "misty_forest",
    minLevel: 38,
    text: "森林中心有一棵巨大的枯萎古树，它的树冠几乎遮蔽了天空。树干中似乎囚禁着某种灵魂。",
    choices: [
      {
        text: "“尝试与古树中的残魂沟通”",
        resultText: "无数古老的回忆涌入勇者的脑海。这不仅是重担，更是传承。她的意志品质得到了升华。魔力疯狂涌动。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 30), level: state.hero.level + 3 } }),
      },
      {
        text: "“这树太老了，砍了当柴烧（这可是顶级魔力炭）”",
        resultText: "你随手一挥。整棵树在幽蓝的火焰中崩落。勇者由于你的这种‘环保毁灭’行为。受到了巨大的惊吓。但你的力量。确实让她无话可说。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 40 } }),
      },
    ],
  },
  {
    id: "mf_9_fog_beast_ambush",
    region: "misty_forest",
    minLevel: 35,
    repeatable: true,
    text: "浓雾中突然伸出一只巨大的爪子！某种不可见的猎食者正潜伏在你们身旁。",
    choices: [
      {
        text: "“闭上眼，通过空气的流动来反击”",
        resultText: "在你的引导下，勇者凭直觉挥出了一剑。随着一声惨叫，雾气散去了。这种‘心眼’的训练是极其宝贵的。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 5), stamina: Math.min(100, state.hero.stamina + 20) } }),
      },
      {
        text: "“站在她身前，用你的气息威慑对方”",
        resultText: "你只是冷哼一声，周边的雾气瞬间凝固，远处的野兽发出了恐惧的哀鸣逃走了。勇者看着你宽厚的背影，安全感倍增，但这种恐怖的气息也令她汗毛倒竖。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, suspicion: state.hero.suspicion + 10 } }),
      },
    ],
  },
  {
    id: "mf_10_glowing_ferns",
    region: "misty_forest",
    minLevel: 31,
    repeatable: true,
    text: "阴暗的树根旁长着一些会发光的蕨类植物。它们不仅美丽，似乎还带有某种魔力。",
    choices: [
      {
        text: "“让勇者采集一些编成花环戴上”",
        resultText: "发光的绿色光环在迷雾中照亮了勇者的脸。她开心地转了个圈，觉得这是她见过最美的饰品。心情大好，状态也回复了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 20, stamina: Math.min(100, state.hero.stamina + 10) } }),
      },
      {
        text: "“告诉她这花有微量辐射，摘了会掉头发”",
        resultText: "勇者吓得倒退三步，惊恐地捂住自己的头。在这个过程中。由于对魔力波动的恐惧。她反而更专注地锁闭了自己的气息。魔力防御提升了。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 8, suspicion: state.hero.suspicion + 5 } }),
      },
    ],
  },
  {
    id: "mf_11_echo_well",
    region: "misty_forest",
    minLevel: 40,
    text: "传说迷雾森林里有一口能回溯过去的井。勇者好奇地探头看去，井水倒映出了她从未见过的景象。",
    choices: [
      {
        text: "“这就是命运的指引”",
        resultText: "井水中闪过了勇者儿时的碎片。这种宿命感让她对你产生了一种命中注定的依赖。她觉得你就是她的引路人。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, mana: Math.min(100, state.hero.mana + 10) } }),
      },
      {
        text: "“一拳打碎水面，告诉她未来由自己创造”",
        resultText: "井水四溅，幻影破灭。勇者在震惊之余。也被你的这种‘逆天改命’的豪气所折服。虽然温馨不再。但她的斗志达到了顶峰。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, stamina: 100, affection: state.hero.affection + 5 } }),
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
        resultText: "跳动的火苗映红了她的脸。这种共同生存的经历极大地消释了她对你身份的怀疑。好感度提升了不少。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 10), affection: state.hero.affection + 8, suspicion: Math.max(0, state.hero.suspicion - 5) } }),
      },
      {
        text: "“让她直接通过跑步来维持体温”",
        resultText: "“跑起来，不然就要变成冰棍啦！”在你的督促下。勇者在雪地里挥汗如雨。虽然没能休息。但她的耐力得到了极大磨练。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 20), level: state.hero.level + 1 } }),
      },
    ],
  },
  {
    id: "if_5_frozen_statue",
    region: "ice_field",
    minLevel: 50,
    text: "雪地里矗立着一座栩栩如生的冰雕，刻画的是一位仰望星空的少女。勇者盯着它，陷入了沉迷。",
    choices: [
      {
        text: "“用魔力解析冰雕中的神圣气息”",
        resultText: "冰雕中竟然封存着一段失传的咒文。这对身为勇者的她来说是莫大的补益。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 25), suspicion: state.hero.suspicion + 10 } }),
      },
      {
        text: "“一拳把冰雕轰碎”",
        resultText: "“碍事的东西。”你冷冷地说道。勇者被你的残暴吓到了，紧紧抓住了衣角。",
        effect: (state) => ({ hero: { ...state.hero, affection: Math.max(0, state.hero.affection - 20), suspicion: state.hero.suspicion + 15 } }),
      },
    ],
  },
  {
    id: "e_desert_oasis_mirage",
    region: "desert",
    minLevel: 65,
    repeatable: true,
    text: "在滚烫的沙丘之后，勇者发现了一片美得不真实的绿洲。她疑惑这是否是某种邪恶的幻觉。",
    choices: [
      {
        text: "“这就是普通绿洲，快去洗个澡休息吧。”",
        resultText: "（你暗中稳定了幻象）勇者在清凉的水中彻底放松，好感度大幅上升，但魔力消耗不少。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 20), affection: state.hero.affection + 25, mana: Math.max(0, state.hero.mana - 10) } }),
      },
      {
        text: "“揭穿幻觉，提醒她警惕魔族的埋伏。”",
        resultText: "勇者冷静下来，识破了幻术。虽然有些失落，但她对力量的理解更深了。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 2, suspicion: state.hero.suspicion + 5, mana: Math.min(100, state.hero.mana + 15) } }),
      }
    ]
  },
  {
    id: "e_ice_field_dragon_bones",
    region: "ice_field",
    minLevel: 70,
    repeatable: true,
    text: "巨龙的骨骸被封印在幽蓝的冰壁之中。那是上古大战留下的痕迹，勇者感受到了沉重的威压。",
    choices: [
      {
        text: "“作为‘向导’，讲述那头巨龙死于‘前代勇者’之手的传说。”",
        resultText: "勇者听得入神，露出了坚定的眼神。她觉得自己继承了某种宿命。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 3, stamina: Math.min(100, state.hero.stamina + 20), affection: state.hero.affection + 10 } }),
      },
      {
        text: "“诱导她尝试切开冰壁，借此磨炼剑技。”",
        resultText: "冰屑飞溅。虽然她累得够呛，但在绝对的严寒中掌握了更强的爆发力。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 15), stamina: Math.min(100, state.hero.stamina + 30), level: state.hero.level + 1 } }),
      }
    ]
  },
  {
    id: "e_desert_ancient_temple",
    region: "desert",
    minLevel: 75,
    repeatable: true,
    text: "一座半埋在沙土中的神庙。碑文上记载着魔王军曾经在此受挫的历史。勇者似乎产生了一些动摇。",
    choices: [
      {
        text: "“历史是由胜者书写的，现在的魔王并不可怕。”",
        resultText: "勇者陷入沉思，她开始怀疑教科书上关于魔王“残暴不仁”的真实性。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 30, suspicion: Math.max(0, state.hero.suspicion - 15) } }),
      },
      {
        text: "“鼓励她深入探索，寻找神庙中的圣器。”",
        resultText: "她找到了一件古代铠甲碎片，战斗力显著提升，但也让她重新坚定了讨伐魔王的决心。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 5, stamina: Math.min(100, state.hero.stamina + 10), suspicion: state.hero.suspicion + 20 } }),
      }
    ]
  },
  {
    id: "e_ice_field_aurora_dance",
    region: "ice_field",
    minLevel: 80,
    repeatable: true,
    text: "绝美的极光在夜空中跳动。勇者坐在雪地上，小声嘀咕着要是魔王也被抓来一起看就好了。",
    choices: [
      {
        text: "“如果魔王投降了，我也许能带他来看。”",
        resultText: "勇者笑得很开心，随后又露出忧郁，她意识到现实可能没那么简单。好感度激增。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 45, suspicion: state.hero.suspicion + 5 } }),
      },
      {
        text: "“提醒她那是由于强烈的魔力流动产生的，不要掉以轻心。”",
        resultText: "虽然你不仅煞风景，还毁了气氛。但她确实通过观察极光领悟了更高阶的魔力运行规律。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 35), suspicion: state.hero.suspicion + 10 } }),
      }
    ]
  },
  {
    id: "e_desert_sandworm_nest",
    region: "desert",
    minLevel: 65,
    repeatable: true,
    text: "地面开始剧烈震动。一只巨大的沙虫破土而出！勇者被卷入了流沙。",
    choices: [
      {
        text: "“假装失足跌入流沙，引诱她为了保护你而爆发潜能。”",
        resultText: "勇者在危机中挥出了超越极限的一剑。沙虫被斩断，而她紧紧抱着你，甚至忘了放手。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 25), level: state.hero.level + 2, affection: state.hero.affection + 35 } }),
      },
      {
        text: "“由于某种‘巧合’，沙虫突然僵硬并在混乱中逃走。”",
        resultText: "她虽然满脸沙尘，但毫发无伤。然而，她似乎在思考刚才沙虫为何突然露出了类似恐惧的表情。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 10), suspicion: state.hero.suspicion + 20 } }),
      }
    ]
  },
  {
    id: "if_6_yeti_snowball_fight",
    region: "ice_field",
    minLevel: 48,
    text: "一群小雪怪正在打雪仗。它们见到你们，兴中勃勃地投掷了几枚雪球作为‘欢迎礼’。",
    choices: [
      {
        text: "“带头反击！让它们见识见识勇者的精准度”",
        resultText: "雪地里充满了欢声笑语。虽然被雪球砸得晕乎乎的，但勇者的反射神经得到了锻炼。好感度也提升了。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 5), stamina: Math.min(100, state.hero.stamina + 10), affection: state.hero.affection + 15 } }),
      },
      {
        text: "“用魔力瞬间蒸发掉那些飞来的雪球”",
        resultText: "一阵水蒸气升腾而起。雪怪们由于被吓到而一哄而散。勇者看着你这有些‘粗暴’的处理方式。虽然觉得很酷。但也对你那随手即来的魔法感到了一丝畏惧。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 20, mana: state.hero.mana + 5 } }),
      },
    ],
  },
  {
    id: "if_7_aurora_dance",
    region: "ice_field",
    minLevel: 55,
    text: "今晚的夜空出现了罕见的极光。勇者兴奋地拉着你在雪地上奔跑，试图触摸那流动的光幕。",
    choices: [
      {
        text: "“在这神圣的光芒下共同祈祷”",
        resultText: "极光仿佛响应了你们。一种柔和的魔力洗涤了你们的疲惫。勇者靠在你的肩头，沉沉睡去。这一刻，她觉得你就是世界上最亲近的人。",
        effect: (state) => ({ 
          hero: { 
            ...state.hero, 
            health: 100, 
            mana: Math.min(100, state.hero.mana + 20),
            affection: state.hero.affection + 35 
          } 
        }),
      },
      {
        text: "“告诉她极光只是虚幻的能量残留，不值得迷恋”",
        resultText: "你冷冰冰的嘲讽让勇者瞬间清醒。她默默松开了你的袖口。在那一刻。她原本因美景而产生的一丝柔情。迅速转化为了对自己目标的冷静反思。",
        effect: (state) => ({ hero: { ...state.hero, affection: Math.max(0, state.hero.affection - 25), suspicion: state.hero.suspicion + 15 } }),
      },
    ],
  },
  {
    id: "if_8_cracked_glacier",
    region: "ice_field",
    minLevel: 46,
    text: "脚下的冰川突然发出了危险的嘎吱声。一道裂缝正在迅速扩大。",
    choices: [
      {
        text: "“跳过去！展示你的绝佳平衡感”",
        resultText: "在惊险的跳跃中，勇者展现出了超越以往的勇气。虽然最后由于脚滑而摔了个满头包，但她确实变强了！耐力得到了极大提升。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 6), stamina: Math.min(100, state.hero.stamina + 25) } }),
      },
      {
        text: "“在裂缝扩张前，冷静寻找绕行路径”",
        resultText: "你阻止了她的冒险冲动。通过精准的观察。你们找到了一条安全的冰脊。这种战术眼光的锻炼。对她未来的成长非常有益。魔力恢复了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), affection: state.hero.affection + 5 } }),
      },
    ],
  },
  {
    id: "if_9_polar_flower",
    region: "ice_field",
    minLevel: 45,
    repeatable: true,
    text: "在厚厚的积雪下，竟然开出了一朵洁白如玉的冰山雪莲。",
    choices: [
      {
        text: "“小心地采摘下来，这能炼制高级恢复药”",
        resultText: "勇者在采摘时异常小心，仿佛在呵护一个脆弱的梦。由于成功的操作，她的精神力（Mana）得到了细微提升。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 5), affection: state.hero.affection + 5 } }),
      },
      {
        text: "“踩碎它，温室里的花朵不配在这片冰原生存”",
        resultText: "你那残酷的动作让勇者愣住了。她看着那凋零的瓣片，心中某种天真的部分似乎也随之死去了。虽然这对她成为‘强者’有利，但也让她对你感到畏惧。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 25 } }),
      },
    ],
  },
  {
    id: "if_10_winter_fishing",
    region: "ice_field",
    minLevel: 50,
    repeatable: true,
    text: "你在一处冰面上凿开了一个洞。你可以教勇者如何进行冰钓。",
    choices: [
      {
        text: "“耐心地教她观察水面的波动”",
        resultText: "钓鱼需要极大的耐心。勇者虽然坐不住，但在你的陪伴下，她竟然破天荒地坚持了一个小时。性格变得更加沉稳了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), stamina: Math.min(100, state.hero.stamina + 5), affection: state.hero.affection + 10 } }),
      },
      {
        text: "“教她直接用魔力轰击水底抓鱼”",
        resultText: "“砰！”冰屑四溅。虽然抓到了鱼。但这完全不是钓鱼。勇者觉得这种暴力的捕猎方式非常高效。魔力输出变得更加狂野了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 25), suspicion: state.hero.suspicion + 5 } }),
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
        resultText: "“这就是神迹吗……”勇者大口吞咽着甘霖，恢复了元气。她看你的眼神已经带上了几分神圣感。好感度大幅上涨。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 20), stamina: Math.min(100, state.hero.stamina + 20), affection: state.hero.affection + 25 } }),
      },
      {
        text: "“告诉她一切都是幻觉，只有意志能战胜干渴”",
        resultText: "你冷酷地拒绝了她的请求。勇者在半昏迷中。竟然真的通过内观魔力循环。实现了一种‘由于魔力充盈而产生的假性饱感’。这是极高的境界。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 35, suspicion: state.hero.suspicion + 20 } }),
      },
    ],
  },
  {
    id: "d_4_mirage_palace",
    region: "desert",
    minLevel: 65,
    text: "远方的地平线上隐约出现了一座华丽的宫殿。那是海市蜃楼，还是真实的存在？",
    choices: [
      {
        text: "“带她走入幻象，在虚实之间磨砺意志”",
        resultText: "穿梭在幻象中是极大的精神消耗。勇者看清了世界的本质，虽然头晕目眩，但对魔法的认知更深了。甚至领悟了一些破幻之法。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 25), suspicion: state.hero.suspicion + 8 } }),
      },
      {
        text: "“闭上眼向着反方向全速前进”",
        resultText: "你拉着她的手在沙漠中狂奔。这种对你绝对的信任。让她在盲跑中竟然进入了一种奇特的‘心流’状态。体能获得了意外的飞跃。",
        effect: (state) => ({ hero: { ...state.hero, stamina: 100, affection: state.hero.affection + 15 } }),
      },
    ],
  },
  {
    id: "d_5_desert_scorpion",
    region: "desert",
    minLevel: 62,
    text: "一只磨盘大小的巨型蝎子从沙地里钻了出来，挥舞着泛着紫光的钩尾。",
    choices: [
      {
        text: "“让勇者在流沙中练习回避反击”",
        resultText: "在软绵绵的沙地上战斗极其困难。勇者虽然被蝎尾扫到了几下，但她终于掌握了在恶劣环境中发力的技巧。力量与速度都变强了。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 10), stamina: Math.min(100, state.hero.stamina + 35) } }),
      },
      {
        text: "“指出蝎子甲壳上的弱点并给予加持”",
        resultText: "“盯着那道红纹！”在你的指点下。勇者一记精准的刺击终结了战斗。她对你的智慧感到深深的折服。同时也感到了你那指挥若定的绝对冷静。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, affection: state.hero.affection + 10 } }),
      },
    ],
  },
  {
    id: "d_6_ancient_caravan",
    region: "desert",
    minLevel: 60,
    text: "你们遇到了一支正在穿越荒漠的古老商队。他们似乎在寻找传说中的‘不干涸之泉’。",
    choices: [
      {
        text: "“为他们施加一个保护风暴的法阵”",
        resultText: "商队领头人送给了勇者一个刻有奇怪符号的罗盘。你的善举也让勇者觉得你是一个正义之士。好感度上涨了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 5), affection: state.hero.affection + 25 } }),
      },
      {
        text: "“告诉勇者这是一群试图盗取资源的贪婪之徒”",
        resultText: "勇者用怀疑的目光注视着商队。在这种先入为主的偏见中。她原本温润的心。似乎也在灼热的沙漠风暴中。变得有些干枯和多疑了。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 15, mana: state.hero.mana + 10 } }),
      },
    ],
  },
  {
    id: "d_7_sleeping_in_dune",
    region: "desert",
    minLevel: 60,
    repeatable: true,
    text: "沙漠的夜晚温差极大。勇者在火堆旁冻得缩成一团。",
    choices: [
      {
        text: "“默默地把她拉进自己的披风里”",
        resultText: "那是她经历过最温暖的夜晚。即使知道这可能是一个陷阱，她也不愿意醒来。这种亲昵让你们的关系产生了飞跃。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 35, health: Math.min(100, state.hero.health + 15) } }),
      },
      {
        text: "“严厉地踢醒她。在这种地方睡着就是自寻死路”",
        resultText: "勇者惊慌地跳了起来。虽然这样她确实不会被冻死。但她看向你的眼神中。除了敬畏。更多了一层深深的寒意（怀疑度）。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 25, stamina: Math.min(100, state.hero.stamina + 5) } }),
      },
    ],
  },
  {
    id: "d_8_buried_statue",
    region: "desert",
    minLevel: 68,
    text: "沙丘下露出了半截巨大的石像头部。它的眼眶里似乎还残留着某种远古魔力。",
    choices: [
      {
        text: "“教她如何引导并吸收这些残留的魔力”",
        resultText: "这种直接的魔力灌注极其危险。勇者的身体由于负荷过重而颤抖，但她的魔力容量被暴力地扩充了。等级也获得了提升。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 12), mana: Math.min(100, state.hero.mana + 55), level: state.hero.level + 2 } }),
      },
      {
        text: "“告诉她这是魔王的眼线，赶紧破坏掉”",
        resultText: "勇者毫不犹豫地击碎了石像。虽然错失了变强的机会。但她这种‘言听计从’的姿态。让你感到了某种掌控的快感。好感度上涨了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, suspicion: state.hero.suspicion + 5 } }),
      },
    ],
  },
  {
    id: "d_9_sand_surfing",
    region: "desert",
    minLevel: 60,
    repeatable: true,
    text: "看着连绵起伏的巨大沙丘，你产生了一个有趣的想法。你可以教勇者如何‘滑沙’。",
    choices: [
      {
        text: "“虽然看起来很幼稚，但能锻炼平衡性”",
        resultText: "“唔噢噢噢！”勇者在沙丘间飞驰。虽然由于最后没能停下来而吃了一嘴沙子，但她开心地不得了。由于运动。她的体能上限也增加了。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 5), stamina: Math.min(100, state.hero.stamina + 10), affection: state.hero.affection + 15 } }),
      },
      {
        text: "“坐在一旁看她一次次从沙丘上滚下来”",
        resultText: "你并没有参与。只是冷淡地计算着她的重力加速度。勇者觉得你真是个扫兴的老家伙。但她为了向你证明自己。反而更努力地练习平衡了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 20), affection: Math.max(0, state.hero.affection - 5) } }),
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
        resultText: "双腿深陷入土，对抗着风暴。虽然极其辛苦，但她的力量根基已经坚如磐石。身体素质显著增强了。",
        effect: (state) => ({ hero: { ...state.hero, health: state.hero.health + 10, level: state.hero.level + 1, stamina: Math.max(0, state.hero.stamina - 15) } }),
      },
      {
        text: "“教她如何利用风压来增加挥剑的初速度”",
        resultText: "借力打力。勇者的剑变得快如闪电。她那专注的神情让你也为之动容。在这种高强度的对抗中。她的魔力也变得沸腾了。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 15, stamina: state.hero.stamina + 5 } }),
      },
    ],
  },
  {
    id: "d_dehydration",
    region: "desert",
    minLevel: 60,
    repeatable: true,
    text: "烈日曝晒下，勇者的嘴唇已经由于缺水而干裂。她看起来随时都会晕倒。",
    choices: [
      {
        text: "“在她走在前面时，偷偷变出水来灌入水壶”",
        resultText: "“诶？水壶里还有吗？”勇者惊喜地大口喝水。你的秘密行动保住了她的体力，但也让她产生了一丝怀疑。",
        effect: (state) => ({ 
          hero: { ...state.hero, affection: state.hero.affection + 10, suspicion: state.hero.suspicion + 5 } 
        }),
      },
      {
        text: "“假装也很口渴，并把最后一滴水递给她”",
        resultText: "勇者看着你也干裂的嘴唇，眼泪汪汪地喝下了水。“露比姐姐，你真好……”虽然体力透支了，但她的心被你俘获了。",
        effect: (state) => ({ 
          hero: { ...state.hero, stamina: Math.max(0, state.hero.stamina - 10), affection: state.hero.affection + 25 } 
        }),
      },
    ],
  },
  {
    id: "vol_fire_spirit_mischief",
    region: "volcano",
    minLevel: 90,
    repeatable: true,
    text: "一个灼热的火精灵从岩浆中跃出，发出一阵尖细的笑声。它朝勇者的头顶丢了一块燃烧的余烬！",
    choices: [
      {
        text: "“用手帮她扑灭火焰”",
        resultText: "你毫不畏惧高温，轻而易举扑灭了火焰。勇者虽然被烫了一下，但更关心你有没有受伤。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 2), affection: state.hero.affection + 15 } }),
      },
      {
        text: "“嘲笑她被余烬烫到时的怪叫”",
        resultText: "火精灵见你大笑，也跟着欢腾雀跃。勇者的魔力被这股无名火干扰了，心情也变得糟糕。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.max(0, state.hero.mana - 8), suspicion: state.hero.suspicion + 8 } }),
      },
    ],
  },
  {
    id: "c_5_dragon_soul_relic",
    region: "dragon_bone_canyon",
    minLevel: 80,
    text: "在峡谷深处，你们发现了一根散发着蓝光的大龙骨。它似乎是远古巨龙的意志残留。",
    choices: [
      {
        text: "“引导她去感知那种古老的孤独”",
        resultText: "勇者在龙骨前静坐了很久。当她睁开眼时，她的目光中带上了一丝‘龙威’。这种阶级的跨越让她连升好几级。魔力也大幅提升。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 4, mana: Math.min(100, state.hero.mana + 30) } }),
      },
      {
        text: "“告诉她龙骨是打造神兵的绝佳材料，赶紧动手挖”",
        resultText: "虽然这种贪婪的行为有点煞风景。但勇者在由于用力过猛。反而锻炼出了极致的爆发力。虽然没得到‘意志’传承。但身体变得更强壮了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: 100, health: state.hero.health + 5 } }),
      },
    ],
  },
  {
    id: "c_6_echo_abyss",
    region: "dragon_bone_canyon",
    minLevel: 78,
    text: "峡谷中回荡着低沉的震动。勇者怀疑这下面是不是真的沉睡着什么恐怖的存在。",
    choices: [
      {
        text: "“这是对内心恐惧的挑战”",
        resultText: "你拉着她的手站在悬崖边缘。由于你的支撑，她战胜了对深渊的恐惧。这种意志的磨砺提升了她的全属性。好感度也提升了。",
        effect: (state) => ({ 
          hero: { 
            ...state.hero, 
            health: Math.min(100, state.hero.health + 10),
            stamina: Math.min(100, state.hero.stamina + 10),
            mana: Math.min(100, state.hero.mana + 10),
            affection: state.hero.affection + 25 
          } 
        }),
      },
      {
        text: "“向下投掷一个高阶照明法球，揭露深渊的真面目”",
        resultText: "刺眼的白光划破黑暗。下面除了一些枯败的白骨什么都没有。勇者虽然松了一口气。但也对你那瞬间点亮深渊的魔力产生了彻骨的怀疑。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 25, mana: state.hero.mana + 5 } }),
      },
    ],
  },
  {
    id: "c_7_obsidian_nest",
    region: "dragon_bone_canyon",
    minLevel: 76,
    text: "岩壁上挂着一个黑曜石筑成的鸟巢。里面有一颗闪烁着不详光芒的紫蛋。",
    choices: [
      {
        text: "“为了变强，尝试吸收蛋里的能量”",
        resultText: "狂暴的能量瞬间席卷了勇者的全身。虽然她成功吞噬了这股力量，但她的神情变得冷静得令人害怕。魔力获得了巨幅提升。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 50), suspicion: state.hero.suspicion + 20 } }),
      },
      {
        text: "“这就是某种怪物的幼崽，保护它并寻找它的母亲”",
        resultText: "勇者那泛滥的同情心让她决定守在巢穴旁。虽然最后母龙并没有回来。但这种‘守护弱小’的纯粹。让你这个魔王感到了一种久违的、有些讽刺的触动。好感大增。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 35, suspicion: Math.max(0, state.hero.suspicion - 10) } }),
      },
    ],
  },
  {
    id: "c_8_falling_rocks",
    region: "dragon_bone_canyon",
    minLevel: 75,
    repeatable: true,
    text: "峡谷上方传来了碎石滚落的声音。一场不小的落石流正朝你们袭来！",
    choices: [
      {
        text: "“用瞬移带她离开危险区”",
        resultText: "你在千钧一发之际抱起她出现在百米开外。虽然惊魂未定，但她对你的‘神出鬼没’产生了极大的依赖。好感度加深了，但怀疑度也上涨了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 20, suspicion: state.hero.suspicion + 10 } }),
      },
      {
        text: "“让她直接出剑劈碎那些落石”",
        resultText: "“这就是剑术最实用的演练！”在你的咆哮中。勇者挥出了数道银光。虽然她被碎石砸得有些狼狈。但她的力量控制已经登峰造极。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 2, stamina: state.hero.stamina + 20, health: state.hero.health - 5 } }),
      },
    ],
  },
  {
    id: "vol_4_lava_surfing",
    region: "volcano",
    minLevel: 92,
    text: "勇者看着那一波波涌动的岩浆，突发奇想：‘露比姐姐，我们能不能在那上面划船？’",
    choices: [
      {
        text: "“用冰系魔法凝结出一条冰船（这也太疯狂了）”",
        resultText: "红与青的视觉冲击下，你们在岩浆河上极速前进。虽然冰块在迅速融化，但那种极致的刺激让勇者终生难忘。好感度加了不少。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 45, suspicion: state.hero.suspicion + 25 } }),
      },
      {
        text: "“严厉痛斥这种拿生命开玩笑的想法”",
        resultText: "“你以为你是谁？这种温度瞬间能把你融化！”你的愤怒让勇者低下了头。虽然没能体验刺激。但她感受到了你那掩盖在‘严酷’下的真切担忧。怀疑度降低了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10, suspicion: Math.max(0, state.hero.suspicion - 15) } }),
      },
    ],
  },
  {
    id: "vol_5_phoenix_feather",
    region: "volcano",
    minLevel: 95,
    text: "火山口的边缘悬挂着一根金色的羽毛。那似乎是不死鸟留下的遗存。",
    choices: [
      {
        text: "“孤注一掷跳过去采摘”",
        resultText: "勇者在千钧一发之际抓住了羽毛。这种向死而生的经历让她的生命力（Health）上限得到了质的飞跃。状态完全恢复了。",
        effect: (state) => ({ hero: { ...state.hero, health: 100, level: state.hero.level + 3, stamina: Math.min(100, state.hero.stamina + 20) } }),
      },
      {
        text: "“用你的羽翼载着她飞过去”",
        resultText: "虽然你极力掩饰。但当你背后展开巨大的恶魔之影时。勇者的瞳孔缩成了针尖。羽毛拿到了。但那一刻的背影。将永远留在她的噩梦中。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, suspicion: state.hero.suspicion + 65 } }),
      },
    ],
  },
  {
    id: "vol_6_volcanic_ash_cloud",
    region: "volcano",
    minLevel: 90,
    repeatable: true,
    text: "天空中飘落着厚厚的火山灰，视线变得模糊。空气中充满了硫磺的味道。",
    choices: [
      {
        text: "“用风系统魔法清理周边的空气”",
        resultText: "你在污浊中开辟出了一方净土。勇者躲在你怀里，感受着那难得的清新。由于成功的魔力控制，你的熟练度（Mana）提升了。好感度也提升了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), affection: state.hero.affection + 15 } }),
      },
      {
        text: "“教她如何通过皮肤来感知外界的敌意而非视觉”",
        resultText: "在混沌中。勇者闭上了眼。当你悄无声息地出现在她身后并由于这种‘偷袭’而将她制服时。她终于明白了这种感知的意义。 怀疑度大幅提升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 35, mana: state.hero.mana + 10 } }),
      },
    ],
  },
  {
    id: "vol_7_lava_golem_clash",
    region: "volcano",
    minLevel: 98,
    text: "一尊巨大的岩浆魔像挡住了去路。它象征着自然的狂怒。",
    choices: [
      {
        text: "“这就是最终决战前的最后一课！”",
        resultText: "在汗水与火焰的交织中，勇者挥出了沉重的一剑。魔像崩解了。虽然她累得指尖都在颤抖，但她已经具备了挑战魔王的资格。全属性巨幅提升。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 15), stamina: Math.min(100, state.hero.stamina + 50), level: state.hero.level + 5 } }),
      },
      {
        text: "“寻找魔像的核心并精准突破”",
        resultText: "“这就是弱点！”在你的指引下。勇者用最小的代价换取了胜利。她对你那种似乎看透一切的洞察力感到惊恐。 怀疑度达到了极高水平。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 40, level: state.hero.level + 2, mana: state.hero.mana + 20 } }),
      },
    ],
  },
  {
    id: "vol_8_hot_rock_spa",
    region: "volcano",
    minLevel: 90,
    repeatable: true,
    text: "这里的地表温度正合适。勇者建议躺在温热的岩石上‘烙大饼’。",
    choices: [
      {
        text: "“帮她按摩由于训练而酸痛的肌肉”",
        resultText: "在你的揉捏下，她的疲劳一扫而空。这种亲昵的接触让她的脸比脚下的岩石还要红。好感度巨幅上涨。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 25), affection: state.hero.affection + 35 } }),
      },
      {
        text: "“提醒她这里地壳运动频繁，随时可能喷发”",
        resultText: "勇者吓得从岩石上弹了起来。虽然极其尴尬。但她终于意识到了这片土地的喜怒无常。在这种危机感中。她对魔力的感悟变深了。",
        effect: (state) => ({ hero: { ...state.hero, mana: state.hero.mana + 15, affection: Math.max(0, state.hero.affection - 5) } }),
      },
    ],
  },
  {
    id: "vol_9_obsidian_forge",
    region: "volcano",
    minLevel: 94,
    text: "这里有一座天然的熔炉，正不断喷发出纯净法力。你可以教勇者如何将魔力注入武器进行临时附魔。",
    choices: [
      {
        text: "“利用这股法力提升武器攻击力”",
        resultText: "在你的指导下，勇者的长剑亮起了赤红的光芒。这对接下来的战斗是巨大的助力。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 20), level: state.hero.level + 1 } }),
      },
      {
        text: "“直接吸收这股力量来强化身体”",
        resultText: "“好热……力量在涌出来！”勇者的肌肉在魔力的灌注下得到了质的飞跃。虽然这种方法很痛苦。但她确实变得更强壮了。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 10), level: state.hero.level + 2 } }),
      },
    ],
  },
  {
    id: "if_11_snow_rabbit_follow",
    region: "ice_field",
    minLevel: 45,
    repeatable: true,
    text: "一只害羞的小雪兔一直跟在你们身后。它似乎被勇者身上的某种气息吸引了。",
    choices: [
      {
        text: "“分一点干粮给它吃（它看起来很饿）”",
        resultText: "小兔子蹭了蹭勇者的手心。这种纯真的互动让勇者的内心得到了极大的治愈。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 5), affection: state.hero.affection + 12 } }),
      },
      {
        text: "“抓起来当储蓄粮”",
        resultText: "勇者被你的残忍惊呆了。她急忙保护住小兔子。虽然这让你看起来像个恶魔。但她的保护欲让她变得更加坚强了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 10), suspicion: state.hero.suspicion + 15 } }),
      },
    ],
  },
  {
    id: "d_10_sand_buried_treasure",
    region: "desert",
    minLevel: 63,
    text: "你在沙地里踢到了一个坚硬的角。挖开一看，居然是一个镀金的大木箱。上面刻着古老的封印。",
    choices: [
      {
        text: "“暴力拆开它看看里面有什么”",
        resultText: "箱子里装满了珍贵的古代货币和一些增幅药水。勇者的各项数值都有了不错的提升。",
        effect: (state) => ({ 
          hero: { 
            ...state.hero, 
            health: Math.min(100, state.hero.health + 10),
            stamina: Math.min(100, state.hero.stamina + 10),
            mana: Math.min(100, state.hero.mana + 10)
          } 
        }),
      },
      {
        text: "“用魔力解析封印并优雅地开启”",
        resultText: "通过精妙的解析，你毫发无损地解开了封印。这种教科书般的魔力运用。让勇者对你的‘魔法底蕴’感到了深深的畏惧。由于拿到了秘籍。她的等级增加了。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 2, suspicion: state.hero.suspicion + 20 } }),
      },
    ],
  },
  {
    id: "d_11_shifting_dune_maze",
    region: "desert",
    minLevel: 60,
    repeatable: true,
    text: "这片沙丘由于风向改变而在不断移动，仿佛一个活着的迷宫。你们似乎迷路了。",
    choices: [
      {
        text: "“利用星象来指引正确的道路”",
        resultText: "在你的博学（作弊）指引下，你们走出了困境。勇者对你的崇拜之情溢于言表。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), affection: state.hero.affection + 10 } }),
      },
      {
        text: "“既然迷路了，就在这里露营吧”",
        resultText: "在大漠的星空下，你们并肩而坐。这种孤独感让勇者觉得你是她在这个世界上唯一的依靠。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25 } }),
      },
    ],
  },
  {
    id: "c_10_crystal_cave",
    region: "dragon_bone_canyon",
    minLevel: 77,
    text: "峡谷石壁上裂开了一个口子，里面闪烁着晶莹的紫色光芒。这是一处晶石矿脉。",
    choices: [
      {
        text: "“教她如何挖掘并吸收晶石能量”",
        resultText: "挖掘过程极其耗费体力和魔力。但在成功吸收后，勇者的等级得到了显著提升。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 6), mana: Math.min(100, state.hero.mana + 20), level: state.hero.level + 2 } }),
      },
      {
        text: "“这是不稳定能量。告诉她这是陷阱”",
        resultText: "勇者乖乖离开了。虽然没能变强。但她对你的‘谨慎’感到由衷的高兴。觉得你总是在为了她的安全着想。好感度提升了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
    ],
  },
  {
    id: "c_11_thunder_storm",
    region: "dragon_bone_canyon",
    minLevel: 82,
    text: "干燥的空气引发了剧烈的雷暴。紫色的闪电不断劈向峡谷底部的金属矿藏。",
    choices: [
      {
        text: "“利用雷电的压力训练剑术”",
        resultText: "在雷鸣电闪中起舞需要极大的胆识。勇者虽然被震得双耳轰鸣，但她的体质已经无人能敌。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 20), health: Math.max(0, state.hero.health - 5) } }),
      },
      {
        text: "“用魔力伞挡住雷电并观察法则”",
        resultText: "你就那样漫不经心地撑着伞挡住了天雷。勇者在那一刻觉得自己看到了神灵。虽然这让她感到了自己的渺小。但也由于对法则的观察而提升了等级。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, suspicion: state.hero.suspicion + 20 } }),
      },
    ],
  },
  {
    id: "vol_10_obsidian_beach",
    region: "volcano",
    minLevel: 90,
    repeatable: true,
    text: "冷却的岩浆形成了黑亮的黑曜石海滩。这里的沙子踩上去沙沙作响。",
    choices: [
      {
        text: "“和她一起收集亮晶晶的黑曜石碎片”",
        resultText: "你们像孩子一样在海滩上寻宝。虽然没有任何实际收益，但这份宁静是决战前最后的慰藉。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“让她在滚烫的黑沙滩上赤脚站立”",
        resultText: "“这就是忍耐力的最终考核！”勇者忍受着脚底的灼痛。她的意志品质已经变得比黑曜石还要坚硬。体能得到了强化。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 15), health: Math.max(0, state.hero.health - 5) } }),
      },
    ],
  },
  {
    id: "vol_11_lava_fountain",
    region: "volcano",
    minLevel: 93,
    repeatable: true,
    text: "岩浆像喷泉一样从地裂中涌出。勇者觉得这景色既美丽又恐怖。",
    choices: [
      {
        text: "“用结界保护她近距离观察”",
        resultText: "在你的保护下，她感受到了自然的伟力。这种宏大的体验让她的精神得到了升华。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), affection: state.hero.affection + 8 } }),
      },
      {
        text: "“这就是摧毁世界的终极力量，让她心生畏惧”",
        resultText: "你向岩浆中注入了魔压。瞬间爆发的火柱直冲云霄。勇者看着那仿佛末日般的景象。在那一刻。她终于明白了。如果那个‘魔王’降临。世界会变成什么样。 怀疑达到了极点。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 35 } }),
      },
    ],
  },
  {
    id: "v_24_well_wish",
    region: "starter_village",
    minLevel: 5,
    repeatable: true,
    text: "老井旁边有一块刻着古老符文的石头。村民们说对着它许愿很灵验。",
    choices: [
      {
        text: "“鼓励勇者去许个愿”",
        resultText: "她闭上眼虔诚地祈祷。虽然不知道许了什么，但她的心情明显变好了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10 } }),
      },
      {
        text: "“告诉她许愿石只是磁场异常”",
        resultText: "你的一番科学解释让勇者瞬间没了兴致。她看着石头的眼神变得有些复杂。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 5 } }),
      },
    ],
  },
  {
    id: "v_25_lost_dog",
    region: "starter_village",
    minLevel: 8,
    text: "一只瘸腿的小狗正在村口哀鸣。它看上去饿坏了。",
    choices: [
      {
        text: "“分出一半的干粮给小狗”",
        resultText: "勇者温柔地抚摸着小狗。你的慷慨让她觉得你虽然是督导。但内心非常温柔。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“让它离远点，会有病毒”",
        resultText: "虽然你是为了安全着想。但勇者看着小狗离去的背影，显得有些伤感。",
        effect: (state) => ({ hero: { ...state.hero, affection: Math.max(0, state.hero.affection - 5), suspicion: state.hero.suspicion + 5 } }),
      },
    ],
  },
  {
    id: "cf_23_old_bridge",
    region: "country_forest",
    minLevel: 12,
    text: "一座长满青苔的老石桥横跨在溪流上。桥下的水流湍急。",
    choices: [
      {
        text: "“拉着她的手一起过桥”",
        resultText: "石桥很湿滑。你稳健的步伐给了她极大的安全感。她的心跳似乎稍微加快了一些。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 12 } }),
      },
      {
        text: "“命令她在桥中心练习单脚站立”",
        resultText: "“保持平衡，这是基本的战技！”勇者在湿滑的桥面上摇摇欲坠。虽然很艰苦，但她的敏捷度提升了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 10) } }),
      },
    ],
  },
  {
    id: "cf_24_fox_trap",
    region: "country_forest",
    minLevel: 15,
    text: "一只色彩斑斓的狡猾狐狸落入了猎人的陷阱。它正用哀求的眼神看着你们。",
    choices: [
      {
        text: "“帮它解开陷阱”",
        resultText: "狐狸重获自由后深深看了你们一眼才消失。勇者觉得这是今天最有意义的一件事。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10 } }),
      },
      {
        text: "“看看它的毛皮值不值钱”",
        resultText: "你并没有动真格，但你那种唯利是图的假象让勇者感到了一丝寒意。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 15 } }),
      },
    ],
  },
  {
    id: "cf_25_ancient_tree",
    region: "country_forest",
    minLevel: 18,
    text: "一棵巨大的空心古树矗立在密林深处。据说它能倾听路人的心声。",
    choices: [
      {
        text: "“带她进入树洞静坐”",
        resultText: "古树的祥和气息平复了旅途的疲惫。你们并肩而座，仿佛时间都静止了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10, stamina: Math.min(100, state.hero.stamina + 10) } }),
      },
      {
        text: "“把这棵树砍了做柴火”",
        resultText: "你只是开个玩笑。但勇者看着你那有些‘邪恶’的笑容。不禁缩了缩脖子。怀疑度略有上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 8 } }),
      },
    ],
  },
  {
    id: "mf_25_mist_statue",
    region: "misty_forest",
    minLevel: 25,
    text: "迷雾笼罩处有一座半塌的雕像。雕像的眼睛处镶嵌着两颗暗淡的红宝石。",
    choices: [
      {
        text: "“尝试用魔性法力激活宝石”",
        resultText: "宝石发出了诡异的红光。虽然提升了勇者的感知，但也让她对那股气息感到莫名不安。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), suspicion: state.hero.suspicion + 20 } }),
      },
      {
        text: "“仅仅作为风景观察”",
        resultText: "你们静静凝视着这座诉说着过往岁月的石像。这一刻的静谧在林间回荡。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 5 } }),
      },
    ],
  },
  {
    id: "ic_22_theatre",
    region: "imperial_city",
    minLevel: 30,
    text: "王城的露天剧场正在上演经典的英雄传说。勇者看得很入神。",
    choices: [
      {
        text: "“和她一起探讨剧情”",
        resultText: "你犀利的分析和对英雄末路的感叹让她对你刮目相看。她觉得你有着比外表更成熟的灵魂。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“指出戏剧里的英雄动作极其业余”",
        resultText: "虽然你说的是实话，但这种大煞风景的行为让勇者显得很无奈。怀疑度也由于你的挑剔而上升了。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 10 } }),
      },
    ],
  },
  {
    id: "ic_23_bakery",
    region: "imperial_city",
    minLevel: 32,
    repeatable: true,
    text: "街角的面包店传出了诱人的香味。勇者的肚子不争气地叫了一声。",
    choices: [
      {
        text: "“买一份刚出炉的羊角面包给她”",
        resultText: "她接过热气腾腾的面包，满足地眯起了眼。这种简单的幸福感让她对你的好感度倍增。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 20), affection: state.hero.affection + 12 } }),
      },
      {
        text: "“为了保持身材，严禁摄入碳水”",
        resultText: "你那种近乎刻薄的管理让她咽了咽口水。她低下头，默默忍受着饥饿的折磨。怀疑度也增加了。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 5), suspicion: state.hero.suspicion + 15 } }),
      },
    ],
  },
  {
    id: "ic_24_fountain",
    region: "imperial_city",
    minLevel: 35,
    text: "中央广场的巨大喷泉在阳光下闪耀着虹彩。不少游客在此投币祈福。",
    choices: [
      {
        text: "“往喷泉里投一枚金币”",
        resultText: "金币入水的声音清脆悦耳。你对美好未来的这种小小寄托，让她对你产生了某种共鸣。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10 } }),
      },
      {
        text: "“指出喷泉的水压不稳，存在安全隐患”",
        resultText: "你职业病般的设计分析让勇者感到不知所措。她觉得你似乎总是盯着这个世界的破绽看。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 15 } }),
      },
    ],
  },
  {
    id: "ic_25_statue_gaze",
    region: "imperial_city",
    minLevel: 40,
    text: "历代勇者的群像高耸入云。勇者仰望着那些伟大的前驱，眼神中充满了压力。",
    choices: [
      {
        text: "“告诉她每个人都是独一无二时”",
        resultText: "你的话语像春风一样化解了她心中的自卑。她深吸一口气，再次握紧了剑柄。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 20 } }),
      },
      {
        text: "“那是你的坟墓。如果你不够强”",
        resultText: "冷酷的现实让她浑身战栗。虽然激发了她的刻苦精神。但也让她看你的眼神充满了惊恐。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 30, mana: Math.min(100, state.hero.mana + 10) } }),
      },
    ],
  },
  {
    id: "ice_12_frozen_lake",
    region: "ice_field",
    minLevel: 42,
    text: "冰湖如同一面巨大的镜子。勇者甚至能看到自己在深水下的倒影。",
    choices: [
      {
        text: "“在湖面上练习滑步剑术”",
        resultText: "冰面非常滑。她摔倒了好几次。但每一次站起来，她的平衡感都在成倍增长。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 15), health: Math.max(0, state.hero.health - 5) } }),
      },
      {
        text: "“指出冰层下方潜伏着的巨兽”",
        resultText: "你随意的一指让勇者毛骨悚然。她不知道你是怎么发现那些怪物的。对你的敬畏转化为了怀疑。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 20 } }),
      },
    ],
  },
  {
    id: "ice_13_snow_sculpture",
    region: "ice_field",
    minLevel: 45,
    text: "风雪中屹立着一些天然形成的雪柱，形状奇特。",
    choices: [
      {
        text: "“和她一起把雪柱雕刻成可爱的样子”",
        resultText: "虽然在极寒中玩雪有些疯狂，但你们的笑声在雪原上飘荡。她觉得你是个懂得生活情趣的人。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“让这些雪柱成为目标进行穿透训练”",
        resultText: "“每一击都要击碎核心！”勇者不知疲倦地挥剑。她的攻击力正在稳步提升。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1 } }),
      },
    ],
  },
  {
    id: "ice_14_arctic_fire",
    region: "ice_field",
    minLevel: 48,
    text: "传说在最冷的地方会产生一种‘极寒之火’。它不会产生热量，而是吸收一切。",
    choices: [
      {
        text: "“教她如何控制法力不被寒火吞噬”",
        resultText: "这是一次极高难度的法力控制实验。勇者的额头渗出了冷汗。但她的魔力池变得更加深邃了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 20), suspicion: state.hero.suspicion + 10 } }),
      },
      {
        text: "“让她赤手去触摸那团火”",
        resultText: "那是一种钻心的冷痛。勇者疼得跪在雪地里。虽然这样磨炼了她的忍耐力。但她对你的恨意增加了一丝。怀疑度也暴涨了。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 30, stamina: Math.min(100, state.hero.stamina + 10) } }),
      },
    ],
  },
  {
    id: "ice_15_lost_expedition",
    region: "ice_field",
    minLevel: 50,
    text: "雪地里露出了一截人类冒险者的旗帜。这里掩埋着一支失败的探险队。",
    choices: [
      {
        text: "“默默地为他们堆一个雪冢”",
        resultText: "勇者向那些先行者致以敬意。她觉得你虽然总是很严厉。但对生命依然抱有基本的慈悲。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 12 } }),
      },
      {
        text: "“搜刮他们剩下的补给品”",
        resultText: "你熟练的动作让勇者感到一阵恶寒。“你以前经常做这种事吗？”她对你的过去产生了深深的怀疑。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 15), suspicion: state.hero.suspicion + 25 } }),
      },
    ],
  },
  {
    id: "ice_16_crystal_cave",
    region: "ice_field",
    minLevel: 52,
    text: "一个闪烁着幽蓝光芒的冰晶洞穴。墙壁上的水晶似乎在震流着法力。",
    choices: [
      {
        text: "“在洞穴中心进行深度冥想”",
        resultText: "这些天然水晶是极好的法力增幅器。勇者的意识仿佛连接到了这片大地的根基。魔力发生了质量的飞跃。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 30) } }),
      },
      {
        text: "“用强力法术震碎洞穴，掠夺水晶”",
        resultText: "你肆无忌惮地破坏着这处自然奇观。勇者看着那些碎裂的晶体。感到了你那与世界为敌的本质。 怀疑度急剧升高。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 35 } }),
      },
    ],
  },
  {
    id: "ice_17_aurora_dance",
    region: "ice_field",
    minLevel: 55,
    text: "夜空中出现了绚丽的极光。那是极其罕见的神迹。",
    choices: [
      {
        text: "“拉着她的手，共赏这份壮丽”",
        resultText: "在绚烂的极光下，你们的身影交叠在一起。这一刻，所有的战斗和宿命似乎都变得微不足道了。她的脸颊微微泛红。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25 } }),
      },
      {
        text: "“指出极光是空间壁垒薄弱的证明”",
        resultText: "你煞有介事的物理科普让勇者的幻想彻底破灭。她看着天空，总觉得背后有一只眼睛在盯着这个世界。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 15 } }),
      },
    ],
  },
  {
    id: "des_16_sand_castle",
    region: "desert",
    minLevel: 58,
    text: "在干旱的沙漠中央。竟然出现了一座由沙子堆砌而成的宏伟城堡。",
    choices: [
      {
        text: "“这是蜃景，别被迷惑了”",
        resultText: "你冷静地指出了光学的诡计。勇者虽然有点失望，但也避免了陷入毫无意义的追逐。警觉性（怀疑度）上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 12 } }),
      },
      {
        text: "“带她走进去，享受片刻的阴凉”",
        resultText: "你用魔力维持住了这座本该崩塌的城堡。在烈日下的一角阴影中。你们分享了一壶微凉的水。好感度大幅上涨。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 18, health: Math.min(100, state.hero.health + 10) } }),
      },
    ],
  },
  {
    id: "des_17_sand_worm_hunt",
    region: "desert",
    minLevel: 60,
    text: "沙丘下方传来了隆隆的震动声。一只巨大的沙虫浮出了地表。",
    choices: [
      {
        text: "“正面迎击，这是考验勇气的时刻”",
        resultText: "这是一场力量的角逐。勇者的重剑死死抵住了怪物的巨颚。她在战斗中变得更加坚毅。等级提升。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 2, stamina: Math.max(0, state.hero.stamina - 15) } }),
      },
      {
        text: "“教她利用沙虫的听觉盲点进行暗杀”",
        resultText: "你那种如毒蛇般精准而隐蔽的攻击方式。让勇者在极短的时间内解决了战斗。她对你那熟练的杀人技感到一阵凉意。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, suspicion: state.hero.suspicion + 20 } }),
      },
    ],
  },
  {
    id: "des_18_glass_flower",
    region: "desert",
    minLevel: 62,
    text: "沙漠深处生长着一种晶莹剔透的植物。它们由纯净的硅砂构成。",
    choices: [
      {
        text: "“摘下一朵别在她的耳畔”",
        resultText: "透明的沙花在她的发间闪烁。她看着你那难得一见的温柔眼神。心率不齐了约三秒钟。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“碾碎它获取内部的高纯度结晶”",
        resultText: "这种美丽的植物被你随手摧毁。你只是为了那点微薄的材料。勇者对你这种‘实用主义’感到阵阵心冷。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 12 } }),
      },
    ],
  },
  {
    id: "des_19_ancient_well",
    region: "desert",
    minLevel: 65,
    text: "一口枯竭了千年的古井。井底似乎散发着幽幽的蓝光。",
    choices: [
      {
        text: "“用法术引出深层地热水”",
        resultText: "清澈的泉水从井口喷薄而出。在这绝地中出现的甘甜。不仅仅滋润了身体。也滋润了你们的关系。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 30), affection: state.hero.affection + 10 } }),
      },
      {
        text: "“井底藏着不详的诅咒。别靠近”",
        resultText: "你的一番告诫让勇者退缩了。其实那只是你不想麻烦去挖水而已。这种刻意的欺瞒让她的直觉感到了违和。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 18 } }),
      },
    ],
  },
  {
    id: "des_20_storm_shelter",
    region: "desert",
    minLevel: 68,
    text: "遮天蔽日的沙尘暴突然降临。你们必须在一处岩缝中躲避。",
    choices: [
      {
        text: "“用身体将她护在最里面”",
        resultText: "狂风在外面呼啸，你的温热体温是她在这个残酷世界里唯一的依靠。她紧紧抓着你的衣角。不愿松开。好感度暴涨。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 35 } }),
      },
      {
        text: "“让她自己在风暴中感悟风的流动”",
        resultText: "你独自在结界里喝着红茶。而勇者在外面被吹成了土人。虽然这提升了她的感知。但也让她深深怀疑你是不是真的想要她的命。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), suspicion: state.hero.suspicion + 25 } }),
      },
    ],
  },
  {
    id: "des_21_ruined_god",
    region: "desert",
    minLevel: 70,
    text: "巨大的风神石像被掩埋了一半。它巨大的面孔正对着苍穹发出无声的呐喊。",
    choices: [
      {
        text: "“清理掉神像上的污垢”",
        resultText: "这种对信仰的尊重感让勇者觉得异常亲切。她虔诚地跪拜。感到了内心的一丝宁静。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 12 } }),
      },
      {
        text: "“在神像上乱涂乱画”",
        resultText: "你这种亵渎神灵的行为让勇者目瞪口呆。“露比姐姐。你对神。真的一点敬畏都没有吗？”她开始思考你的真实身份。怀疑度急剧升高。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 30 } }),
      },
    ],
  },
  {
    id: "vol_12_magma_surfing",
    region: "volcano",
    minLevel: 85,
    text: "一种可以在岩浆上移动的‘烈焰船’正停靠在岩石岸边。",
    choices: [
      {
        text: "“带她体验飞一般的快感”",
        resultText: "你们在沸腾的红海上飞驰。火风吹乱了发丝。她从未想过地狱般的景色也能如此浪漫。脸上的笑容多了一些真诚。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 20 } }),
      },
      {
        text: "“让她独自架船穿越岩浆湖”",
        resultText: "稍微一点失误就是灰飞烟灭。在这种极限的压迫下。勇者的神经已经崩到了极限。虽然提升了战力。但也让她看你的眼神充满了惊恐。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, suspicion: state.hero.suspicion + 25 } }),
      },
    ],
  },
  {
    id: "vol_13_phoenix_nest",
    region: "volcano",
    minLevel: 88,
    text: "火山口附近的焦土上。竟然孕育着一颗散发着金光的巨大卵。",
    choices: [
      {
        text: "“帮她一起守护这枚不死鸟之卵”",
        resultText: "守夜的时间很漫长。你们围坐在火堆旁闲聊。当你提到一些‘过去’的故事时。她听得出神。连手都忘了挪动。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“把蛋烤了吃。一定大补”",
        resultText: "你并不是真的想吃。但在这种极度神圣的生机面前表现出的残忍。让勇者彻底认识到了你隐藏在表象下的魔性。怀疑度暴涨。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 40 } }),
      },
    ],
  },
  {
    id: "vol_14_obsidian_blade",
    region: "volcano",
    minLevel: 90,
    text: "岩缝中插着一把通体黑亮的重剑。它似乎在呼唤着它的主人。",
    choices: [
      {
        text: "“协助她拔出这把魔剑”",
        resultText: "当你们的手叠在一起用力时。巨剑发出了震天的轰鸣。它认主了。虽然这把剑带着邪气。但它确实极大强化了勇者的输出能力。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 3, stamina: Math.max(0, state.hero.stamina - 10) } }),
      },
      {
        text: "“告诉她这是一把诅咒之剑，碰了会狂暴”",
        resultText: "其实你是不想让她拿到能对你产生威胁的武器。勇者虽然听话地离开了。但她总觉得那把剑在对她哭泣。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 25 } }),
      },
    ],
  },
  {
    id: "vol_15_demon_altar",
    region: "volcano",
    minLevel: 92,
    text: "隐藏在火山口下的一处古老恶魔祭坛。周围散落着巨大的骨骼。",
    choices: [
      {
        text: "“让她在这里练习净化之术”",
        resultText: "极端的邪恶和极致的圣洁在此碰撞。这种高强度的术法对抗。让勇者的光属性法术得到了质的飞跃。对魔王的威胁度提升了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 35) } }),
      },
      {
        text: "“你就在这里，感到了回家的温暖”",
        resultText: "你的一句低语并没有背着勇者。她惊恐地后退。看着那些正在向你匍匐低首的白骨。眼中的泪水夺眶而出。怀疑度直接封顶。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 60 } }),
      },
    ],
  },
  {
    id: "c_12_echo_wall",
    region: "dragon_bone_canyon",
    minLevel: 85,
    text: "峡谷的绝壁形成了一个天然的回音室。任何细小的声响都会被放大千倍。",
    choices: [
      {
        text: "“对她轻轻说一声：辛苦了”",
        resultText: "那句轻柔的话语在山谷间不断回荡。仿佛千百个你都在对她表达谢意。她的心弦在那一刻彻底崩断了。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25 } }),
      },
      {
        text: "“发出震天怒吼来测试她的耳感”",
        resultText: "“别发呆！这只是声学。不是什么魔法！”你的严厉训斥被放大了无数倍。让她感到了一种极度的精神压迫。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 15 } }),
      },
    ],
  },
  {
    id: "c_13_bone_bridge",
    region: "dragon_bone_canyon",
    minLevel: 88,
    text: "一具跨度达百米的巨大龙骨横亘在深渊之上。形成了一座白森森的桥梁。",
    choices: [
      {
        text: "“背着她走过这令人胆寒的骨桥”",
        resultText: "当你宽阔的背遮挡住那深不见底的裂缝时。她把脸埋在你的肩头。感到了前所未有的安宁。这份亲昵已经超出了督导的范畴。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 30 } }),
      },
      {
        text: "“让她在骨桥上蒙眼练习盲斗”",
        resultText: "只要踩偏一点就是万劫不复。在这极致的恐怖中。她终于领悟了战斗的本能。体质得到了大幅增强。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 20), level: state.hero.level + 1 } }),
      },
    ],
  },
  {
    id: "c_14_forbidden_glyph",
    region: "dragon_bone_canyon",
    minLevel: 92,
    text: "龙族在陨落前留下的最后一枚金辉铭文。它记载着屠龙……或者屠魔的禁咒。",
    choices: [
      {
        text: "“指引她领悟那光明的真谛”",
        resultText: "这是一份极其沉重的恩赐。当那道禁忌的光芒融入她的身体时。她看你的眼神中充满了悲悯。“你为什么要帮我。露比姐姐？”怀疑度急剧升高。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 50), suspicion: state.hero.suspicion + 35 } }),
      },
      {
        text: "“由于你的威慑，那枚铭文瞬间暗淡消失了”",
        resultText: "你并没有做任何多余的动作。仅仅是你的存在就让那些古老的神迹感到了恐惧而退散。勇者握着空空如也的双手。感到了前所未有的绝望。怀疑度直接爆表。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 55 } }),
      },
    ],
  },
  {
    id: "ice_18_mystic_fur",
    region: "ice_field",
    minLevel: 58,
    text: "你在雪地里发现了一只冻僵的极地白狐。它的皮毛散发着微弱的魔力。",
    choices: [
      {
        text: "“用法力为它取暖并放归自然”",
        resultText: "白狐苏醒后，围着勇者跳了一圈，留下了一根闪着银光的胡须。勇者觉得这是冰原的馈赠。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“剥下皮毛做一件围脖”",
        resultText: "你冷酷地执行了‘丛林法则’。勇者虽然戴上了暖和的围脖。但她看你的眼神变得冰冷。怀疑度大幅上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 25 } }),
      },
    ],
  },
  {
    id: "ice_19_frost_giant_footprint",
    region: "ice_field",
    minLevel: 60,
    text: "雪地上出现了一个直径达十米的巨大脚印。那是远古霜巨人的踪迹。",
    choices: [
      {
        text: "“通过脚印分析巨人的弱点”",
        resultText: "你详细地讲解了巨人的骨骼结构。勇者虽然听得头皮发麻。但她对巨型生物的战斗技巧提升了。等级增加。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1 } }),
      },
      {
        text: "“在脚印坑里泡个温泉（你自己加热的）”",
        resultText: "在这极寒中泡热水澡简直是神迹。勇者靠在边缘，舒服地叹了口气。这一刻，她觉得你就是她的守护神。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 20, health: Math.min(100, state.hero.health + 20) } }),
      },
    ],
  },
  {
    id: "ice_20_eternal_winter_altar",
    region: "ice_field",
    minLevel: 62,
    text: "冰原尽头矗立着一座被永恒之雪覆盖的神坛。据说在此祈祷能获得冬之神的祝福。",
    choices: [
      {
        text: "“鼓励勇者献上诚挚的祈祷”",
        resultText: "当她跪下时，风雪竟然奇迹般地停止了。一道圣光降下。不仅强化了她的体质。也让她感到了世界的光明。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 30), affection: state.hero.affection + 10 } }),
      },
      {
        text: "“一脚踢翻神坛上的贡品”",
        resultText: "这种嚣张的行为引来了毁灭性的暴风雪。你们虽然狼狈逃离。但勇者对你那种完全无视神明权能的态度感到了深深的恐惧。怀疑度暴涨。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 35 } }),
      },
    ],
  },
  {
    id: "ice_21_northern_lights_sword",
    region: "ice_field",
    minLevel: 65,
    text: "当极光最盛时，冰层中映射出一柄光之长剑的幻影。",
    choices: [
      {
        text: "“指导她用纯净的意志去触碰”",
        resultText: "只有内心纯洁之人才能握住此剑。勇者成功了。虽然幻影很快消散。但她的剑意已带上了极光般的绚烂与迅捷。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 2 } }),
      },
      {
        text: "“用魔力强行将幻影撕碎”",
        resultText: "你不能容忍这种带有‘净化’色彩的力量接近她。在那破碎的光屑中。勇者看到了你那如同黑洞般的深渊本质。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 20 } }),
      },
    ],
  },
  {
    id: "des_22_oasis_mirage",
    region: "desert",
    minLevel: 72,
    text: "在极度的干渴中。远方出现了一片绿意盎然的绿洲。但虚幻得不真切。",
    choices: [
      {
        text: "“利用魔力将蜃景转化为真实的绿洲”",
        resultText: "你随手改写了现实。当清凉的泉水泼在脸上时。勇者喜极而泣。她觉得只要有你在。就没有到不了的终点。好感度暴涨。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25, health: Math.min(100, state.hero.health + 20) } }),
      },
      {
        text: "“坐在沙丘上冷眼看她对着空气狂奔”",
        resultText: "这种近乎残酷的观望让她耗尽了最后一丝体力。当她灰头土脸地回来时。眼神中已经没有任何光彩了。怀疑度急剧升高。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 30, health: Math.max(0, state.hero.health - 20) } }),
      },
    ],
  },
  {
    id: "des_23_scorpion_king",
    region: "desert",
    minLevel: 75,
    text: "一只金色的巨型蝎子拦住了去路。它是这片荒漠的霸主。",
    choices: [
      {
        text: "“与她合力使出联合技”",
        resultText: "你们的动作出奇地合拍。当巨蝎倒下时。你们相视一笑。尽管满身风尘。但这种羁绊感已经无可替代。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 20, level: state.hero.level + 1 } }),
      },
      {
        text: "“让她在蝎钩下练习生死一线的闪避”",
        resultText: "每一次闪过毒刺都伴随着死亡的呼啸。勇者的汗水浸湿了衣裳。她的生存本能被激发到了极致。怀疑度也随之上升。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 2, suspicion: state.hero.suspicion + 15 } }),
      },
    ],
  },
  {
    id: "des_24_sphinx_riddle",
    region: "desert",
    minLevel: 78,
    text: "一只斯芬克斯挡在必经之路上。要求你们回答一个关于命运的谜题。",
    choices: [
      {
        text: "“替她回答出那个深奥的答案”",
        resultText: "斯芬克斯惊讶地让开了路。勇者崇拜地看着你。“露比姐姐。你好像什么都知道。”好感度大幅上涨。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 18 } }),
      },
      {
        text: "“直接把狮身人面兽打残”",
        resultText: "“谜题什么的太麻烦了。”你瞬间爆发出的恐怖魔压让神兽落荒而逃。勇者看着满地的裂缝。感到了你那无视规则的狂妄。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 25 } }),
      },
    ],
  },
  {
    id: "des_25_golden_city_gate",
    region: "desert",
    minLevel: 80,
    text: "风沙中若隐若现地露出了一座黄金之城的拱门。那是失落文明的遗迹。",
    choices: [
      {
        text: "“带她进入宫殿寻找珍贵的遗物”",
        resultText: "在废墟中，你们找到了一枚受保护的护身符。这不仅提升了她的防御力。也让她感到了这一行的收获。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, affection: state.hero.affection + 10 } }),
      },
      {
        text: "“告诉她这是通往地狱的入口”",
        resultText: "你撒了个谎，因为那座城市里有你不喜欢的圣遗物。勇者有些遗憾地离开了。但她的直觉告诉她你在隐瞒什么。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 22 } }),
      },
    ],
  },
  {
    id: "vol_16_lava_fish_grill",
    region: "volcano",
    minLevel: 93,
    text: "你在岩浆岸边发现了一种极度耐热的特殊鱼类。",
    choices: [
      {
        text: "“娴熟地烧烤这种鱼并分享”",
        resultText: "虽然环境恶劣，但这是勇者吃过最好吃的鱼。当你细心地挑出鱼刺递给她时。她看你的眼神中溢满了温柔。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 18, health: Math.min(100, state.hero.health + 15) } }),
      },
      {
        text: "“告诉她这种鱼是由死者的怨念化成的”",
        resultText: "仅仅是一句玩笑，却让勇者吓得差点把吃下去的全部吐出来。她觉得你这种阴暗的幽默感实在是太吓人了。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 15 } }),
      },
    ],
  },
  {
    id: "vol_17_ash_storm",
    region: "volcano",
    minLevel: 94,
    text: "漫天黑色的火山灰降临。视线变得极其模糊。",
    choices: [
      {
        text: "“用斗篷遮住两人的头，紧紧依偎”",
        resultText: "在漆黑死寂的灰烬风暴中。只有彼此的心跳声如此清晰。这极端的环境反而促进了某种情感的质变。好感度狂飙。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 40 } }),
      },
      {
        text: "“让她在灰烬中通过念力来辨别方向”",
        resultText: "你在灰中漫步，而她在一遍遍碰壁。这种严酷的特训虽然大幅提升了她的控制力。但也让她觉得你冷血得不像人类。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 25), suspicion: state.hero.suspicion + 20 } }),
      },
    ],
  },
  {
    id: "vol_18_magma_gem",
    region: "volcano",
    minLevel: 95,
    text: "岩缝深处有一块不断搏动的红色宝石。仿佛火山的心脏。",
    choices: [
      {
        text: "“指导她用血液与宝石建立契约”",
        resultText: "契约成功的刹那。整座火山都发出了轰鸣。勇者的攻击力现在已经能够轻易切开巨龙的鳞甲。体质得到极大强化。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 3, health: Math.max(0, state.hero.health - 10) } }),
      },
      {
        text: "“将宝石直接吞噬掉”",
        resultText: "你在勇者惊恐的注视下。一口吞下了蕴含恐怖能量的宝石。你那瞬间膨胀的魔压让天空都变了颜色。怀疑度直接爆表。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 55 } }),
      },
    ],
  },
  {
    id: "vol_19_ashen_flower",
    region: "volcano",
    minLevel: 96,
    text: "灰烬中开出了一朵苍白的小花，在如此酷热中竟未枯萎。",
    choices: [
      {
        text: "“小心地加护屏障保护它”",
        resultText: "你的这一举动展现了对弱小生命的极大怜悯。勇者觉得你内心深处一定也有着温柔的一面。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 12 } }),
      },
      {
        text: "“踩碎它并告诉她美丽是软弱的表现”",
        resultText: "你那冷酷的教条让勇者感到一阵绝望。她在这个死寂的世界里看不到任何希望。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 20 } }),
      },
    ],
  },
  {
    id: "vol_20_gate_to_abyss",
    region: "volcano",
    minLevel: 97,
    text: "火山口底部出现了一道散发着黑气的裂缝。对面似乎是另一个世界。",
    choices: [
      {
        text: "“联手封印这道裂缝”",
        resultText: "当你们共同施法时。金白与漆黑的能量在这里汇聚。最终将那不详的气息堵了回去。这种并肩作战的满足感。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25 } }),
      },
      {
        text: "“向裂缝对面的人打招呼”",
        resultText: "你那熟练的深渊语让勇者如坠冰窖。她听不懂你在说什么。但那一定不是属于‘人类’的语言。怀疑度直接封顶。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 60 } }),
      },
    ],
  },
  {
    id: "c_15_thunder_ritual",
    region: "dragon_bone_canyon",
    minLevel: 94,
    text: "在一处雷电频发的祭坛。当地的遗民要求你们展示力量来换取通路。",
    choices: [
      {
        text: "“展示精准的战斗技巧获取认可”",
        resultText: "勇者如迅雷般扫平了试炼者。在这种热血的战斗后。不仅通路打开了。她的实力也确凿无疑地提升了。等级增加。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, stamina: Math.max(0, state.hero.stamina - 15) } }),
      },
      {
        text: "“用绝对的魔力压制让他们下跪”",
        resultText: "那一刻，你如神魔降世。所有生命都在你面前颤抖。勇者在人群中。感到了自己那种仿佛身处狼群的孤独与恐惧。怀疑度暴涨。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 40 } }),
      },
    ],
  },
  {
    id: "c_16_dragon_whisper",
    region: "dragon_bone_canyon",
    minLevel: 95,
    text: "幽深的洞穴深处。竟然传出了某种古老存在在梦呓。那是龙的低语。",
    choices: [
      {
        text: "“让她倾听那声音中蕴含的自然真理”",
        resultText: "虽然听不懂具体含义。但那种跨越时空的宏大感，让勇者的精神得到了前所未有的淬炼。魔力池深度暴增。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 40) } }),
      },
      {
        text: "“翻译那些低语，大多是在诅咒神灵”",
        resultText: "你那种对神灵毫无掩饰的蔑视。以及这居然真的能被你‘听懂’的事实。让勇者觉得你就是这邪恶力量的一部分。怀疑度上升。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 30 } }),
      },
    ],
  },
  {
    id: "c_17_lightning_lake",
    region: "dragon_bone_canyon",
    minLevel: 96,
    text: "一处积满了雨水并不断受到雷击的大湖。湖水因带电而呈现出耀眼的金色。",
    choices: [
      {
        text: "“在湖边进行抗电性训练”",
        resultText: "每一次电流穿过身体都是极致的折磨。勇者咬紧牙关坚持了下去。她的体魄现在已经变得非比寻常。生命值及耐力得到强化。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 20), stamina: Math.min(100, state.hero.stamina + 20) } }),
      },
      {
        text: "“在湖中心跳一支舞（用法力屏蔽掉雷电）”",
        resultText: "你在漫天惊雷中翩翩起舞。那一刻你仿佛在嘲笑上苍。勇者在岸边痴痴地看着你。这种甚至有些疯狂的烂漫。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25 } }),
      },
    ],
  },
  {
    id: "c_18_shadow_stalker",
    region: "dragon_bone_canyon",
    minLevel: 97,
    text: "有一团没有实体的阴影一直在远方注视着你们。它是这个峡谷最古老的幽魂。",
    choices: [
      {
        text: "“利用这种被监视的压力磨练意志”",
        resultText: "背后的寒意始终未消。但也正因如此。勇者任何时刻都没有放松警惕。她的警觉性达到了巅峰。等级提升。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1 } }),
      },
      {
        text: "“转过头去，对那个阴影挥挥手”",
        resultText: "那个阴影竟然弯腰向你致意。勇者差点吓得把剑掉在地上。她现在百分之百确定。你跟这些怪物是‘一伙的’。怀疑度直接封顶。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 65 } }),
      },
    ],
  },
  {
    id: "c_19_final_vow",
    region: "dragon_bone_canyon",
    minLevel: 98,
    text: "即将离开峡谷时。勇者突然停下脚步。在月色下看着你。",
    choices: [
      {
        text: "“告诉她：无论发生什么，我都不会害你”",
        resultText: "你的承诺重若千钧。在这决战前的夜晚。她选择相信一个已经充满疑点的所谓‘督导’。这一刻，好感度达到了极限。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 50 } }),
      },
      {
        text: "“告诉她：明天你就将知道一切真相”",
        resultText: "这种充满了宿命感的预告。让她彻夜未眠。她握着剑的手在颤抖。怀疑度也达到了无法回头的地步。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 45 } }),
      },
    ],
  },
  {
    id: "cf_new_1",
    region: "country_forest",
    minLevel: 10,
    text: "森林里出现了一个巨大的捕兽夹，看起来像是专门针对大型魔物的。",
    choices: [
      {
        text: "“这很危险，教她如何解除陷阱”",
        resultText: "在你的指导下，勇者成功拆除了捕兽夹。她感到了从未有过的成就感，敏捷度提升了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 5), level: state.hero.level + 1 } }),
      },
      {
        text: "“假装没看见，看看她会不会踩上去”",
        resultText: "“哎哟！”勇者虽然没被夹到，但被吓得跳了起来。她埋怨地看着你，怀疑度上涨了。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 10 } }),
      },
    ],
  },
  {
    id: "cf_new_2",
    region: "country_forest",
    minLevel: 15,
    text: "一棵倒塌的古树挡住了去路，树干上长满了奇特的寄生植物。",
    choices: [
      {
        text: "“用它来练习劈砍力量”",
        resultText: "勇者在你的监督下将古树劈开。虽然大汗淋漓，但力量确实增长了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 10), health: Math.max(0, state.hero.health - 5) } }),
      },
      {
        text: "“教她辨识这些寄生植物的毒性”",
        resultText: "原来这漂亮的叶子下藏着剧毒。勇者学到了宝贵的生存知识，对你的依赖增加了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 5), affection: state.hero.affection + 5 } }),
      },
    ],
  },
  {
    id: "cf_new_3",
    region: "country_forest",
    minLevel: 20,
    text: "林间空地上有一群小鹿在嬉戏。勇者想去摸摸它们。",
    choices: [
      {
        text: "“释放柔和的魔力让它们不要受惊”",
        resultText: "在你的帮助下，勇者顺利接触到了小鹿。她被自然的纯净所治愈，心情大好。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10, health: 100 } }),
      },
      {
        text: "“突然在大树后发出惨叫声骚扰”",
        resultText: "小鹿被吓跑了，勇者也吓得摔了一跤。她气鼓鼓地瞪着你，觉得你是在磨炼她的神经。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 5, level: state.hero.level + 1 } }),
      },
    ],
  },
  {
    id: "cf_new_4",
    region: "country_forest",
    minLevel: 5,
    text: "路边的一处老旧石碑，上面的文字似乎在描述某种邪恶的仪式。",
    choices: [
      {
        text: "“解析上面的魔力波动”",
        resultText: "这种阴冷的魔力虽然让你很熟悉，但勇者由于你的这种‘分析’感到了极大的不快。魔力提升了，但怀疑度也涨了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), suspicion: state.hero.suspicion + 15 } }),
      },
      {
        text: "“让勇者一剑斩碎这晦气的东西”",
        resultText: "石碑碎裂，那种压抑的气息消失了。勇者的正义感得到了满足，力量小幅上升。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 8) } }),
      },
    ],
  },
  {
    id: "cf_new_5",
    region: "country_forest",
    minLevel: 25,
    text: "草丛中传来了窸窸窣窣的声音，似乎有什么东西在窥视。",
    choices: [
      {
        text: "“投掷诱饵看看是什么”",
        resultText: "原来只是一只迷路的野猪。勇者顺手练了练突刺。力量增加了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 10) } }),
      },
      {
        text: "“对那个方向释放大范围灼烧”",
        resultText: "火焰瞬间席卷了草丛。那种完全不顾及生态的暴力让勇者打了个冷战。怀疑度由于这种破坏而上升了。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 20 } }),
      },
    ],
  },
  {
    id: "mf_new_1",
    region: "misty_forest",
    minLevel: 30,
    text: "浓雾中出现了一个浮在空中的发光球体，它在有节奏地闪烁。",
    choices: [
      {
        text: "“这是迷失之灯，跟着它走”",
        resultText: "球体引路让你们穿过了危险的沼泽。勇者感到了魔法的神奇，魔力上限提升了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 10), affection: state.hero.affection + 5 } }),
      },
      {
        text: "“那是诱捕灵魂的诱饵，离远点”",
        resultText: "你的一声低喝让勇者如梦初醒。果然，不远处隐约露出了巨大的食人花。勇者感激地握住了你的手。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10, level: state.hero.level + 2 } }),
      },
    ],
  },
  {
    id: "mf_new_2",
    region: "misty_forest",
    minLevel: 35,
    text: "四周的树木仿佛都在窃窃私语，空气粘稠得让人窒息。",
    choices: [
      {
        text: "“教她如何用静心咒屏蔽这些干扰”",
        resultText: "勇者的精神力在对抗中得到了飞跃。那种在混乱中寻找宁静的感觉非常奇妙。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 20) } }),
      },
      {
        text: "“嘲笑她居然被这些微弱的声音吓到”",
        resultText: "由于你的冷嘲热讽，勇者咬着牙强撑。虽然意志力提升了，但她看向你的眼神也多了一丝幽怨。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 3, affection: Math.max(0, state.hero.affection - 5) } }),
      },
    ],
  },
  {
    id: "mf_new_3",
    region: "misty_forest",
    minLevel: 40,
    text: "突然，迷雾中冲出了一个和勇者一模一样的‘影子’。",
    choices: [
      {
        text: "“那是心魔，击败她就能突破等级”",
        resultText: "在艰苦的战斗后，勇者斩断了影子。她的全属性获得了爆发性的提升。",
        effect: (state) => ({ hero: { ...state.hero, stamina: 100, mana: 100, level: state.hero.level + 10 } }),
      },
      {
        text: "“在影子消失前，偷偷和它握了握手”",
        resultText: "勇者惊讶地看到你和她的影子一副熟络的样子。她的三观被震碎了，怀疑度涨到了惊人的高度。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 40 } }),
      },
    ],
  },
  {
    id: "mf_new_4",
    region: "misty_forest",
    minLevel: 45,
    text: "这里的地表覆盖着一层不详的紫色地衣，踩上去会发出尖叫。",
    choices: [
      {
        text: "“教她如何在不惊动它们的情况下滑行”",
        resultText: "由于这种极其考验敏捷和魔力控制的训练，勇者的身法大涨。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 10), level: state.hero.level + 5 } }),
      },
      {
        text: "“大步流星地踩过去，享受那种尖叫”",
        resultText: "你表现出的这种变态般的恶趣味让勇者彻底无语。由于这种恐怖的气氛，她的怀疑度疯狂上涨。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 25 } }),
      },
    ],
  },
  {
    id: "mf_new_5",
    region: "misty_forest",
    minLevel: 50,
    text: "古老的月光祭坛就在眼前，这里祭祀着早已陨落的神灵。",
    choices: [
      {
        text: "“尝试献祭一点魔王的魔力来亵渎它”",
        resultText: "祭坛变色，天空变暗。在这种逆天的魔力转换下，勇者获得了邪恶但强大的增幅。等级直接飞跃。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 15, suspicion: state.hero.suspicion + 50 } }),
      },
      {
        text: "“净化这处祭坛的残秽”",
        resultText: "这是一场极其消耗魔力的礼赞。光芒驱散了迷雾，勇者的灵魂得到了洗涤。好感度提升，健康值也恢复了。",
        effect: (state) => ({ hero: { ...state.hero, health: 100, affection: state.hero.affection + 20 } }),
      },
    ],
  },
  {
    id: "vol_new_1",
    region: "volcano",
    minLevel: 80,
    text: "前方是一个巨大的活火山口，岩浆正在不安地翻涌。",
    choices: [
      {
        text: "“教她如何吸收这地热中的火元素”",
        resultText: "这是一种极其危险的修行。勇者的额头上满是汗珠，但她的魔力属性中带上了恐怖的爆发力。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 30), level: state.hero.level + 5 } }),
      },
      {
        text: "“告诉她其实岩浆深处藏着魔王的内裤”",
        resultText: "“哈？那是认真的吗？”勇者被你的这种离谱笑话弄得不知道该哭还是该笑。虽然气氛变轻松了，但这种无厘头的欺骗让她觉得你越来越奇怪了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10, suspicion: state.hero.suspicion + 5 } }),
      },
    ],
  },
  {
    id: "dbc_new_1",
    region: "dragon_bone_canyon",
    minLevel: 85,
    text: "在深渊的边缘，你发现了一截巨大的、还在跳动的龙心。它被封印在水晶中。",
    choices: [
      {
        text: "“这就是传说中的‘龙之不朽’，让她吞噬它”",
        resultText: "这种血腥而强大的仪式让勇者的心跳变得如同雷鸣。她的生命力提升到了一个非人的境界。",
        effect: (state) => ({ hero: { ...state.hero, health: 100, stamina: 100, level: state.hero.level + 10 } }),
      },
      {
        text: "“那是陷阱，快把它踢下深渊”",
        resultText: "你的一脚让龙心坠入无尽的黑暗。勇者虽然觉得可惜，但她对你那种完全不在乎宝物的‘清高’感到非常敬佩。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, suspicion: state.hero.suspicion + 10 } }),
      },
    ],
  },
  {
    id: "dbc_new_2",
    region: "dragon_bone_canyon",
    minLevel: 95,
    text: "最后一段骨桥上站着一个浑身漆黑的影子，它似乎是你很久以前的分身。",
    choices: [
      {
        text: "“这就是你的终极宿命，跨过去！”",
        resultText: "勇者在你的咆哮中冲向黑影。当剑锋刺穿黑影的一瞬，她领悟了真正的‘斩魔杀’。全属性巨幅提升。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 20, suspicion: state.hero.suspicion + 30 } }),
      },
      {
        text: "“装作没看见，直接瞬移带她过去”",
        resultText: "你这种心虚的行为让勇者产生了大大的疑惑。虽然避免了战斗，但她看向你的眼神已经充满了审视。怀疑度爆表。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 60 } }),
      },
    ],
  },
  {
    id: "dbc_extra_1",
    region: "dragon_bone_canyon",
    minLevel: 85,
    text: "峡谷的风在骨洞中吹出凄厉的哨音，勇者发现了一枚散发着古龙威压的龙鳞。",
    choices: [
      {
        text: "“将其融入你的护甲，感受那不屈的意志。”",
        resultText: "护甲泛起了淡金色的光芒。勇者的防御力和体力大增。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 15), stamina: Math.min(100, state.hero.stamina + 25), level: state.hero.level + 2 } }),
      },
      {
        text: "“那是邪恶的诅咒，用圣力将其彻底净化。”",
        resultText: "净化过程中爆发的冲击让勇者的魔力得到了洗礼。她对秩序的信仰更加坚定了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 30), affection: state.hero.affection + 5 } }),
      }
    ]
  },
  {
    id: "dbc_extra_2",
    region: "dragon_bone_canyon",
    minLevel: 90,
    text: "一处被诅咒的龙冢，地面上布满了会啃食生命力的暗红地衣。",
    choices: [
      {
        text: "“教她使用‘烈焰焚心’步法穿过去。”",
        resultText: "这是一种极其消耗体力的危险身法。勇者虽然累得满脸通红，但她的速度达到了新高度。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 12), stamina: Math.min(100, state.hero.stamina + 20), level: state.hero.level + 4 } }),
      },
      {
        text: "“告诉她只需要闭上眼，那是虚假的幻象。”",
        resultText: "地衣确实没能伤到她，但那种被‘邪能’擦身而过的阴冷让她对你的博学产生了深深的敬畏与怀疑。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10, suspicion: state.hero.suspicion + 15 } }),
      }
    ]
  },
  {
    id: "dbc_extra_3",
    region: "dragon_bone_canyon",
    minLevel: 95,
    text: "在峡谷最深处，回荡着一个苍老的声音，它在询问谁是这个时代的强者。",
    choices: [
      {
        text: "“指引她去接受古老龙魂的考验。”",
        resultText: "通过了灵魂的震慑，勇者的精神力达到了巅峰。她的双眼如今能看透一切虚妄。",
        effect: (state) => ({ hero: { ...state.hero, mana: 100, level: state.hero.level + 8 } }),
      },
      {
        text: "“释放出你真正的威压直接把它吼回去。”",
        resultText: "声音瞬间消失。勇者虽然因为你的‘威武’感到安心，但那种仿佛要把灵魂都冻结的魔气让她半晌没敢说话。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 20, suspicion: state.hero.suspicion + 25 } }),
      }
    ]
  },
  {
    id: "vol_extra_1",
    region: "volcano",
    minLevel: 75,
    text: "熔岩湖中升起了一门由黑耀石打造的试炼之门。",
    choices: [
      {
        text: "“赤膊冲进去，那是魔王锻炼禁卫军的地方。”",
        resultText: "勇者在高温下挺过了半小时。这种非人的折磨换来了钢铁般的躯体。",
        effect: (state) => ({ hero: { ...state.hero, health: 100, stamina: 100, level: state.hero.level + 6 } }),
      },
      {
        text: "“利用这种热量，教她如何锻造自己的圣剑。”",
        resultText: "剑锋变得通红。这虽然不是什么‘正路’魔法，但圣剑的威力确实暴涨了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), level: state.hero.level + 5 } }),
      }
    ]
  },
  {
    id: "vol_extra_2",
    region: "volcano",
    minLevel: 80,
    text: "空气中充满了硫磺的气息，一头早已饿疯了的烈焰魔犬挡在了你们面前。",
    choices: [
      {
        text: "“把它作为诱饵，练习诱导杀。”",
        resultText: "勇者冷静地利用地形杀死了魔犬。她的实战经验得到了极大的补充。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 10), level: state.hero.level + 3 } }),
      },
      {
        text: "“告诉它你是谁，让它滚回去。”",
        resultText: "魔犬吓得当场暴毙。勇者惊讶地看着你，她觉得你刚才那轻描淡写的一瞥简直比魔王还可怕。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 5, suspicion: state.hero.suspicion + 30 } }),
      }
    ]
  },
  {
    id: "vol_extra_3",
    region: "volcano",
    minLevel: 85,
    text: "你注意到火山口有一株传说中的‘火凤花’，据说能让人死而复生。",
    choices: [
      {
        text: "“那是个陷阱，火凤花只是用来诱捕贪婪者的。”",
        resultText: "勇者听从了你的建议。原来那是一只巨型火蜂的拟态。她由于你的博学感到了深切的好感。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, level: state.hero.level + 1 } }),
      },
      {
        text: "“那是给你的奖励，去摘下它吧。”",
        resultText: "勇者虽然被烫伤了，但确实得到了神露。这种舍身取物的做法让她更坚强了。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 20), level: state.hero.level + 10 } }),
      }
    ]
  },
  {
    id: "vol_extra_4",
    region: "volcano",
    minLevel: 90,
    text: "大地突然开裂，岩浆正在倒灌进入你们所在的坑洞。",
    choices: [
      {
        text: "“教她如何控制身边的冷空气制造立足点。”",
        resultText: "这是一场高强度的魔法控制练习。她在生死边缘掌握了极寒魔法与火焰的平衡。",
        effect: (state) => ({ hero: { ...state.hero, mana: 100, level: state.hero.level + 5 } }),
      },
      {
        text: "“在最后一秒直接抱着她飞到了更高处。”",
        resultText: "那种瞬间失重的感觉让她的心跳完全停不下来。虽然脱险了，但她看着你的眼神正变得越来越复杂。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25, suspicion: state.hero.suspicion + 10 } }),
      }
    ]
  },
  {
    id: "vol_extra_5",
    region: "volcano",
    minLevel: 95,
    text: "在火山的最核心，供奉着一把早已断裂的、曾属于‘勇者祖辈’的断剑。",
    choices: [
      {
        text: "“献祭你的一部分灵力，强行让断剑重燃。”",
        resultText: "剑身燃起了紫黑色的魔火。勇者握剑时感觉到了一股狂暴而绝望的力量。等级直接飞跃。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 20, health: 100, suspicion: state.hero.suspicion + 40 } }),
      },
      {
        text: "“让她在断画前默默祈祷，寻求祖辈的保佑。”",
        resultText: "这原本只是个安慰。但在这种虔诚中，勇者的内心得到了真正的宁静。好感度提升到了极点。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 50, health: 100 } }),
      }
    ]
  },
  {
    id: "e_extra_starter_1",
    region: "starter_village",
    minLevel: 1,
    repeatable: true,
    text: "老铁匠在敲打废铁，勇者好奇地在一旁观看。她似乎想要学一点修补防具的技巧。",
    choices: [
      {
        text: "“鼓励她亲自动手，哪怕被烫到手也没关系。”",
        resultText: "她在叮当声中磨炼了力量和耐心。虽然手有点红肿，但力量提升了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 10), level: state.hero.level + 1 } }),
      },
      {
        text: "“帮她拿走沉重的锤子，让她去帮邻居家带孩子。”",
        resultText: "和孩子们在一起，她的压力完全消失了，好感度有了长足进步。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 12, health: 100 } }),
      }
    ]
  },
  {
    id: "e_extra_starter_2",
    region: "starter_village",
    minLevel: 1,
    repeatable: true,
    text: "村头的草药园里长出了一些奇怪的蓝色野花。勇者想摘一朵送给你。",
    choices: [
      {
        text: "“欣然接受，并告诉她这是能增加魔力的稀有品种。”",
        resultText: "她高兴得快要跳起来。在那之后的练习中，她的魔力确实产生了一丝波动。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, mana: state.hero.mana + 1 } }),
      },
      {
        text: "“严肃地告诉她，勇者不应该把时间花在这些没用的东西上。”",
        resultText: "她虽然很沮丧，但更加专注地投入了挥剑练习中。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, stamina: Math.min(100, state.hero.stamina + 5) } }),
      }
    ]
  },
  {
    id: "e_extra_starter_3",
    region: "starter_village",
    minLevel: 5,
    repeatable: true,
    text: "村里举行了一场厨艺大赛，勇者鼓起勇气想展示她最近学的‘烤蘑菇’。",
    choices: [
      {
        text: "“偷偷在她的蘑菇里注入一点恢复魔力，让评委大为赞赏。”",
        resultText: "她赢得了第一名！她把奖品分给你，并觉得自己在厨艺方面也是个天才。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 20, suspicion: state.hero.suspicion + 2 } }),
      },
      {
        text: "“告诉她烹饪也是对火候的控制练习。”",
        resultText: "她认真地观察火候。虽然最后蘑菇焦了点，但她对魔力流动的敏感度提高了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 5), level: state.hero.level + 1 } }),
      }
    ]
  },
  {
    id: "e_extra_starter_4",
    region: "starter_village",
    minLevel: 1,
    repeatable: true,
    text: "一个捣蛋鬼小孩抢走了勇者的钱袋。勇者在田野里追得气喘吁吁。",
    choices: [
      {
        text: "“在远处轻轻一点路面，让那小孩‘不小心’摔一跤。”",
        resultText: "勇者拿回了钱袋。她气鼓鼓的样子真可爱，好感度增加了。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 10 } }),
      },
      {
        text: "“大喊‘这就是实战中的突发状况’，让她穿着重铠跑完剩余的距离。”",
        resultText: "她累瘫在地上。但这种爆发式的体质训练非常有成效。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 10), stamina: Math.min(100, state.hero.stamina + 30) } }),
      }
    ]
  },
  {
    id: "e_extra_starter_5",
    region: "starter_village",
    minLevel: 10,
    repeatable: true,
    text: "村里的井中飘出了极其微弱的魔族气息。其实那是巴力巡逻时不小心掉进去的一颗扣子。",
    choices: [
      {
        text: "“骗她那是某种远古神明的指引，让她对着井口冥想。”",
        resultText: "由于井底的环境非常幽静。她阴差阳错地在冥想中获得了内心平静，魔力显著提升。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 15), suspicion: state.hero.suspicion + 5 } }),
      },
      {
        text: "“告诉她是有怪物在水井里，让她去清理水井。”",
        resultText: "在井下清理淤泥的工作虽然又脏又累，但她的手臂力量得到了实打实的锻炼。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 5), stamina: Math.min(100, state.hero.stamina + 25) } }),
      }
    ]
  },
  {
    id: "e_extra_imperial_1",
    region: "imperial_city",
    minLevel: 25,
    repeatable: true,
    text: "在王都繁华的集市，一张关于‘失踪勇者’的高额悬赏令引起了大家的关注。那个背影和勇者有点像。",
    choices: [
      {
        text: "“在悬赏令上画几笔，把那背影改成了魔物形象。”",
        resultText: "勇者被你的幽默感逗乐了，同时也稍微缓解了被通缉（认同感）的焦虑。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, suspicion: state.hero.suspicion + 5 } }),
      },
      {
        text: "“趁机告诉她只有变强才能摆脱这些困扰。”",
        resultText: "她感受到了王权的压力。那种紧张感转化为了修行的动力。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 3, stamina: Math.min(100, state.hero.stamina + 10) } }),
      }
    ]
  },
  {
    id: "e_extra_imperial_2",
    region: "imperial_city",
    minLevel: 20,
    repeatable: true,
    text: "城墙外正在进行一场秘密的魔法演习，五颜六色的光芒在夜空中闪烁。",
    choices: [
      {
        text: "“带她潜入进去，近距离观察那些高阶魔法的架构。”",
        resultText: "勇者的眼界大开。她对魔法阵的理解达到了全新的高度。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 25), suspicion: state.hero.suspicion + 10 } }),
      },
      {
        text: "“告诉她那些都是唬人的花架子，让她在旁边练习扎马步。”",
        resultText: "虽然她由于没有看到演习而有些失落。但那种极度专注的状态让她的下盘更稳了。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, stamina: Math.min(100, state.hero.stamina + 12) } }),
      }
    ]
  },
  {
    id: "e_extra_imperial_3",
    region: "imperial_city",
    minLevel: 15,
    repeatable: true,
    text: "一位失意的老吟游诗人在酒馆角落弹奏竖琴。他的琴弦断了一根。",
    choices: [
      {
        text: "“用魔力帮他接上，并示范一段连神灵也会流泪的旋律。”",
        resultText: "勇者被你的曲子深深折服。她觉得你是这世界上最优雅的‘诗人’。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25 } }),
      },
      {
        text: "“告诉勇者那是由于他的指力不足，以此训诫她。”",
        resultText: "勇者不仅不再同情，还拼命练习手指的握力。她的剑术力量稳定性提升了。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 10), level: state.hero.level + 1 } }),
      }
    ]
  },
  {
    id: "e_extra_imperial_4",
    region: "imperial_city",
    minLevel: 1,
    repeatable: true,
    text: "王城中心喷泉边，勇者在投掷硬币许愿。她看起来有点失神。",
    choices: [
      {
        text: "“握住她的另一只手，一起许下那个所谓的‘和平’心愿。”",
        resultText: "在那一刻，你们像是真正的同伴。好感度显著提升。",
        effect: (state) => ({ hero: { ...state.hero, health: 100, affection: state.hero.affection + 20 } }),
      },
      {
        text: "“在她投币的一瞬间，用魔力把硬币弹开。”",
        resultText: "面对这种挫折，勇者气急败坏。在那之后的实战中，她挥出的愤怒一击威力惊人。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 1, mana: Math.min(100, state.hero.mana + 15) } }),
      }
    ]
  },
  {
    id: "e_extra_imperial_5",
    region: "imperial_city",
    minLevel: 35,
    repeatable: true,
    text: "在贵族居住区，一场关于‘谁才是真正勇者继承人’的辩论正在激烈地进行着。勇者对此感到非常厌烦。",
    choices: [
      {
        text: "“带她飞到屋顶，俯瞰那些庸人的争执。”",
        resultText: "勇者第一次感觉到了超越众生的优越感。她的心态开始变得像一个真正的强者。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 4, affection: state.hero.affection + 10 } }),
      },
      {
        text: "“鼓励她下去展露一手，让他们闭嘴。”",
        resultText: "虽然场面一度混乱。但勇者在实战中震慑了所有人。她的威名（等级）有了飞跃。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 6, suspicion: state.hero.suspicion + 15 } }),
      }
    ]
  },
  {
    id: "e_extra_ice_1",
    region: "ice_field",
    minLevel: 40,
    repeatable: true,
    text: "在冰雪覆盖的湖面上，勇者由于地滑而摔了不知道多少个跟头。",
    choices: [
      {
        text: "“温柔地把她背起来，踩在薄冰之上如履平地。”",
        resultText: "勇者在你的背上睡着了。她觉得自己这辈子最幸福的工作就是被通缉的勇者。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 25 } }),
      },
      {
        text: "“告诉她这是平衡感训练。让她在冰面上进行单脚旋转。”",
        resultText: "在那之后。她的战斗敏捷度几乎达到了非人的地步。",
        effect: (state) => ({ hero: { ...state.hero, stamina: Math.min(100, state.hero.stamina + 20), level: state.hero.level + 2 } }),
      }
    ]
  },
  {
    id: "e_extra_ice_2",
    region: "ice_field",
    minLevel: 45,
    repeatable: true,
    text: "在冰穴深处，发现了一束散发着冷光的永恒之花。",
    choices: [
      {
        text: "“采集并制作成冰晶护身符，亲自为她戴上。”",
        resultText: "那护身符散发的清凉感让她在这个严寒之地反而不觉得冷了。好感度提升。",
        effect: (state) => ({ hero: { ...state.hero, health: 100, affection: state.hero.affection + 15 } }),
      },
      {
        text: "“诱导她吞下花瓣，直接吸收其中的寒冰魔力。”",
        resultText: "那冻结灵魂的痛苦被她硬生生地扛了下来。她的魔力属性发生了质变。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 40), level: state.hero.level + 3 } }),
      }
    ]
  },
  {
    id: "e_extra_ice_3",
    region: "ice_field",
    minLevel: 55,
    repeatable: true,
    text: "一群饿得发疯的雪狼正在悄悄包围你们。",
    choices: [
      {
        text: "“仅仅是散发出一丝属于捕食者的上位压制力。”",
        resultText: "狼群灰溜溜地逃走了。勇者对你的身份越来越感到不安（以及好奇）。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 20 } }),
      },
      {
        text: "“告诉她这是锻炼‘多重斩杀’的好时机，让她上。”",
        resultText: "在一片血与雪的战斗中。她的等级得到了实战的淬炼。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 12), level: state.hero.level + 5 } }),
      }
    ]
  },
  {
    id: "e_extra_desert_1",
    region: "desert",
    minLevel: 60,
    repeatable: true,
    text: "烈日当头。勇者被海市蜃楼引导向了相反的方向。",
    choices: [
      {
        text: "“把那一处幻象变成真实的喷泉，让她喝个饱。”",
        resultText: "勇者喝水时幸福的表情让你觉得，哪怕退休金被扣一半也值了。",
        effect: (state) => ({ hero: { ...state.hero, health: 100, affection: state.hero.affection + 25 } }),
      },
      {
        text: "“让她继续走。这种恶劣环境下。意志力的锻炼是无可取代的。”",
        resultText: "她几乎走脱了皮。但那种韧性几乎是顶尖强者的标配。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.max(0, state.hero.health - 20), stamina: Math.min(100, state.hero.stamina + 45), level: state.hero.level + 4 } }),
      }
    ]
  },
  {
    id: "e_extra_desert_2",
    region: "desert",
    minLevel: 65,
    repeatable: true,
    text: "一阵名为‘死亡之眼’的沙尘暴正在卷来，那不是普通的天灾。",
    choices: [
      {
        text: "“用魔力强行在风暴的正中心劈开一条安全通道。”",
        resultText: "勇者穿过风暴，看着你淡然的表情，心里充满了安全感。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 15, suspicion: state.hero.suspicion + 5 } }),
      },
      {
        text: "“鼓励她直接冲进风暴。去劈开那些锋利的飞沙。”",
        resultText: "在这种极度危险的练习中。她的剑气终于能做到外放了。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 25), level: state.hero.level + 6 } }),
      }
    ]
  },
  {
    id: "e_extra_volcano_1",
    region: "volcano",
    minLevel: 75,
    repeatable: true,
    text: "山脚下的黑石林里，潜藏着极度危险的火毒蛇。",
    choices: [
      {
        text: "“由于你已经在沿途撒下了驱蚊药（魔压）。它们都避开了。”",
        resultText: "勇者平安通过，觉得现在的运气简直好得不像话。好感度上升。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 12 } }),
      },
      {
        text: "“让她去捕捉这些蛇来提取火系抗性材料。”",
        resultText: "在惊险的抓捕中，她的反应速度提高到了匪夷所思的地步。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 3, stamina: Math.min(100, state.hero.stamina + 10) } }),
      }
    ]
  },
  {
    id: "e_extra_volcano_2",
    region: "volcano",
    minLevel: 80,
    repeatable: true,
    text: "在那座被称为‘炼狱’的小屋里。隐居着一位性格孤僻的锻造大师。",
    choices: [
      {
        text: "“用一壶百年的魔界陈酿贿赂他。请他为勇者打造防具。”",
        resultText: "得到这身闪耀的铠甲。勇者的生命上限仿佛不存在了一般。战斗力暴涨。",
        effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 30), stamina: Math.min(100, state.hero.stamina + 30), level: state.hero.level + 5 } }),
      },
      {
        text: "“告诉勇者那是骗子，让她继续在熔岩边负重前行。”",
        resultText: "她虽然错过了神装。但锻炼出的每一块肌肉都比钢铁还要坚硬。",
        effect: (state) => ({ hero: { ...state.hero, stamina: 100, level: state.hero.level + 3 } }),
      }
    ]
  },
  {
    id: "e_extra_volcano_3",
    region: "volcano",
    minLevel: 85,
    repeatable: true,
    text: "滚烫的硫酸雨开始落下。这绝非自然的现象，而是由于魔力过载导致的。",
    choices: [
      {
        text: "“把她拉到背后，用最顶级的广域结界挡下所有腐蚀。”",
        resultText: "这种霸道且绝对的力量。让勇者对你的崇拜已经到了几乎变质的地步。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 35, suspicion: state.hero.suspicion + 15 } }),
      },
      {
        text: "“让她练习如何利用微小的魔力气旋弹开每一滴雨滴。”",
        resultText: "这种地狱般的操控力练习。让她的魔力池扩大了一倍。",
        effect: (state) => ({ hero: { ...state.hero, mana: Math.min(100, state.hero.mana + 55), level: state.hero.level + 4 } }),
      }
    ]
  },
  {
    id: "e_extra_dragon_1",
    region: "dragon_bone_canyon",
    minLevel: 80,
    repeatable: true,
    text: "在那被诅咒的裂谷底，栖息着一头早已失去神智的古老亡灵龙。",
    choices: [
      {
        text: "“陪她一起在星空下进行最后的特训，并承诺会赢。”",
        resultText: "勇者哭着抱住了你，这一刻她感觉退休和魔王都不再重要。好感度达到了极限。",
        effect: (state) => ({ hero: { ...state.hero, affection: state.hero.affection + 55 } }),
      },
      {
        text: "“让她去单刷那头亡灵龙。这是踏入魔王城唯一的门票。”",
        resultText: "在一场几乎同归于尽的战斗中。她浴火重生。成就了传说的神话。",
        effect: (state) => ({ hero: { ...state.hero, level: state.hero.level + 15, health: 100, stamina: 100 } }),
      }
    ]
  },
  {
    id: "e_extra_dragon_2",
    region: "dragon_bone_canyon",
    minLevel: 90,
    repeatable: true,
    text: "风暴中，你看到了那扇影影绰绰的、连接着‘深渊’与‘现世’的大门。那是魔王城的入口。",
    choices: [
      {
        text: "“由于你已经在路边指明了捷径。她顺利到达了决战之地。”",
        resultText: "勇者握紧了剑柄。无论你的真实身份到底是什么，她都必须面对那个名为‘露比’的宿命。",
        effect: (state) => ({ hero: { ...state.hero, suspicion: state.hero.suspicion + 45 } }),
      },
      {
        text: "“告诉她还需要在这里再磨练一年才能合格。”",
        resultText: "由于这里的压倒性魔力。以及枯燥的循环修行。她的各项属性都已经足以碾压神魔。",
        effect: (state) => ({ hero: { ...state.hero, level: 100, mana: 100, stamina: 100 } }),
      }
    ]
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
  {
    id: "n_19_weapon_forge",
    speaker: "独眼的矮人铁匠",
    text: "大人，我们需要在熔岩区建立一个新的军火工厂。魔族的武器已经钝到连勇者的皮肤都划不破了！",
    swipeLeft: { text: "我们现在提倡和平。", effects: { military: -10, morale: +5 } },
    swipeRight: { text: "开工！我要更锋利的巨剑。", effects: { military: +20, resources: -15, climate: -10 } },
  },
  {
    id: "n_21_magic_labs",
    speaker: "疯狂的炼金术士",
    text: "给我一点活体……我是说，一点经费，我就能研发出让勇者迷失方向的新型迷幻剂！",
    swipeLeft: { text: "这种手段太卑鄙了。", effects: { morale: +5, climate: -5 } },
    swipeRight: { text: "听起来很有用。", effects: { resources: -10, military: +5, climate: +15 } },
  },
  {
    id: "n_22_monster_breeding",
    speaker: "触手怪养育员",
    text: "大人，后山的史莱姆群泛滥成灾了，它们甚至开始吞噬实验室的样本桶。是清理掉还是……作为特产出售？",
    swipeLeft: { text: "统统铲除。", effects: { resources: -2, climate: -5 } },
    swipeRight: { text: "做成史莱姆果冻礼盒。", effects: { resources: +15, morale: -5 } },
  },
  {
    id: "n_23_prophecy",
    speaker: "盲眼的占卜婆婆",
    text: "在梦境的深处，我看到了勇者的觉醒……我们需要在每个村庄建立哨塔来监视她的动向。",
    swipeLeft: { text: "让她自己成长。", effects: { morale: +5, climate: -5 } },
    swipeRight: { text: "密切视察。", effects: { resources: -8, military: +10, climate: +5 } },
  },
  {
    id: "n_24_tax_reform",
    speaker: "死板的僵尸书记员",
    text: "大人，现在的魔界租金太乱了。我建议对那些占据高级洞穴的巨魔征收‘地壳占用税’。",
    swipeLeft: { text: "他们会造反的。", effects: { morale: +10, military: -5 } },
    swipeRight: { text: "这是一笔横财。", effects: { resources: +25, morale: -15 } },
  },
  {
    id: "n_25_demon_expo",
    speaker: "浮夸的营销大师",
    text: "我们应该举办第一届‘全魔界选美大赛’，展示我们除了獠牙以外的多样性，这有助于改善外界评价。",
    swipeLeft: { text: "无聊的把戏。", effects: { morale: -3 } },
    swipeRight: { text: "我要当评委。", effects: { resources: -20, morale: +35 } },
  },
  {
    id: "n_26_spy_infiltration",
    speaker: "冷酷的暗杀者之首",
    text: "人类王国正派人潜入我们的矿区。是直接让他们‘消失’，还是派人去他们王都搞点破坏作为回礼？",
    swipeLeft: { text: "就地处决。", effects: { military: +5, climate: +5 } },
    swipeRight: { text: "礼尚往来。", effects: { military: +15, resources: -10, climate: +10 } },
  },
  {
    id: "n_27_dungeon_cleanup",
    speaker: "勤恳的食尸鬼保洁",
    text: "大人，地下城里的冒险者尸体太多了，容易引发瘟疫。我们需要建立一个自动清理法阵。",
    swipeLeft: { text: "让它们自然腐烂。", effects: { morale: -10, climate: +15 } },
    swipeRight: { text: "环保第一。", effects: { resources: -5, climate: -10, morale: +5 } },
  },
  {
    id: "n_28_air_pollution",
    speaker: "忧虑的火龙飞行员",
    text: "由于火山喷发太剧烈，高空的可见度已经低到我们要撞到鸟身女妖的家了！建议限制岩浆产出。",
    swipeLeft: { text: "戴上护目镜飞。", effects: { military: -5, resources: +10 } },
    swipeRight: { text: "为了安全，限流吧。", effects: { resources: -10, climate: -20, morale: +5 } },
  },
  {
    id: "n_29_soul_trading",
    speaker: "奸诈的灵魂交易商",
    text: "我这里有一批优质的‘正义勇者残魂’。如果您把它们注入盔甲，我们的军势将不可阻挡。",
    swipeLeft: { text: "我不吃这种带怨气的东西。", effects: { morale: +5, military: -5 } },
    swipeRight: { text: "这是极品补药。", effects: { resources: -30, military: +45, climate: +20 } },
  },
  {
    id: "n_30_mirror_trap",
    speaker: "神秘的镜之恶魔",
    text: "我可以把这森林里的溪流都变成幻影镜面，这样任何入侵者都会在自我否定中崩溃。",
    swipeLeft: { text: "太卑鄙了。", effects: { morale: +2, climate: -5 } },
    swipeRight: { text: "这才是真正的陷阱。", effects: { military: +10, climate: +15, resources: -5 } },
  },
  {
    id: "n_31_demon_school",
    speaker: "博学的地狱教授",
    text: "我们需要建立一所‘职业魔王学校’，不仅教魔法，也要教管理。那些下级恶魔太没文化了。",
    swipeLeft: { text: "拳头就是文化。", effects: { military: +5, morale: -5 } },
    swipeRight: { text: "知识就是力量。", effects: { resources: -25, morale: +20, military: +5 } },
  },
  {
    id: "n_32_abyss_drilling",
    speaker: "贪婪的钻头工头",
    text: "我们在深渊第十八层挖到了亮晶晶的东西，像是某种远古神灵的牙齿，价值连城！",
    swipeLeft: { text: "那里埋着禁忌，停下。", effects: { morale: +5, resources: -10 } },
    swipeRight: { text: "挖！一颗都别放过。", effects: { resources: +60, climate: +30, morale: -20 } },
  },
  {
    id: "n_33_music_festival",
    speaker: "朋克风的无头骑士",
    text: "大人，别整天管那些征服世界的差事了。让我们在冥河之巅办一场摇滚音乐祭吧！",
    swipeLeft: { text: "我喜欢安静。", effects: { morale: -5 } },
    swipeRight: { text: "把音响开到最大！", effects: { resources: -15, morale: +50 } },
  },
  {
    id: "n_34_ghost_ship",
    speaker: "骷髅船长",
    text: "大人，我们在冥河打捞到一艘幽灵船，上面装满了陈年的佳酿，但也有不少凶猛的幽灵水手。是把酒运回来，还是让整艘船在大集市展示？",
    swipeLeft: { text: "我要喝酒。", effects: { resources: +15, morale: -5 } },
    swipeRight: { text: "举办幽灵船之旅。", effects: { resources: -5, morale: +25 } },
  },
  {
    id: "n_35_demon_gym",
    speaker: "硬汉牛头人",
    text: "兄弟们现在的肚子都快赶上史莱姆了！我们需要办一个‘地狱健身房’，强迫所有人撸铁。",
    swipeLeft: { text: "懒惰是恶魔的权利。", effects: { morale: +5, military: -5 } },
    swipeRight: { text: "练起来！", effects: { military: +15, resources: -10, morale: +5 } },
  },
  {
    id: "n_36_mimic_chest",
    speaker: "调皮的小宝箱怪",
    text: "咕叽咕叽！（它想在大门附近放一排兄弟，这样任何人都别想轻易进来）",
    swipeLeft: { text: "太吵了。", effects: { morale: -2 } },
    swipeRight: { text: "听起来很稳固。", effects: { military: +8, resources: -5 } },
  },
  {
    id: "n_37_magic_crystal",
    speaker: "精打细算的巫妖",
    text: "王城的魔法水晶快用光了，我们需要向人类王都‘进口’一批。是用武力掠夺，还是用我们地下的黑金交换？",
    swipeLeft: { text: "直接抢吧。", effects: { military: +20, morale: -5, climate: +10 } },
    swipeRight: { text: "和平贸易。", effects: { resources: -25, morale: +10, climate: -5 } },
  },
  {
    id: "n_38_monster_race",
    speaker: "地狱犬驯兽师",
    text: "我们想举办第一届‘地狱犬竞速赛’，这能极大缓解士兵们的心理压力。只要一点点奖金……",
    swipeLeft: { text: "没兴趣。", effects: { morale: -5 } },
    swipeRight: { text: "我压一号种子！", effects: { resources: -15, morale: +40 } },
  },
  {
    id: "n_39_corruption",
    speaker: "阴森的堕落祭司",
    text: "大人的名声太好了，这不符合魔王的人设。建议我们在各个村庄散布关于您的‘吃人童谣’。",
    swipeLeft: { text: "我还要在海边养老呢。", effects: { morale: +10, climate: -10 } },
    swipeRight: { text: "随你便吧。", effects: { climate: +20, morale: -15 } },
  },
  {
    id: "n_40_lava_energy",
    speaker: "满身煤灰的哥布林",
    text: "为什么我们要费力挖煤？直接接一根管子到熔岩湖，我们就有了无穷无尽的热能。只要忽略那一点点爆炸风险。",
    swipeLeft: { text: "安全第一。", effects: { military: -5, climate: -5 } },
    swipeRight: { text: "炸了也是艺术。", effects: { resources: +40, military: +10, climate: +25 } },
  },
  {
    id: "n_41_night_market",
    speaker: "八只手的影魔家",
    text: "大人，魔界应该发展夜间经济。在城堡广场开办‘午夜美食街’，不仅能收租，还能解决小妖精的就业。",
    swipeLeft: { text: "半夜太吵，我不习惯。", effects: { morale: -5 } },
    swipeRight: { text: "准了，我要摊位费。", effects: { resources: +20, morale: +15, climate: +5 } },
  },
  {
    id: "n_42_flying_castle",
    speaker: "异想天开的石像鬼",
    text: "如果能让城堡飞起来，我们就再也不怕勇者拆家了。只是这需要消耗海量的反引力水晶。",
    swipeLeft: { text: "我恐高。", effects: { morale: -2 } },
    swipeRight: { text: "飞向蓝天！", effects: { military: +50, resources: -60, climate: +30 } },
  },
  {
    id: "n_43_secret_agent",
    speaker: "冷艳的魅魔间谍",
    text: "我成功潜入了人类王国的财务部，发现他们正在亏空公款去买昂贵的‘圣力护身符’。我们需要在黑市抬高那些符咒的价格。",
    swipeLeft: { text: "没空管人类的死活。", effects: { resources: -5 } },
    swipeRight: { text: "大赚一笔。", effects: { resources: +50, military: +10 } },
  },
  {
    id: "n_44_statue_upgrade",
    speaker: "忧心忡忡的石匠",
    text: "门口那尊您的个人雕像手里的剑有点歪，这极大地影响了魔王的威严。是花重金重塑，还是干脆给它戴个墨镜掩盖一下？",
    swipeLeft: { text: "戴墨镜挺酷的。", effects: { resources: -2, morale: +5 } },
    swipeRight: { text: "重塑！必须霸气！", effects: { resources: -15, morale: +20 } },
  },
  {
    id: "n_45_sewer_monsters",
    speaker: "神神秘秘的下水道工",
    text: "城里下水道里长出了一些带触手的变异真菌，它们正试图把城堡整个搬走。是要清理，还是……看看它们能搬到哪？",
    swipeLeft: { text: "搬走我的城堡？门都没有！", effects: { resources: -5, military: +5 } },
    swipeRight: { text: "看看它能不能搬到海边。", effects: { climate: +30, morale: +5 } },
  },
  {
    id: "n_46_demon_theatre",
    speaker: "优雅的食人魔导演",
    text: "我想排演一出莎士比亚风格的悲剧，名字叫《勇者与魔王的绝唱》。这能提升我们魔族的文化品味。",
    swipeLeft: { text: "太艺术了，我看不懂。", effects: { morale: -2 } },
    swipeRight: { text: "我能演反派吗？", effects: { resources: -10, morale: +25 } },
  },
  {
    id: "n_47_volcano_fishing",
    speaker: "钓鱼狂魔巫妖",
    text: "大人，在熔岩里发现了一群变异的‘火龙鱼’，它们甚至不需要火就能自热！我们要不要以此开发高端料理？",
    swipeLeft: { text: "听着就很烫嘴。", effects: { morale: -2 } },
    swipeRight: { text: "魔界米其林全靠它了。", effects: { resources: +15, morale: +10 } },
  },
  {
    id: "n_48_abyss_wifi",
    speaker: "博学的深渊之眼",
    text: "大人的各种指令传达太慢了。我建议在整座山脉覆盖‘深渊魔讯网’，实现信息的即时共享。",
    swipeLeft: { text: "我不想被打扰假期。", effects: { morale: +5 } },
    swipeRight: { text: "这能提高统治效率。", effects: { military: +15, resources: -20, climate: +5 } },
  },
  {
    id: "n_49_dragon_strike",
    speaker: "愤怒的黑龙首领",
    text: "这里的床板太硬了，我们要更好的垫子！否则我就带着儿郎们去人类领地‘散步’了！",
    swipeLeft: { text: "你是龙，又不是猫！", effects: { military: -10, morale: -10 } },
    swipeRight: { text: "买！买最好的羽绒垫！", effects: { resources: -30, military: +20, morale: +15 } },
  },
  {
    id: "n_51_puppet_master",
    speaker: "面无表情的机械偶",
    text: "我研发出了一款完全拟人的‘充气式假魔王’。当您想偷懒……我是说巡视时。它能替您坐在王座上。",
    swipeLeft: { text: "这种事我宁愿让猫去干。", effects: { resources: -2 } },
    swipeRight: { text: "正合我意！", effects: { resources: -5, morale: +10, climate: -5 } },
  },
  {
    id: "n_52_sky_barrier",
    speaker: "年迈的禁锢法师",
    text: "大人，我们的领空经常被那些烦人的飞龙骑士侵扰。我建议耗费巨资开启‘绝望天幕’，任何没有魔王授权的生物进入都会被瞬间烧成灰。",
    swipeLeft: { text: "那我也没法钓鱼了。", effects: { morale: +2, resources: -5 } },
    swipeRight: { text: "我们要绝对的隐私。", effects: { military: +40, resources: -50, climate: +20 } },
  },
  {
    id: "n_53_monster_bank",
    speaker: "穿着西装的小恶魔",
    text: "大人，各色矿石放在金库里都发霉了！我建议开办‘魔界第一银行’，通过低息贷款鼓励哥布林们创业。",
    swipeLeft: { text: "我怕他们卷款私逃。", effects: { morale: -5 } },
    swipeRight: { text: "经济才是硬道理。", effects: { resources: +100, morale: -30, military: -15 } },
  },
  {
    id: "n_54_eternal_flower",
    speaker: "忧郁的水晶骷髅",
    text: "在一处冰缝里发现了一朵能永不凋谢的‘冥界之花’。它能抚平受伤的心灵。是放在大厅，还是献给未来的勇者？",
    swipeLeft: { text: "这种伤感的东西不适合大厅。", effects: { morale: -5 } },
    swipeRight: { text: "留给她吧……虽然她不需要。", effects: { climate: -10, morale: +10 } },
  },
  {
    id: "n_55_demon_uniform",
    speaker: "时尚达人魅魔",
    text: "大人，我们魔族的服装统一感太差了！我设计了一套带蕾丝和尖刺的‘魔王军制式礼服’，绝对能震慑人类！",
    swipeLeft: { text: "我不喜欢制服。太束缚了。", effects: { resources: -2 } },
    swipeRight: { text: "全员换装！帥是一辈子的事。", effects: { resources: -20, military: +10, morale: +30 } },
  },
  {
    id: "n_56_gate_repair",
    speaker: "勤恳的地穴领主",
    text: "魔王城的大门被上次那个勇者踹坏了两个螺丝，现在每次开关都会发出‘吱呀’的刺耳响声。修它吗？",
    swipeLeft: { text: "这种恐怖氛围感挺好的。", effects: { resources: +2, morale: -2 } },
    swipeRight: { text: "太吵了！修！", effects: { resources: -10, morale: +5 } },
  },
  {
    id: "n_57_echo_forest",
    speaker: "爱说话的树人",
    text: "由于这些年森林里死掉的人太多，他们的回音把所有的野兽都吓跑了。我建议请一些死灵法师来‘清理噪音’。",
    swipeLeft: { text: "让他们永远在这叫吧。", effects: { climate: +15, morale: -5 } },
    swipeRight: { text: "我们需要清静。", effects: { resources: -5, climate: -10, morale: +5 } },
  },
  {
    id: "n_58_shadow_tax",
    speaker: "贪婪的吸血鬼税务官",
    text: "既然太阳照不到魔界，那我们就反过来收‘月光税’。任何敢在晚上出门的怪物都得交钱！",
    swipeLeft: { text: "这会引起暴动的。", effects: { morale: +10, military: -5 } },
    swipeRight: { text: "天才的想法。", effects: { resources: +40, morale: -35 } },
  },
  {
    id: "n_59_lava_aquarium",
    speaker: "有着透明脑袋的小恶魔",
    text: "大人，我想在您的卧室里建一个‘熔岩水族馆’，里面放满会发光的火蛇。这有助于您的睡眠。",
    swipeLeft: { text: "漏水了……我是说漏火了怎么办？", effects: { resources: -2 } },
    swipeRight: { text: "听起来很梦幻。", effects: { resources: -15, morale: +25 } },
  },
  {
    id: "n_60_mirror_portal",
    speaker: "神神秘秘的空间猎犬",
    text: "我能在王都的广场中心开启一个‘镜中世界’，那里的时间流速只有这里的一半。是作为训练营还是避暑胜地？",
    swipeLeft: { text: "时间久了会把人变疯的。", effects: { military: -10 } },
    swipeRight: { text: "全速运转！", effects: { military: +30, resources: -40, climate: +20 } },
  },
  {
    id: "n_61_demon_parade",
    speaker: "活泼的魅魔妹妹",
    text: "大人，我们要搞一场魔王城大巡游！不仅要有巨龙飞过，还要有小妖精沿街撒黑金硬币。这能极大提升向心力！",
    swipeLeft: { text: "别撒我的钱！", effects: { resources: +5, morale: -10 } },
    swipeRight: { text: "撒！我们要狂欢！", effects: { resources: -30, morale: +60 } },
  },
  {
    id: "n_62_cursed_spring",
    speaker: "一脸愁容的树妖",
    text: "后山那眼诅咒之泉由于水源干枯，现在的诅咒效果变差了。冒险者喝了居然只是轻微腹泻。我们要往里注汞吗？",
    swipeLeft: { text: "太不环保了。", effects: { climate: -10, morale: +5 } },
    swipeRight: { text: "要搞就搞大的。加料！", effects: { military: +5, resources: -5, climate: +25 } },
  },
  {
    id: "n_63_abyss_elevator",
    speaker: "满头大汗的哥布林机械师",
    text: "爬楼梯上塔尖太累了。我建议安装一个‘深渊电梯’，靠抓捕那些有浮空能力的史莱姆来带动。",
    swipeLeft: { text: "这算不算非法雇佣？", effects: { resources: -2 } },
    swipeRight: { text: "魔政人性化！开装！", effects: { resources: -10, morale: +15 } },
  },
  {
    id: "n_64_statue_vandalism",
    speaker: "愤怒的无头骑士长",
    text: "有人在您的神像屁股上画了一个粉红色的猪头！这绝对是人类王国的挑衅！出兵吗？",
    swipeLeft: { text: "……洗掉就行了。别意气用事。", effects: { military: -5, morale: +10 } },
    swipeRight: { text: "血债血偿！荡平人类村庄！", effects: { military: +50, morale: -20, climate: +30 } },
  },
  {
    id: "n_65_magic_potatoes",
    speaker: "神情紧张的药农",
    text: "我误打误撞种出了一些‘爆炸土豆’，一碰就炸。是作为战略物资储备起来，还是作为……新型食材？",
    swipeLeft: { text: "那是谋杀。", effects: { morale: -5 } },
    swipeRight: { text: "卖给那些不知情的厨师。", effects: { resources: +20, military: +10, morale: -15 } },
  },
  {
    id: "n_66_demon_idols",
    speaker: "狂热的影魔经纪人",
    text: "大人，时代变了！我们应该组建一个‘魔界偶像团体’。用优美的歌声洗脑那些人类。比用火球炸他们有效十倍！",
    swipeLeft: { text: "我讨厌这种塑料感。", effects: { morale: -5 } },
    swipeRight: { text: "出道吧！魅魔小姐姐们！", effects: { resources: -25, morale: +50, military: -10 } },
  },
  {
    id: "n_67_soul_harvest",
    speaker: "阴沉的镰刀死神",
    text: "这片森林里的残存灵魂已经溢出了。如果您不批准收集。它们会变成游荡的冤魂，随机攻击魔王城的守卫。",
    swipeLeft: { text: "那是由于他们太弱了。", effects: { military: -10 } },
    swipeRight: { text: "收起来。喂给炼金锅。", effects: { resources: +30, climate: +20 } },
  },
  {
    id: "n_68_volcano_sauna",
    speaker: "赤裸上身的炎魔",
    text: "大人的浴室太冷了。我建议把岩浆管道直接铺到地板下面。做个天然桑拿房。只要保证不漏火。",
    swipeLeft: { text: "我怕半夜变焦炭。", effects: { resources: -2 } },
    swipeRight: { text: "冬天到了。这主意不错。", effects: { resources: -15, morale: +20 } },
  },
  {
    id: "n_69_mirror_forest",
    speaker: "神秘的双头乌鸦",
    text: "森林里的树都长出了眼睛！它们在监视每一个人。是要把这些变异树砍了，还是干脆把整片深林变成我们的情报网？",
    swipeLeft: { text: "我有隐私恐惧症。砍！", effects: { resources: -10, climate: -15 } },
    swipeRight: { text: "尽收眼底。", effects: { military: +20, climate: +20 } },
  },
  {
    id: "n_70_demon_vacation",
    speaker: "累瘫了的秘书妖精",
    text: "大人……我已经连着工作了一百年了。如果再不放假，我真的要由于过劳而变成纯洁的天使了！",
    swipeLeft: { text: "那你就变成天使吧，我正好想要个白羽毛枕头。", effects: { morale: -30, military: +5 } },
    swipeRight: { text: "带薪休假三百年。现在就去！", effects: { resources: -5, morale: +100 } },
  },
  {
    id: "n_71_monster_zoo",
    speaker: "鼻青脸肿的探险家",
    text: "我在外面的雪原抓到了一只濒危的‘极光独角兽’。是关进动物园门收票。还是直接卖给黑市？",
    swipeLeft: { text: "放了它吧……这种稀罕物。", effects: { morale: +15, climate: -10 } },
    swipeRight: { text: "魔王城也需要高级宠物。", effects: { resources: -15, morale: +30 } },
  },
  {
    id: "n_72_dragon_revolt",
    speaker: "神情严峻的黑骑士",
    text: "由于最近那次削减了伙食费。巨龙们正在罢工，它们甚至拒绝在城楼上面喷火！怎么安抚？",
    swipeLeft: { text: "不干活就滚！", effects: { military: -40, morale: -20 } },
    swipeRight: { text: "给它们最嫩的小牛犊肉。", effects: { resources: -35, military: +30, morale: +10 } },
  },
  {
    id: "n_73_spirit_road",
    speaker: "虚弱的萤火虫精灵",
    text: "我们想在迷雾森林开辟一条指引方向的光之径。这样我们就不会迷失在自己的森林里了。但这样人类也会找进来。",
    swipeLeft: { text: "迷失也是森林的防御。", effects: { military: +5, climate: +5 } },
    swipeRight: { text: "自家路得认得清。", effects: { resources: -5, climate: -10, morale: +10 } },
  },
  {
    id: "n_74_demon_library_upgrade",
    speaker: "满身书垢的僵尸馆长",
    text: "图书馆的禁术区居然长毛了！我们需要购买一批昂贵的‘干燥宝石’来保住那些羊皮卷。",
    swipeLeft: { text: "烂就烂吧，都过时了。", effects: { military: -15 } },
    swipeRight: { text: "知识就是财富。买！", effects: { resources: -20, military: +20 } },
  },
  {
    id: "n_75_final_feast",
    speaker: "满面红光的厨师长",
    text: "传闻勇者就要打过来了。大人。我们要不要举办最后一场全城宴会。就算死了也要做个饱鬼？",
    swipeLeft: { text: "现在应该擦剑而不是拿叉子！", effects: { military: +15, morale: -10 } },
    swipeRight: { text: "今朝有酒今朝醉。开席！", effects: { resources: -50, morale: +200 } },
  },
  {
    id: "n_extra_1_skellie_jokes",
    speaker: "滑稽的骷髅术士",
    text: "大人，我打算在城墙上刻满我会的所有冷笑话，这样敌人攻城时会因为太冷而握不住剑！",
    swipeLeft: { text: "太冷了，我先打个寒颤。", effects: { morale: -5, climate: +5 } },
    swipeRight: { text: "冷笑话也是一种防御。", effects: { morale: +10, military: +5 } },
  },
  {
    id: "n_extra_2_goblin_disco",
    speaker: "疯狂的哥布林工程师",
    text: "陷阱房太无聊了，我们想把它改成‘熔岩蹦迪厅’！既能锻炼士兵体力，又能创收！",
    swipeLeft: { text: "你是想烧掉我的宫殿吗？", effects: { resources: -5 } },
    swipeRight: { text: "动次打次，跳起来！", effects: { resources: +15, morale: +20, military: -5 } },
  },
  {
    id: "n_extra_3_medusa_salon",
    speaker: "爱美的蛇发女妖",
    text: "我想在王城开一家美发沙龙。虽然客人可能会被石化，但发型绝对是永恒的。",
    swipeLeft: { text: "我不希望我的领民变成石像。", effects: { climate: -5 } },
    swipeRight: { text: "这种‘永恒’的美感不错。", effects: { resources: +10, climate: +15 } },
  },
  {
    id: "n_extra_4_troll_hunger",
    speaker: "饥饿的巨魔酋长",
    text: "大人！每天三顿饭根本填不饱我们的肚子！我们要抗议，我们要加餐！",
    swipeLeft: { text: "再吵就把你加进午餐。", effects: { morale: -10, military: +5 } },
    swipeRight: { text: "每人加一桶加饭酱。", effects: { resources: -15, morale: +25, military: +10 } },
  },
  {
    id: "n_extra_5_fallen_angel_tan",
    speaker: "忧郁的堕落天使",
    text: "地狱的火光太暗了，我申请去魔王城顶层晒个日光浴，让我的羽毛更有光泽。",
    swipeLeft: { text: "小心被烤焦了。", effects: { morale: -5 } },
    swipeRight: { text: "记得涂防晒霜。", effects: { morale: +15, climate: +10 } },
  },
  {
    id: "n_extra_6_slime_plumbing",
    speaker: "透明的史莱姆管家",
    text: "城堡的下水道堵了。我建议由我们史莱姆族全体出动，通过管道彻底清理。",
    swipeLeft: { text: "听起来有点恶心。", effects: { morale: -5 } },
    swipeRight: { text: "顺带把巴力的臭袜子也冲走。", effects: { resources: -5, morale: +10, climate: +15 } },
  },
  {
    id: "n_extra_7_demon_baron_uniform",
    speaker: "强迫症的地狱男爵",
    text: "魅魔们的工作服太暴露了，这不利于魔军的纪律！我建议全员换成铁板重装。",
    swipeLeft: { text: "你在自讨苦吃。", effects: { morale: -20, military: +5 } },
    swipeRight: { text: "纪律就是一切。", effects: { morale: -10, military: +20, climate: +5 } },
  },
  {
    id: "n_extra_8_black_dragon_nap",
    speaker: "打哈欠的黑龙",
    text: "大人……我想在您的金库里睡个五百年的长觉。我会顺便帮您看门的。",
    swipeLeft: { text: "我的金库不是你的卧室。", effects: { resources: +10, military: -5 } },
    swipeRight: { text: "那是全世界最安全的安保系统。", effects: { resources: -20, military: +50 } },
  },
  {
    id: "n_extra_9_ghost_prank",
    speaker: "淘气的幽灵小队",
    text: "明天是‘万魔夜行日’。我们想在城堡里搞个吓死人不偿命的恶作剧比赛。",
    swipeLeft: { text: "别吓到我的厨子。", effects: { morale: -5 } },
    swipeRight: { text: "我也要参加！", effects: { morale: +30, climate: +5 } },
  },
  {
    id: "n_extra_10_scientific_hair",
    speaker: "疯狂的僵尸科学家",
    text: "我正在研究一种‘防脱发禁术’。只要您愿意提供一点魔力样本，魔王永不秃顶！",
    swipeLeft: { text: "我的发际线很稳！", effects: { morale: -5 } },
    swipeRight: { text: "为了我那茂密的头发……", effects: { resources: -10, morale: +10, climate: +5 } },
  },
];

export const ENDINGS: Ending[] = [
  { 
    id: "ending_a", 
    title: "结局 A", 
    image: "/upload/ed2.png",
    text: "魔王城的黑色大门在一阵轰鸣声中缓缓开启。这本该是史诗级的最终决战，但王座上的魔王此时正忍着打哈欠的冲动，在脑海里疯狂拨算盘。\n\n“一年了……只要这孩子今天能稳稳当当地捅我一剑，我的‘带薪退休计划’就算完美收官了！”魔王维持着威严的表情，眼神早已飘向了桌上的的海景度假村海报。\n\n差分剧情：\n勇者才刚跨过魔王城的门槛，整个人就“啪叽”一声平地摔在了地板上。\n\n魔王的表情僵住了。她原本计划让勇者打掉她 1%血量就装死，可现在的状况是，如果不手动撤掉防御阵法，勇者可能会被直接震碎。\n\n勇者趴在地上，一边喘气一边给自己打气：“露比姐姐说过……坚持就是胜利……”\n\n魔王终于忍不住从王座上跳了下来，一把拎起勇者的后领，像拎着一只虚弱的猫：“坚持个鬼啊！你连这儿的空气阻力都打不赢吧？退款！这届勇者我要退款！”\n\n于是，退休计划惨遭滑铁卢。魔王骂骂咧咧地收起了海报，认命地开始准备下一年的魔鬼训练方案。", 
    condition: (state) => (state.hero.health + state.hero.stamina + state.hero.mana) < 220
  },
  { 
    id: "ending_b", 
    title: "结局 B", 
    image: "/upload/ed1.png",
    text: "魔王城的黑色大门在一阵轰鸣声中缓缓开启。这本该是史诗级的最终决战，但王座上的魔王此时正忍着打哈欠的冲动，在脑海里疯狂拨算盘。\n\n“一年了……只要这孩子今天能稳稳当当地捅我一剑，我的‘带薪退休计划’就算完美收官了！”魔王维持着威严的表情，眼神早已飘向了桌上的的海景度假村海报。\n\n差分剧情：\n魔王优雅地施展了一个特效拉满、伤害为零的魔法，然后完美地演技爆发，顺着勇者的剑锋“倒地不起”。\n\n“啊，我败了，世界是你的了……”魔王心里的小人已经开始跳草裙舞了。\n\n可下一秒，迎接她的不是胜利的欢呼，而是勇者撕心裂肺的哭声。她丢掉剑，一头扎进魔王怀里，把鼻涕眼泪全蹭在了裙子上：“露比姐姐！你不要死！我都明白了……你故意教我怎么恢复战力，就是为了让我杀掉你来换取世界的和平对吗？这种沉重的爱，我怎么承受得起啊！”\n\n“既然你不想当魔王，那我也不当勇者了！这魔王城挺大的，我们把它改成‘勇者与魔王的主题度假村’怎么样？”\n\n于是，世界上最奇葩的创业组合诞生了。", 
    condition: (state) => (state.hero.health + state.hero.stamina + state.hero.mana) >= 220 && state.hero.affection >= 300 && state.hero.suspicion >= 200
  },
  { 
    id: "ending_c", 
    title: "结局 C", 
    image: "/upload/ed3.png",
    text: "魔王城的黑色大门在一阵轰鸣声中缓缓开启。这本该是史诗级的最终决战，但王座上的魔王此时正忍着打哈欠的冲动，在脑海里疯狂拨算盘。\n\n“一年了……只要这孩子今天能稳稳当当地捅我一剑，我的‘带薪退休计划’就算完美收官了！”魔王维持着威严的表情，眼神早已飘向了桌上的的海景度假村海报。\n\n差分剧情：\n这是魔王算盘里最完美的一局。\n\n勇者带着满腔的正义感打败了魔王，带着对“失踪的露比姐姐”的淡淡忧伤回到了王城。而在大洋彼岸，魔王换上了太阳镜，正对着一桌子海鲜大快朵颐。她偶尔会看到报纸上关于“伟大勇者”的新闻，嘴角露出一抹深藏功与名的微笑。\n\n“数值算尽，退休归我。”魔王喝了一口果汁，满足地叹了口气。\n\n于是，勇者拯救了世界，魔王拯救了假期。", 
    condition: (state) => (state.hero.health + state.hero.stamina + state.hero.mana) >= 220 && state.hero.affection < 300 && state.hero.suspicion < 200
  },
  { 
    id: "ending_d", 
    title: "结局 D", 
    image: "/upload/ed4.png",
    text: "魔王城的黑色大门在一阵轰鸣声中缓缓开启。这本该是史诗级的最终决战，但王座上的魔王此时正忍着打哈欠的冲动，在脑海里疯狂拨算盘。\n\n“一年了……只要这孩子今天能稳稳当当地捅我一剑，我的‘带薪退休计划’就算完美收官了！”魔王维持着威严的表情，眼神早已飘向了桌上的的海景度假村海报。\n\n差分剧情：\n小勇挥动手中的神剑指向王座：“魔王，受死吧！为了露比姐姐的期待，我一定要终结这一切！”\n\n魔王忍住笑意，利用瞬移逃走，留下一个写着“我被干掉了”的稻草人。\n\n不久后，在温暖的海边沙滩上，穿着泳装的“露比”正躺在躺椅上吸着椰子水。勇者在远处挥舞她钓上来的大鱼：“露比姐姐！我们今晚有烤鱼吃了！”\n\n“露比”拍了拍旁边的位置，心满意足地闭上眼：“干得好……现在世界和平了，我们可以一直幸福下去了。”\n\n于是，在那个不知名的海岛上，勇者与魔王的幸福退休生活开始了。", 
    condition: (state) => (state.hero.health + state.hero.stamina + state.hero.mana) >= 220 && state.hero.affection >= 300 && state.hero.suspicion < 200
  },
  { 
    id: "ending_e", 
    title: "结局 E", 
    image: "/upload/ed5.png",
    text: "魔王城的黑色大门在一阵轰鸣声中缓缓开启。这本该是史诗级的最终决战，但王座上的魔王此时正忍着打哈欠的冲动，在脑海里疯狂拨算盘。\n\n“一年了……只要这孩子今天能稳稳当当地捅我一剑，我的‘带薪退休计划’就算完美收官了！”魔王维持着威严的表情，眼神早已飘向了桌上的的海景度假村海报。\n\n差分剧情：\n这一场的空气里没有粉红泡泡，只有冷冰冰的杀气。\n\n当勇者发现所谓“命运般的相遇”只是魔王为了退休的把戏时，她手里的剑也挥出了破纪录的数值。魔王试图解释：“其实我们这叫双赢……”\n\n“赢你个头！”小勇的剑刃划破了空气，“把我的感动还给我啊！”\n\n这一剑，魔王没能躲开。于是，魔王城塌了，退休计划也随之灰飞烟灭。她躺在废墟里，看着勇者头也不回离去的背影，终于明白：感情账，是这世上最难算的数值。", 
    condition: (state) => (state.hero.health + state.hero.stamina + state.hero.mana) >= 220 && state.hero.affection < 300 && state.hero.suspicion >= 200
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
    text: "【养成指南】：你的目标是平衡勇者的【生命(HP)、力量(STA)、魔法(MP)、好感度(Affection)、怀疑度(Suspicion)】这五项核心指标。请在等级达到 100 前将她引导向魔王城。",
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
    text: "你的目标是提升勇者的【总战力】，即生命(HP) + 力量(STA) + 魔法(MP)，让她能够打败你。但要注意【好感度】和【怀疑度】的变动，那会决定你们最终的结局。",
  },
  {
    type: "TUTORIAL",
    text: "现在可以安排勇者的日程了！初始开放地区有【绿叶村】与【王城】，随着等级提升会解锁更多区域。在【王城】可以回复生命(HP)、力量(STA)与魔法(MP)，也会一次提升5级，请合理规划日程~",
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
