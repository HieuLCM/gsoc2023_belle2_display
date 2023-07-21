import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { EventDisplayService } from 'phoenix-ui-components';

@Component({
    selector: 'app-object-selector-overlay',
    templateUrl: './object-selector-overlay.component.html',
    styleUrls: ['./object-selector-overlay.component.scss']
})
export class ObjectSelectorOverlayComponent implements OnInit {
    // Attributes for displaying the information of selected objects
    @Input() hiddenSelectedInfo: boolean;
    selectedObject = { name: 'Object', attributes: [] };

    constructor(private eventDisplay: EventDisplayService) {}

    ngOnInit() {
        this.eventDisplay.allowSelection(this.selectedObject);
    }

    onClick() {
        this.eventDisplay.highlightObject(
            this.eventDisplay.getActiveObjectId().value
        );
    }

    highlightMCParticle(particleIndex: number) {
        const particleCollections = [
            'Charged particles',
            'Neutral particles',
            'Neutrinos',
            'Others'
        ];
        const allCollections = this.eventDisplay.getCollections();
        for (let i = 0; i < allCollections.length; i++) {
            if (particleCollections.includes(allCollections[i])) {
                const particles = this.eventDisplay.getCollection(
                    allCollections[i]
                );
                const selectedParticle = particles.find(
                    (p: any) => p.index === particleIndex
                );
                if (selectedParticle) {
                    this.eventDisplay.highlightObject(selectedParticle.uuid);
                    this.eventDisplay
                        .getActiveObjectId()
                        .update(selectedParticle.uuid);
                    break;
                }
            }
        }
    }
}
