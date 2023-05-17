import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PhoenixUIModule } from 'phoenix-ui-components';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetectorComponent } from './detector/detector.component';
import { EventDisplayComponent } from './event-display/event-display.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    DetectorComponent,
    EventDisplayComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PhoenixUIModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
