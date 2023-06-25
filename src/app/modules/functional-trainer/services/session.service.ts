import { Injectable, WritableSignal, Signal, signal,computed } from '@angular/core';
import { KeyService } from 'src/app/shared/services/key/key.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  
  public questions: {correctNoteIndex?: number, wrongNoteIndexList?: number[], isCorrect?: boolean}[] = [];
  
  public state: WritableSignal<SessionState> = signal(SessionState.FirstInit);

  public questionCount = 20;
  
  public activeQuestion = 0;

  SessionState = SessionState;

  private selectedKey: Signal<string[]> = computed(()=>this.keySrv.selectedNoteList().map(note => {return note.slice(0, -1)} ))

  public activeQuestionState: {correctNoteIndex?: number, wrongNoteIndexList?: number[], isCorrect?: boolean} = {};

  public canProceedToTheNextQuestion: boolean = false;

  constructor(private keySrv: KeyService) { }

  public startSession(questionCount: number = 20) {
    if(this.state() === SessionState.Active) throw new Error("Session already active");
    this.state.set(SessionState.Active);
    this.questionCount = questionCount;


  }

  public goToNextQuestion() {
    if (this.activeQuestionState.wrongNoteIndexList) {
      this.activeQuestionState.isCorrect = false;
    } else {
      this.activeQuestionState.isCorrect = true;
    }
    this.questions.push(this.activeQuestionState);

    if (this.questionCount - 1> this.activeQuestion) {
      this.activeQuestionState = {};
      this.activeQuestion = this.activeQuestion + 1;
      this.canProceedToTheNextQuestion = false;
      console.log("Active Question: ", this.activeQuestion, "\nQuestions Array: ", this.questions);
    } else {
      this.endSession();
      console.log("Active Question: ", this.activeQuestion, "\nQuestions Array: ", this.questions);
    }
  }


  public endSession() {
    if(this.state() !== SessionState.Active) throw new Error("No active session to end");
    this.state.set(SessionState.AfterSession);

    // Get the state ready for the next session
    this.activeQuestionState = {};
    this.canProceedToTheNextQuestion = false;
    this.activeQuestion = 0;
  }

  public guess(correctNote: string, guessNote:string) {

    const guessIndex = this.selectedKey().indexOf(guessNote);
    const correctIndex = this.selectedKey().indexOf(correctNote);

    if (!this.activeQuestionState.correctNoteIndex) {
      this.activeQuestionState.correctNoteIndex = correctIndex;
    }

    if (guessIndex === correctIndex) this.canProceedToTheNextQuestion = true;

    if (this.canProceedToTheNextQuestion) return;


    if (this.activeQuestionState.wrongNoteIndexList) {
      if(!this.activeQuestionState.wrongNoteIndexList.includes(guessIndex)) {
        this.activeQuestionState.wrongNoteIndexList.push(guessIndex)
      }
    } else {
      this.activeQuestionState.wrongNoteIndexList = [guessIndex];
    }
  }




}


export enum SessionState {
  FirstInit = "firstInit",
  Active = "active",
  AfterSession = "afterSession"
}