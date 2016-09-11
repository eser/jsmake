const childProcess = require('child_process');

class Utils {
    shell(commands) {
        const commands_ = (commands.constructor === Array) ? commands : [ commands ];

        for (let command of commands_) {
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

    // TODO mkdir
    // TODO rm
    // TODO cp
    // TODO mv
}

module.exports = Utils;
