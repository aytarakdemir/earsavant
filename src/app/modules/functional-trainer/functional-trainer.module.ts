import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FunctionalTrainerRoutingModule } from './functional-trainer-routing.module';
import { FunctionalTrainerComponent } from './pages/functional-trainer/functional-trainer.component';
import { ProgressInfoComponent } from './components/progress-info/progress-info.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { ConfigurationPanelComponent } from './components/configuration-panel/configuration-panel.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FunctionalTrainerComponent,
    ProgressInfoComponent,
    ConfigurationPanelComponent
  ],
  imports: [
    CommonModule,
    FunctionalTrainerRoutingModule,
    LoadingComponent,
    ReactiveFormsModule
  ]
})
export class FunctionalTrainerModule { }
