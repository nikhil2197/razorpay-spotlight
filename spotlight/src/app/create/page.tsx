"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Mic, ClipboardPaste, ArrowLeft } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { RequireMerchant } from "@/components/RequireMerchant";
import { Button } from "@/components/ui";
import { useSpotlight } from "@/lib/store";
import { parseTranscript } from "@/lib/parser";
import { TENNIS_SCRIPT, MMA_SCRIPT } from "@/data/seed";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    SpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.webkitSpeechRecognition ?? w.SpeechRecognition ?? null;
}

function CreateContent() {
  const { merchant, upsertOffering, offerings } = useSpotlight();
  const router = useRouter();
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [scriptOpen, setScriptOpen] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  if (!merchant) return null;

  const script = merchant.category === "sports_academy" ? TENNIS_SCRIPT : MMA_SCRIPT;
  const micSupported = !!getSpeechRecognition();

  function toggleRecording() {
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) return;

    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event: unknown) => {
      const e = event as { resultIndex: number; results: { transcript: string }[][] };
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        finalText += e.results[i][0].transcript;
      }
      setTranscript((prev) => (prev ? `${prev} ${finalText}` : finalText));
    };
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  }

  function pasteScript() {
    setTranscript(script);
  }

  function handleProcess() {
    if (!transcript.trim() || !merchant) return;
    const merchantId = merchant.merchantId;
    setProcessing(true);
    setTimeout(() => {
      const { offering, flags } = parseTranscript(transcript);
      const draftId = `spotlight-draft-${Date.now()}`;
      const draft = { ...offering, offeringId: draftId, merchantId, status: "draft" as const };
      upsertOffering(draft);
      sessionStorage.setItem(`flags_${draftId}`, JSON.stringify(flags));
      setProcessing(false);
      router.push(`/create/preview?id=${draftId}`);
    }, 1400);
  }

  const existingDrafts = offerings.filter((o) => o.merchantId === merchant.merchantId && o.status === "draft");

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-5 pt-4 pb-2 flex items-center gap-2">
        <button onClick={() => router.push("/home")} className="text-slate-500">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Create Spotlight</h1>
      </div>

      <div className="px-5">
        <button
          onClick={() => setScriptOpen((v) => !v)}
          className="w-full flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-amber-800"
        >
          Evaluator script
          <ChevronDown size={16} className={scriptOpen ? "rotate-180 transition-transform" : "transition-transform"} />
        </button>
        {scriptOpen && (
          <div className="bg-amber-50 border-x border-b border-amber-200 rounded-b-lg px-4 py-3 -mt-px">
            <p className="text-[12.5px] leading-relaxed text-amber-900 italic">&ldquo;{script}&rdquo;</p>
          </div>
        )}
      </div>

      <div className="px-5 mt-5 flex flex-col items-center">
        <button
          onClick={toggleRecording}
          disabled={!micSupported}
          className={`h-20 w-20 rounded-full flex items-center justify-center transition-colors ${
            recording ? "bg-red-500 animate-pulse" : "bg-blue-600"
          } disabled:bg-slate-300`}
        >
          <Mic size={30} className="text-white" />
        </button>
        <p className="text-xs text-slate-500 mt-2">
          {micSupported ? (recording ? "Listening… tap to stop" : "Tap to speak your offering") : "Mic not supported in this browser"}
        </p>

        <button
          onClick={pasteScript}
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full px-3 py-1.5"
        >
          <ClipboardPaste size={13} /> Paste preset transcript
        </button>
      </div>

      <div className="px-5 mt-5 flex-1">
        <p className="text-xs font-semibold text-slate-500 mb-1.5">Live transcript</p>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Your spoken offering will appear here — or type/paste it directly."
          className="w-full min-h-[140px] rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {existingDrafts.length > 0 && (
        <div className="px-5 mb-2">
          <button
            onClick={() => router.push(`/create/preview?id=${existingDrafts[existingDrafts.length - 1].offeringId}`)}
            className="text-xs text-blue-600 font-semibold"
          >
            Resume last draft →
          </button>
        </div>
      )}

      <div className="px-5 pb-6 pt-2 bg-[#f4f5f7] sticky bottom-0">
        <Button className="w-full" disabled={!transcript.trim() || processing} onClick={handleProcess}>
          {processing ? "Structuring schedule…" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <MobileShell>
      <RequireMerchant>
        <CreateContent />
      </RequireMerchant>
    </MobileShell>
  );
}
