import { Injectable } from '@angular/core';
import * as Tone from 'tone';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  constructor() {}

  public playNote(note: string, lag: number = 0): void {
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease(note, '8n', now + lag);
  }

  public playChord(notes: string[], lag:number = 0): void {
    notes.forEach((note: string) => {
      this.playNote(note, lag);
    });
  }

  public playProgression(chords: string[][]) {
    chords.forEach((chord, index) => {
      this.playChord(chord, index * 0.5);  
    });
  }
}
