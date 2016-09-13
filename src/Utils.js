import childProcess from 'child_process';
import cofounder from 'cofounder';

class Utils {
    constructor() {
        this.scanDir = cofounder.scanDir;
        // TODO
        // this.glob = cofounder.glob;
        // this.mkdir = cofounder.mkdir;
        // this.rmdir = cofounder.rmdir;
        // this.cp = cofounder.cp;
        // this.mv = cofounder.mv;
        // this.rm = cofounder.rm;
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
