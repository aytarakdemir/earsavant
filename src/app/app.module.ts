import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoadingComponent } from "./shared/components/loading/loading.component";
import { BottomMenuComponent } from "./shared/components/bottom-menu/bottom-menu.component";
import { HeaderComponent } from './shared/components/header/header.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        LoadingComponent,
        BottomMenuComponent
    ]
})
export class AppModule { }
