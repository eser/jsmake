import { Command } from './Command';
import { RunContext } from './RunContext';

export class CommandSet {
    constructor() {
    }

    locateCommandSet(pathstr) {
        const split = pathstr.split(' ');

        let pointer: any = this;
        while (split.length > 1) {
            const name = split.shift();

            pointer = pointer[name];

            if (pointer === undefined) {
                return pointer;
            }
        }

        return {
            parent: pointer,
            name: split[0]
        };
    }

    locateCommand(pathstr) {
        const target = this.locateCommandSet(pathstr);

        return target.parent[target.name];
    }

    createCommandSet(pathstr) {
        const split = pathstr.split(' ');

        let pointer: any = this;
        while (split.length > 1) {
            const name = split.shift();

            if (!(name in pointer)) {
                pointer[name] = new CommandSet();
            }

            pointer = pointer[name];
        }

        return {
            parent: pointer,
            name: split[0]
        };
    }

    createCommand(pathstr, options): Command {
        const target = this.createCommandSet(pathstr);

        const command = Object.assign(new Command(target.name, undefined), options);

        target.parent[target.name] = command;

        return command;
    }

    async exec(argv): Promise<RunContext> {
        const runContext = new RunContext();

        const args = argv._.join(' ');

        runContext.enqueueCommand(this, args, { argv: argv });

        await runContext.execute();

        return runContext;
    }

    menu() {

    }

    help() {

    }
};

export default CommandSet;
