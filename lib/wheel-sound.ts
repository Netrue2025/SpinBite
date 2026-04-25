export function playWheelSound() {
  if (typeof window === "undefined") {
    return;
  }

  const AudioContextClass =
    window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const master = context.createGain();
  master.gain.value = 0.08;
  master.connect(context.destination);

  const tickCount = 18;

  for (let index = 0; index < tickCount; index += 1) {
    const progress = index / tickCount;
    const delay = 24 + index * (42 + progress * 24);

    window.setTimeout(() => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "square";
      oscillator.frequency.value = 420 + (index % 4) * 35;
      gain.gain.setValueAtTime(0.001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.05);

      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.055);
    }, delay);
  }

  window.setTimeout(() => {
    context.close().catch(() => undefined);
  }, 1800);
}
