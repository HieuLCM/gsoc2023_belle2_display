import { Component } from '@angular/core';
import { EventDisplayService } from 'phoenix-ui-components';

@Component({
  selector: 'app-view-toggle',
  templateUrl: './view-toggle.component.html',
  styleUrls: ['./view-toggle.component.scss'],
})
export class ViewToggleComponent {
  orthographicView: boolean = true;

  constructor(private eventDisplay: EventDisplayService) {}

  switchMainView() {
    this.orthographicView = !this.orthographicView;
    this.eventDisplay
      .getUIManager()
      .toggleOrthographicView(this.orthographicView);
  }
}
