import { Consultant } from 'consultant/lib/esm';
import { EventEmitter } from 'es6-eventemitter/lib/esm';
import { assign } from 'ponyfills/lib/esm';
import { RunContext } from './RunContext';
import { alignedString } from './utils/alignedString';

const reservedWords = [ 'exec' ];

export type CommandActionType = (argv: any, stream: any) => any | Promise<any>;

export type CommandLocation = {
    parent: { [key: string]: any },
    name: string,
    instance: any
};

export type Command = {
    label: string;
    description: string | undefined;
    parameters: any[];
    prerequisites: string[];
    action: CommandActionType;
    rules: any;
};

export const tasksProxyHandler = {
    get(target, name) {
        if (target.children !== undefined && name in target.children) {
            return new Proxy(target.children[name], tasksProxyHandler);
        }

        return target[name];
    }
}

export class CommandSet {
    events: EventEmitter;
    taskRules: any;
    tasks: any;

    constructor() {
        this.events = new EventEmitter();

        this.taskRules = {
            label: 'jsmake',
            strict: true,

            children: {}
        };

        this.tasks = new Proxy(this.taskRules, tasksProxyHandler);
    }

    locateNode(nodePath: string): CommandLocation | null {
        return this.locateNodeDirect(nodePath.split(' '));
    }

    locateNodeDirect(nodePath: string[]): CommandLocation | null {
        let pointer = this.taskRules.children,
            i;

        const length = nodePath.length - 1;

        for (i = 0; i < length; i++) {
            const name = nodePath[i];

            pointer = pointer[name];

            if (pointer === undefined) {
                return null;
            }

            if (i < length) {
                if (!('children' in pointer)) {
                    return null;
                }

                pointer = pointer.children;
            }
        }

        const instance = pointer[nodePath[i]];

        if (instance === undefined) {
            return null;
        }

        return {
            parent: pointer,
            name: nodePath[i],
            instance: instance
        };
    }

    createNode(nodePath: string): CommandLocation {
        return this.createNodeDirect(nodePath.split(' '));
    }

    createNodeDirect(nodePath: string[]): CommandLocation {
        let pointer = this.taskRules.children,
            i;

        const length = nodePath.length - 1;

        for (i = 0; i < length; i++) {
            const name = nodePath[i];

            if (!(name in pointer)) {
                pointer[name] = {
                    type: Consultant.types.command
                };
            }

            pointer = pointer[name];

            if (i < length) {
                if (!('children' in pointer)) {
                    pointer.children = {};
                }

                pointer = pointer.children;
            }
        }

        return {
            parent: pointer,
            name: nodePath[i],
            instance: pointer[nodePath[i]]
        };
    }

    addCommand(pathstr: string, command: Command): void {
        const split = pathstr.split(' ');

        for (const reservedWord of reservedWords) {
            if (split.indexOf(reservedWord) !== -1) {
                throw new Error(`${reservedWord} is a reserved word and should\'t be a name for a command`);
            }
        }

        const targetNode = this.createNodeDirect(split);

        targetNode.parent[targetNode.name] = assign(
            {},
            targetNode.instance,
            {
                type: Consultant.types.command,
                aliases: [],
                id: pathstr,
                uiHidden: false,
                helpDetails: true,
                strict: true
            },
            command
        );
    }

    getConsultant(): Consultant {
        return new Consultant(this.taskRules);
    }

    async exec(args: string | object): Promise<RunContext> {
        const consultant = this.getConsultant(),
            runContext = new RunContext(consultant, this.logger);

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
    //     //         name: alignedString([ 0, task.label, 35, task.description ]),
    //     //         value: task.label,
    //     //         'short': task.label
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
        //     (taskKey) => this.tasks[taskKey].label
        // );

        return [];
    }

    help(stream: any, indent = 0): void {
        stream.write(alignedString([ indent, 'Tasks                            Description                        ' ]));
        stream.write(alignedString([ indent, '-------------------------------  -----------------------------------' ]));

        // for (const taskKey of Object.keys(this.tasks)) {
        //     const task = this.tasks[taskKey];

        //     output.push(
        //         alignedString([ indent, task.label, 35, task.description ])
        //     );

        //     // TODO
        //     task.parameters.help(output, [ indent + 4, 35 ]);
        // }
    }
};

export default CommandSet;
