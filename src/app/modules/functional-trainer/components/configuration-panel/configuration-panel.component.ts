import { Component, effect } from '@angular/core';
import { KeyService } from 'src/app/shared/services/key/key.service';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { WalkMode } from '../../pages/functional-trainer/functional-trainer.component';
import { ConfigService } from '../../services/config.service';


@Component({
  selector: 'app-configuration-panel',
  templateUrl: './configuration-panel.component.html',
  styleUrls: ['./configuration-panel.component.scss']
})
export class ConfigurationPanelComponent {
  myForm: FormGroup;

  WalkMode = WalkMode;
  possibleNotesSubscription: any;

  constructor(public keySrv: KeyService, private formBuilder: FormBuilder, public configSrv: ConfigService) {
    this.myForm = this.formBuilder.group({
      octaveConfigLow: '',
      octaveConfigHigh: '',
      possibleNotesConfig: this.formBuilder.array([false,false,false,false,false,false,false,false,false,false,false,false]),
      scaleConfig: this.formBuilder.array([false,false,false,false,false,false,false,false,false,false,false,false]),
      walkMode: [],
      chordsProgressionConfig: this.formBuilder.array([this.createChordFormGroup()]),
    });


    effect(() => {
      while(this.chordsProgressionConfigFormArray.controls.length !== 0) {
        this.removeNestedFormGroup(0);
      }
      for (let i = 0; i < this.configSrv.configObj().chordsProgressionConfig.length; i++) {
        this.addNestedFormGroup();
      }
      this.myForm.setValue(this.configSrv.configObj());

    })

    this.possibleNotesSubscription = this.possibleNotesConfigFormArray.valueChanges.subscribe(possibleNotesArr => {
      possibleNotesArr.forEach((note:boolean, i:number) => {
        if (!note) {
          this.scaleConfigFormArray.controls[i].setValue(null);
        } else {
          this.scaleConfigFormArray.controls[i].setValue(true);
        }
      })
    });



  
  }
  
  apply() {
    this.configSrv.configObj.set(this.myForm.value);
  }

  createChordFormGroup(): FormGroup {
    return this.formBuilder.group({
      chordNotes: this.formBuilder.array([false,false,false,false,false,false,false,false,false,false,false,false])
    });
  }

  addNestedFormGroup() {
    if (this.chordsProgressionConfigFormArray.length > 10) return;
    this.chordsProgressionConfigFormArray.push(this.createChordFormGroup());
  }

  removeNestedFormGroup(index: number) {
    const nestedFormArray = this.myForm.get('chordsProgressionConfig') as FormArray;
    nestedFormArray.removeAt(index);
  }

  get possibleNotesConfigFormArray() {
    return this.myForm.controls['possibleNotesConfig'] as FormArray;
  }
  get scaleConfigFormArray() {
    return this.myForm.controls['scaleConfig'] as FormArray;
  }

  get chordsProgressionConfigFormArray() {
    return this.myForm.controls['chordsProgressionConfig'] as FormArray;
  }

  get chordNotes() {
    const nestedFormGroup = this.chordsProgressionConfigFormArray.controls[0] as FormGroup;
    return nestedFormGroup .get('chordNotes') as FormArray;
  }
  

  ngOnDestroy() {
    this.possibleNotesSubscription.unsubscribe();
  }

}
