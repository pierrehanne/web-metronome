import { Metronome } from "@/components/metronome";

export default function Home() {
  return (
    <div className="noise-bg relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle radial gradient backdrop */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.16_0.015_75)_0%,oklch(0.09_0.003_75)_70%)]" />

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 sm:mb-12 text-center">
          <h1 className="text-lg sm:text-xl font-light tracking-[0.25em] uppercase text-foreground/80 font-sans">
            Metronome
          </h1>
          <div className="mt-2 w-12 h-px bg-amber/40 mx-auto" />
        </header>

        {/* Metronome */}
        <Metronome />

        {/* Footer */}
        <footer className="mt-10 sm:mt-14 text-center">
          <p className="text-[10px] text-muted-foreground/30 font-mono tracking-widest uppercase">
            Precision tempo
          </p>
        </footer>
      </main>
    </div>
  );
}
