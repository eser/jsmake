import consultant = require('consultant');
import EventEmitter = require('es6-eventemitter');
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

export class CommandSet {
    tasks: object;

    constructor() {
        this.tasks = {};
    }

    locatePath(pathstr: string): CommandLocation | null {
        const split = pathstr.split(' ');

        let pointer: object = this.tasks;

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

    addCommand(pathstr: string, command: Command): void {
        const split = pathstr.split(' ');

        for (const reservedWord of reservedWords) {
            if (split.indexOf(reservedWord) !== -1) {
                throw new Error(`${reservedWord} is a reserved word and should\'t be a name for a command`);
            }
        }

        let pointer: object = this.tasks;

        while (split.length > 1) {
            const name = <string>split.shift();

            if (!(name in pointer)) {
                pointer[name] = {};
            }

            pointer = pointer[name];
        }

        pointer[split[0]] = command;
    }

    buildConsultantRules(target: object, pathStack: string[]): any {
        const result: any = {};

        for (const itemKey in target) {
            const item = target[itemKey];

            if (result.children === undefined) {
                result.children = {};
            }

            const newPathStack = [ ...pathStack, itemKey ];

            let itemContent = {
                type: consultant.types.command,
                id: newPathStack.join(' '),
                label: item.name,
                description: item.description
            };

            if (!Array.isArray(item.prerequisites)) {
                itemContent = Object.assign(
                    itemContent,
                    this.buildConsultantRules(target[itemKey], newPathStack)
                );
            }

            result.children[itemKey] = itemContent;
        }

        return result;
    }

    getConsultant(): consultant {
        const consultantRules = this.buildConsultantRules(this.tasks, []),
            consultantInstance = new consultant(consultantRules);

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
