import fs from 'fs';
import os from 'os';
import childProcess from 'child_process';
import cofounder from 'cofounder';
import semver from 'semver';
import npm from 'npm';
import yargsParser from 'yargs-parser';

class Utils {
    constructor() {
        this.scanDir = cofounder.scanDir;
        this.glob = cofounder.glob;
        this.rm = cofounder.rm;
        this.rmdir = cofounder.rmdir;
        this.mkdir = cofounder.mkdir;
        // TODO
        // this.cp = cofounder.cp;
        // this.mv = cofounder.mv;
    }

    parseArgv(args) {
        return yargsParser(args); // .replace('  ', ' ')
    }

    shell(command, args = [], env = {}) {
        const env_ = Object.assign({}, process.env, env);

        const proc = childProcess.spawnSync(
            command,
            args,
            {
                stdio: 'inherit',
                shell: true,
                env: env_,
                encoding: 'utf8'
            }
        );

        process.on('SIGTERM', () => proc.kill('SIGTERM'));

        return proc;
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
