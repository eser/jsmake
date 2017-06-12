import EventEmitter = require('es6-eventemitter');
import maester = require('maester');
import Senior = require('senior');
import { Command, CommandSet } from './CommandSet';
import { Utils } from './Utils';
import pkg = require('../package.json');

const emptyDescription = '';

export class JsMake extends CommandSet {
    events: EventEmitter;
    logger: any;
    plugins: Senior;
    utils: Utils;
    errors: { [key: string]: any };
    lastDescription: string;

    constructor() {
        super();

        this.events = new EventEmitter();
        this.logger = maester;
        this.plugins = new Senior('jsmake');
        this.utils = new Utils();

        this.errors = {
            unknownCommand: Symbol('unknown command'),
            exception: Symbol('exception thrown')
        };

        this.lastDescription = emptyDescription;
    }

    loadPlugins(): void {
        maester.debug('loading plugins...');

        this.plugins.loadAll({ jsmake: this }); // FIXME capture result?
    }

    loadFile(filepath: string): Command | null {
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

    desc(description: string): void {
        this.lastDescription = description;
    }

    task(pathstr: string, ...params: any[]): void {
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

        if (this.lastDescription !== emptyDescription) {
            options.description = this.lastDescription;
        }
        this.lastDescription = emptyDescription;

        // params[0] as action
        if (paramCount === 1) {
            options.prerequisites = [];
            options.action = params[0];
        }
        // params[0] as prerequisites, params[1] as action
        else {
            options.prerequisites = params[0];
            options.action = params[1];
        }

        this.addCommand(pathstr, options);
    }

    getVersion(): string | undefined {
        return pkg.version;
    }
}

export default JsMake;
