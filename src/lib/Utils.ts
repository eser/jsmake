import * as fs from 'fs';
import * as cofounder from 'cofounder';
import * as semver from 'semver';

export class Utils extends cofounder.constructor {
    constructor(...args) {
        super(...args);
    }

    async packageJsonVersionBump(filepath, type = 'patch') {
        const packageContent = await this.json.loadFile(filepath);

        packageContent.version = semver.inc(packageContent.version, type);

        await this.json.saveFile(filepath, packageContent);

        return packageContent.version;
    }

    npmPublish() {
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
        this.shell('npm publish');
    }
}

export default Utils;
