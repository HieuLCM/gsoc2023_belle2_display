import { PhoenixLoader, PhoenixObjects } from 'phoenix-event-display';
import { KLMClusterObject } from './objects/klmCluster';

import * as THREE from 'three';

export class Belle2Loader extends PhoenixLoader {
  private data: any;
  private scale: number = 2;

  constructor() {
    super();
    this.data = {};
  }

  protected override loadObjectTypes(eventData: any) {
    super.loadObjectTypes(eventData);
    if (eventData.KLMClusters) {
      this.addObjectType(
        eventData.KLMClusters,
        KLMClusterObject.getKLMCluster,
        'KLMCLusters'
      );
    }
    if (eventData.MCParticles) {
      this.addObjectType(
        eventData.MCParticles,
        PhoenixObjects.getTrack,
        "MCParticles"
      )
    }
  }

  public getEventData(): any {
    const eventData: any = {
      CaloClusters: {},
      KLMClusters: {},
      Tracks: {},
    };

    eventData.KLMClusters = this.getKLMClusters();
    eventData.CaloClusters = this.getCaloClusters();
    eventData.Tracks = this.getTracks();
    for (const objectType of ['CaloClusters', 'KLMClusters', 'Tracks', "MCParticles"]) {
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
    const clusterNum = this.data.KLMClusters.length;
    if (clusterNum !== 0) {
      for (let i = 0; i < clusterNum; i++) {
        klmClusters[`KLMCluster_${i}`] = [this.data.KLMClusters[i]];
      }
    }
    return klmClusters;
  }

  private getCaloClusters(): any {
    let caloClusters: any = {};
    caloClusters['ECLClusters'] = this.data.ECLClusters.map((cluster: any) => ({
      energy: 10000 * cluster?.energy,
      eta: -Math.log(Math.tan(cluster?.theta / 2)),
      phi: cluster?.phi,
      radius: 2 * cluster?.r + (10000 * cluster?.energy * 0.03) / 2.9,
      side: 6,
      color: '#FF5533',
    }));

    return caloClusters;
  }

  private getTracks(): any {
    let tracks: any = {};
    tracks['FittedTrack'] = this.data.Tracks.map((track: any) => ({
      charge: track.charge,
      color: track.charge ? track.charge === 1.0 ? 0x000000 : 0x014A00 : 0xFFFFFF,
      pos: track.pos.map((row: any) => row.map((val: any) => val * this.scale)),
      d0: track.d0,
      z0 : track.z0,
      phi: track.phi0,
      omega: track.omega,
      tanLambda: track.tanLambda
    }));
    return tracks;
  }

  private getMCParticle(): any {
    let particles: any = {};
    particles['ReconstructedTrack'] = this.data.MCParticles.map((particle: any) => ({
      charge: particle.charge,
      pos: particle.pos.map((row: any) => row.map((val: any) => val * this.scale)),
    }))
  }
}
