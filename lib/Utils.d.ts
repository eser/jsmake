export declare class Utils {
    fs: any;
    json: any;
    os: any;
    constructor();
    packageJsonVersionBump(filepath: any, type?: string): Promise<string>;
    npmPublish(): void;
}
export default Utils;
