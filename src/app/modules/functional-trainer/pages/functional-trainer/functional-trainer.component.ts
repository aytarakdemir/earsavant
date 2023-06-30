import { Component, WritableSignal, computed, effect, signal, untracked } from '@angular/core';
import { AudioService } from 'src/app/shared/services/audio/audio.service';
import { KeyService } from 'src/app/shared/services/key/key.service';
import * as _ from 'lodash';
import { SessionService, SessionState } from '../../services/session.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { ConfigService } from '../../services/config.service';

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

  msMelodySpeed: number = 400;

  msAfterUserIsAllowedToClick: number = this.msMelodySpeed;

  SessionState = SessionState;


  constructor(
    public audioSrv: AudioService,
    public keySrv: KeyService,
    public sessionSrv: SessionService,
    public loadingSrv: LoadingService,
    public configSrv: ConfigService
  ) {

    effect(async () => {
      if (this.audioSrv.samplerReady()) {
        untracked(()=> {
          this.loadingSrv.hideLoading();
          this.playSelectedProgressionAndNote();

        })
      }
    });
    effect(async () => {
      this.configSrv.chordProgressionConfig()
        untracked(()=> {
          if (this.sessionSrv.state() === SessionState.Active && this.audioSrv.samplerReady()) {
            this.playSelectedProgressionAndNote();
      
          }
        })

      
      
    });


  }

  ngOnInit() {
    this.sessionSrv.resetSession();
  }

  setNewKey() {
    this.keySrv.randomizeWorkingKey(this.configSrv.possibleRandomNotesConfig(), this.configSrv.octaveConfig());
    this.guessFeedback.set(GuessState.default);
    this.sessionSrv.goToNextQuestion();


  }

  playSelectedProgressionAndNote() {
    console.log(this.configSrv.chordProgressionConfig());
    this.audioSrv.playProgression(
      this.configSrv.chordProgressionConfig()
    );

    this.audioSrv.playNote(this.keySrv.selectedRandomNote(), this.configSrv.chordProgressionConfig().length * this.msMelodySpeed / 1000 + 0.5);
  }

  userGuess(note: string) {
    if (this.coloringActive()) return;
    const guessNote = note.slice(0, -1);
    const correctNote = this.keySrv.selectedRandomNote().slice(0, -1);
    
    this.sessionSrv.guess(correctNote, guessNote);
    if (guessNote === correctNote) {
      this.guessFeedback.set(GuessState.success);
      const keyToWalkOn = this.changeOctave(
        Number(note.slice(-1)) -
          Number(this.keySrv.selectedRandomNote().slice(-1))
      );

      const noteIndicesToWalkOn = this.getNotesIndicesToWalkOn(keyToWalkOn, this.configSrv.walkModeConfig());
      const notesToWalkOn = this.getNotesToWalkOn(keyToWalkOn, this.configSrv.walkModeConfig());

      this.audioSrv.playMelody(
        notesToWalkOn,
        this.msMelodySpeed * 0.001,
        this.msMelodySpeed * 0.001
      );
      this.colorPlaying(
        noteIndicesToWalkOn,
        this.msMelodySpeed
      );
    } else {
      this.guessFeedback.set(GuessState.failure);

      let noteElement = document.getElementById(
        'note-' + this.keySrv.selectedNoteList().indexOf(note)
      );
      if (noteElement) {
        noteElement.classList.add('cet-failure');
        setTimeout(() => {
          noteElement?.classList.remove('cet-failure');
        }, this.msMelodySpeed);
      }
    }
  }

  getNotesToWalkOn(keyToWalkOn: string[], walkMode: WalkMode) {
    let resultNotes;

    if (keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()) <
    keyToWalkOn.length / 2) {
      resultNotes = keyToWalkOn
            .slice(0, keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()) + 1)
            .reverse();
    } else {
      resultNotes = keyToWalkOn.slice(
        keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()),
        keyToWalkOn.length
      );
    }

    return this.transformResultForSelectedWalkMode(resultNotes, walkMode);
  }
  
  getNotesIndicesToWalkOn(keyToWalkOn: string[], walkMode: WalkMode) {
    let resultNotes;

    if (keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()) <
    keyToWalkOn.length / 2) {
      resultNotes = _.range(keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()), -1);
    } else {
      resultNotes = _.range(
        keyToWalkOn.indexOf(this.keySrv.selectedRandomNote()),
        keyToWalkOn.length
      );
    }

    return this.transformResultForSelectedWalkMode(resultNotes, walkMode);
    
  }
  
  transformResultForSelectedWalkMode(resultNotes: any[], walkMode: WalkMode) {
    switch (walkMode) {
      case WalkMode.ToRoot:
        return resultNotes;
      case WalkMode.FromRoot:
        return resultNotes.reverse();
      case WalkMode.JumpToRoot:
        let ret = [];
        ret.push(resultNotes[0]);
        if (resultNotes[0] !== resultNotes[resultNotes.length-1]) {
          ret.push(resultNotes[resultNotes.length-1]);
        }
        return ret;
      case WalkMode.NoWalk:
        return [resultNotes[0]];
      default:
        return resultNotes;
    }
  }

  colorPlaying(indices: number[], time: number) {
    if (this.coloringActive()) return;
    
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
    this.loadingSrv.showLoading();
    this.audioSrv.start();
    this.keySrv.setScaleDegrees(this.configSrv.scaleConfig());
    this.keySrv.randomizeWorkingKey(this.configSrv.possibleRandomNotesConfig(), this.configSrv.octaveConfig() );
    this.sessionSrv.startSession(5);
    this.trainerStarted.set(true);
    
    
  }

  resetSession() {
    this.sessionSrv.resetSession();
    this.audioSrv.samplerReady.set(false);
  }

  ngOnDestroy() {
    this.audioSrv.samplerReady.set(false);
  }
}

enum GuessState {
  default = 'def',
  success = 'success',
  failure = 'fail',
}

export enum WalkMode {
  ToRoot = 'toRoot',
  FromRoot = 'fromRoot',
  JumpToRoot = 'jumpToRoot',
  NoWalk = 'noWalk',
}
