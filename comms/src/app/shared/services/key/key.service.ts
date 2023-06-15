import { Injectable, WritableSignal, effect } from '@angular/core';
import { AudioService } from '../audio/audio.service';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyService {

  private notes: string[] = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  private octaves: string[] = ['0', '1', '2', '3', '4', '5', '6'];

  public selectedNoteList: WritableSignal<string[]> = signal(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  public selectedRandomNote: WritableSignal<string> = signal('C');

  constructor(private audioSrv: AudioService) {
    this.randomizeWorkingKey();
  }

  randomizeWorkingKey(): void {
    const root = this.notes[Math.floor(Math.random() * this.notes.length)];
    this.selectedNoteList.set(this.getKeyNotesForOctave(root, 3));
    this.setRandomNote(root);
    this.audioSrv.playChord([this.selectedNoteList()[0], this.selectedNoteList()[2], this.selectedNoteList()[4]]);
  }

  setRandomNote(rootNote: string) {
    const selectedKey = this.getKey(rootNote);
    const selectedNote =
      selectedKey[Math.floor(Math.random() * selectedKey.length)];
    this.selectedRandomNote.set(
      selectedNote +
      this.octaves[Math.floor(Math.random() * this.octaves.length)]);
  }

  getKeyNotesForOctave(rootNote: string, octave: number): string[] {
    const keyNotes = this.getKey(rootNote).map((note) => {
      const selectedKey = this.getKey(rootNote);
      var smallestNoteIndex = this.notes.length;
      selectedKey.forEach((note) => {
        if (this.notes.indexOf(note) < smallestNoteIndex) {
          smallestNoteIndex = this.notes.indexOf(note);
        }
      });

      if (
        selectedKey.indexOf(note) <
        selectedKey.indexOf(this.notes[smallestNoteIndex])
      ) {
        return note + this.octaves[octave];
      } else {
        return note + this.octaves[octave + 1];
      }
    });

    keyNotes.push(
      keyNotes[0].slice(0, -1) +
        this.octaves[this.octaves.indexOf(keyNotes[0].slice(-1)) + 1]
    );
    return keyNotes;
  }

  getKey(rootNote: string, steps: number[] = [0, 2, 4, 5, 7, 9, 11]): string[] {
    this.notes.indexOf(rootNote);
    var keyNotes: string[] = [];

    steps.forEach((step) => {
      keyNotes.push(
        this.notes[(this.notes.indexOf(rootNote) + step) % this.notes.length]
      );
    });
    return keyNotes;
  }
}
