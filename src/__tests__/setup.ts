import "@testing-library/jest-dom/vitest";

// Mock ResizeObserver (not available in jsdom, required by Radix UI)
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal("ResizeObserver", MockResizeObserver);

// Mock pointer capture methods (not available in jsdom, required by Radix UI Slider)
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = vi.fn();
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = vi.fn();
}

// Mock Web Audio API (not available in jsdom)
function createMockGainNode() {
  return {
    gain: {
      value: 1,
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
}

function createMockOscillatorNode() {
  return {
    type: "sine" as OscillatorType,
    frequency: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
}

class MockAudioContext {
  currentTime = 0;
  state: AudioContextState = "running";
  destination = {};
  createGain = vi.fn(() => createMockGainNode());
  createOscillator = vi.fn(() => createMockOscillatorNode());
  resume = vi.fn().mockResolvedValue(undefined);
  close = vi.fn().mockResolvedValue(undefined);
}

vi.stubGlobal("AudioContext", MockAudioContext);
