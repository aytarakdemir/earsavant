import { Injectable, OnDestroy, WritableSignal, effect, signal, untracked } from '@angular/core';
import * as _ from 'lodash';
import { KeyService } from 'src/app/shared/services/key/key.service';
import { WalkMode } from '../pages/functional-trainer/functional-trainer.component';
import { BaseService } from 'src/app/core/base/base.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';


export class Preset {
  name!: string;
  octaveConfigLow: number = 2;
  octaveConfigHigh: number = 6;
  scaleConfig!: any[];
  possibleRandomNotesConfig!: any[];
  walkMode: WalkMode = WalkMode.ToRoot;
  chordsProgressionConfig: {chordNotes: any[]}[] = [];
  chordsProgressionRandom: boolean = false;
  showChordsChromatic: boolean = false;
}


@Injectable({
  providedIn: 'root'
})
export class ConfigService extends BaseService implements OnDestroy {
  possibleRandomNotesConfig: WritableSignal<number[]> = signal([]);
  scaleConfig: WritableSignal<number[]> = signal([]);
  walkModeConfig: WritableSignal<WalkMode> = signal(WalkMode.ToRoot);
  octaveConfig: WritableSignal<{low: number, high: number}> = signal({low: 2, high: 2});
  chordProgressionConfig: WritableSignal<string[][]> = signal([[]]);


  chordsWithIndex: number[][] = [[]];

  destroy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  presets: Map<string, Preset> = new Map<string,Preset>();

  activePresetId: string = this.generateRandomPresetId();

  configObj: WritableSignal<Preset> = signal(
    {
      name: 'preset',
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

  constructor(private keySrv: KeyService, 
              protected override http: HttpClient,
              private toastr: ToastrService) {
    super(http);

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
  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.complete();
  }


  sendPresets() {
    console.log([...this.presets]);
    this.post(
      'http://localhost:3000/save_presets',
      JSON.stringify({userID: localStorage.getItem('userId'), presets: [...this.presets]})
    ).subscribe(
      {
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log('Preset Error', err);
          this.toastr.error(err.error.message, 'Preset Error');
        }
      }
    );
  }

  getPresets() {
    this.post(
      'http://localhost:3000/get_presets',
      JSON.stringify({userID: localStorage.getItem('userId')})
    ).subscribe(
      {
        next: (res: any) => {
          let presetList = JSON.parse(res.presets.preset_list);
          let presetMap = new Map<string, any>(presetList);
          console.log(presetMap);
          this.presets = presetMap;
        },
        error: (err) => {
          console.log('Preset Error', err);
        }
      }
    );
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

  addNewPreset(preset: Preset) {
    const key = this.generateRandomPresetId();
    this.presets.set(key, preset);
    this.activePresetId = key;
    console.log(Object.fromEntries(this.presets.entries()));
  }

  setActivePreset(presetKey: string) {
    this.configObj.set(this.presets.get(presetKey) ?? this.configObj());
    this.activePresetId = presetKey;
  }

  removePreset() {
    this.presets.delete(this.activePresetId);
    this.setActivePreset(this.presets.keys().next().value);
  }

  applyChangesToActivePreset(key: string, formValue: Preset) {
    this.presets.set(key, formValue ?? this.configObj());
  }

  generateRandomPresetId() {
    return Date.now().toString() + Math.random().toString().substring(5);
  }
}
