import { PhoenixLoader } from "phoenix-event-display";
import { KLMClusterObject } from "./objects/klmCluster";

import * as THREE from 'three'

export class Belle2Loader extends PhoenixLoader {
    private data: any;

    constructor() {
        super()
        this.data = {}
    }

    protected override loadObjectTypes(eventData: any) {
        super.loadObjectTypes(eventData);
        if (eventData.KLMClusters) {
            this.addObjectType(
                eventData.KLMClusters,
                KLMClusterObject.getKLMCluster,
                'KLMCLusters'
            )
        }
    }

    public getEventData(): any {
        const eventData: any = {
            CaloClusters: {},
            KLMClusters: {}
        }

        eventData.KLMClusters = this.getKLMClusters();
        eventData.CaloClusters = this.getCaloClusters();
        for (const objectType of [
            "CaloClusters",
            "KLMClusters"
        ]) {
            if (Object.keys(eventData[objectType]).length === 0) {
                eventData[objectType] = undefined
            } 
        }

        return eventData
    }

    public getAllEventData(allEventsDataFromJSON: any): any {
        const allEventsData: any = {}
        for (let i = 0; i < Object.keys(allEventsDataFromJSON).length-1; i++) {
            this.data = allEventsDataFromJSON?.[i]
            allEventsData[`Event ${i}`] = this.getEventData()
        }
        console.log(allEventsData)
        return allEventsData
    }

    private getKLMClusters(): any {
        const klmCluster: any = {}
        const clusterNum = this.data.KLMClusters.length
        if (clusterNum !== 0) {
            for (let i = 0; i<clusterNum; i++) {
                klmCluster[`Cluster_${i}`] = [this.data.KLMClusters[i]]
            }
        }
        return klmCluster
    }

    private getCaloClusters(): any {
        let caloCluster: any = {};
        caloCluster["ECLClusters"] = this.data.ECLClusters.map((cluster: any) => ({
            energy: 10000 * Math.exp(cluster?.['m_logEnergy']),
            eta: -Math.log(Math.tan(cluster?.['m_theta'] / 2)),
            phi: cluster?.['m_phi'],
            radius:
                2 * cluster?.m_r +
                (10000 * Math.exp(cluster?.['m_logEnergy']) * 0.03) / 2.9,
            side: 6,
            color: '#FF5533',
            }))

            return caloCluster
    }
}