import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PhoenixUIModule } from 'phoenix-ui-components';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetectorComponent } from './detector/detector.component';
import { EventDisplayComponent } from './event-display/event-display.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingComponent } from './loading/loading.component';
import { ViewToggleComponent } from './view-toggle/view-toggle.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        AppComponent,
        DetectorComponent,
        EventDisplayComponent,
        LoadingComponent,
        ViewToggleComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        PhoenixUIModule,
        BrowserAnimationsModule,
        MatTooltipModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
