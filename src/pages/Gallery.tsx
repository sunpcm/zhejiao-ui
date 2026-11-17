import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Dialog } from "../components/Dialog";
import { IconAlert, IconPage } from "../components/Icons";
import { Toast } from "../components/Toast";
import { Link } from "../router";

const sections = [
  { id: "buttons", label: "按钮" },
  { id: "fields", label: "输入" },
  { id: "table", label: "表格" },
  { id: "nav", label: "导航" },
  { id: "tabs", label: "标签页" },
  { id: "dialog", label: "对话框" },
  { id: "toast", label: "提示" },
  { id: "empty", label: "空状态" },
  { id: "error", label: "错误" },
  { id: "badges", label: "徽章" },
  { id: "links", label: "链接" },
];

const tabs = [
  {
    id: "need",
    label: "需求",
    body: "退货原因仍是选填。交付前改成必填，并写明谁来补旧单。空着的单不要静默通过。",
  },
  {
    id: "draft",
    label: "成稿",
    body: "尺码表以仓库里的尺寸表为准。页面文案多出来的那一档删掉，避免和吊牌不一致。",
  },
  {
    id: "talk",
    label: "会话记录",
    body: "顾客问能不能改成门店自提。已答应今天回写到需求，不留在聊天记录里就算完成。",
  },
] as const;

const shops = [
  { name: "城南旗舰", date: "11月12日", open: "2", status: "待复核", tone: "warn" },
  { name: "河西仓店", date: "11月14日", open: "0", status: "已关闭", tone: "ok" },
  { name: "东站临时柜", date: "11月9日", open: "5", status: "逾期", tone: "danger" },
] as const;

const zones = ["今日待办", "已关闭", "会话里提到的店"] as const;

