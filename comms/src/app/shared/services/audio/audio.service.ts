import { Injectable } from '@angular/core';
import * as Tone from 'tone';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  playNote(note: string): void {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(note, '8n');
  }

  playChord(notes: string[]): void {
    notes.forEach((note: string) => {
      this.playNote(note);
    });
  }
}
