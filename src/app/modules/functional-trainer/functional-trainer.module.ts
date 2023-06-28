import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FunctionalTrainerRoutingModule } from './functional-trainer-routing.module';
import { FunctionalTrainerComponent } from './pages/functional-trainer/functional-trainer.component';
import { ProgressInfoComponent } from './components/progress-info/progress-info.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';


@NgModule({
  declarations: [
    FunctionalTrainerComponent,
    ProgressInfoComponent
  ],
  imports: [
    CommonModule,
    FunctionalTrainerRoutingModule,
    LoadingComponent
  ]
})
export class FunctionalTrainerModule { }
