import fs = require('fs');
import semver = require('semver');
import { CoFounder } from 'cofounder/lib/esm';

export class Utils extends CoFounder {
    constructor() {
        super();
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
