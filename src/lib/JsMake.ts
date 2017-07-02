import { Maester } from 'maester/lib/esm';
import { Senior } from 'senior/lib/esm';
import { assign } from 'ponyfills/lib/assign';
import { Command, CommandSet } from './CommandSet';
import { Utils } from './Utils';
import pkg = require('../package.json');

const emptyDescription = '';

export class JsMake extends CommandSet {
    logger: Maester;
    plugins: Senior;
    utils: Utils;
    errors: { [key: string]: any };

    outputStream: any;
    lastDescription: string;

    constructor() {
        super();

        this.lastDescription = emptyDescription;
        this.outputStream = process.stdout;

        this.logger = new Maester();
        this.logger.logging.addLogger('stream', 'stream', 'basic', this.outputStream);

        this.plugins = new Senior('jsmake');
        this.utils = new Utils();

        this.errors = {
            unknownCommand: Symbol('unknown command'),
            exception: Symbol('exception thrown')
        };
    }

    loadPlugins(): void {
        this.logger.debug('loading plugins...');

        this.plugins.loadAll({ jsmake: this }); // FIXME capture result?
    }

    loadFile(filepath: string): Command | null {
        this.logger.debug(`loading makefile '${filepath}'...`);

        const loadedModule = this.plugins.loadFile(filepath, { jsmake: this });

        return loadedModule;
    }

    desc(description: string): void {
        this.lastDescription = description;
    }

    task(pathstr: string, ...params: any[]): void {
        let paramCount = params.length;
        const lastParam = params[paramCount - 1];

        let options;

        if (lastParam.constructor !== Function && lastParam instanceof Object) {
            options = assign({}, lastParam);
            paramCount--;
        }
        else {
            options = {};
        }

        if (this.lastDescription !== emptyDescription) {
            options.description = this.lastDescription;
        }
        this.lastDescription = emptyDescription;

        // params[0] as prerequisites, params[1] as action
        if (paramCount >= 2) {
            options.prerequisites = params[0];
            options.action = params[1];
        }
        // params[0] as action
        else if (paramCount >= 1) {
            options.prerequisites = [];
            options.action = params[0];
        }

        this.addCommand(pathstr, options);
    }

    getVersion(): string | undefined {
        return pkg.version;
    }
}

export default JsMake;
