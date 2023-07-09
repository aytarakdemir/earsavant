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
  chordProgressionConfig: WritableSignal<string[][]> = signal([[]]);


  chordsWithIndex: number[][] = [[]];

  configObj: WritableSignal<any> = signal(
    {
      presetName: 'preset',
      octaveConfigLow: 2,
      octaveConfigHigh: 6,
      scaleConfig: [true,false,true,false,true,true,false,true,false,true,false,true],
      possibleRandomNotesConfig: [true,null,true,null,true,true,null,true,null,true,null,true],
      walkMode: WalkMode.ToRoot,
      chordsProgressionConfig: [{chordNotes: [true,false,false,false,true,false,false,true,false,false,false,false]},{chordNotes: [true,false,false,false,false,true,false,false,false,true,false,false]}],
      chordsProgressionRandom: false,
      showChordsChromatic: false
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


        this.chordsWithIndex = this.configObj().chordsProgressionConfig.map((chord: {chordNotes: boolean[]}) => {
          return chord.chordNotes.reduce((acc:number[], curr:boolean, index:number) => {
            if (curr) {
              acc.push(index);
            }
            return acc;
          }, []);
  
        })
        console.log(this.chordsWithIndex);
        
        let key = this.keySrv.getKeyNotesForOctave(this.keySrv.selectedRootNote(), 3, true);
        let chordsWithNotes = this.chordsWithIndex.map((chord: number[]) => {
          return chord.map((scaleIndex) => {
            return key[scaleIndex];
          })
        })

        this.chordProgressionConfig.set(chordsWithNotes);
        
        console.log(chordsWithNotes);

      });
    })

    effect(() => {
      this.keySrv.selectedRootNote();
      untracked(() => {
        let key = this.keySrv.getKeyNotesForOctave(this.keySrv.selectedRootNote(), 3, true)

        let chordsWithNotes = this.chordsWithIndex.map((chord: number[]) => {
          return chord.map((scaleIndex) => {
            return key[scaleIndex];
          })
        })

        this.chordProgressionConfig.set(this.configObj().chordsProgressionRandom ? this.randomizeOctaves(chordsWithNotes) : chordsWithNotes);
      })
    })
  }

  randomizeOctaves(chordProgression: string[][] ,octaveRange: {low: number, high: number} = {low: 2, high: 5}) {
    return chordProgression.map((chord: string[]) => {
      return chord.map((note: string) => {
        return note.slice(0, -1) + String(this.getRandomNumber(octaveRange.low, octaveRange.high));
      });
    });
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  addNewPreset(preset: any) {
    console.log(preset);
  }


  aa() {
    this.configObj.set({
      presetName: 'aa1',
      octaveConfigLow: 2,
      octaveConfigHigh: 6,
      scaleConfig: [true,false,true,false,true,true,false,true,false,true,false,true],
      possibleRandomNotesConfig: [true,null,true,null,true,true,null,true,null,true,null,true],
      walkMode: WalkMode.ToRoot,
      chordsProgressionConfig: [{chordNotes: [true,false,false,false,true,false,false,true,false,false,false,false]},
      {chordNotes: [true,false,false,false,false,true,false,false,false,true,false,false]},
      {chordNotes: [true,false,false,false,true,false,false,true,false,false,false,false]},
      {chordNotes: [true,false,false,false,false,true,false,false,false,true,false,false]}],
      chordsProgressionRandom: true,
      showChordsChromatic: false
    })
  }

}
