import { useMemo, useState } from "react";

type ColumnId = "inbox" | "draft" | "deliver";

type Item = {
  id: string;
  column: ColumnId;
  title: string;
  source: string;
  note: string;
};

const columns: { id: ColumnId; title: string }[] = [
  { id: "inbox", title: "待整理" },
  { id: "draft", title: "成稿中" },
  { id: "deliver", title: "待交付" },
];

const initialItems: Item[] = [
  {
    id: "return-reason",
    column: "inbox",
    title: "退货原因改成必填",
    source: "需求走到交付",
    note: "旧单仍是选填。交付前要写明谁来回填，以及空值怎么处理。",
  },
  {
    id: "price-tag",
    column: "inbox",
    title: "东站临时柜价签差 3 元",
    source: "店铺巡检",
    note: "系统价 49，价签 52。先核对是不是昨晚的改价没有下发。",
  },
  {
    id: "pickup",
    column: "draft",
    title: "把门店自提写回需求",
    source: "会话记录",
    note: "顾客昨晚问过。承诺今天回写，不要只留在聊天里。",
  },
  {
    id: "size-chart",
    column: "draft",
    title: "尺码表和页面文案对同一版",
    source: "需求走到交付",
    note: "成稿里胸围多了一档。以尺寸表为准改文案。",
  },
  {
    id: "one-pager",
    column: "deliver",
    title: "巡检说明压成一页",
    source: "店铺巡检",
    note: "店长只看一页。逾期项放最上面，已关闭的不占正文。",
  },
];

function shift(column: ColumnId, direction: -1 | 1): ColumnId {
  const index = columns.findIndex((item) => item.id === column);
  const next = index + direction;
  if (next < 0 || next >= columns.length) return column;
  return columns[next].id;
}

export function Board() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const selected = items.find((item) => item.id === selectedId) ?? null;
  const needle = query.trim();
  const visible = useMemo(
    () =>
      items.filter(
        (item) => needle === "" || item.title.includes(needle) || item.source.includes(needle),
      ),
    [items, needle],
  );

  function move(direction: -1 | 1) {
    if (!selected) return;
    setItems((current) =>
      current.map((item) =>
        item.id === selected.id ? { ...item, column: shift(item.column, direction) } : item,
      ),
    );
  }

  const selectedIndex = selected ? columns.findIndex((column) => column.id === selected.column) : -1;

  return (
    <article>
      <h1 id="page-title" className="page-title" tabIndex={-1}>
        工作台
      </h1>
      <p className="lede">
        这是一个小工具的壳，用来看主题在密一点的界面里还站不站得住。一条需求从待整理走到待交付，停在哪一列要一眼能看出来。
      </p>

      <div className="toolbar">
        <label className="field-label" htmlFor="board-filter">
          筛选标题或来源
          <input
            id="board-filter"
            className="field"
            value={query}
            placeholder="例如 退货"
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <div className="board-layout">
        <div className="board-columns">
          {columns.map((column) => {
            const rows = visible.filter((item) => item.column === column.id);
            return (
              <section key={column.id} className="column" aria-labelledby={`col-${column.id}`}>
                <h2 id={`col-${column.id}`} className="column-head">
                  <span>{column.title}</span>
                  <span className="num">{rows.length}</span>
                </h2>
                {rows.length === 0 ? (
                  <p className="column-empty">这一列没有对得上的条目。</p>
                ) : (
                  rows.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="row-button"
                      aria-pressed={item.id === selectedId}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <span className="item-title">{item.title}</span>
                      <span className="item-source">{item.source}</span>
                    </button>
                  ))
                )}
              </section>
            );
          })}
        </div>

        <section className="detail" aria-labelledby="detail-title">
          {selected ? (
            <>
              <h2 id="detail-title" className="section-title">
                {selected.title}
              </h2>
              <p className="note">{selected.source}</p>
              <p className="prose">{selected.note}</p>
              <p className="note">
                现在在「{columns.find((column) => column.id === selected.column)?.title}」。
              </p>
              <div className="button-row">
                <button
                  type="button"
                  className="btn"
                  disabled={selectedIndex <= 0}
                  onClick={() => move(-1)}
                >
                  退回上一列
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={selectedIndex < 0 || selectedIndex >= columns.length - 1}
                  onClick={() => move(1)}
                >
                  移到下一列
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 id="detail-title" className="section-title">
                还没有选中
              </h2>
              <p className="prose">点一条需求，再决定它往哪一列走。</p>
            </>
          )}
        </section>
      </div>
    </article>
  );
}
