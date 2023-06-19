import { Component, WritableSignal, signal } from '@angular/core';
import { AudioService } from 'src/app/shared/services/audio/audio.service';
import { KeyService } from 'src/app/shared/services/key/key.service';
import * as _ from 'lodash';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-functional-trainer',
  templateUrl: './functional-trainer.component.html',
  styleUrls: ['./functional-trainer.component.scss'],
})
export class FunctionalTrainerComponent {
  trainerStarted: WritableSignal<boolean> = signal(false);
  coloringActive: WritableSignal<boolean> = signal(false);

  guessFeedback: WritableSignal<GuessState> = signal(GuessState.default);

  GuessState = GuessState;

  msColorChangeTime: number = 300;

  msAfterUserIsAllowedToClick: number = this.msColorChangeTime;

  constructor(
    public audioSrv: AudioService,
    public keySrv: KeyService,
    public scoreSrv: ScoreService
  ) {}

  ngOnInit() {}

  setNewKey() {
    this.keySrv.randomizeWorkingKey();
    this.guessFeedback.set(GuessState.default);
    this.scoreSrv.recordScore();

    this.audioSrv.playProgression(
      [
        [
          this.keySrv.selectedNoteList()[0],
          this.keySrv.selectedNoteList()[2],
          this.keySrv.selectedNoteList()[4],
        ],
        [
          this.keySrv.selectedNoteList()[3],
          this.keySrv.selectedNoteList()[5],
          this.keySrv.selectedNoteList()[0],
        ],
        [
          this.keySrv.selectedNoteList()[4],
          this.keySrv.selectedNoteList()[6],
          this.keySrv.selectedNoteList()[1],
        ],
        [
          this.keySrv.selectedNoteList()[0],
          this.keySrv.selectedNoteList()[2],
          this.keySrv.selectedNoteList()[4],
        ],
      ]
    );

    this.audioSrv.playNote(this.keySrv.selectedRandomNote(), 1.5);
  }

  userGuess(note: string) {
    if (this.coloringActive()) return;
    const guessNote = note.slice(0, -1);
    const correctNote = this.keySrv.selectedRandomNote().slice(0, -1);

    if (guessNote === correctNote) {
      this.scoreSrv.increaseCorrect();
      this.scoreSrv.stopRecordScore();
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
          this.msColorChangeTime * 0.001,
          this.msColorChangeTime * 0.001
        );
        this.colorPlaying(
          _.range(keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()), -1),
          this.msColorChangeTime
        );
      } else {
        this.audioSrv.playMelody(
          keyToWalkOn.slice(
            keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()),
            keyToWalkOn.length
          ),
          this.msColorChangeTime * 0.001,
          this.msColorChangeTime * 0.001
        );
        this.colorPlaying(
          _.range(
            keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()),
            keyToWalkOn.length
          ),
          this.msColorChangeTime
        );
      }
    } else {
      this.scoreSrv.increaseIncorrect();
      this.guessFeedback.set(GuessState.failure);

      let noteElement = document.getElementById(
        'note-' + this.keySrv.selectedNoteList().indexOf(note)
      );
      if (noteElement) {
        noteElement.classList.add('cet-failure');
        setTimeout(() => {
          noteElement?.classList.remove('cet-failure');
        }, this.msColorChangeTime);
      }
    }
  }

  colorPlaying(indices: number[], time: number) {
    if (!this.coloringActive()) {
      this.coloringActive.set(true);
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
      setTimeout(() => {
        this.coloringActive.set(false);
      }, indices.length * time + this.msAfterUserIsAllowedToClick);
    }
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
    this.scoreSrv.recordScore();

    setTimeout(()=> {
      this.audioSrv.playProgression(
        [
          [
            this.keySrv.selectedNoteList()[0],
            this.keySrv.selectedNoteList()[2],
            this.keySrv.selectedNoteList()[4],
          ],
          [
            this.keySrv.selectedNoteList()[3],
            this.keySrv.selectedNoteList()[5],
            this.keySrv.selectedNoteList()[0],
          ],
          [
            this.keySrv.selectedNoteList()[4],
            this.keySrv.selectedNoteList()[6],
            this.keySrv.selectedNoteList()[1],
          ],
          [
            this.keySrv.selectedNoteList()[0],
            this.keySrv.selectedNoteList()[2],
            this.keySrv.selectedNoteList()[4],
          ],
        ]
      );
  
      this.audioSrv.playNote(this.keySrv.selectedRandomNote(), 1.5);

    },500);

  }
}

enum GuessState {
  default = 'def',
  success = 'success',
  failure = 'fail',
}
