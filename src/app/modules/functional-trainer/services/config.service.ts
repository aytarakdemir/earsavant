import { Injectable, WritableSignal, effect, signal, untracked } from '@angular/core';
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
      this.configObj();
      untracked(()=> {

        let possibleNotes = this.configObj().possibleNotesConfig.reduce((acc:number[], curr:boolean, index:number) => {
          if (curr) {
            acc.push(index);
          }
          return acc;
        }, []);

        console.log(possibleNotes);
        
        let i = 0
        let scaleNotes = this.configObj().scaleConfig.reduce((acc:number[], curr:boolean) => {
          if (curr !== null) {
            i++;
          }
          if (curr) {
            acc.push(i);
          }
          return acc;
        }, []);
        
        console.log(scaleNotes);



        let chordNotes = this.configObj().chordsProgressionConfig.map((chord: {chordNotes: boolean[]}) => {
          return chord.chordNotes.reduce((acc:number[], curr:boolean, index:number) => {
            if (curr) {
              acc.push(index);
            }
            return acc;
          }, []);
  
        })
        console.log(chordNotes);

      });
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
