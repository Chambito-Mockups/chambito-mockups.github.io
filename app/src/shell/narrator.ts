/** Lee en voz alta la narración de cada pantalla con la voz en español del dispositivo (Android, iPhone o computadora). */

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

/** la mejor voz en español: primero las de Latinoamérica, después cualquier otra */
function spanishVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('es'));
  const rank = (v: SpeechSynthesisVoice) => {
    const l = v.lang.toLowerCase();
    return (['es-py', 'es-ar', 'es-419', 'es-us', 'es-mx'].findIndex((x) => l.startsWith(x)) + 1 || 9) - (v.localService ? 0 : 0.5);
  };
  return voices.sort((a, b) => rank(a) - rank(b))[0];
}

let current: SpeechSynthesisUtterance | null = null;

/** Lee `text`; `onEnd` corre al terminar (no si se corta con otra lectura o con `stop`). */
export function speak(text: string, onEnd?: () => void) {
  if (!canSpeak() || !text) { onEnd?.(); return; }
  stop();
  const u = new SpeechSynthesisUtterance(text);
  const voice = spanishVoice();
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? 'es-419';
  u.rate = 1;
  current = u;
  u.onend = () => { if (current === u) { current = null; onEnd?.(); } };
  u.onerror = () => { if (current === u) { current = null; onEnd?.(); } };
  window.speechSynthesis.speak(u);
}

export function stop() {
  if (!canSpeak()) return;
  current = null;
  window.speechSynthesis.cancel();
}
