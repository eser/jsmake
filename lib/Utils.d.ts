import { CoFounder } from 'cofounder/lib/esm';
export declare class Utils extends CoFounder {
    constructor();
    packageJsonVersionBump(filepath: any, type?: string): Promise<string>;
    npmPublish(): void;
}
export default Utils;
