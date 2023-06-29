import { Component } from '@angular/core';
import { KeyService } from 'src/app/shared/services/key/key.service';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { WalkMode } from '../../pages/functional-trainer/functional-trainer.component';


@Component({
  selector: 'app-configuration-panel',
  templateUrl: './configuration-panel.component.html',
  styleUrls: ['./configuration-panel.component.scss']
})
export class ConfigurationPanelComponent {
  myForm: FormGroup;

  WalkMode = WalkMode;
  possibleNotesSubscription: any;

  constructor(public keySrv: KeyService, private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      octaveConfigLow: [2],
      octaveConfigHigh: [6],
      possibleNotesConfig: this.formBuilder.array([true,false,true,false,true,true,false,true,false,true,false,true]),
      scaleConfig: this.formBuilder.array([true,null,true,null,true,true,null,true,null,true,null,true]),
      walkMode: [WalkMode.ToRoot],
      chordsProgressionConfig: this.formBuilder.array([this.createChordFormGroup()]),
    });

    this.possibleNotesSubscription = this.possibleNotesConfigFormArray.valueChanges.subscribe(possibleNotesArr => {
      possibleNotesArr.forEach((note:boolean, i:number) => {
        if (!note) {
          this.scaleConfigFormArray.controls[i].setValue(null);
        } else {
          this.scaleConfigFormArray.controls[i].setValue(true);
        }
      })
    });

    this.myForm.valueChanges.subscribe(form => {
      console.log(form);
    }

    )
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
    if (this.chordsProgressionConfigFormArray.length === 1) return;
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
