import { Component, Input } from '@angular/core';
import { EventLoader } from './event-loader';

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.scss'],
})
export class EventDisplayComponent {
  @Input() eventData = '';
  constructor() {}
  ngOnInit() {
    const eventfile = new EventLoader('../../assets/mdst-v06-00-00.root');
    eventfile.getData('tree', (data: any) => {
      console.log(data);
    });
  }
}
