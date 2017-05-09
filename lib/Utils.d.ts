import cofounder = require('cofounder');
export declare class Utils extends cofounder.constructor {
    constructor(...args: any[]);
    packageJsonVersionBump(filepath: any, type?: string): Promise<any>;
    npmPublish(): void;
}
export default Utils;
