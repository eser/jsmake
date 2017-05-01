import * as EventEmitter from 'es6-eventemitter';
import * as consultant from 'consultant';
import { TaskException } from './TaskException';

export async function notAssigned(argv: any, argValidated: any): Promise<any> {
    throw new TaskException('task\'s action is not assigned');
};

export type CommandActionType = (argv: any, argValidated: any) => any | Promise<any>;

export type CommandStateType = { argv: any };

export class Command {
    events: EventEmitter;
    name: string;
    description: string | undefined;
    parameters: any[];
    prerequisites: string[];
    action: CommandActionType;
    menuHidden: boolean;

    constructor(name: string, description: string | undefined, parameters: any[] = [], prerequisites: string[] = [], action: CommandActionType = notAssigned) {
        this.events = new EventEmitter();

        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.prerequisites = prerequisites;
        this.action = action;

        this.menuHidden = false;
    }

    setParameter(name, options) {
        if (this.parameters === undefined) {
            this.parameters = [];
        }

        this.parameters[name] = options;
    }

    async execute(state: CommandStateType) {
        try {
            if (this.action !== notAssigned || this.prerequisites.length === 0) {
                // TODO
                let argValidated;

                if (this.parameters !== undefined) {
                    argValidated = consultant.input.fromObject(this.parameters, state.argv);
                }

                const ret = this.action(state.argv, argValidated);

                if (ret instanceof Promise) {
                    await ret;
                }
            }

            this.events.emit('done');
        }
        catch (ex) {
            this.events.emit('error', ex);
        }

        this.events.emit('complete');
    }
};

export default Command;
