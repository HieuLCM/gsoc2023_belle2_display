import { Component, OnInit } from '@angular/core';
import { EventLoader } from './event-loader';
import { EventDisplayService } from 'phoenix-ui-components';
import {
  Configuration,
  PhoenixMenuNode,
  PresetView,
} from 'phoenix-event-display';
import { DetectorLoader } from './detector-loader';

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.scss'],
})
export class EventDisplayComponent implements OnInit {
  loaded = false;
  loadingProgress = 0;
  phoenixMenuRoot: PhoenixMenuNode = new PhoenixMenuNode(
    'Phoenix Menu',
    'phoenix-menu'
  );

  constructor(private eventDisplay: EventDisplayService) {}

  ngOnInit() {
    // const detectorFile = new DetectorLoader('../../assets/Belle2Geo.root');
    // detectorFile.getData('VGM Root geometry');

    const configuration: Configuration = {
      presetViews: [
        new PresetView('Center View', [300, 50, 0], [0, 0, 0], 'top-cube'),
        new PresetView('Left View', [0, 0, 550], [0, 0, 0], 'left-cube'),
        new PresetView('Right View', [0, 0, -500], [0, 0, 0], 'right-cube'),
      ],
      defaultView: [330, -150, 200, 0, 0, 0],
      phoenixMenuRoot: this.phoenixMenuRoot,
    };

    this.eventDisplay.init(configuration);
    this.eventDisplay.loadGLTFGeometry(
      '../../assets/Belle2Geo_EventDisplay.gltf',
      undefined,
      undefined,
      1,
      true
    );
    this.eventDisplay
      .getLoadingManager()
      .addProgressListener((progress) => (this.loadingProgress = progress));
    this.eventDisplay
      .getLoadingManager()
      .addLoadListenerWithCheck(() => (this.loaded = true));
  }
}
