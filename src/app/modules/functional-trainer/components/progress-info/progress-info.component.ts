import { Component, Signal, computed, signal } from '@angular/core';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-progress-info',
  templateUrl: './progress-info.component.html',
  styleUrls: ['./progress-info.component.scss']
})
export class ProgressInfoComponent {

  remainingBoxes: Signal<any[]> = signal([]);

  constructor(public sessionSrv: SessionService) {
    this.remainingBoxes =  computed(() => 
    Array(this.sessionSrv.questionCount - this.sessionSrv.questions().length)
    );
  }
  
  ngOnInit() {

  }

}
