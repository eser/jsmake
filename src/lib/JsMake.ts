import * as EventEmitter from 'es6-eventemitter';
import * as maester from 'maester';
import * as consultant from 'consultant';
import * as Senior from 'senior';
import { Command } from './Command';
import { CommandSet } from './CommandSet';
import { Utils } from './Utils';
import { alignedString } from './utils/alignedString';
import * as pkg from '../package.json';

const emptyDescription = '';

export class JsMake {
    events: EventEmitter;
    logger: any;
    tasks: CommandSet;
    plugins: Senior;
    utils: Utils;
    errors: { [key: string]: any };
    description: string;

    constructor() {
        this.events = new EventEmitter();
        this.logger = maester;
        this.tasks = new CommandSet();
        this.plugins = new Senior('jsmake');
        this.utils = new Utils();

        this.errors = {
            unknownCommand: Symbol('unknown command'),
            exception: Symbol('exception thrown')
        };

        this.description = emptyDescription;
    }

    loadPlugins() {
        maester.debug('loading plugins...');

        const plugins = this.plugins.loadAll({ jsmake: this });
    }

    loadFile(filepath) {
        maester.debug(`loading makefile '${filepath}'...`);

        const jsmakeBackup = global.jsmake;

        global.jsmake = this;

        try {
            const loadedModule = require(filepath);

            return loadedModule;
        }
        catch (ex) {
            if (ex.code !== 'MODULE_NOT_FOUND') {
                throw ex;
            }
        }

        global.jsmake = jsmakeBackup;

        return null;
    }

    desc(description) {
        this.description = description;
    }

    task(name, ...params) {
        let paramCount = params.length;
        const lastParam = params[paramCount - 1];

        let options;

        if (lastParam.constructor !== Function && lastParam instanceof Object) {
            options = Object.assign({}, lastParam);
            paramCount--;
        }
        else {
            options = {};
        }

        if (this.description !== emptyDescription) {
            options.description = this.description;
        }
        this.description = emptyDescription;

        // params[0] as action
        if (paramCount === 1) {
            options.action = params[0];
        }
        // params[0] as prerequisites, params[1] as action
        else {
            options.prerequisites = params[0];
            options.action = params[1];
        }

        const command = this.tasks.createCommand(name, options);

        return command;
    }

    // getTaskNames() {
    //     return Object.keys(this.tasks).map(
    //         (taskKey) => this.tasks[taskKey].name
    //     );
    // }

    getVersion() {
        return pkg.version;
    }

    help(output, indent = 0) {
        output.push(alignedString([ indent, 'Tasks                            Description                        ' ]));
        output.push(alignedString([ indent, '-------------------------------  -----------------------------------' ]));

        // for (const taskKey of Object.keys(this.tasks)) {
        //     const task = this.tasks[taskKey];

        //     output.push(
        //         alignedString([ indent, task.name, 35, task.description ])
        //     );

        //     // TODO
        //     task.parameters.help(output, [ indent + 4, 35 ]);
        // }
    }

    async menu() {
        const menuItems = [];

        // for (const taskKey of Object.keys(this.tasks)) {
        //     const task = this.tasks[taskKey];

        //     if (task.menuHidden) {
        //         continue;
        //     }

        //     menuItems.push({
        //         name: alignedString([ 0, task.name, 35, task.description ]),
        //         value: task.name,
        //         'short': task.name
        //     });
        // }

        const taskRules = {
            _: {
                type: String,
                label: 'Task',
                description: 'The task to be executed',
                values: menuItems,
                cancelValue: {
                    name: 'Quit',
                    value: null,
                    'short': 'Quit'
                },
                min: 0,
                max: undefined
            }
        };

        const result = await consultant.input.fromInquiry(taskRules);

        if (result instanceof Object) {
            await this.tasks.exec(result.argv);

            return true;
        }

        return false;
    }
}

export default JsMake;
