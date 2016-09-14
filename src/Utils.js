import fs from 'fs';
import childProcess from 'child_process';
import cofounder from 'cofounder';
import semver from 'semver';
import npm from 'npm';

class Utils {
    constructor() {
        this.scanDir = cofounder.scanDir;
        this.glob = cofounder.glob;
        this.rm = cofounder.rm;
        this.rmdir = cofounder.rmdir;
        // TODO
        // this.mkdir = cofounder.mkdir;
        // this.cp = cofounder.cp;
        // this.mv = cofounder.mv;
    }

    shell(commands) {
        const commands_ = (commands.constructor === Array) ? commands : [ commands ];

        for (const command of commands_) {
            childProcess.spawnSync(
                command,
                [],
                {
                    stdio: 'inherit',
                    shell: true
                }
            );
        }
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
        npm.load(
            { loaded: false },
            function (err) {
                if (err) {
                    throw err;
                }

                npm.commands.publish();
            }
        );
    }
}

export default Utils;
