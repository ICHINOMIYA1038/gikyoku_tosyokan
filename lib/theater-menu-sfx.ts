/**
 * Web Audio APIによる触感的な効果音。
 * 音声ファイル不要、外部依存なし。
 */

let ctx: AudioContext | null = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function tone(freq: number, duration: number, startOffset = 0, type: OscillatorType = "sine", volume = 0.15) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(c.destination);
  const start = c.currentTime + startOffset;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.start(start);
  osc.stop(start + duration);
}

/** サイコロ音: 3つの短い音 */
export function playDiceRoll() {
  tone(440, 0.08, 0, "square", 0.12);
  tone(660, 0.08, 0.06, "square", 0.12);
  tone(880, 0.12, 0.12, "triangle", 0.15);
}

/** シャッフル音: 上昇するアルペジオ */
export function playShuffle() {
  const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
  notes.forEach((n, i) => tone(n, 0.1, i * 0.05, "sine", 0.1));
}

/** タイマー終了音: 上昇+下降のベル風 */
export function playTimerEnd() {
  tone(880, 0.3, 0, "sine", 0.2);
  tone(1108.73, 0.5, 0.1, "sine", 0.15);
}

/** クリック音: 短い高音 */
export function playClick() {
  tone(1200, 0.03, 0, "square", 0.08);
}
