import { Injectable, WritableSignal, signal } from '@angular/core';
import * as Tone from 'tone';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  constructor() {}

  private progressionActive: WritableSignal<boolean> = signal(false);
  public start() {
    Tone.start();
  }

  private setProgressionActive() {
    this.progressionActive.set(true);
  }

  private setProgressionPassive() {
    this.progressionActive.set(false);
  }

  public playNote(
    note: string,
    lag: number = 0,
    sustainTime: number = 0.3
  ): void {
    if (Tone.context.state !== 'suspended') {
      const synth = new Tone.Synth().toDestination();
      const now = Tone.now();
      synth.triggerAttack(note, now + lag);
      synth.triggerRelease(now + lag + sustainTime);
    }
  }

  public playMelody(
    notes: string[],
    spaceTime: number = 0.5,
    sustainTime: number = 0.5
  ) {
    notes.forEach((note, index) => {
      this.playNote(note, index * spaceTime, sustainTime);
    });
  }

  public playChord(
    notes: string[],
    lag: number = 0,
    sustainTime: number = 0.5
  ): void {
    notes.forEach((note: string) => {
      this.playNote(note, lag, sustainTime);
    });
  }

  public playProgression(
    chords: string[][],
    spaceTime: number = 0.5,
    sustainTime: number = 0.5
  ) {
    if (!this.progressionActive()) {
      this.setProgressionActive();
      chords.forEach((chord, index) => {
        this.playChord(chord, index * spaceTime, sustainTime);
      }, (chords.length - 1) * spaceTime + sustainTime);
      setTimeout(() => {
        this.setProgressionPassive();
      }, (chords.length - 1) * spaceTime + sustainTime * 5000);
    }
  }
}
