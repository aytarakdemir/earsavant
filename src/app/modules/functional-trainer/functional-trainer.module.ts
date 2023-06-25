import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FunctionalTrainerRoutingModule } from './functional-trainer-routing.module';
import { FunctionalTrainerComponent } from './pages/functional-trainer/functional-trainer.component';
import { ProgressInfoComponent } from './components/progress-info/progress-info.component';


@NgModule({
  declarations: [
    FunctionalTrainerComponent,
    ProgressInfoComponent
  ],
  imports: [
    CommonModule,
    FunctionalTrainerRoutingModule
  ]
})
export class FunctionalTrainerModule { }
