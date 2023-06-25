import {
  Injectable,
  WritableSignal,
  Signal,
  signal,
  computed,
  ChangeDetectorRef,
} from '@angular/core';
import { KeyService } from 'src/app/shared/services/key/key.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public questions: WritableSignal<{
    correctNoteIndex?: number;
    wrongNoteIndexList?: number[];
    isCorrect?: boolean;
  }[]> = signal([]);

  public state: WritableSignal<SessionState> = signal(SessionState.FirstInit);

  public questionCount = 20;

  public activeQuestion = 0;

  SessionState = SessionState;

  private selectedKey: Signal<string[]> = computed(() =>
    this.keySrv.selectedNoteList().map((note) => {
      return note.slice(0, -1);
    })
  );

  public activeQuestionState: {
    correctNoteIndex?: number;
    wrongNoteIndexList?: number[];
    isCorrect?: boolean;
  } = {};

  public canProceedToTheNextQuestion: boolean = false;

  public results: { correctCount?: number; questionCount?: number } = {};

  constructor(private keySrv: KeyService) {}

  public startSession(questionCount: number = 20) {
    if (this.state() === SessionState.Active)
      throw new Error('Session already active');
    this.state.set(SessionState.Active);
    this.questionCount = questionCount;
  }

  public resetSession() {
    this.state.set(SessionState.FirstInit);

    this.activeQuestionState = {};
    this.canProceedToTheNextQuestion = false;
    this.activeQuestion = 0;
    this.questions.set([]);
  }

  public goToNextQuestion() {
    if (this.activeQuestionState.wrongNoteIndexList) {
      this.activeQuestionState.isCorrect = false;
    } else {
      this.activeQuestionState.isCorrect = true;
    }
    this.questions.mutate(array => array.push(this.activeQuestionState));

    if (this.questionCount - 1 > this.activeQuestion) {
      console.log(
        'Active Question: ',
        this.activeQuestion,
        '\nQuestions Array: ',
        this.questions()
      );
      this.activeQuestionState = {};
      this.activeQuestion = this.activeQuestion + 1;
      this.canProceedToTheNextQuestion = false;
    } else {
      console.log(
        'Active Question: ',
        this.activeQuestion,
        '\nQuestions Array: ',
        this.questions()
      );
      this.endSession();
    }
  }

  public endSession() {
    if (this.state() !== SessionState.Active)
      throw new Error('No active session to end');
    this.state.set(SessionState.AfterSession);

    let correctCount = 0;
    this.questions().forEach((question) => {
      if (question.isCorrect) correctCount++;
    });

    // Assign endgame statistics to the results object here...
    this.results = {
      correctCount: correctCount,
      questionCount: this.questionCount,
    };


  }

  public guess(correctNote: string, guessNote: string) {
    const guessIndex = this.selectedKey().indexOf(guessNote);
    const correctIndex = this.selectedKey().indexOf(correctNote);

    if (!this.activeQuestionState.correctNoteIndex) {
      this.activeQuestionState.correctNoteIndex = correctIndex;
    }

    if (guessIndex === correctIndex) this.canProceedToTheNextQuestion = true;

    if (this.canProceedToTheNextQuestion) return;

    if (this.activeQuestionState.wrongNoteIndexList) {
      if (!this.activeQuestionState.wrongNoteIndexList.includes(guessIndex)) {
        this.activeQuestionState.wrongNoteIndexList.push(guessIndex);
      }
    } else {
      this.activeQuestionState.wrongNoteIndexList = [guessIndex];
    }
  }
}

export enum SessionState {
  FirstInit = 'firstInit',
  Active = 'active',
  AfterSession = 'afterSession',
}
