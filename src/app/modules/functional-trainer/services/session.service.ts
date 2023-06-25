import { Injectable, WritableSignal, Signal, signal,computed } from '@angular/core';
import { KeyService } from 'src/app/shared/services/key/key.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  
  public questions: {correctNoteIndex?: number, wrongNoteIndexList?: number[]}[] = [];
  
  public state: WritableSignal<SessionState> = signal(SessionState.FirstInit);

  public questionCount = 20;
  
  public activeQuestion = 0;

  SessionState = SessionState;

  private selectedKey: Signal<string[]> = computed(()=>this.keySrv.selectedNoteList().map(note => {return note.slice(0, -1)} ))

  public activeQuestionState: {correctNoteIndex?: number, wrongNoteIndexList?: number[]} = {};

  constructor(private keySrv: KeyService) { }

  public startSession(questionCount: number = 20) {
    if(this.state() === SessionState.Active) throw new Error("Session already active");
    this.state.set(SessionState.Active);
    this.questionCount = questionCount;


  }

  public goToNextQuestion() {
    if (this.questionCount > this.activeQuestion) {
      this.questions.push(this.activeQuestionState);
      this.activeQuestion = this.activeQuestion + 1;
      console.log("Active Question: ", this.activeQuestion, "\nQuestions Array: ", this.questions);
    } else {
      this.endSession();
      console.log("Active Question: ", this.activeQuestion, "\nQuestions Array: ", this.questions);
    }
  }


  public endSession() {
    if(this.state() !== SessionState.Active) throw new Error("No active session to end");
    this.state.set(SessionState.AfterSession);
  }

  public guess(correctNote: string, guessNote:string) {

    const guessIndex = this.selectedKey().indexOf(guessNote);
    const correctIndex = this.selectedKey().indexOf(correctNote);

    if (!this.activeQuestionState.correctNoteIndex) {
      this.activeQuestionState.correctNoteIndex = correctIndex;
    }

    if (this.activeQuestionState.wrongNoteIndexList) {
      if(!this.activeQuestionState.wrongNoteIndexList.includes(guessIndex)) {
        this.activeQuestionState.wrongNoteIndexList.push(guessIndex)
      }
    } else {
      this.activeQuestionState.wrongNoteIndexList = [guessIndex];
    }


    console.log(correctIndex, guessIndex);
    
    // You have the selected key, calculate which notes correspond to which noteIndices. Do all score calculations according to those indices. Note name are variable but indices are constant. Indices act as scale degrees
    console.log(this.selectedKey());
    console.log(correctNote, guessNote);
  }




}


enum SessionState {
  FirstInit = "firstInit",
  Active = "active",
  AfterSession = "afterSession"
}