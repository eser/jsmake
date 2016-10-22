import fs from 'fs';
import cofounder from 'cofounder';
import semver from 'semver';

export class Utils {
    constructor() {
        // fs
        this.scanDir = cofounder.fs.scanDir;
        this.glob = cofounder.fs.glob;
        this.cp = cofounder.fs.cp;
        this.mv = cofounder.fs.mv;
        this.rm = cofounder.fs.rm;
        this.rmdir = cofounder.fs.rmdir;
        this.mkdir = cofounder.fs.mkdir;
        this.writeFile = cofounder.fs.writeFile;
        // os
        this.shell = cofounder.os.shell;
    }

    packageJsonLoad(filepath) {
        const packageFile = fs.readFileSync(filepath, { encoding: 'utf8' });

        const packageContent = JSON.parse(packageFile);

        return packageContent;
    }

    packageJsonSave(filepath, content) {
        fs.writeFileSync(
            filepath,
            JSON.stringify(content, null, '  '),
            { encoding: 'utf8' }
        );
    }

    packageJsonVersionBump(filepath, type = 'patch') {
        const packageContent = this.packageJsonLoad(filepath);

        packageContent.version = semver.inc(packageContent.version, type);

        this.packageJsonSave(filepath, packageContent);

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
