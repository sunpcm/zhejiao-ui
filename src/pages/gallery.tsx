import { useEffect, useId, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { PLACES, PRIORITIES, STATUS_LABEL } from "../data";
import { useStore } from "../store";
import { Dialog, Tag } from "../ui";
import type { Priority } from "../types";

type Draft = {
  title: string;
  place: string;
  priority: Priority;
  detail: string;
};

const EMPTY: Draft = { title: "", place: "", priority: "中", detail: "" };

type Errors = Partial<Record<keyof Draft, string>>;

function validate(draft: Draft): Errors {
  const errors: Errors = {};
  const title = draft.title.trim();
  if (!title) errors.title = "请填写标题。";
  else if (title.length < 4) errors.title = "标题至少 4 个字。";
  if (!draft.place) errors.place = "请选择位置。";
  const detail = draft.detail.trim();
  if (!detail) errors.detail = "请填写说明。";
  else if (detail.length < 12) errors.detail = "说明至少 12 个字，方便下一个人判断。";
  return errors;
}

export function GalleryPage() {
  const { tickets, addTicket, pushToast } = useStore();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [madeId, setMadeId] = useState<string | null>(null);
  const [clearOpen, setClearOpen] = useState(false);
  const [sampleOpen, setSampleOpen] = useState(false);
  const [tablePriority, setTablePriority] = useState<Priority | "全部">("全部");
  const [page, setPage] = useState(1);
  const titleId = useId();
  const placeId = useId();
  const priorityId = useId();
  const detailId = useId();
  const filterId = useId();

  useEffect(() => {
    document.title = "组件 · 工单台";
  }, []);

  const errors = submitted ? validate(draft) : {};
  const pageSize = 4;
  const rows = useMemo(
    () => tickets.filter((ticket) => tablePriority === "全部" || ticket.priority === tablePriority),
    [tickets, tablePriority],
  );
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleRows = rows.slice((safePage - 1) * pageSize, safePage * pageSize);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validate(draft);
    const firstInvalid = (Object.keys(nextErrors)[0] ?? null) as keyof Draft | null;
    if (firstInvalid) {
      const id =
        firstInvalid === "title"
          ? titleId
          : firstInvalid === "place"
            ? placeId
            : firstInvalid === "detail"
              ? detailId
              : priorityId;
      document.getElementById(id)?.focus();
      return;
    }
    const ticket = addTicket({
      title: draft.title.trim(),
      summary: draft.detail.trim(),
      place: draft.place,
      priority: draft.priority,
    });
    setMadeId(ticket.id);
    setDraft(EMPTY);
    setSubmitted(false);
    setPage(1);
    pushToast(`已把 ${ticket.id} 放到待处理。`);
  }

  function requestClear() {
    const dirty = draft.title || draft.place || draft.detail || draft.priority !== "中";
    if (!dirty) {
      pushToast("草稿是空的，不用清。");
      return;
    }
    setClearOpen(true);
  }

  return (
    <>
      <header className="page-head">
        <h1>组件</h1>
        <p className="lede">
          这些控件都会出现在工作台里。用键盘走一遍：焦点环在浅底、深底和实心按钮上都要看得见。
        </p>
      </header>

      <section className="block panel" aria-labelledby="buttons-heading">
        <h2 id="buttons-heading">按钮</h2>
        <p className="section-note">一处只放一个主动作。次按钮用来退回或取消。不能点的留在原位，不藏起来。</p>
        <div className="row">
          <button type="button" className="btn btn-primary" onClick={() => pushToast("主按钮只负责这一处的主动作。")}>
            开始处理
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => pushToast("次按钮没有改动数据。")}>
            先不改
          </button>
          <button type="button" className="btn btn-quiet" onClick={() => pushToast("这是一个安静的动作。")}>
            查看记录
          </button>
          <button type="button" className="btn btn-primary" disabled>
            已关闭
          </button>
        </div>
      </section>

      <section className="block panel" aria-labelledby="form-heading">
        <h2 id="form-heading">登记工单</h2>
        <p className="section-note">提交后会写进同一份台账，刷新页面会回到初始的十条。</p>
        <form className="form" noValidate onSubmit={onSubmit}>
          <div className="form-split">
            <div className="field">
              <label htmlFor={titleId}>标题</label>
              <input
                id={titleId}
                value={draft.title}
                maxLength={40}
                aria-invalid={errors.title ? true : undefined}
                aria-describedby={errors.title ? `${titleId}-error` : `${titleId}-hint`}
                onChange={(event) => update("title", event.target.value)}
              />
              {errors.title ? (
                <p id={`${titleId}-error`} className="error" role="alert">
                  {errors.title}
                </p>
              ) : (
                <p id={`${titleId}-hint`} className="hint">
                  4 到 40 个字。
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor={placeId}>位置</label>
              <select
                id={placeId}
                value={draft.place}
                aria-invalid={errors.place ? true : undefined}
                aria-describedby={errors.place ? `${placeId}-error` : undefined}
                onChange={(event) => update("place", event.target.value)}
              >
                <option value="">请选择</option>
                {PLACES.map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </select>
              {errors.place ? (
                <p id={`${placeId}-error`} className="error" role="alert">
                  {errors.place}
                </p>
              ) : null}
            </div>
          </div>
          <div className="field">
            <label htmlFor={priorityId}>优先级</label>
            <select
              id={priorityId}
              value={draft.priority}
              onChange={(event) => update("priority", event.target.value as Priority)}
            >
              {PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor={detailId}>说明</label>
            <textarea
              id={detailId}
              value={draft.detail}
              rows={4}
              aria-invalid={errors.detail ? true : undefined}
              aria-describedby={errors.detail ? `${detailId}-error` : `${detailId}-hint`}
              onChange={(event) => update("detail", event.target.value)}
            />
            {errors.detail ? (
              <p id={`${detailId}-error`} className="error" role="alert">
                {errors.detail}
              </p>
            ) : (
              <p id={`${detailId}-hint`} className="hint">
                至少 12 个字，写清现象和已经试过的办法。
              </p>
            )}
          </div>
          <div className="row">
            <button type="submit" className="btn btn-primary">
              写入台账
            </button>
            <button type="button" className="btn btn-secondary" onClick={requestClear}>
              清空草稿
            </button>
          </div>
          {madeId ? (
            <p className="form-note" role="status">
              已写入待处理：<span className="num">{madeId}</span>。
              <Link to="/board">到工作台查看</Link>
            </p>
          ) : null}
        </form>
      </section>

      <section className="block panel" aria-labelledby="overlay-heading">
        <h2 id="overlay-heading">对话框与提示</h2>
        <p className="section-note">对话框可以用取消、确认或退出键关掉。提示会自己消失。</p>
        <div className="row">
          <button type="button" className="btn btn-primary" onClick={() => setSampleOpen(true)}>
            打开对话框
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => pushToast("夜班已经看到这条提示。")}>
            发出提示
          </button>
        </div>
      </section>

      <section className="block panel" aria-labelledby="table-heading">
        <h2 id="table-heading">台账摘录</h2>
        <div className="filters">
          <div className="field">
            <label htmlFor={filterId}>优先级</label>
            <select
              id={filterId}
              value={tablePriority}
              onChange={(event) => {
                setTablePriority(event.target.value as Priority | "全部");
                setPage(1);
              }}
            >
              <option value="全部">全部</option>
              {PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <p className="count">
            <span className="num">{rows.length}</span> 条
          </p>
        </div>
        <div className="table-wrap">
          <table>
            <caption className="vh">按优先级筛选后的工单</caption>
            <thead>
              <tr>
                <th scope="col">编号</th>
                <th scope="col">标题</th>
                <th scope="col">优先级</th>
                <th scope="col">状态</th>
                <th scope="col">受理人</th>
                <th scope="col">更新</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={6}>没有符合的工单。</td>
                </tr>
              ) : (
                visibleRows.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="num">{ticket.id}</td>
                    <td>{ticket.title}</td>
                    <td>
                      <Tag priority={ticket.priority}>{ticket.priority}</Tag>
                    </td>
                    <td>
                      <Tag status={ticket.status}>{STATUS_LABEL[ticket.status]}</Tag>
                    </td>
                    <td>{ticket.owner}</td>
                    <td>{ticket.updated}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <nav className="pager" aria-label="分页">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={safePage === 1}
          >
            上一页
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              className="page-btn"
              aria-current={number === safePage ? "page" : undefined}
              onClick={() => setPage(number)}
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={safePage === pageCount}
          >
            下一页
          </button>
        </nav>
      </section>

      <section className="block panel" aria-labelledby="tag-heading">
        <h2 id="tag-heading">标签</h2>
        <p className="section-note">颜色只表示状态，不拿来装饰。</p>
        <div className="row">
          {PRIORITIES.map((item) => (
            <Tag key={item} priority={item}>
              {item}
            </Tag>
          ))}
          <Tag status="doing">处理中</Tag>
          <Tag status="review">待验收</Tag>
          <Tag status="done">已关闭</Tag>
        </div>
      </section>

      <Dialog
        open={clearOpen}
        title="清空这份草稿？"
        closeLabel="留下"
        primaryLabel="清空"
        onClose={() => setClearOpen(false)}
        onPrimary={() => {
          setDraft(EMPTY);
          setSubmitted(false);
          setClearOpen(false);
          pushToast("草稿已清空。");
        }}
      >
        <p>已经写下的标题、位置和说明会被清掉。台账里的工单不受影响。</p>
      </Dialog>
      <Dialog
        open={sampleOpen}
        title="把这条提示交给夜班？"
        closeLabel="取消"
        primaryLabel="交给夜班"
        onClose={() => setSampleOpen(false)}
        onPrimary={() => {
          setSampleOpen(false);
          pushToast("已交给夜班。对话框可以关掉了。");
        }}
      >
        <p>这只是组件页上的对话框。取消、确认，或者按 Escape，都会把它关掉，焦点回到刚才的按钮。</p>
      </Dialog>
    </>
  );
}
