import { Component } from '@angular/core';
import { AudioService } from 'src/app/shared/services/audio/audio.service';
import { KeyService } from 'src/app/shared/services/key/key.service';
import * as Tone from 'tone';

@Component({
  selector: 'app-functional-trainer',
  templateUrl: './functional-trainer.component.html',
  styleUrls: ['./functional-trainer.component.scss'],
})
export class FunctionalTrainerComponent {
  

  constructor(public audioSrv: AudioService,
              public keySrv: KeyService) {
    this.keySrv.randomizeWorkingKey();
  }



  
}
