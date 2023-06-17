import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FunctionalTrainerRoutingModule } from './functional-trainer-routing.module';
import { FunctionalTrainerComponent } from './pages/functional-trainer/functional-trainer.component';


@NgModule({
  declarations: [
    FunctionalTrainerComponent
  ],
  imports: [
    CommonModule,
    FunctionalTrainerRoutingModule
  ]
})
export class FunctionalTrainerModule { }
