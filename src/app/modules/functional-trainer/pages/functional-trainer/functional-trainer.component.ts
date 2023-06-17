import { Component, WritableSignal, signal } from '@angular/core';
import { AudioService } from 'src/app/shared/services/audio/audio.service';
import { KeyService } from 'src/app/shared/services/key/key.service';


@Component({
  selector: 'app-functional-trainer',
  templateUrl: './functional-trainer.component.html',
  styleUrls: ['./functional-trainer.component.scss'],
})
export class FunctionalTrainerComponent {

  trainerStarted: WritableSignal<boolean> = signal(false);

  guessFeedback: WritableSignal<GuessState> = signal(GuessState.default);

  GuessState = GuessState;
  
  constructor(public audioSrv: AudioService, public keySrv: KeyService) {

  }

  ngOnInit() {
    
  }

  setNewKey() {
    this.keySrv.randomizeWorkingKey();
    this.guessFeedback.set(GuessState.default);
  }

  userGuess(note: string) {
    this.audioSrv.playNote(note);

    const guessNote = note.slice(0, -1);
    const correctNote = this.keySrv.selectedRandomNote().slice(0, -1);

    if (guessNote === correctNote) {
      console.log(`Correct!`);
      this.guessFeedback.set(GuessState.success);
    } else {
      console.log("Wrong!");
      this.guessFeedback.set(GuessState.failure);
    }
    
  }
  
  initialize() {
    this.audioSrv.start();
    this.trainerStarted.set(true);
    this.keySrv.randomizeWorkingKey();
  }

}

enum GuessState {
  default = "def",
  success = "success",
  failure = "fail"
}