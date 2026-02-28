"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Play,
  Square,
  Minus,
  Plus,
  Volume2,
  VolumeX,
  Hand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMetronome, type TimeSignature } from "@/hooks/use-metronome";

const TIME_SIGNATURES: { label: string; value: TimeSignature }[] = [
  { label: "2/4", value: { beats: 2, subdivision: 4 } },
  { label: "3/4", value: { beats: 3, subdivision: 4 } },
  { label: "4/4", value: { beats: 4, subdivision: 4 } },
  { label: "5/4", value: { beats: 5, subdivision: 4 } },
  { label: "6/8", value: { beats: 6, subdivision: 8 } },
  { label: "7/8", value: { beats: 7, subdivision: 8 } },
  { label: "3/8", value: { beats: 3, subdivision: 8 } },
  { label: "9/8", value: { beats: 9, subdivision: 8 } },
  { label: "12/8", value: { beats: 12, subdivision: 8 } },
];

const TEMPO_MARKINGS = [
  { min: 20, max: 39, label: "Grave" },
  { min: 40, max: 54, label: "Largo" },
  { min: 55, max: 65, label: "Lento" },
  { min: 66, max: 75, label: "Adagio" },
  { min: 76, max: 107, label: "Andante" },
  { min: 108, max: 119, label: "Moderato" },
  { min: 120, max: 155, label: "Allegro" },
  { min: 156, max: 175, label: "Vivace" },
  { min: 176, max: 199, label: "Presto" },
  { min: 200, max: 300, label: "Prestissimo" },
];

function getTempoMarking(bpm: number): string {
  return (
    TEMPO_MARKINGS.find((t) => bpm >= t.min && bpm <= t.max)?.label ?? ""
  );
}

