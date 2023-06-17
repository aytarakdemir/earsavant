import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotAuthorizedRoutingModule } from './not-authorized-routing.module';
import { NotAuthorizedComponent } from './pages/not-authorized/not-authorized.component';


@NgModule({
  declarations: [
    NotAuthorizedComponent
  ],
  imports: [
    CommonModule,
    NotAuthorizedRoutingModule
  ]
})
export class NotAuthorizedModule { }
