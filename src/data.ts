import type { Priority, Status, Surface, ThemeId, Ticket } from "./types";

export const SURFACES: { id: Surface; name: string; path: string; line: string }[] = [
  { id: "reading", name: "阅读", path: "/reading", line: "长文，按中文可读行长控制" },
  { id: "product", name: "产品", path: "/product", line: "台账、表格和表单" },
  { id: "infra", name: "运维", path: "/infra", line: "状态、数字和日志，再紧一档" },
];

export const THEMES: { id: ThemeId; name: string; words: string; index: string }[] = [
  { id: "qingge", name: "青格", words: "克制、清晰、网格、当代", index: "01" },
  { id: "kanci", name: "刊次", words: "排版、印刷、权威、冷静", index: "02" },
  { id: "yingbian", name: "硬边", words: "硬、直白、高对比、当代", index: "03" },
];

export const STATUS_ORDER: Status[] = ["todo", "doing", "review", "done"];

export const STATUS_LABEL: Record<Status, string> = {
  todo: "待处理",
  doing: "处理中",
  review: "待验收",
  done: "已关闭",
};

export const ACTION_LABEL: Record<Status, string> = {
  todo: "开始处理",
  doing: "提交验收",
  review: "结案",
  done: "已关闭",
};

export const PRIORITIES: Priority[] = ["低", "中", "高", "紧急"];

export const PLACES = [
  "三号楼东门",
  "二层竹间",
  "财务室",
  "文印室",
  "地库",
  "开放区 A 排",
  "机房",
] as const;

export const TICKETS: Ticket[] = [
  {
    id: "GD-1048",
    title: "东门读卡器无心跳",
    summary: "三号楼东门的控制器从凌晨起没有心跳。夜班已改为人工核验出入，白天需要把设备拉回来。",
    place: "三号楼东门",
    priority: "高",
    status: "todo",
    owner: "陈可",
    updated: "11月17日 06:40",
  },
  {
    id: "GD-1052",
    title: "林夏的账号与权限",
    summary: "设计部林夏今天入职。邮箱已经开通，代码仓库和工单台权限还没配完。",
    place: "开放区 A 排",
    priority: "中",
    status: "doing",
    owner: "周宁",
    updated: "11月17日 09:15",
  },
  {
    id: "GD-1055",
    title: "月度导出缺少验收时间",
    summary: "财务导出的表格没有「验收时间」一列。补上之后请赵启明确认一版，再交给月结。",
    place: "财务室",
    priority: "中",
    status: "review",
    owner: "赵启明",
    updated: "11月16日 17:20",
  },
  {
    id: "GD-1061",
    title: "竹间投屏慢两秒",
    summary: "二层竹间的无线投屏大约慢两秒。不影响开会，但要把原因记在台账里，避免下次当成新故障。",
    place: "二层竹间",
    priority: "低",
    status: "todo",
    owner: "未分派",
    updated: "11月15日 14:05",
  },
  {
    id: "GD-1066",
    title: "访客无线证书将到期",
    summary: "访客无线证书下周二到期。新证书已经申请，还差换上，并通知前台怎么协助访客连接。",
    place: "机房",
    priority: "高",
    status: "doing",
    owner: "陈可",
    updated: "11月17日 10:02",
  },
  {
    id: "GD-1070",
    title: "三号打印机反复卡纸",
    summary: "辊轮已换，试印二十页没有再卡。先关闭。如果本周复发，再开一条新工单，不要把这条重新打开。",
    place: "文印室",
    priority: "低",
    status: "done",
    owner: "周宁",
    updated: "11月14日 11:30",
  },
  {
    id: "GD-1074",
    title: "差旅单缺行程单",
    summary: "市场部两张差旅单被退回，缺行程单。补件已经送到财务室，等赵启明点收后就可以关。",
    place: "财务室",
    priority: "中",
    status: "review",
    owner: "赵启明",
    updated: "11月17日 08:50",
  },
  {
    id: "GD-1079",
    title: "地库摄像头快六分钟",
    summary: "地库三路摄像头比标准时间快六分钟，回放对不上门禁记录。先人工对时，再查授时服务器。",
    place: "地库",
    priority: "紧急",
    status: "todo",
    owner: "陈可",
    updated: "11月17日 07:25",
  },
  {
    id: "GD-1083",
    title: "开放区插座没有回路标签",
    summary: "保洁反映开放区插座看不出属于哪一路。停电演练时不知道该拉哪一个开关。",
    place: "开放区 A 排",
    priority: "低",
    status: "doing",
    owner: "未分派",
    updated: "11月13日 16:40",
  },
  {
    id: "GD-1088",
    title: "外部协作账号复核",
    summary: "季度复核：十二个外部协作账号里有三个已经过了项目期，需要停用或者续期。名单在机房共享目录。",
    place: "机房",
    priority: "中",
    status: "todo",
    owner: "赵启明",
    updated: "11月12日 09:00",
  },
];
