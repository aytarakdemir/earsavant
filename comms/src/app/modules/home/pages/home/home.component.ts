import { Component } from '@angular/core';
import * as Tone from 'tone';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor() {}

  playNote(note: string) {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(note, '8n');
  }

  playChord(notes: string[]) {
    notes.forEach((note: string) => {
      this.playNote(note);
    });
  }
}
