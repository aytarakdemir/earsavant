import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  public currentScore: WritableSignal<{correct: number, incorrect: number}> = signal({correct: 0, incorrect: 0});

  public scoreRecording: WritableSignal<boolean> = signal(false);

  constructor() { }

  public recordScore() {
    this.scoreRecording.set(true);
  }

  public stopRecordScore() {
    this.scoreRecording.set(false);
  }

  public increaseCorrect() {
    if (this.scoreRecording()) {
      this.currentScore.mutate(obj => {
        obj.correct = obj.correct + 1;
      })
    }
  }

  public increaseIncorrect() {
    if (this.scoreRecording()) {
      this.currentScore.mutate(obj => {
        obj.incorrect = obj.incorrect + 1;
      })
    }
  }



}
