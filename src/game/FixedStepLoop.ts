export interface FixedStepLoopOptions {
  stepSeconds: number;
  maxFrameSeconds: number;
  step: (dtSeconds: number) => void;
}

export class FixedStepLoop {
  private readonly stepSeconds: number;
  private readonly maxFrameSeconds: number;
  private readonly step: (dtSeconds: number) => void;
  private accumulator = 0;
  private paused = false;

  constructor(options: FixedStepLoopOptions) {
    this.stepSeconds = options.stepSeconds;
    this.maxFrameSeconds = options.maxFrameSeconds;
    this.step = options.step;
  }

  advance(elapsedSeconds: number): number {
    if (this.paused) return 0;

    const clamped = Math.min(Math.max(elapsedSeconds, 0), this.maxFrameSeconds);
    this.accumulator += clamped;

    let steps = 0;
    while (this.accumulator >= this.stepSeconds) {
      this.step(this.stepSeconds);
      this.accumulator -= this.stepSeconds;
      steps += 1;
    }
    return steps;
  }

  setPaused(paused: boolean): void {
    this.paused = paused;
    this.accumulator = 0;
  }

  get isPaused(): boolean {
    return this.paused;
  }
}