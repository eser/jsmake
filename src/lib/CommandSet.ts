import { Consultant } from 'consultant/lib/esm';
import { EventEmitter } from 'es6-eventemitter/lib/esm';
import { assign } from 'ponyfills/lib/esm';
import { RunContext } from './RunContext';
import { alignedString } from './utils/alignedString';

const reservedWords = [ 'exec' ];

export type CommandActionType = (argv: any, stream: any) => any | Promise<any>;

export type CommandLocation = {
    parent: object,
    instance: Command,
    name: string
};

export type Command = {
    events: EventEmitter;
    name: string;
    description: string | undefined;
    parameters: any[];
    prerequisites: string[];
    action: CommandActionType;
    rules: any;
};

export const ProxyHandler = {
    get(target, name) {

    }
}

export class CommandSet {
    tasks: { [key: string]: any };

    constructor() {
        this.tasks = {
            label: 'jsmake',
            strict: true,

            children: {}
        };
    }

    locatePath(pathstr: string): CommandLocation | null {
        const split = pathstr.split(' ');

        let pointer = this.tasks;

        while (split.length > 1) {
            // since we checked split.length, it's 100% a string
            const name = <string>split.shift();

            pointer = pointer[name];

            if (pointer === undefined) {
                return null;
            }
        }

        const instance = pointer[split[0]];

        if (instance === undefined) {
            return null;
        }

        return {
            parent: pointer,
            instance: instance,
            name: split[0]
        };
    }

    locateNode(nodePath: string[]) {
        const split = nodePath.splice(0);

        let pointer = this.tasks.children;

        while (split.length > 1) {
            const name = <string>split.shift();

            if (!(name in pointer)) {
                pointer[name] = {};
            }

            pointer = pointer[name];

            if (split.length > 0) {
                if (!('children' in pointer)) {
                    pointer.children = {};
                }

                pointer = pointer.children;
            }
        }

        return {
            parent: pointer,
            name: split[0]
        };
    }

    addCommand(pathstr: string, command: Command): void {
        const split = pathstr.split(' ');

        for (const reservedWord of reservedWords) {
            if (split.indexOf(reservedWord) !== -1) {
                throw new Error(`${reservedWord} is a reserved word and should\'t be a name for a command`);
            }
        }

        const targetNode = this.locateNode(split);
        targetNode.parent[targetNode.name] = assign(
            {},
            targetNode.parent[targetNode.name],
            {
                type: Consultant.types.command,
                id: pathstr,
                label: command.name,
                description: command.description,
                uiHidden: false,
                helpDetails: true,
                strict: true
            }
        );
    }

    getConsultant(): Consultant {
        const consultantInstance = new Consultant(this.tasks);

        return consultantInstance;
    }

    async exec(args: string | object): Promise<RunContext> {
        const consultant = this.getConsultant(),
            runContext = new RunContext(consultant);

        await runContext.enqueueCommand(this, args);

        await runContext.execute();

        return runContext;
    }

    // async menu(): Promise<> {
    //     const menuItems = [];

    //     // for (const taskKey of Object.keys(this.tasks)) {
    //     //     const task = this.tasks[taskKey];

    //     //     if (task.menuHidden) {
    //     //         continue;
    //     //     }

    //     //     menuItems.push({
    //     //         name: alignedString([ 0, task.name, 35, task.description ]),
    //     //         value: task.name,
    //     //         'short': task.name
    //     //     });
    //     // }

    //     const taskRules = {
    //         _: {
    //             type: String,
    //             label: 'Task',
    //             description: 'The task to be executed',
    //             values: menuItems,
    //             cancelValue: {
    //                 name: 'Quit',
    //                 value: null,
    //                 'short': 'Quit'
    //             },
    //             min: 0,
    //             max: undefined
    //         }
    //     };

    //     const result = await consultant.input.fromInquiry(taskRules);

    //     if (result instanceof Object) {
    //         await this.tasks.exec(result.argv);

    //         return true;
    //     }

    //     return false;
    // }

    getTaskTree(): string[] {
        // TODO list tasks in tree format

        // return Object.keys(this.tasks).map(
        //     (taskKey) => this.tasks[taskKey].name
        // );

        return [];
    }

    help(stream: any, indent = 0): void {
        stream.write(alignedString([ indent, 'Tasks                            Description                        ' ]));
        stream.write(alignedString([ indent, '-------------------------------  -----------------------------------' ]));

        // for (const taskKey of Object.keys(this.tasks)) {
        //     const task = this.tasks[taskKey];

        //     output.push(
        //         alignedString([ indent, task.name, 35, task.description ])
        //     );

        //     // TODO
        //     task.parameters.help(output, [ indent + 4, 35 ]);
        // }
    }
};

export default CommandSet;
