import { PhoenixLoader } from 'phoenix-event-display/dist/loaders/phoenix-loader';
import { settings as jsrootSettings, openFile } from 'jsroot';
import { TSelector, treeProcess } from 'jsroot/tree';
import { format } from 'date-fns';

class TEventSelector extends TSelector {
    /** constructor */
    private branch: string;
    private branchData: any;
    constructor(branch: string) {
        super();
        this.branch = branch;
        this.addBranch(branch);
        // if (this.branch === "EventMetaData") {
        //     this.branchData = {}
        // } else {
        //     this.branchData = [];
        // }
        this.branchData = [];
    }

    getECLClusters(data: any) {
        return [
            ...data.map(cluster => ({
                r: cluster['m_r'],
                phi: cluster['m_phi'],
                theta: cluster['m_theta'],
                energy: Math.exp(cluster?.['m_logEnergy'])
            }))
        ];
    }

    getKLMClusters(data: any) {
        return [
            ...data.map(cluster => ({
                x: cluster['m_globalX'],
                y: cluster['m_globalY'],
                z: cluster['m_globalZ'],
                layer: cluster['m_layers'],
                innermostLayer: cluster['m_innermostLayer']
            }))
        ];
    }

    getEventMetaData(data: any) {
        return {
            experiment: data['m_experiment'],
            run: data['m_run'],
            event: data['m_event'],
            time: format(
                parseInt(data['m_time'].toString().slice(0, -6)),
                'yyyy-MM-dd HH:mm:ss'
            )
        };
    }

    /** function called before reading of TTree starts */
    Begin() {}

    /** function called for every entry */
    Process(entryNum: any) {
        if (this.branch === 'ECLClusters') {
            this.branchData.push({
                ECLClusters: this.getECLClusters(this.tgtobj['ECLClusters'])
            });
        }
        if (this.branch === 'KLMClusters') {
            this.branchData.push({
                KLMClusters: this.getKLMClusters(this.tgtobj['KLMClusters'])
            });
        }
        if (this.branch === 'EventMetaData') {
            this.branchData.push({
                EventMetadata: this.getEventMetaData(
                    this.tgtobj['EventMetaData']
                )
            });
        }
        if (this.branch === 'Tracks') {
            this.branchData.push({
                Tracks: []
            });
        }
        if (this.branch === 'MCParticles') {
            this.branchData.push({
                MCParticles: []
            });
        }
    }

    /** function called when processing finishes */
    Terminate(res: any) {}

    public getBranchData() {
        return this.branchData;
    }
}

export class EventLoader extends PhoenixLoader {
    private fileData: any;
    private fileURL: any;
    private branches: any;
    private entries: any;

    constructor(fileURL: any) {
        super();

        this.fileURL = fileURL;

        this.fileData = {};

        this.branches = [
            'KLMClusters',
            'ECLClusters',
            'Tracks',
            'MCParticles',
            'EventMetaData'
        ];
    }

    public async getData(treeName: string, onHandleData: (data: any) => void) {
        jsrootSettings.UseStamp = false;

        const file = await openFile(this.fileURL);
        const tree = await file.readObject(treeName);
        // this.branches = tree.fBranches.arr.map((branch: any) => branch.fName);
        this.entries = tree.fEntries;

        // Use Promise.all and map to wait for all promises to resolve.
        const branchDataPromises = this.branches.map(async (branch: string) => {
            const selector = new TEventSelector(branch);
            await treeProcess(tree, selector);
            return selector.getBranchData();
        });
        const allBranchData = await Promise.all(branchDataPromises);

        for (let i = 0; i < this.entries; i++) {
            for (let j = 0; j < this.branches.length; j++) {
                this.fileData = {
                    ...this.fileData,
                    [`Event ${i + 1}`]: {
                        ...this.fileData[`Event ${i + 1}`],
                        ...allBranchData[j][i]
                    }
                };
            }
        }
        // Save fileData by input the appropriate onHandleData function
        onHandleData(this.fileData);
        return this.fileData;
    }
}
