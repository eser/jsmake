import childProcess from 'child_process';
import cofounder from 'cofounder';

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
}

export default Utils;