export function Metronome() {
  const [state, actions] = useMetronome();
  const { isPlaying, bpm, currentBeat, timeSignature, volume, accentFirst } =
    state;

  const [bpmInput, setBpmInput] = useState(String(bpm));
  const bpmInputRef = useRef<HTMLInputElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Sync bpmInput with bpm from external changes (slider, tap)
  useEffect(() => {
    setBpmInput(String(bpm));
  }, [bpm]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      switch (e.code) {
        case "Space":
          e.preventDefault();
          actions.toggle();
          break;
        case "KeyT":
          actions.tapTempo();
          break;
        case "ArrowUp":
          e.preventDefault();
          actions.setBpm(bpm + 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          actions.setBpm(bpm - 1);
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [actions, bpm]);

  const handleBpmInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBpmInput(e.target.value);
    },
    []
  );

  const handleBpmInputBlur = useCallback(() => {
    const parsed = parseInt(bpmInput, 10);
    if (!isNaN(parsed)) {
      actions.setBpm(parsed);
    }
    setBpmInput(String(bpm));
  }, [bpmInput, bpm, actions]);

  const handleBpmInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.currentTarget.blur();
      }
    },
    []
  );

  const handleTimeSignatureChange = useCallback(
    (val: string) => {
      const ts = TIME_SIGNATURES.find((t) => t.label === val);
      if (ts) {
        actions.setTimeSignature(ts.value);
      }
    },
    [actions]
  );

  const tempoMarking = getTempoMarking(bpm);
  const tsLabel = `${timeSignature.beats}/${timeSignature.subdivision}`;

  // Generate beat dot positions in a circle
  const beatDots = Array.from({ length: timeSignature.beats }, (_, i) => {
    const angle =
      (i / timeSignature.beats) * Math.PI * 2 - Math.PI / 2; // Start from top
    const radius = 44; // percentage
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y, index: i };
  });

  return (
    <div className="relative flex flex-col items-center justify-center gap-6 sm:gap-8 w-full max-w-md mx-auto px-4">
      {/* Tempo marking */}
      <div className="text-center">
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-muted-foreground font-mono">
          {tempoMarking}
        </p>
      </div>

      {/* Central beat visualizer */}
      <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80">
        {/* Background ring */}
        <div className="absolute inset-3 sm:inset-4 rounded-full border border-border/50" />
        <div className="absolute inset-6 sm:inset-8 rounded-full border border-border/30" />

        {/* Expanding ring animation on beat */}
        {currentBeat >= 0 && (
          <div
            ref={ringRef}
            key={`ring-${currentBeat}-${Date.now()}`}
            className="absolute inset-6 sm:inset-8 rounded-full border-2 border-amber animate-ring-expand"
          />
        )}

        {/* Beat dots around the circle */}
        {beatDots.map(({ x, y, index }) => {
          const isActive = currentBeat === index;
          const isAccentBeat = accentFirst && index === 0;
          return (
            <div
              key={index}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div
                className={`
                  rounded-full transition-all duration-75
                  ${
                    isActive
                      ? isAccentBeat
                        ? "w-5 h-5 sm:w-6 sm:h-6 bg-amber shadow-[0_0_20px_var(--amber-glow)] animate-beat"
                        : "w-4 h-4 sm:w-5 sm:h-5 bg-amber shadow-[0_0_12px_var(--amber-glow)] animate-beat"
                      : isAccentBeat
                        ? "w-3.5 h-3.5 sm:w-4 sm:h-4 bg-amber-dim/80 border border-amber-dim"
                        : "w-2.5 h-2.5 sm:w-3 sm:h-3 bg-muted-foreground/30 border border-muted-foreground/20"
                  }
                `}
              />
            </div>
          );
        })}

        {/* Central BPM display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <input
            ref={bpmInputRef}
            type="text"
            inputMode="numeric"
            value={bpmInput}
            onChange={handleBpmInputChange}
            onBlur={handleBpmInputBlur}
            onKeyDown={handleBpmInputKeyDown}
            className="w-28 sm:w-36 text-center bg-transparent font-mono text-5xl sm:text-7xl font-light tracking-tight text-foreground outline-none selection:bg-amber/20 caret-amber tabular-nums"
            aria-label="BPM"
          />
          <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-muted-foreground font-mono mt-0.5">
            bpm
          </span>
        </div>
      </div>

      {/* BPM Slider */}
      <div className="w-full flex items-center gap-3 px-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => actions.setBpm(bpm - 1)}
              className="text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Decrease BPM"
            >
              <Minus className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Decrease BPM</p>
          </TooltipContent>
        </Tooltip>

        <Slider
          value={[bpm]}
          onValueChange={([val]) => actions.setBpm(val)}
          min={20}
          max={300}
          step={1}
          className="flex-1"
          aria-label="BPM Slider"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => actions.setBpm(bpm + 1)}
              className="text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Increase BPM"
            >
              <Plus className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Increase BPM</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
        {/* Time Signature */}
        <Select value={tsLabel} onValueChange={handleTimeSignatureChange}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="w-[72px] sm:w-[80px] h-10 sm:h-11 font-mono text-sm bg-secondary border-border hover:bg-accent">
                <SelectValue />
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Time signature</p>
            </TooltipContent>
          </Tooltip>
          <SelectContent className="font-mono">
            {TIME_SIGNATURES.map((ts) => (
              <SelectItem key={ts.label} value={ts.label}>
                {ts.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Play/Stop Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={actions.toggle}
              className={`
                group relative flex items-center justify-center rounded-full transition-all duration-200
                w-16 h-16 sm:w-20 sm:h-20
                ${
                  isPlaying
                    ? "bg-amber text-background shadow-[0_0_30px_var(--amber-glow)] hover:shadow-[0_0_40px_var(--amber-glow)]"
                    : "bg-secondary text-foreground border border-border hover:bg-accent hover:border-amber/30 hover:shadow-[0_0_20px_var(--amber-glow)]"
                }
              `}
              aria-label={isPlaying ? "Stop" : "Start"}
            >
              {isPlaying ? (
                <Square className="size-5 sm:size-6 fill-current" />
              ) : (
                <Play className="size-5 sm:size-6 fill-current ml-0.5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{isPlaying ? "Stop" : "Start"} (Space)</p>
          </TooltipContent>
        </Tooltip>

        {/* Tap Tempo */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={actions.tapTempo}
              className="h-10 sm:h-11 px-3 sm:px-4 font-mono text-xs sm:text-sm tracking-wider bg-secondary border-border hover:bg-accent hover:border-amber/30"
              aria-label="Tap tempo"
            >
              <Hand className="size-3.5 sm:size-4 mr-1 sm:mr-1.5" />
              TAP
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Tap tempo (T)</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Bottom controls: volume + accent toggle */}
      <div className="flex items-center justify-between w-full gap-4 px-2">
        {/* Volume control */}
        <div className="flex items-center gap-2 flex-1 max-w-[180px]">
          <button
            onClick={() => actions.setVolume(volume > 0 ? 0 : 0.7)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={volume === 0 ? "Unmute" : "Mute"}
          >
            {volume === 0 ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </button>
          <Slider
            value={[volume]}
            onValueChange={([val]) => actions.setVolume(val)}
            min={0}
            max={1}
            step={0.01}
            className="flex-1"
            aria-label="Volume"
          />
        </div>

        {/* Accent toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => actions.setAccentFirst(!accentFirst)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono tracking-wider transition-all
                ${
                  accentFirst
                    ? "bg-amber/15 text-amber border border-amber/30"
                    : "text-muted-foreground border border-transparent hover:text-foreground hover:bg-secondary"
                }
              `}
              aria-label="Toggle accent on first beat"
            >
              <span className={`w-2 h-2 rounded-full ${accentFirst ? "bg-amber" : "bg-muted-foreground/40"}`} />
              ACCENT
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Accent first beat</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-[10px] sm:text-xs text-muted-foreground/50 font-mono tracking-wider text-center">
        SPACE play/stop &middot; T tap &middot; &uarr;&darr; adjust
      </div>
    </div>
  );
}
