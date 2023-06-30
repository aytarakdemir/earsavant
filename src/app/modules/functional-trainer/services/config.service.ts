import { Injectable, WritableSignal, effect, signal, untracked } from '@angular/core';
import * as _ from 'lodash';
import { KeyService } from 'src/app/shared/services/key/key.service';
import { WalkMode } from '../pages/functional-trainer/functional-trainer.component';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  possibleRandomNotesConfig: WritableSignal<number[]> = signal([]);
  scaleConfig: WritableSignal<number[]> = signal([]);
  walkModeConfig: WritableSignal<WalkMode> = signal(WalkMode.ToRoot);
  octaveConfig: WritableSignal<{low: number, high: number}> = signal({low: 2, high: 2});


  configObj: WritableSignal<any> = signal(
    {
      octaveConfigLow: 2,
      octaveConfigHigh: 6,
      scaleConfig: [true,false,true,false,true,true,false,true,false,true,false,true],
      possibleRandomNotesConfig: [true,null,true,null,true,true,null,true,null,true,null,true],
      walkMode: WalkMode.ToRoot,
      chordsProgressionConfig: [{chordNotes: [true,true,false,false,false,false,false,false,false,false,false,false]},{chordNotes: [true,true,false,false,false,false,false,false,false,false,false,false]}],
    }
  );

  constructor(private keySrv: KeyService) {
    effect(()=> {
      this.configObj();
      untracked(()=> {

        let scaleNotes = this.configObj().scaleConfig.reduce((acc:number[], curr:boolean, index:number) => {
          if (curr) {
            acc.push(index);
          }
          return acc;
        }, []);

        console.log('scaleNotes', scaleNotes);
        this.scaleConfig.set(scaleNotes);
        
        let i = 0
        let possibleNotes = this.configObj().possibleRandomNotesConfig.reduce((acc:number[], curr:boolean) => {
          if (curr) {
            acc.push(i);
          }
          if (curr !== null) {
            i++;
          }
          return acc;
        }, []);
        
        console.log('possibleNotes', possibleNotes);
        if (possibleNotes[0] === 0) {
          possibleNotes.push(possibleNotes.length);
        }
        console.log('possibleNotes', possibleNotes);
        this.possibleRandomNotesConfig.set(possibleNotes);


        let octaveConfigObj = {low: this.configObj().octaveConfigLow, high: this.configObj().octaveConfigHigh};
        this.octaveConfig.set(octaveConfigObj);


        this.walkModeConfig.set(this.configObj().walkMode);


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
      scaleConfig: [true,false,true,false,true,true,false,true,false,true,false,true],
      possibleRandomNotesConfig: [true,null,true,null,true,true,null,true,null,true,null,true],
      walkMode: WalkMode.ToRoot,
      chordsProgressionConfig: [{chordNotes: [true,true,false,false,false,false,false,false,false,false,false,false]},
      {chordNotes: [true,true,false,false,false,false,false,false,false,false,false,false]},
      {chordNotes: [true,true,false,false,false,false,false,false,false,false,false,false]},
      {chordNotes: [true,true,false,false,false,false,false,false,false,false,false,false]}],
    })
  }

}
