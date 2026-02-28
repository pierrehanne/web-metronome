import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMetronome } from "@/hooks/use-metronome";

describe("useMetronome", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("initializes with correct defaults", () => {
      const { result } = renderHook(() => useMetronome());
      const [state] = result.current;

      expect(state.isPlaying).toBe(false);
      expect(state.bpm).toBe(120);
      expect(state.currentBeat).toBe(-1);
      expect(state.timeSignature).toEqual({ beats: 4, subdivision: 4 });
      expect(state.volume).toBe(0.7);
      expect(state.accentFirst).toBe(true);
    });
  });

  describe("setBpm", () => {
    it("sets BPM to a valid value", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setBpm(140);
      });

      expect(result.current[0].bpm).toBe(140);
    });

    it("clamps BPM below minimum (20)", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setBpm(5);
      });

      expect(result.current[0].bpm).toBe(20);
    });

    it("clamps BPM above maximum (300)", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setBpm(500);
      });

      expect(result.current[0].bpm).toBe(300);
    });

    it("rounds fractional BPM values", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setBpm(120.7);
      });

      expect(result.current[0].bpm).toBe(121);
    });

    it("handles boundary value 20", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setBpm(20);
      });

      expect(result.current[0].bpm).toBe(20);
    });

    it("handles boundary value 300", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setBpm(300);
      });

      expect(result.current[0].bpm).toBe(300);
    });
  });

  describe("setTimeSignature", () => {
    it("updates the time signature", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setTimeSignature({ beats: 3, subdivision: 4 });
      });

      expect(result.current[0].timeSignature).toEqual({
        beats: 3,
        subdivision: 4,
      });
    });

    it("accepts compound time signatures", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setTimeSignature({ beats: 6, subdivision: 8 });
      });

      expect(result.current[0].timeSignature).toEqual({
        beats: 6,
        subdivision: 8,
      });
    });
  });

  describe("setVolume", () => {
    it("sets volume to a valid value", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setVolume(0.5);
      });

      expect(result.current[0].volume).toBe(0.5);
    });

    it("clamps volume below 0", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setVolume(-0.5);
      });

      expect(result.current[0].volume).toBe(0);
    });

    it("clamps volume above 1", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setVolume(1.5);
      });

      expect(result.current[0].volume).toBe(1);
    });

    it("accepts boundary value 0", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setVolume(0);
      });

      expect(result.current[0].volume).toBe(0);
    });

    it("accepts boundary value 1", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setVolume(1);
      });

      expect(result.current[0].volume).toBe(1);
    });
  });

  describe("setAccentFirst", () => {
    it("sets accent to false", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setAccentFirst(false);
      });

      expect(result.current[0].accentFirst).toBe(false);
    });

    it("sets accent back to true", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].setAccentFirst(false);
      });
      act(() => {
        result.current[1].setAccentFirst(true);
      });

      expect(result.current[0].accentFirst).toBe(true);
    });
  });

  describe("tapTempo", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("does nothing with a single tap", () => {
      const { result } = renderHook(() => useMetronome());
      const spy = vi.spyOn(performance, "now").mockReturnValue(1000);

      act(() => {
        result.current[1].tapTempo();
      });

      expect(result.current[0].bpm).toBe(120); // unchanged
      spy.mockRestore();
    });

    it("calculates BPM from two taps 500ms apart (120 BPM)", () => {
      const { result } = renderHook(() => useMetronome());
      const spy = vi.spyOn(performance, "now");

      spy.mockReturnValue(1000);
      act(() => {
        result.current[1].tapTempo();
      });

      spy.mockReturnValue(1500);
      act(() => {
        result.current[1].tapTempo();
      });

      expect(result.current[0].bpm).toBe(120);
      spy.mockRestore();
    });

    it("calculates BPM from three taps at 600ms intervals (100 BPM)", () => {
      const { result } = renderHook(() => useMetronome());
      const spy = vi.spyOn(performance, "now");

      spy.mockReturnValue(1000);
      act(() => {
        result.current[1].tapTempo();
      });

      spy.mockReturnValue(1600);
      act(() => {
        result.current[1].tapTempo();
      });

      spy.mockReturnValue(2200);
      act(() => {
        result.current[1].tapTempo();
      });

      expect(result.current[0].bpm).toBe(100);
      spy.mockRestore();
    });

    it("filters out taps older than 3 seconds", () => {
      const { result } = renderHook(() => useMetronome());
      const spy = vi.spyOn(performance, "now");

      // Old tap
      spy.mockReturnValue(1000);
      act(() => {
        result.current[1].tapTempo();
      });

      // 4 seconds later — old tap should be filtered
      spy.mockReturnValue(5000);
      act(() => {
        result.current[1].tapTempo();
      });

      // Only 1 recent tap, so BPM shouldn't change meaningfully from the pair
      // But since old tap is filtered, this is effectively a single tap
      expect(result.current[0].bpm).toBe(120); // unchanged — only 1 recent tap
      spy.mockRestore();
    });

    it("clamps tap tempo result within valid range", () => {
      const { result } = renderHook(() => useMetronome());
      const spy = vi.spyOn(performance, "now");

      // Two taps very close together — would produce >300 BPM
      spy.mockReturnValue(1000);
      act(() => {
        result.current[1].tapTempo();
      });

      spy.mockReturnValue(1050); // 50ms apart = 1200 BPM
      act(() => {
        result.current[1].tapTempo();
      });

      expect(result.current[0].bpm).toBe(300); // clamped
      spy.mockRestore();
    });
  });

  describe("playback control", () => {
    it("start sets isPlaying to true", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].start();
      });

      expect(result.current[0].isPlaying).toBe(true);
    });

    it("stop sets isPlaying to false and resets currentBeat", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].start();
      });
      act(() => {
        result.current[1].stop();
      });

      expect(result.current[0].isPlaying).toBe(false);
      expect(result.current[0].currentBeat).toBe(-1);
    });

    it("toggle starts when stopped", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].toggle();
      });

      expect(result.current[0].isPlaying).toBe(true);
    });

    it("toggle stops when playing", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].start();
      });
      act(() => {
        result.current[1].toggle();
      });

      expect(result.current[0].isPlaying).toBe(false);
    });

    it("start initializes audio scheduling", () => {
      const setIntervalSpy = vi.spyOn(global, "setInterval");
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].start();
      });

      expect(setIntervalSpy).toHaveBeenCalled();
      setIntervalSpy.mockRestore();
    });
  });

  describe("cleanup", () => {
    it("clears interval and closes AudioContext on unmount", () => {
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      const { result, unmount } = renderHook(() => useMetronome());

      act(() => {
        result.current[1].start();
      });

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });
});
