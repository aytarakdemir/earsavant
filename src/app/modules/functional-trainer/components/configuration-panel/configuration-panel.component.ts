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
      octaveConfigLow: [2], // Provide a default value for number control
      octaveConfigHigh: [6], // Provide a default value for number control
      possibleNotesConfig: this.formBuilder.array([true,false,true,false,true,true,false,true,false,true,false,true]), // Create an empty form array
      scaleConfig: this.formBuilder.array([true,null,true,null,true,true,null,true,null,true,null,true]), // Create an empty form array
      walkMode: [WalkMode.ToRoot]
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

  get possibleNotesConfigFormArray() {
    return this.myForm.controls['possibleNotesConfig'] as FormArray;
  }
  get scaleConfigFormArray() {
    return this.myForm.controls['scaleConfig'] as FormArray;
  }
  

  ngOnDestroy() {
    this.possibleNotesSubscription.unsubscribe();
  }

}
