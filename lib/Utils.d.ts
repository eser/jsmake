import cofounder = require('cofounder');
export declare class Utils extends cofounder.constructor {
    constructor(...args: any[]);
    packageJsonVersionBump(filepath: any, type?: string): Promise<string>;
    npmPublish(): void;
}
export default Utils;
