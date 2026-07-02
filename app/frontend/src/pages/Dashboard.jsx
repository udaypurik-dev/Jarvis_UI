import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/kyra/TopBar";
import DottedOrb from "@/components/kyra/DottedOrb";
import SystemStats from "@/components/kyra/SystemStats";
import ConversationLog from "@/components/kyra/ConversationLog";
import QuickCommands from "@/components/kyra/QuickCommands";
import VoiceWaveform from "@/components/kyra/VoiceWaveform";
import DiagnosticsStrip from "@/components/kyra/DiagnosticsStrip";
import BootOverlay from "@/components/kyra/BootOverlay";
import { getLocationAndWeather, getSpeechRecognition, speak, cancelSpeak, jarvisReply } from "@/lib/jarvis";

export default function Dashboard() {
  const [booting, setBooting] = useState(true);
  const [agentState, setAgentState] = useState("idle"); // idle | listening | thinking | speaking
  const [muted, setMuted] = useState(false);
  const [weather, setWeather] = useState(null);
  const [locError, setLocError] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [pendingReply, setPendingReply] = useState(null); // {text}
  const recRef = useRef(null);
  const restartQueued = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1600);
    return () => clearTimeout(t);
  }, []);

  // Warm up the speech synthesis voices list
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  const fetchWeather = useCallback(async () => {
    try {
      const w = await getLocationAndWeather();
      setWeather(w);
      setLocError(null);
    } catch (e) {
      setLocError(e?.message || "Location denied");
    }
  }, []);

  // Try location once at load (user must grant permission)
  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const finalizeQuery = useCallback((text) => {
    if (!text?.trim()) {
      setAgentState("idle");
      return;
    }
    setTranscript(text.trim());
    setAgentState("thinking");
    // Slight delay to simulate processing
    setTimeout(() => {
      const reply = jarvisReply(text, { weather });
      setPendingReply({ text: reply, id: Date.now() });
      if (!muted) {
        setAgentState("speaking");
        speak(reply, {
          onEnd: () => setAgentState("idle"),
        });
      } else {
        setAgentState("idle");
      }
    }, 550);
  }, [muted, weather]);

  const startListening = useCallback(() => {
    const rec = getSpeechRecognition();
    if (!rec) {
      // No speech recognition — fallback: just simulate
      setAgentState("listening");
      setTimeout(() => finalizeQuery("Speech recognition not supported in this browser. Try Chrome."), 900);
      return;
    }
    recRef.current = rec;
    let finalText = "";
    rec.onresult = (e) => {
      let interimTxt = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interimTxt += r[0].transcript;
      }
      setInterim(interimTxt);
    };
    rec.onerror = (e) => {
      setInterim("");
      if (e.error === "not-allowed") {
        setPendingReply({ text: "Microphone permission was denied. Please allow it in your browser settings.", id: Date.now() });
      }
      setAgentState("idle");
    };
    rec.onend = () => {
      setInterim("");
      if (restartQueued.current) {
        restartQueued.current = false;
        return;
      }
      finalizeQuery(finalText);
    };
    try { rec.start(); setAgentState("listening"); cancelSpeak(); } catch (_) { /* ignore double-start */ }
  }, [finalizeQuery]);

  const stopListening = useCallback(() => {
    try { recRef.current?.stop(); } catch (_) { /* noop */ }
  }, []);

  const handleMicToggle = useCallback(() => {
    if (agentState === "listening") {
      stopListening();
    } else if (agentState === "speaking") {
      cancelSpeak();
      setAgentState("idle");
    } else {
      startListening();
    }
  }, [agentState, startListening, stopListening]);

  const handleTypedCommand = useCallback((text) => {
    finalizeQuery(text);
  }, [finalizeQuery]);

  const handleQuickCommand = useCallback((cmd) => {
    const phraseMap = {
      scan: "Run a full environmental scan",
      music: "Play some workshop music",
      lock: "Engage lockdown protocol",
      analyze: "Run a deep analysis",
      search: "Do a global recon sweep",
      deploy: "Deploy the Mark VII suit",
      call: "Call Rhodes",
      sleep: "Enter standby",
    };
    finalizeQuery(phraseMap[cmd] || cmd);
  }, [finalizeQuery]);

  return (
    <div className="kyra-grain kyra-grid-bg min-h-screen w-full text-zinc-100 relative overflow-x-hidden" data-testid="jarvis-dashboard">
      {booting && <BootOverlay />}

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-4">
        <TopBar agentState={agentState} weather={weather} locError={locError} onRetryLocation={fetchWeather} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-12 gap-4 lg:gap-5 mt-4"
        >
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            <SystemStats weather={weather} />
          </div>

          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
            <div className="hud-panel p-6 relative flex flex-col items-center justify-center min-h-[520px]">
              <span className="corner corner-tl" />
              <span className="corner corner-tr" />
              <span className="corner corner-bl" />
              <span className="corner corner-br" />
              <div className="scanline" />

              <div className="w-full flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 ${agentState !== "idle" ? "red-pulse bg-[var(--kyra-red)]" : "bg-zinc-600"}`} />
                  <span className="font-hud text-[0.7rem] tracking-[0.35em] uppercase text-zinc-400">
                    Agent // J.A.R.V.I.S
                  </span>
                </div>
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-zinc-500">
                  state <span className="text-[var(--kyra-red)]">{agentState}</span>
                </span>
              </div>

              <DottedOrb state={agentState} />

              {/* Live transcript */}
              <div className="mt-3 min-h-[26px] font-mono text-[0.72rem] tracking-wide text-center max-w-xl">
                {agentState === "listening" && (
                  <span className="text-zinc-300">
                    <span className="text-[var(--kyra-red)]">▸</span> {interim || <span className="text-zinc-500">listening...</span>}
                  </span>
                )}
                {agentState === "thinking" && transcript && (
                  <span className="text-zinc-400"><span className="text-[var(--kyra-red)]">▸</span> {transcript}</span>
                )}
                {agentState === "speaking" && pendingReply && (
                  <span className="text-[var(--kyra-red)]">◈ {pendingReply.text}</span>
                )}
              </div>

              <div className="w-full mt-4">
                <VoiceWaveform
                  active={agentState !== "idle"}
                  muted={muted}
                  onMicToggle={handleMicToggle}
                  onMute={() => setMuted((m) => !m)}
                  state={agentState}
                />
              </div>
            </div>

            <QuickCommands onFire={handleQuickCommand} />
          </div>

          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            <ConversationLog
              transcript={transcript}
              pendingReply={pendingReply}
              onSend={handleTypedCommand}
              agentState={agentState}
            />
          </div>
        </motion.div>

        <DiagnosticsStrip weather={weather} />

        <footer className="mt-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[0.65rem] tracking-[0.3em] uppercase text-zinc-500 font-hud gap-2">
          <span>J.A.R.V.I.S OS · v3.14.2 · Build 0x9F2E</span>
          <span className="text-zinc-600">© Stark-class Intelligence // Authorised User: KYRA</span>
        </footer>
      </div>
    </div>
  );
}
