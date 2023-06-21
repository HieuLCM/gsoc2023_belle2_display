import { Component, OnInit } from '@angular/core';
import { EventLoader } from '../../loaders/event-loader';
import {
    EventDataFormat,
    EventDataImportOption,
    EventDisplayService
} from 'phoenix-ui-components';
import {
    Configuration,
    PhoenixMenuNode,
    PresetView,
    StateManager
} from 'phoenix-event-display';
import { DetectorLoader } from './detector-loader';
import * as saveAs from 'file-saver';
import { eventConvertor } from './event-convertor';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { Belle2Loader } from 'src/loaders/event-data-loaders';
import { Color } from 'three';
// import * as mdst from '../../assets/mdst.json'
// import * as phoenixMenuConfig from '../../assets/config.json';

@Component({
    selector: 'app-event-display',
    templateUrl: './event-display.component.html',
    styleUrls: ['./event-display.component.scss']
})
export class EventDisplayComponent implements OnInit {
    loaded = false;
    loadingProgress = 0;
    phoenixMenuRoot: PhoenixMenuNode = new PhoenixMenuNode(
        'Phoenix Menu',
        'phoenix-menu'
    );

    constructor(private eventDisplay: EventDisplayService) {}

    async ngOnInit() {
        // const detectorFile = new DetectorLoader('../../assets/Belle2Geo.root');
        // detectorFile.getData('VGM Root geometry');
        const belle2Loader = new Belle2Loader();

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
        // });
        // eventConvertor()
        const configuration: Configuration = {
            eventDataLoader: belle2Loader,
            presetViews: [
                new PresetView(
                    'Left View',
                    [0, 0, -1000],
                    [0, 0, 0],
                    'left-cube'
                ),
                new PresetView(
                    'Center View',
                    [-1000, 50, 0],
                    [0, 0, 0],
                    'top-cube'
                ),
                new PresetView(
                    'Right View',
                    [0, 0, 1200],
                    [0, 0, 0],
                    'right-cube'
                )
            ],
            defaultView: [820, -200, 530, 0, 0, 0],
            phoenixMenuRoot: this.phoenixMenuRoot,
            forceColourTheme: 'dark'
            // defaultEventFile: {
            //   eventFile: '../../assets/mdst_event.json',
            //   eventType: 'json',
            // },
        };

        this.eventDisplay.init(configuration);
        this.eventDisplay.loadGLTFGeometry(
            '../../assets/Belle2Geo_EventDisplay.gltf',
            undefined,
            undefined,
            2,
            true
        );

        // fetch('../../assets/mdst_data.json')
        //   .then((response) => {
        //     if (!response.ok) {
        //       throw new Error('Network response was not ok');
        //     }
        //     return response.json();
        //   })
        //   .then((mdst) => {
        //     const mdstEventData = belle2Loader.getAllEventData(mdst);

        //     this.eventDisplay.parsePhoenixEvents(mdstEventData);
        //   });

        try {
            const response = await fetch('../../assets/mdst_data.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const mdst = await response.json();
            const mdstEventData = belle2Loader.getAllEventData(mdst);
            this.eventDisplay.parsePhoenixEvents(mdstEventData);
        } catch (error) {
            console.error(error);
        }

        this.eventDisplay
            .getLoadingManager()
            .addProgressListener(progress => (this.loadingProgress = progress));
        this.eventDisplay.getLoadingManager().addLoadListenerWithCheck(() => {
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
