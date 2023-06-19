import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  public currentScore: WritableSignal<{correct: number, wrong: number}> = signal({correct: 0, wrong: 0});

  private scoreRecording: WritableSignal<boolean> = signal(false);

  constructor() { }

  public recordScore() {
    this.scoreRecording.set(true);
  }

  private stopRecordScore() {
    this.scoreRecording.set(false);
  }

  public increaseCorrect() {
    if (this.scoreRecording()) {
      this.currentScore.mutate(obj => {
        obj.correct = obj.correct + 1;
      })
      this.stopRecordScore();
    }
  }

  public increaseWrong() {
    if (this.scoreRecording()) {
      this.currentScore.mutate(obj => {
        obj.wrong = obj.wrong + 1;
      })
      this.stopRecordScore();
    }
  }



}
