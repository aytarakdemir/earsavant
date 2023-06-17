import { Component, WritableSignal, signal } from '@angular/core';
import { AudioService } from 'src/app/shared/services/audio/audio.service';
import { KeyService } from 'src/app/shared/services/key/key.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-functional-trainer',
  templateUrl: './functional-trainer.component.html',
  styleUrls: ['./functional-trainer.component.scss'],
})
export class FunctionalTrainerComponent {
  trainerStarted: WritableSignal<boolean> = signal(false);

  guessFeedback: WritableSignal<GuessState> = signal(GuessState.default);

  GuessState = GuessState;

  colorChangeTime: number = 300;

  constructor(public audioSrv: AudioService, public keySrv: KeyService) {}

  ngOnInit() {}

  setNewKey() {
    this.keySrv.randomizeWorkingKey();
    this.guessFeedback.set(GuessState.default);
  }

  userGuess(note: string) {
    const guessNote = note.slice(0, -1);
    const correctNote = this.keySrv.selectedRandomNote().slice(0, -1);

    if (guessNote === correctNote) {
      this.guessFeedback.set(GuessState.success);
      const keyToWalkOn = this.changeOctave(
        Number(note.slice(-1)) -
          Number(this.keySrv.selectedRandomNote().slice(-1))
      );
      if (
        keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()) <
        keyToWalkOn.length / 2
      ) {
        this.audioSrv.playMelody(
          keyToWalkOn
            .slice(0, keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()) + 1)
            .reverse(),
          this.colorChangeTime * 0.001,
          this.colorChangeTime * 0.001
        );
        console.log(
          _.range(keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()), -1)
        );
        this.colorPlaying(
          _.range(keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()), -1),
          this.colorChangeTime
        );
      } else {
        this.audioSrv.playMelody(
          keyToWalkOn.slice(
            keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()),
            keyToWalkOn.length
          ),
          this.colorChangeTime * 0.001,
          this.colorChangeTime * 0.001
        );
        this.colorPlaying(
          _.range(
            keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()),
            keyToWalkOn.length
          ),
          this.colorChangeTime
        );
      }
    } else {
      this.guessFeedback.set(GuessState.failure);

      let noteElement = document.getElementById(
        'note-' + this.keySrv.selectedNoteList().indexOf(note)
      );
      if (noteElement) {
        noteElement.classList.add('cet-failure');
        setTimeout(() => {
          noteElement?.classList.remove('cet-failure');
        }, this.colorChangeTime);
      }
    }
  }

  colorPlaying(indices: number[], time: number) {
    indices.forEach((i, index) => {
      let note = document.getElementById('note-' + i);

      if (note) {
        setTimeout(() => {
          note?.classList.add('cet-playing');
          setTimeout(() => {
            note?.classList.remove('cet-playing');
          }, time);
        }, time * index);
      }
    });
  }

  changeOctave(amount: number) {
    let selectedNoteList = this.keySrv.selectedNoteList();
    const modifiedNoteList = selectedNoteList.map((note: string) => {
      const currentOctave = Number(note.slice(-1));
      const newOctave = currentOctave - amount;
      return note.slice(0, -1) + newOctave;
    });
    return modifiedNoteList;
  }

  initialize() {
    this.audioSrv.start();
    this.trainerStarted.set(true);
    this.keySrv.randomizeWorkingKey();
  }
}

enum GuessState {
  default = 'def',
  success = 'success',
  failure = 'fail',
}
