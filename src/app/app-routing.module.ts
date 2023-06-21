import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { EventDisplayComponent } from './event-display/event-display.component';
import { DetectorComponent } from './detector/detector.component';

// Define the routes for the application
const routes: Routes = [
    {
        path: 'detector',
        component: DetectorComponent
    },
    {
        path: '', // set the root path to display AppComponent
        component: EventDisplayComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
