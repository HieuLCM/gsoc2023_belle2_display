import { Component, OnInit } from '@angular/core';
import { EventLoader } from './event-loader';
import { EventDisplayService } from 'phoenix-ui-components';
import {
  Configuration,
  PhoenixMenuNode,
  PresetView,
  StateManager,
} from 'phoenix-event-display';
import { DetectorLoader } from './detector-loader';
import * as saveAs from 'file-saver';
// import * as phoenixMenuConfig from '../../assets/config.json';

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

    // const eventLoader = new EventLoader('../../assets/mdst-v06-00-00.root');

    // eventLoader.getData('tree', (data: any) => {
    //   // const replacer = (key: any, value: any) => {
    //   //   if (typeof value === 'bigint') {
    //   //     return value.toString();
    //   //   }
    //   //   return value;
    //   // };
    //   // const fileToSave = new Blob([JSON.stringify(data, replacer)], {
    //   //   type: 'application/json',
    //   // });
    //   // saveAs(fileToSave, 'mdst.json');
    // })

    const configuration: Configuration = {
      presetViews: [
        new PresetView('Left View', [0, 0, -1000], [0, 0, 0], 'left-cube'),
        new PresetView('Center View', [-1000, 50, 0], [0, 0, 0], 'top-cube'),
        new PresetView('Right View', [0, 0, 1200], [0, 0, 0], 'right-cube'),
      ],
      defaultView: [0, 0, 1000, 0, 0, 0],
      phoenixMenuRoot: this.phoenixMenuRoot,
    };

    this.eventDisplay.init(configuration);
    this.eventDisplay.loadGLTFGeometry(
      '../../assets/Belle2Geo_EventDisplay.gltf',
      undefined,
      undefined,
      3,
      true
    );

    this.eventDisplay
      .getLoadingManager()
      .addProgressListener((progress) => (this.loadingProgress = progress));
    this.eventDisplay.getLoadingManager().addLoadListenerWithCheck(() => {
      this.eventDisplay.getUIManager().toggleOrthographicView(true);
      this.loaded = true;
      // const urlConfig = this.eventDisplay
      // .getURLOptionsManager()
      // .getURLOptions()
      // .get('config');

      // if (!urlConfig) {
      //   this.loaded = true
      // // Load the defaut config from JSON file
      //   const stateManager = new StateManager();
      //   stateManager.loadStateFromJSON(phoenixMenuConfig);
      // }
    });
  }
}
