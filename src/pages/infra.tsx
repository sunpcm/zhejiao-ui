import { useEffect } from "react";

type State = "ok" | "warn" | "bad";

const SERVICES: { name: string; state: State; label: string; place: string; since: string; note: string }[] = [
  { name: "门禁控制器", state: "bad", label: "中断", place: "三号楼东门", since: "06:12", note: "无心跳，夜班改人工核验" },
  { name: "地库授时", state: "warn", label: "降级", place: "地库", since: "07:25", note: "三路摄像头快 6 分钟" },
  { name: "访客无线", state: "warn", label: "将到期", place: "机房", since: "10:02", note: "证书下周二到期" },
  { name: "文印", state: "ok", label: "正常", place: "文印室", since: "11月14日", note: "辊轮已换，试印通过" },
  { name: "账号目录", state: "ok", label: "正常", place: "开放区", since: "09:15", note: "林夏邮箱已开，仓库权限未齐" },
  { name: "工单台", state: "ok", label: "正常", place: "本机", since: "00:00", note: "台账可写" },
];

const METRICS: { label: string; value: string; unit: string; state: State; width: string }[] = [
  { label: "未关闭", value: "9", unit: "条", state: "ok", width: "45%" },
  { label: "紧急", value: "1", unit: "条", state: "bad", width: "12%" },
  { label: "证书剩余", value: "6", unit: "天", state: "warn", width: "30%" },
  { label: "对时偏差", value: "6", unit: "分钟", state: "warn", width: "60%" },
];

const LOGS = [
  "06:40:18  门禁  东门控制器心跳丢失，已改人工核验",
  "07:25:03  授时  地库三路比标准时间快 6 分钟",
  "09:15:44  账号  林夏邮箱已开，仓库与工单台权限未齐",
  "10:02:11  证书  访客无线下周二到期，新证已申请",
  "11:30:00  文印  GD-1070 关闭。复发另开，不重开旧单",
];

export function InfraPage() {
  useEffect(() => {
    document.title = "运维 · 工单台";
  }, []);

  return (
    <div className="ops">
      <header className="page-head">
        <h1>运行状态</h1>
        <p className="lede">这一屏只放状态、数字和日志。颜色表示通断和缓急，不拿来装饰。</p>
      </header>
      <div className="ops-metrics">
        {METRICS.map((item) => (
          <article key={item.label} className="metric">
            <p className="metric-label">{item.label}</p>
            <p className="metric-value num">
              {item.value}
              <span>{item.unit}</span>
            </p>
            <div className="meter" data-state={item.state}>
              <span style={{ width: item.width }} />
            </div>
          </article>
        ))}
      </div>
      <div className="table-wrap">
        <table className="ops-table">
          <caption className="vh">服务状态</caption>
          <thead>
            <tr>
              <th scope="col">服务</th>
              <th scope="col">状态</th>
              <th scope="col">位置</th>
              <th scope="col">自从</th>
              <th scope="col">备注</th>
            </tr>
          </thead>
          <tbody>
            {SERVICES.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>
                  <span className="state" data-state={row.state}>
                    {row.label}
                  </span>
                </td>
                <td>{row.place}</td>
                <td className="num">{row.since}</td>
                <td>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <pre className="log" aria-label="最近日志">
        {LOGS.join("\n")}
      </pre>
    </div>
  );
}