export function Gallery() {
  const [toast, setToast] = useState<string | null>(null);

  return (
    <article>
      <h1 id="page-title" className="page-title" tabIndex={-1}>
        组件
      </h1>
      <p className="lede">
        这些零件按真实工具来写。需求走到交付、店铺巡检、会话记录，都是会在产品里出现的句子。
      </p>

      <div className="gallery">
        <nav className="gallery-index" aria-label="组件目录">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>

        <div className="stack">
          <section className="specimen" id="buttons" aria-labelledby="buttons-title">
            <h2 id="buttons-title" className="section-title">
              按钮
            </h2>
            <p className="note">主按钮是这一步要做的事。旁边的是旁路，危险操作用砖红。</p>
            <div className="button-row">
              <button type="button" className="btn btn-primary">
                记下这条
              </button>
              <button type="button" className="btn">
                存成草稿
              </button>
              <button type="button" className="btn btn-quiet">
                取消
              </button>
              <button type="button" className="btn btn-danger">
                标为阻塞
              </button>
              <button type="button" className="btn" disabled>
                已交付
              </button>
            </div>
          </section>

          <section className="specimen" id="fields" aria-labelledby="fields-title">
            <h2 id="fields-title" className="section-title">
              输入与表单
            </h2>
            <p className="note">店铺巡检里补一条记录。店铺名称为空时不能提交。</p>
            <InspectionForm onSaved={setToast} />
          </section>

          <section className="specimen" id="table" aria-labelledby="table-title">
            <h2 id="table-title" className="section-title">
              表格
            </h2>
            <div className="table-wrap">
              <table>
                <caption>本周店铺巡检</caption>
                <thead>
                  <tr>
                    <th scope="col">店铺</th>
                    <th scope="col">上次巡检</th>
                    <th scope="col">未关闭</th>
                    <th scope="col">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {shops.map((shop) => (
                    <tr key={shop.name}>
                      <td>{shop.name}</td>
                      <td>{shop.date}</td>
                      <td className="num">{shop.open}</td>
                      <td>
                        <span className={`badge badge-${shop.tone}`}>{shop.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="specimen" id="nav" aria-labelledby="nav-title">
            <h2 id="nav-title" className="section-title">
              导航
            </h2>
            <p className="note">页头是这套主题自己的导航。下面是巡检工具里的分区。</p>
            <ZoneNav />
          </section>

          <section className="specimen" id="tabs" aria-labelledby="tabs-title">
            <h2 id="tabs-title" className="section-title">
              标签页
            </h2>
            <p className="note">同一条需求的三份材料。方向键可以在标签之间移动。</p>
            <MaterialTabs />
          </section>

          <section className="specimen" id="dialog" aria-labelledby="dialog-title">
            <h2 id="dialog-title" className="section-title">
              对话框
            </h2>
            <p className="note">确认会打断当前工作，所以单独问一次。按 Esc 或「取消」关闭。</p>
            <DeliverDialog onDone={setToast} />
          </section>

          <section className="specimen" id="toast" aria-labelledby="toast-title">
            <h2 id="toast-title" className="section-title">
              提示
            </h2>
            <p className="note">写完一条记录后从页面边缘告诉你，不挡住表格。</p>
            <button type="button" className="btn" onClick={() => setToast("已写入巡检记录。")}>
              写入一条提示
            </button>
          </section>

          <section className="specimen" id="empty" aria-labelledby="empty-title">
            <h2 id="empty-title" className="section-title">
              空状态
            </h2>
            <EmptyState />
          </section>

          <section className="specimen" id="error" aria-labelledby="error-title">
            <h2 id="error-title" className="section-title">
              错误
            </h2>
            <ErrorState />
          </section>

          <section className="specimen" id="badges" aria-labelledby="badges-title">
            <h2 id="badges-title" className="section-title">
              徽章
            </h2>
            <div className="button-row">
              <span className="badge badge-warn">待复核</span>
              <span className="badge badge-ok">已关闭</span>
              <span className="badge badge-danger">逾期</span>
              <span className="badge">草稿</span>
            </div>
          </section>

          <section className="specimen" id="links" aria-labelledby="links-title">
            <h2 id="links-title" className="section-title">
              链接
            </h2>
            <p className="prose">
              成稿不在这一页。<Link href="/board">去工作台看「退货原因改成必填」停在哪一列</Link>。
            </p>
          </section>
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast(null)} />
    </article>
  );
}

function InspectionForm({ onSaved }: { onSaved: (message: string) => void }) {
  const [shop, setShop] = useState("");
  const [summary, setSummary] = useState("价签和系统价差 3 元");
  const [channel, setChannel] = useState("门店价签");
  const [action, setAction] = useState("todo");
  const [note, setNote] = useState("");
  const [followup, setFollowup] = useState(true);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (shop.trim() === "") {
      setError("先填店铺名称。");
      return;
    }
    setError("");
    const tail = followup ? "已标成待复核。" : "这次不跟进。";
    onSaved(`${shop.trim()}的巡检已记下。${tail}`);
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      {error !== "" ? (
        <p id="shop-error" className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <label className="field-label">
        <span>
          店铺名称 <span className="req">必填</span>
        </span>
        <input
          className="field"
          value={shop}
          placeholder="城南旗舰"
          autoComplete="off"
          aria-invalid={error !== "" ? true : undefined}
          aria-describedby={error !== "" ? "shop-error" : undefined}
          onChange={(event) => setShop(event.target.value)}
        />
      </label>
      <label className="field-label">
        问题摘要
        <input
          className="field"
          value={summary}
          autoComplete="off"
          onChange={(event) => setSummary(event.target.value)}
        />
      </label>
      <label className="field-label">
        发现位置
        <select className="field" value={channel} onChange={(event) => setChannel(event.target.value)}>
          <option>门店价签</option>
          <option>系统价格</option>
          <option>会话里的承诺</option>
        </select>
      </label>
      <fieldset>
        <legend>处理方式</legend>
        <label className="choice">
          <input
            type="radio"
            name="action"
            value="fix"
            checked={action === "fix"}
            onChange={() => setAction("fix")}
          />
          当场改价
        </label>
        <label className="choice">
          <input
            type="radio"
            name="action"
            value="todo"
            checked={action === "todo"}
            onChange={() => setAction("todo")}
          />
          记一笔待办
        </label>
        <label className="choice">
          <input
            type="radio"
            name="action"
            value="skip"
            checked={action === "skip"}
            onChange={() => setAction("skip")}
          />
          本次忽略
        </label>
      </fieldset>
      <label className="field-label">
        备注
        <textarea
          className="field"
          value={note}
          placeholder="昨晚改价可能没下发"
          onChange={(event) => setNote(event.target.value)}
        />
      </label>
      <label className="choice">
        <input type="checkbox" checked={followup} onChange={(event) => setFollowup(event.target.checked)} />
        下次巡检继续看这条
      </label>
      <div className="button-row">
        <button type="submit" className="btn btn-primary">
          记下巡检
        </button>
      </div>
    </form>
  );
}

function ZoneNav() {
  const [current, setCurrent] = useState(0);
  return (
    <div className="stack">
      <nav className="subnav" aria-label="巡检分区">
        {zones.map((zone, index) => (
          <button
            key={zone}
            type="button"
            aria-current={index === current ? "page" : undefined}
            onClick={() => setCurrent(index)}
          >
            {zone}
          </button>
        ))}
      </nav>
      <p className="note">
        正在看{zones[current]}。城南旗舰有 <span className="num">2</span> 条未关闭。
      </p>
    </div>
  );
}

function MaterialTabs() {
  const [current, setCurrent] = useState<(typeof tabs)[number]["id"]>("need");

  function onKey(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((tab) => tab.id === current);
    const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (direction === 0) return;
    event.preventDefault();
    const next = tabs[(index + direction + tabs.length) % tabs.length];
    setCurrent(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="一条需求的三份材料" className="tabs" onKeyDown={onKey}>
        {tabs.map((tab) => {
          const selected = tab.id === current;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setCurrent(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== current}
          tabIndex={0}
          className="tab-panel"
        >
          {tab.body}
        </div>
      ))}
    </div>
  );
}

function DeliverDialog({ onDone }: { onDone: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn" onClick={() => setOpen(true)}>
        标为已交付
      </button>
      <Dialog
        open={open}
        title="标为已交付"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="btn" onClick={() => setOpen(false)}>
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setOpen(false);
                onDone("「退货原因改成必填」已标为已交付。");
              }}
            >
              确认交付
            </button>
          </>
        }
      >
        <p>确认之后，这条需求会从成稿中拿掉。巡检列表不再显示它。</p>
      </Dialog>
    </>
  );
}

function EmptyState() {
  const [started, setStarted] = useState(false);
  return (
    <div className="state-block">
      <IconPage className="icon" />
      <h3 className="section-title">这个店铺还没有巡检</h3>
      <p>城南旗舰从上周才开始记。第一条由店长补。</p>
      <button type="button" className="btn btn-primary" onClick={() => setStarted(true)}>
        记下第一条
      </button>
      {started ? <p role="status">草稿已开。店铺：城南旗舰。</p> : null}
    </div>
  );
}

function ErrorState() {
  const [retried, setRetried] = useState(false);
  return (
    <div className="state-block state-error" role="alert">
      <IconAlert className="icon" />
      <h3 className="section-title">会话记录没有载入</h3>
      <p>请求在半路断了。记录还在，只是这一页没拿到。</p>
      <button type="button" className="btn" onClick={() => setRetried(true)}>
        再试一次
      </button>
      {retried ? <p role="status">已重新取到 12 条会话。</p> : null}
    </div>
  );
}
