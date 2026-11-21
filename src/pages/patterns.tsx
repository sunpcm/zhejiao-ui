import { useEffect, useId, useState, type FormEvent } from "react";

type Scenario = "normal" | "empty" | "loading" | "error";

type ChatMessage = {
  id: number;
  from: "me" | "echotalk";
  text: string;
};

const SCENARIOS: { id: Scenario; label: string }[] = [
  { id: "normal", label: "正常" },
  { id: "empty", label: "空状态" },
  { id: "loading", label: "加载中" },
  { id: "error", label: "错误" },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 1, from: "echotalk", text: "今晚的交接摘要已经整理好，要一起过一遍吗？" },
  { id: 2, from: "me", text: "先列出还没处理完的两条工单。" },
  { id: 3, from: "echotalk", text: "东门读卡器仍在人工核验；地库授时偏差等待复核。" },
];

export function PatternsPage() {
  const scenarioId = useId();
  const chatInputId = useId();
  const titleId = useId();
  const promptId = useId();
  const [scenario, setScenario] = useState<Scenario>("normal");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [chatText, setChatText] = useState("");
  const [title, setTitle] = useState("夜班交接说明");
  const [prompt, setPrompt] = useState("把未结工单整理成三段：现象、已做、下一步。");
  const [draft, setDraft] = useState(
    "待处理：东门读卡器无心跳，已改人工核验。下一步：白天检查控制器供电。",
  );
  const [formNote, setFormNote] = useState("");

  useEffect(() => {
    document.title = "产品样张 · 折角界面实验室";
  }, []);

  function retryLocalScenario() {
    setScenario("normal");
    setFormNote("");
  }

  function submitChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = chatText.trim();
    if (!text) {
      setFormNote("先写一句要发给本地样例的内容。");
      return;
    }
    setMessages((current) => [
      ...current,
      { id: current.length + 1, from: "me", text },
      {
        id: current.length + 2,
        from: "echotalk",
        text: "这是固定样例回应。",
      },
    ]);
    setChatText("");
    if (scenario === "empty") setScenario("normal");
    setFormNote("本地消息已加入对话。");
  }

  function createLocalDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !prompt.trim()) {
      setFormNote("标题和创作要求都写一点，才能生成本地样例。");
      return;
    }
    setDraft(
      `《${title.trim()}》\n\n${prompt.trim()}\n\n这是一份本地固定样例，用来检查标题、正文、状态和操作层级。`,
    );
    if (scenario === "empty") setScenario("normal");
    setFormNote("已生成本地草稿；刷新页面会恢复样例数据。");
  }

  const blocked = scenario === "loading" || scenario === "error";

  return (
    <>
      <header className="page-head pattern-head">
        <div>
          <p className="kicker num">产品样张 · LOCAL ONLY</p>
          <h1>把同一套基础放进真实产品结构</h1>
          <p className="lede">
            这里并排检查对话与创作工作区。主题、明暗和版面仍由页眉控制；两块样张共用 token、状态和控件规则。
          </p>
        </div>
        <div className="field pattern-scenario">
          <label htmlFor={scenarioId}>场景状态</label>
          <select
            id={scenarioId}
            value={scenario}
            onChange={(event) => {
              const next = event.target.value as Scenario;
              setScenario(next);
              setFormNote("");
            }}
          >
            {SCENARIOS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <p className="notice" role="note">
        <strong>本地演示：</strong>两块样张都使用固定样例数据。
      </p>

      <div className="pattern-grid" data-scenario={scenario}>
        <section className="sample panel" aria-labelledby="echotalk-heading">
          <header className="sample-head">
            <div>
              <p className="sample-kicker">EchoTalk · 对话</p>
              <h2 id="echotalk-heading">夜班交接助手</h2>
            </div>
            <span className="sample-mark">本地状态</span>
          </header>

          {scenario === "empty" ? (
            <div className="sample-state" role="status">
              <p className="sample-state-title">还没有对话</p>
              <p>从一句具体的问题开始，例如“今天还有哪些工单没交接？”</p>
            </div>
          ) : null}

          {scenario === "loading" ? (
            <div className="sample-state" role="status" aria-live="polite">
              <p className="sample-state-title">正在加载历史对话</p>
              <span className="skeleton" />
              <span className="skeleton skeleton-short" />
            </div>
          ) : null}

          {scenario === "error" ? (
            <div className="sample-state sample-state-error" role="alert">
              <p className="sample-state-title">本地样例未能载入</p>
              <p>重试后回到固定样例。</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => retryLocalScenario()}
              >
                重试本地样例
              </button>
            </div>
          ) : null}

          {scenario === "normal" || scenario === "empty" ? (
            <div className="chat" aria-label="本地对话样例">
              {messages.length > 0 && scenario === "normal" ? (
                <ol className="message-list">
                  {messages.map((message) => (
                    <li key={message.id} data-from={message.from}>
                      <span className="message-author">
                        {message.from === "me" ? "我" : "EchoTalk"}
                      </span>
                      <p>{message.text}</p>
                    </li>
                  ))}
                </ol>
              ) : null}
              <form className="chat-form" onSubmit={submitChat}>
                <label htmlFor={chatInputId}>输入消息</label>
                <textarea
                  id={chatInputId}
                  rows={3}
                  value={chatText}
                  placeholder="例如：列出还没关闭的紧急工单"
                  onChange={(event) => setChatText(event.target.value)}
                />
                <div className="sample-actions">
                  <button type="submit" className="btn btn-primary">
                    发送本地消息
                  </button>
                  <span className="sample-help">固定样例回应</span>
                </div>
              </form>
            </div>
          ) : (
            <form className="chat-form is-blocked" aria-label="不可发送的对话控件">
              <label htmlFor={`${chatInputId}-blocked`}>输入消息</label>
              <textarea
                id={`${chatInputId}-blocked`}
                rows={3}
                value={chatText}
                disabled={blocked}
                placeholder={scenario === "loading" ? "等待本地样例载入" : "先恢复本地样例"}
                onChange={(event) => setChatText(event.target.value)}
              />
              <button type="button" className="btn btn-primary" disabled>
                发送本地消息
              </button>
            </form>
          )}
        </section>

        <section className="sample panel" aria-labelledby="nexty-heading">
          <header className="sample-head">
            <div>
              <p className="sample-kicker">Nexty · 创作工作区</p>
              <h2 id="nexty-heading">交接说明草稿</h2>
            </div>
            <span className="sample-mark">本地草稿</span>
          </header>

          {scenario === "empty" ? (
            <div className="sample-state" role="status">
              <p className="sample-state-title">还没有草稿</p>
              <p>标题和创作要求留在这里，确认后再生成一份本地固定样例。</p>
            </div>
          ) : null}

          {scenario === "loading" ? (
            <div className="sample-state" role="status" aria-live="polite">
              <p className="sample-state-title">正在生成结构</p>
              <span className="skeleton" />
              <span className="skeleton" />
              <span className="skeleton skeleton-short" />
            </div>
          ) : null}

          {scenario === "error" ? (
            <div className="sample-state sample-state-error" role="alert">
              <p className="sample-state-title">本地草稿没有载入</p>
              <p>草稿内容仍在，重试会恢复预览。</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => retryLocalScenario()}
              >
                重试本地样例
              </button>
            </div>
          ) : null}

          <div className="creation" aria-label="本地创作工作区样例">
            <form className="creation-form" onSubmit={createLocalDraft}>
              <div className="field">
                <label htmlFor={titleId}>草稿标题</label>
                <input
                  id={titleId}
                  value={title}
                  disabled={blocked}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor={promptId}>创作要求</label>
                <textarea
                  id={promptId}
                  rows={3}
                  value={prompt}
                  disabled={blocked}
                  onChange={(event) => setPrompt(event.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={blocked}>
                生成本地草稿
              </button>
            </form>
            <div className="draft-preview" aria-live="polite">
              <p className="sample-kicker">草稿预览</p>
              {scenario === "normal" ? <pre>{draft}</pre> : null}
              {scenario === "empty" ? <p>生成后会在这里显示固定样例。</p> : null}
              {scenario === "loading" ? <span className="skeleton" /> : null}
              {scenario === "error" ? <p>预览区正在等待恢复动作。</p> : null}
            </div>
          </div>
        </section>
      </div>

      <p className="sample-feedback" role="status">
        {formNote}
      </p>
    </>
  );
}
