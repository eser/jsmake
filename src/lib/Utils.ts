import fs = require('fs');
import semver = require('semver');
import * as cofounder from 'cofounder/lib/esm';

export class Utils {
    fs: any;
    json: any;
    os: any;

    constructor() {
        this.fs = cofounder.fs;
        this.json = cofounder.json;
        this.os = cofounder.os;
    }

    async packageJsonVersionBump(filepath, type = 'patch'): Promise<string> {
        const packageContent = await this.json.loadFile(filepath);

        packageContent.version = semver.inc(packageContent.version, type);

        await this.json.saveFile(filepath, packageContent);

        return packageContent.version;
    }

    npmPublish(): void {
        /*
        npm.load(
            { loaded: false },
            function (err) {
                if (err) {
                    throw err;
                }

                npm.commands.publish();
            }
        );
        */
        this.os.shell('npm publish');
    }
}

export default Utils;
