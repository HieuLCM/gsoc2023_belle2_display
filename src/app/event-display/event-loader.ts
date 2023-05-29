import { PhoenixLoader } from 'phoenix-event-display/dist/loaders/phoenix-loader';
import { openFile } from 'jsroot';
import { TSelector, treeProcess } from 'jsroot/tree';

class TEventSelector extends TSelector {
  /** constructor */
  private branch: string;
  private branchData: any;
  constructor(branch: string) {
    super();
    this.branch = branch;
    this['addBranch'](branch);
    this.branchData = [];
  }

  /** function called before reading of TTree starts */
  Begin() {}

  /** function called for every entry */
  Process(entryNum: any) {
    this.branchData.push({ [this.branch]: this['tgtobj'][this.branch] });
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

  constructor(fileURL: string) {
    super();

    this.fileURL = fileURL;

    this.fileData = {};

    this.branches = [];
  }

  public async getData(treeName: string, onHandleData: (data: any) => void) {
    const file = await openFile(this.fileURL);
    const tree = await file.readObject(treeName);
    this.branches = tree.fBranches.arr.map((branch: any) => branch.fName);
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
          [i]: { ...this.fileData[i], ...allBranchData[j][i] },
        };
      }
    }
    // Save fileData by input the appropriate onHandleData function
    onHandleData(this.fileData);
    return this.fileData;
  }
}
