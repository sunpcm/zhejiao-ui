import { useEffect, useId, useState } from "react";
import { ACTION_LABEL, PRIORITIES, STATUS_LABEL, STATUS_ORDER } from "../data";
import { useStore } from "../store";
import { Dialog, Tag } from "../ui";
import type { Priority, Status, Ticket } from "../types";

function nextStatus(status: Status): Status | null {
  const index = STATUS_ORDER.indexOf(status);
  if (index < 0 || index >= STATUS_ORDER.length - 1) return null;
  return STATUS_ORDER[index + 1];
}

function prevStatus(status: Status): Status | null {
  const index = STATUS_ORDER.indexOf(status);
  if (index <= 0) return null;
  return STATUS_ORDER[index - 1];
}

export function BoardPage() {
  const {
    filtered,
    selectedId,
    query,
    priority,
    select,
    setQuery,
    setPriority,
    clearFilters,
    setStatus,
    pushToast,
  } = useStore();
  const [confirming, setConfirming] = useState(false);
  const searchId = useId();
  const priorityId = useId();
  const selected = filtered.find((ticket) => ticket.id === selectedId) ?? null;
  const selectedAnywhere = selectedId;

  useEffect(() => {
    document.title = "工作台 · 工单台";
  }, []);

  function move(ticket: Ticket, status: Status) {
    const changed = setStatus(ticket.id, status);
    if (!changed) return;
    pushToast(`已把 ${ticket.id} 改为${STATUS_LABEL[status]}。`);
  }

  function requestAdvance(ticket: Ticket) {
    if (ticket.status === "review") {
      setConfirming(true);
      return;
    }
    const status = nextStatus(ticket.status);
    if (status) move(ticket, status);
  }

  return (
    <>
      <header className="page-head">
        <h1>工作台</h1>
        <p className="lede">
          按状态分列。点一条工单，再改它的状态。筛选和选中会留着，切换主题不会清掉。
        </p>
      </header>

      <div className="filters">
        <div className="field">
          <label htmlFor={searchId}>搜索</label>
          <input
            id={searchId}
            value={query}
            placeholder="编号、标题、位置或受理人"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={priorityId}>优先级</label>
          <select
            id={priorityId}
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority | "全部")}
          >
            <option value="全部">全部</option>
            {PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn btn-quiet" onClick={clearFilters}>
          清除筛选
        </button>
        <p className="count">
          <span className="num">{filtered.length}</span> 条
        </p>
      </div>

      <div className="work">
        <div className="board">
          {STATUS_ORDER.map((status) => {
            const items = filtered.filter((ticket) => ticket.status === status);
            return (
              <section key={status} className="column" aria-labelledby={`col-${status}`}>
                <h2 id={`col-${status}`}>
                  {STATUS_LABEL[status]}
                  <span className="num">{items.length}</span>
                </h2>
                {items.length === 0 ? (
                  <p className="empty">这一列还没有工单。</p>
                ) : (
                  <div className="column-list">
                    {items.map((ticket) => (
                      <button
                        key={ticket.id}
                        type="button"
                        className={ticket.id === selectedAnywhere ? "ticket is-selected" : "ticket"}
                        aria-pressed={ticket.id === selectedAnywhere}
                        onClick={() => select(ticket.id)}
                      >
                        <span className="ticket-id num">{ticket.id}</span>
                        <span className="ticket-title">{ticket.title}</span>
                        <span className="ticket-meta">
                          {ticket.place} · {ticket.owner}
                        </span>
                        <Tag priority={ticket.priority}>{ticket.priority}</Tag>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <aside className="detail" aria-live="polite">
          {selected ? (
            <>
              <p className="detail-kicker num">{selected.id}</p>
              <h2>{selected.title}</h2>
              <p className="detail-summary">{selected.summary}</p>
              <dl className="meta">
                <div>
                  <dt>位置</dt>
                  <dd>{selected.place}</dd>
                </div>
                <div>
                  <dt>受理人</dt>
                  <dd>{selected.owner}</dd>
                </div>
                <div>
                  <dt>优先级</dt>
                  <dd>
                    <Tag priority={selected.priority}>{selected.priority}</Tag>
                  </dd>
                </div>
                <div>
                  <dt>状态</dt>
                  <dd>
                    <Tag status={selected.status}>{STATUS_LABEL[selected.status]}</Tag>
                  </dd>
                </div>
                <div>
                  <dt>更新</dt>
                  <dd>{selected.updated}</dd>
                </div>
              </dl>
              {selected.status === "done" ? (
                <p className="section-note">这条已经关闭，记录仍留在台账里。</p>
              ) : null}
              <div className="row">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={selected.status === "done"}
                  onClick={() => requestAdvance(selected)}
                >
                  {ACTION_LABEL[selected.status]}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={selected.status === "todo"}
                  onClick={() => {
                    const status = prevStatus(selected.status);
                    if (status) move(selected, status);
                  }}
                >
                  退回
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>处理记录</h2>
              <p className="section-note">
                {selectedId && !selected
                  ? "这条工单被筛选藏起来了。清除筛选就能看到它。"
                  : "选一条工单，再改它的状态。"}
              </p>
            </>
          )}
        </aside>
      </div>

      <Dialog
        open={confirming && selected?.status === "review"}
        title="确认结案？"
        closeLabel="再看看"
        primaryLabel="确认结案"
        onClose={() => setConfirming(false)}
        onPrimary={() => {
          if (!selected) return;
          move(selected, "done");
          setConfirming(false);
        }}
      >
        <p>
          要把 <span className="num">{selected?.id}</span> {selected?.title} 标成已关闭吗？记录还留在台账里，只是不再当作未完成。
        </p>
      </Dialog>
    </>
  );
}
