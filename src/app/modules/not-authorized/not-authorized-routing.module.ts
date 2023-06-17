import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotAuthorizedComponent } from './pages/not-authorized/not-authorized.component';

const routes: Routes = [
  {
    path: '',
    component: NotAuthorizedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotAuthorizedRoutingModule { }
