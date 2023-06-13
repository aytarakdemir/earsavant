import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FunctionalTrainerComponent } from './pages/functional-trainer/functional-trainer.component';

const routes: Routes = [
  {
    path: '',
    component: FunctionalTrainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FunctionalTrainerRoutingModule { }
