import { Injectable, WritableSignal, effect, signal } from '@angular/core';
import * as _ from 'lodash';
import { KeyService } from 'src/app/shared/services/key/key.service';
import { WalkMode } from '../pages/functional-trainer/functional-trainer.component';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  configObj: WritableSignal<any> = signal(
    {
      octaveConfigLow: 2,
      octaveConfigHigh: 6,
      possibleNotesConfig: [true,false,true,false,true,true,false,true,false,true,false,true],
      scaleConfig: [true,null,true,null,true,true,null,true,null,true,null,true],
      walkMode: WalkMode.ToRoot,
      chordsProgressionConfig: [{chordNotes: [true,true,false,false,false,false,false,false,false,false,false,false]},{chordNotes: [true,true,false,false,false,false,false,false,false,false,false,false]}],
    }
  );

  constructor(private keySrv: KeyService) {
    effect(()=> {
      console.log(this.configObj());
    })
  }


  aa() {
    this.configObj.set({
      octaveConfigLow: 2,
      octaveConfigHigh: 6,
      possibleNotesConfig: [true,false,true,false,true,true,false,true,false,true,false,true],
      scaleConfig: [true,null,true,null,true,true,null,true,null,true,null,true],
      walkMode: WalkMode.ToRoot,
      chordsProgressionConfig: [{chordNotes: [true,true,false,false,false,false,false,false,false,false,false,false]},
      {chordNotes: [true,true,false,false,false,false,false,false,false,false,false,false]},
      {chordNotes: [true,true,false,false,false,false,false,false,false,false,false,false]},
      {chordNotes: [true,true,false,false,false,false,false,false,false,false,false,false]}],
    })
  }

}
