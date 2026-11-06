/**
 * Web Audio API Sound Synthesizer for Pokédex Cries, Evolution Fanfare & UI Feedback
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 0.3;
    this.ambientGain = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Procedural digital Pokémon Cry based on pokemon attributes
   */
  playPokemonCry(pokemon) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(this.ctx.destination);

    // Compute characteristic pitch and duration based on stats / stage
    const baseFreq = Math.max(120, 520 - (pokemon.stats?.hp || 50) * 3);
    const duration = 0.45 + (pokemon.evolutionStage || 0) * 0.15;

    // Dual oscillator setup for classic 8-bit / digital Pokédex timbre
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = pokemon.types.includes('Fire') ? 'sawtooth' : (pokemon.types.includes('Ghost') ? 'sine' : 'square');
    osc2.type = 'triangle';

    // Frequency modulation
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + duration * 0.4);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + duration);

    osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + duration * 0.6);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.1, now + duration);

    // Filter sweep
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.8, now + 0.04);
    env.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(env);
    env.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
  }

  /**
   * Dramatic Evolution whoosh, harmonic riser & triumphal chime
   */
  playEvolutionSequence() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.setValueAtTime(this.volume * 0.85, now);
    master.connect(this.ctx.destination);

    // Phase 1: Rising Energy Swell (0s - 0.7s)
    const riser = this.ctx.createOscillator();
    const riserGain = this.ctx.createGain();
    riser.type = 'sawtooth';
    riser.frequency.setValueAtTime(140, now);
    riser.frequency.exponentialRampToValueAtTime(980, now + 0.7);

    riserGain.gain.setValueAtTime(0.01, now);
    riserGain.gain.linearRampToValueAtTime(0.4, now + 0.65);
    riserGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    riser.connect(riserGain);
    riserGain.connect(master);
    riser.start(now);
    riser.stop(now + 0.8);

    // Phase 2: Cosmic Arpeggiated Chime (at 0.75s)
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C Major arpeggio
    notes.forEach((freq, idx) => {
      const noteTime = now + 0.75 + idx * 0.08;
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      chime.type = 'sine';
      chime.frequency.setValueAtTime(freq, noteTime);

      chimeGain.gain.setValueAtTime(0, noteTime);
      chimeGain.gain.linearRampToValueAtTime(0.3, noteTime + 0.02);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.8);

      chime.connect(chimeGain);
      chimeGain.connect(master);

      chime.start(noteTime);
      chime.stop(noteTime + 0.85);
    });
  }

  /**
   * Futuristic holographic UI clicks
   */
  playClick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);

    gain.gain.setValueAtTime(this.volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  playHover() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.03);

    gain.gain.setValueAtTime(this.volume * 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const soundManager = new SoundManager();
