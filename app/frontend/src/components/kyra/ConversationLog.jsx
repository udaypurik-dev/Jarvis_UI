import { useEffect, useRef, useState } from "react";
import { Terminal, Send, User } from "lucide-react";

const INITIAL = [
  { role: "system", text: "J.A.R.V.I.S OS booted · Session 0x9F2E · Voice interface engaged", ts: currTs() },
  { role: "agent", text: "Good day, sir. All systems nominal. Grant microphone and location access to unlock full functionality.", ts: currTs() },
];

export default function ConversationLog({ transcript, pendingReply, onSend, agentState }) {
  const [log, setLog] = useState(INITIAL);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const lastTranscript = useRef("");
  const lastReplyId = useRef(null);

  useEffect(() => {
    if (transcript && transcript !== lastTranscript.current) {
      lastTranscript.current = transcript;
      setLog((L) => [...L, { role: "user", text: transcript, ts: currTs() }]);
    }
  }, [transcript]);

  useEffect(() => {
    if (pendingReply && pendingReply.id !== lastReplyId.current) {
      lastReplyId.current = pendingReply.id;
      setLog((L) => [...L, { role: "agent", text: pendingReply.text, ts: currTs() }]);
    }
  }, [pendingReply]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [log, agentState]);

  const submit = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    onSend?.(input.trim());
    setInput("");
  };

  return (
    <div className="hud-panel p-4 relative flex flex-col h-full min-h-[520px]" data-testid="conversation-log">
      <span className="corner corner-tl" />
      <span className="corner corner-tr" />
      <span className="corner corner-bl" />
      <span className="corner corner-br" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[var(--kyra-red)]" />
          <h3 className="font-hud text-xs tracking-[0.35em] uppercase text-zinc-300">Comm Log</h3>
        </div>
        <span className="font-mono text-[0.6rem] tracking-widest text-zinc-500">SESSION 0x9F2E</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto hud-scroll pr-2 space-y-3 font-mono text-[0.72rem]">
        {log.map((msg, i) => (
          <LogLine key={i} msg={msg} />
        ))}
        {agentState === "thinking" && (
          <div className="text-[var(--kyra-red)] flex items-center gap-1 tracking-widest uppercase text-[0.62rem]">
            <span className="font-hud">J.A.R.V.I.S</span>
            <span className="blink">▎▎▎</span>
          </div>
        )}
        {agentState === "speaking" && (
          <div className="text-[var(--kyra-red)] flex items-center gap-1 tracking-widest uppercase text-[0.62rem]">
            <span className="font-hud">J.A.R.V.I.S</span>
            <span>◈ speaking</span>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="mt-3 border border-[var(--kyra-border)] px-2 py-1.5 flex items-center gap-2 focus-within:border-[var(--kyra-border-strong)] transition-colors">
        <span className="font-hud text-[0.6rem] tracking-[0.3em] uppercase text-[var(--kyra-red)]">CMD ▸</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type or say a command..."
          className="flex-1 bg-transparent outline-none font-mono text-[0.75rem] text-white placeholder:text-zinc-600"
          data-testid="command-input"
        />
        <button type="submit" className="hud-btn !px-2 !py-1" data-testid="command-send">
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}

function LogLine({ msg }) {
  const isUser = msg.role === "user";
  const isSys = msg.role === "system";
  const tag = isSys ? "SYS" : isUser ? "USER" : "J.A.R.V.I.S";
  const color = isSys ? "text-zinc-500" : isUser ? "text-white" : "text-[var(--kyra-red)]";
  return (
    <div className="border-l-2 pl-2 py-0.5" style={{ borderColor: isUser ? "rgba(255,255,255,0.35)" : isSys ? "rgba(120,120,120,0.35)" : "var(--kyra-red)" }}>
      <div className="flex items-center gap-2 text-[0.55rem] tracking-widest uppercase text-zinc-500 font-hud">
        {isUser ? <User size={9} /> : null}
        <span className={color}>{tag}</span>
        <span>·</span>
        <span>{msg.ts}</span>
      </div>
      <div className={`mt-0.5 ${isSys ? "text-zinc-500" : "text-zinc-200"}`}>{msg.text}</div>
    </div>
  );
}

function currTs() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}
