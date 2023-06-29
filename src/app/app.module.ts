import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PhoenixUIModule } from 'phoenix-ui-components';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetectorComponent } from './detector/detector.component';
import { EventDisplayComponent } from './event-display/event-display.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingComponent } from './loading/loading.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomizedEventSelectorComponent } from './customized-event-selector/customized-event-selector.component';
import { IOEventComponent } from './io-event/io-event.component';
import { IODialogComponent } from './io-event/io-dialog/io-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        DetectorComponent,
        EventDisplayComponent,
        LoadingComponent,
        CustomizedEventSelectorComponent,
        IOEventComponent,
        IODialogComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        PhoenixUIModule,
        BrowserAnimationsModule,
        MatTooltipModule,
        MatDialogModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
