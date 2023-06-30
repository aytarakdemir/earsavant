import { Injectable, WritableSignal, effect } from '@angular/core';
import { AudioService } from '../audio/audio.service';
import { signal } from '@angular/core';
import * as _ from 'lodash';

/**
 * Prepares notes that will be fed into the AudioService.
 */
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

  public solfegeList: string[] = [
    'Do',
    'Ra',
    'Re',
    'Me',
    'Mi',
    'Fa',
    'Se',
    'So',
    'Le',
    'La',
    'Te',
    'Ti',
  ];

  private octaves: string[] = ['0', '1', '2', '3', '4', '5', '6'];

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
  public possibleRandomNoteIndices: WritableSignal<number[]> = signal(_.range(this.selectedNoteList().length));

  private randomizerWorkingOctave = 3;

  constructor(private audioSrv: AudioService) {
    this.randomizeWorkingKey();
  }

  /**
   * The key needs to change randomly for the given scale. A random note is selected as the answer.
   * @param possibleNotes Which of the scale degrees can be the answer.
   * @param octaveRange Changes random notes range
   */
  public randomizeWorkingKey(
    possibleNotes: number[] = _.range(this.selectedNoteList().length),
    octaveRange: { low: number; high: number } = { low: 2, high: this.octaves.length - 1 },
  ): void {
    const root = this.notes[Math.floor(Math.random() * this.notes.length)];
    this.selectedRootNote.set(root);
    this.selectedNoteList.set(
      this.getKeyNotesForOctave(root, this.randomizerWorkingOctave)
    );
    this.setRandomNote(
      root,
      octaveRange,
      possibleNotes
    );
  }

  public setRandomNote(
    rootNote: string,
    octaveRange: { low: number; high: number },
    possibleNotes: number[] = _.range(this.selectedNoteList().length)
  ) {
    if (
      octaveRange.low > octaveRange.high ||
      octaveRange.low < 0 ||
      octaveRange.low > this.octaves.length - 1 ||
      octaveRange.high < 0 ||
      octaveRange.high > this.octaves.length - 1
    )
      throw new Error('Invalid octave range!');

    this.possibleRandomNoteIndices.set(possibleNotes);

    const selectedKey = this.getKey(rootNote);
    const selectedNote =
      selectedKey[
        possibleNotes[
          Math.floor(Math.random() * selectedKey.length) % possibleNotes.length
        ]
      ];
    this.selectedRandomNote.set(
      selectedNote +
        this.octaves[
          octaveRange.low +
            Math.floor(
              Math.random() *
                Math.min(
                  this.octaves.length,
                  octaveRange.high - octaveRange.low
                )
            )
        ]
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
    var solfegeArr: string[] = [];

    steps.forEach((step) => {
      keyNotes.push(
        this.notes[(this.notes.indexOf(rootNote) + step) % this.notes.length]
      );

      solfegeArr.push(
        this.solfegeList[step]
      );
      this.selectedSolfegeList.set(solfegeArr)
    });
    return keyNotes;
  }
}
