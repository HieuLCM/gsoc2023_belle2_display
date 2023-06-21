import { Cut, PhoenixLoader, PhoenixObjects } from 'phoenix-event-display';
import { KLMClusterObject } from './objects/klmCluster';

import { MCParticleObject } from './objects/mcParicles';
import { ECLClusterObject } from './objects/eclCluster';

export class Belle2Loader extends PhoenixLoader {
    private data: any;
    private scale: number = 2;

    constructor() {
        super();
        this.data = {};
    }

    protected override loadObjectTypes(eventData: any) {
        super.loadObjectTypes(eventData);
        const pi = parseFloat(Math.PI.toFixed(2));
        if (eventData.KLMClusters) {
            this.addObjectType(
                eventData.KLMClusters,
                KLMClusterObject.getKLMCluster,
                'KLMCLusters'
            );
        }
        if (eventData.MCParticles) {
            const cuts: Cut[] = [];

            this.addObjectType(
                eventData.MCParticles,
                MCParticleObject.getMCParticle,
                'MCParticles',
                false,
                cuts
            );
        }
        if (eventData.ECLClusters) {
            this.addObjectType(
                eventData.ECLClusters,
                ECLClusterObject.getECLCluster,
                'ECLClusters'
            );
        }
    }

    public getEventData(): any {
        const eventData: any = {
            ECLClusters: {},
            KLMClusters: {},
            Tracks: {},
            MCParticles: {}
        };

        eventData.KLMClusters = this.getKLMClusters();
        eventData.ECLClusters = this.getECLClusters();
        eventData.Tracks = this.getTracks();
        eventData.MCParticles = this.getMCParticles();
        for (const objectType of [
            'ECLClusters',
            'KLMClusters',
            'Tracks',
            'MCParticles'
        ]) {
            if (Object.keys(eventData[objectType]).length === 0) {
                eventData[objectType] = undefined;
            }
        }

        return eventData;
    }

    public getAllEventData(allEventsDataFromJSON: any): any {
        const allEventsData: any = {};
        for (let i = 1; i < Object.keys(allEventsDataFromJSON).length; i++) {
            this.data = allEventsDataFromJSON?.[`Event ${i}`];
            allEventsData[`Event ${i}`] = this.getEventData();
        }
        return allEventsData;
    }

    private getKLMClusters(): any {
        const klmClusters: any = {};
        const clusterNum = this.data?.KLMClusters.length;
        if (clusterNum !== 0) {
            for (let i = 0; i < clusterNum; i++) {
                klmClusters[`KLMCluster_${i}`] = [this.data.KLMClusters[i]];
            }
        }
        return klmClusters;
    }

    private getECLClusters(): any {
        let eclClusters: any = {};
        const clusterNum = this.data?.ECLClusters.length;
        if (clusterNum !== 0) {
            for (let i = 0; i < clusterNum; i++) {
                eclClusters[`ECLCluster_${i}`] = [
                    {
                        energy: this.data.ECLClusters[i].energy,
                        theta: this.data.ECLClusters[i].theta,
                        phi: this.data.ECLClusters[i].phi,
                        radius: this.data.ECLClusters[i].r
                    }
                ];
            }
        }
        return eclClusters;
    }

    private getTracks(): any {
        let tracks: any = {};
        tracks['Fitted Track'] = this.data?.Tracks.map((track: any) => ({
            charge: track.charge,
            // color: track.charge ? track.charge === 1.0 ? "E33535" : "336FD1": "A6C55E",
            color: '336FD1',
            pos: track.pos.map((row: any) =>
                row.map((val: any) => val * this.scale)
            ),
            d0: track.d0,
            z0: track.z0,
            phi: track.phi0,
            omega: track.omega,
            tanLambda: track.tanLambda
        }));
        return tracks;
    }

    private getMCParticles(): any {
        let particles: any = {};
        let collection: any[] = [];
        // const pdgMap: any = {
        //   "22": "photon",
        //   "321": "kaon",
        //   "-321": "kaon",
        //   "211": "pion",
        //   "-211": "pion",
        //   "111": "pion",
        //   "11": "electron",
        //   "-11": "electron",
        //   "13": "muon",
        //   "-13": "muon",
        //   "2212": "proton",
        //   "-2212": "proton",
        //   "411": "deuteron",
        //   "-411": "deuteron",
        //   "421": "deuteron"
        // }
        this.data?.MCParticles.forEach((particle: any) => {
            if (particle?.seen?.length) {
                if (!collection.includes(particle.name)) {
                    collection.push(particle.name);
                    particles[particle.name] = [];
                }
                particles[particle.name].push({
                    name: particle.name,
                    charge: particle.charge,
                    pos: particle.pos.map((row: any) =>
                        row.map((val: any) => val * this.scale)
                    ),
                    PDG: particle.PDG,
                    color: this.getParticleColor(particle.PDG),
                    seen: particle.seen
                });
            }
        });

        // particles['ReconstructedTrack'] = this.data?.MCParticles.map((particle: any) => ({
        //   name: particle.name,
        //   charge: particle.charge,
        //   pos: particle.pos.map((row: any) => row.map((val: any) => val * this.scale)),
        //   PDG: particle.PDG,
        //   color: this.getParticleColor(particle.PDG)
        // }))
        return particles;
    }

    private getParticleColor(pdg: number): string {
        switch (pdg) {
            case 22:
                return '#ff1e1e';
            case 321:
            case -321:
                return '#22ff1e';
            case 2212:
            case -2212:
                return '#f213a0';
            case 411:
            case -411:
            case 421:
                return '#00FFFF';
            case 11:
            case -11:
                return '#f26513';
            case 13:
            case -13:
                return '#f2eb13';
            case 211:
            case -211:
            case 111:
                return '#1322f2';
            case 12:
            case 14:
            case 16:
            case -12:
            case -14:
            case -16:
                return '#595954';
            default:
                return '#bdbdb5';
        }
    }
}
