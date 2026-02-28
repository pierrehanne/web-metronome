import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Metronome } from "@/components/metronome";

function renderMetronome() {
  return render(
    <TooltipProvider>
      <Metronome />
    </TooltipProvider>
  );
}

describe("Metronome component", () => {
  describe("rendering", () => {
    it("renders the BPM input with default value 120", () => {
      renderMetronome();
      const input = screen.getByRole("textbox", { name: /bpm/i });
      expect(input).toHaveValue("120");
    });

    it("renders the play/start button", () => {
      renderMetronome();
      expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
    });

    it("renders the tap tempo button", () => {
      renderMetronome();
      expect(screen.getByRole("button", { name: /tap tempo/i })).toBeInTheDocument();
    });

    it("renders the accent toggle button", () => {
      renderMetronome();
      expect(
        screen.getByRole("button", { name: /toggle accent/i })
      ).toBeInTheDocument();
    });

    it("renders volume controls", () => {
      renderMetronome();
      expect(screen.getByRole("button", { name: /mute/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/volume/i)).toBeInTheDocument();
    });

    it("renders BPM slider", () => {
      renderMetronome();
      expect(screen.getByLabelText(/bpm slider/i)).toBeInTheDocument();
    });

    it("renders decrease and increase BPM buttons", () => {
      renderMetronome();
      expect(screen.getByRole("button", { name: /decrease bpm/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /increase bpm/i })).toBeInTheDocument();
    });

    it("displays the tempo marking for 120 BPM", () => {
      renderMetronome();
      expect(screen.getByText("Allegro")).toBeInTheDocument();
    });

    it("renders the BPM label", () => {
      renderMetronome();
      expect(screen.getByText("bpm")).toBeInTheDocument();
    });

    it("renders keyboard shortcuts hint", () => {
      renderMetronome();
      expect(screen.getByText(/space play\/stop/i)).toBeInTheDocument();
    });
  });

  describe("BPM input interaction", () => {
    it("updates BPM when typing a value and blurring", async () => {
      renderMetronome();
      const input = screen.getByRole("textbox", { name: /bpm/i });

      await userEvent.clear(input);
      await userEvent.type(input, "90");
      fireEvent.blur(input);

      expect(input).toHaveValue("90");
    });

    it("commits BPM on Enter key", async () => {
      renderMetronome();
      const input = screen.getByRole("textbox", { name: /bpm/i });

      await userEvent.clear(input);
      await userEvent.type(input, "150{Enter}");

      expect(input).toHaveValue("150");
    });

    it("reverts invalid input to current BPM on blur", async () => {
      renderMetronome();
      const input = screen.getByRole("textbox", { name: /bpm/i });

      await userEvent.clear(input);
      await userEvent.type(input, "abc");
      fireEvent.blur(input);

      expect(input).toHaveValue("120");
    });
  });

  describe("play/stop button", () => {
    it("toggles from Start to Stop on click", async () => {
      renderMetronome();

      const startBtn = screen.getByRole("button", { name: /start/i });
      await userEvent.click(startBtn);

      expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
    });

    it("toggles back from Stop to Start", async () => {
      renderMetronome();

      const startBtn = screen.getByRole("button", { name: /start/i });
      await userEvent.click(startBtn);

      const stopBtn = screen.getByRole("button", { name: /stop/i });
      await userEvent.click(stopBtn);

      expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
    });
  });

  describe("BPM adjustment buttons", () => {
    it("decrease button reduces BPM by 1", async () => {
      renderMetronome();
      const decreaseBtn = screen.getByRole("button", { name: /decrease bpm/i });

      await userEvent.click(decreaseBtn);

      const input = screen.getByRole("textbox", { name: /bpm/i });
      expect(input).toHaveValue("119");
    });

    it("increase button increases BPM by 1", async () => {
      renderMetronome();
      const increaseBtn = screen.getByRole("button", { name: /increase bpm/i });

      await userEvent.click(increaseBtn);

      const input = screen.getByRole("textbox", { name: /bpm/i });
      expect(input).toHaveValue("121");
    });
  });

  describe("keyboard shortcuts", () => {
    it("Space key toggles playback", async () => {
      renderMetronome();

      // Focus away from input so shortcut works
      fireEvent.keyDown(document, { code: "Space" });

      expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
    });

    it("ArrowUp increases BPM by 1", () => {
      renderMetronome();

      fireEvent.keyDown(document, { code: "ArrowUp" });

      const input = screen.getByRole("textbox", { name: /bpm/i });
      expect(input).toHaveValue("121");
    });

    it("ArrowDown decreases BPM by 1", () => {
      renderMetronome();

      fireEvent.keyDown(document, { code: "ArrowDown" });

      const input = screen.getByRole("textbox", { name: /bpm/i });
      expect(input).toHaveValue("119");
    });

    it("keyboard shortcuts are ignored when input is focused", async () => {
      renderMetronome();
      const input = screen.getByRole("textbox", { name: /bpm/i });

      await userEvent.click(input);
      fireEvent.keyDown(input, { code: "ArrowUp" });

      // BPM should remain 120 since the input is focused
      expect(input).toHaveValue("120");
    });
  });

  describe("volume mute toggle", () => {
    it("mute button toggles to unmute state", async () => {
      renderMetronome();
      const muteBtn = screen.getByRole("button", { name: /mute/i });

      await userEvent.click(muteBtn);

      expect(screen.getByRole("button", { name: /unmute/i })).toBeInTheDocument();
    });

    it("unmute button restores volume", async () => {
      renderMetronome();

      // Mute first
      await userEvent.click(screen.getByRole("button", { name: /mute/i }));
      // Then unmute
      await userEvent.click(screen.getByRole("button", { name: /unmute/i }));

      expect(screen.getByRole("button", { name: /mute/i })).toBeInTheDocument();
    });
  });
});
