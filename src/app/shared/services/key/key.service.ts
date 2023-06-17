import { Injectable, WritableSignal, effect } from '@angular/core';
import { AudioService } from '../audio/audio.service';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
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
  private octaves: string[] = ['1', '2', '3', '4', '5', '6'];

  public selectedNoteList: WritableSignal<string[]> = signal([
    'C4',
    'D4',
    'E4',
    'F4',
    'G4',
    'A4',
    'B4',
  ]);
  public selectedSolfegeList: WritableSignal<string[]> = signal([
    'Do',
    'Re',
    'Mi',
    'Fa',
    'So',
    'La',
    'Ti',
  ]);
  public selectedRandomNote: WritableSignal<string> = signal('C');
  public selectedRootNote: WritableSignal<string> = signal('C');

  private randomizerWorkingOctave = 2;

  constructor(private audioSrv: AudioService) {
    this.randomizeWorkingKey();
  }

  public randomizeWorkingKey(): void {
    const root = this.notes[Math.floor(Math.random() * this.notes.length)];
    this.selectedRootNote.set(root);
    this.selectedNoteList.set(this.getKeyNotesForOctave(root, this.randomizerWorkingOctave));
    this.setRandomNote(root);
    this.audioSrv.playProgression([
      [
        this.selectedNoteList()[0],
        this.selectedNoteList()[2],
        this.selectedNoteList()[4],
      ],
      [
        this.selectedNoteList()[3],
        this.selectedNoteList()[5],
        this.selectedNoteList()[0],
      ],
      [
        this.selectedNoteList()[4],
        this.selectedNoteList()[6],
        this.selectedNoteList()[1],
      ],
      [
        this.selectedNoteList()[0],
        this.selectedNoteList()[2],
        this.selectedNoteList()[4],
      ],
  
    ]
  );
  }

  public setRandomNote(rootNote: string) {
    const selectedKey = this.getKey(rootNote);
    const selectedNote =
      selectedKey[Math.floor(Math.random() * selectedKey.length)];
    this.selectedRandomNote.set(
      selectedNote +
        this.octaves[Math.floor(Math.random() * this.octaves.length)]
    );
  }

  public getKeyNotesForOctave(rootNote: string, octave: number): string[] {
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

  private getKey(
    rootNote: string,
    steps: number[] = [0, 2, 4, 5, 7, 9, 11]
  ): string[] {
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
