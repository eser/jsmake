"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateNotifier = require("update-notifier");
const jsmake = require("./");
const pkg = require("../package.json");
let exitCode = 0;
process.on('uncaughtException', (err) => {
    console.error(err.stack);
    exitCode = 1;
});
process.on('exit', () => {
    process.exit(exitCode);
});
updateNotifier({ pkg: pkg })
    .notify({ defer: false });
const args = process.argv.slice(2).join(' ');
jsmake.exec(args)
    .catch((err) => {
    jsmake.logger.error(err);
});
//# sourceMappingURL=cli.js.map