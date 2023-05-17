import { Component, OnInit } from '@angular/core';
import { DetectorLoader } from './detector-loader';
import { EventDisplayService } from 'phoenix-ui-components';
import {
  Configuration,
  PhoenixMenuNode,
  PresetView,
} from 'phoenix-event-display';

@Component({
  selector: 'app-detector',
  templateUrl: './detector.component.html',
  styleUrls: ['./detector.component.scss'],
})
export class DetectorComponent implements OnInit {
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
        new PresetView('Center View', [1300, 100, 0], [0, 0, 0], 'top-cube'),
        new PresetView('Left View', [0, 250, 1200], [0, 0, 0], 'left-cube'),
        new PresetView('Right View', [0, 250, -1200], [0, 0, 0], 'right-cube'),
      ],
      defaultView: [1000, -300, 600, 0, 0, 0],
      phoenixMenuRoot: this.phoenixMenuRoot,
    };

    this.eventDisplay.init(configuration);

    this.eventDisplay.loadGLTFGeometry(
      '../../assets/Belle2Geo_BKLM.gltf',
      undefined,
      undefined,
      1,
      true
    );

    this.eventDisplay.loadGLTFGeometry(
      '../../assets/Belle2Geo_Section.gltf',
      undefined,
      undefined,
      1,
      true
    );

    this.eventDisplay.loadGLTFGeometry(
      '../../assets/Belle2Geo.gltf',
      undefined,
      undefined,
      1,
      true
    );

    this.eventDisplay.loadGLTFGeometry(
      '../../assets/Belle2Geo_ARICH.gltf',
      undefined,
      undefined,
      1,
      true
    );

    this.eventDisplay.loadGLTFGeometry(
      '../../assets/Belle2Geo_Material_FWD.gltf',
      undefined,
      undefined,
      1,
      true
    );

    this.eventDisplay.loadGLTFGeometry(
      '../../assets/Belle2Geo_Material_BWD.gltf',
      undefined,
      undefined,
      1,
      true
    );

    this.eventDisplay.loadGLTFGeometry(
      '../../assets/Belle2Geo_Material_TOP_BWD.gltf',
      undefined,
      undefined,
      1,
      true
    );

    this.eventDisplay.loadGLTFGeometry(
      '../../assets/Belle2Geo_Material_Barrel.gltf',
      undefined,
      undefined,
      1,
      true
    );

    this.eventDisplay.loadGLTFGeometry(
      '../../assets/Belle2Geo_TOP.gltf',
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
