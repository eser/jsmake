"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assign_1 = require("ponyfills/lib/assign");
const EventEmitter_1 = require("es6-eventemitter/lib/EventEmitter");
const esm_1 = require("consultant/lib/esm");
const RunContext_1 = require("./RunContext");
const alignedString_1 = require("./utils/alignedString");
const reservedWords = ['exec'];
exports.tasksProxyHandler = {
    get(target, name) {
        if (target.children !== undefined && name in target.children) {
            return new Proxy(target.children[name], exports.tasksProxyHandler);
        }
        return target[name];
    }
};
class CommandSet {
    constructor() {
        this.events = new EventEmitter_1.EventEmitter();
        this.taskRules = {
            label: 'jsmake',
            strict: true,
            children: {}
        };
        this.tasks = new Proxy(this.taskRules, exports.tasksProxyHandler);
    }
    locateNode(nodePath) {
        return this.locateNodeDirect(nodePath.split(' '));
    }
    locateNodeDirect(nodePath) {
        let pointer = this.taskRules.children, i;
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
    createNode(nodePath) {
        return this.createNodeDirect(nodePath.split(' '));
    }
    createNodeDirect(nodePath) {
        let pointer = this.taskRules.children, i;
        const length = nodePath.length - 1;
        for (i = 0; i < length; i++) {
            const name = nodePath[i];
            if (!(name in pointer)) {
                pointer[name] = {
                    type: esm_1.Consultant.types.command
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
    addCommand(pathstr, command) {
        const split = pathstr.split(' ');
        for (const reservedWord of reservedWords) {
            if (split.indexOf(reservedWord) !== -1) {
                throw new Error(`${reservedWord} is a reserved word and should\'t be a name for a command`);
            }
        }
        const targetNode = this.createNodeDirect(split);
        targetNode.parent[targetNode.name] = assign_1.assign({}, targetNode.instance, {
            type: esm_1.Consultant.types.command,
            aliases: [],
            id: pathstr,
            uiHidden: false,
            helpDetails: true,
            strict: true
        }, command);
    }
    getConsultant() {
        return new esm_1.Consultant(this.taskRules);
    }
    async exec(args) {
        const consultant = this.getConsultant(), runContext = new RunContext_1.RunContext(consultant, this.logger);
        await runContext.enqueueCommand(this, args);
        await runContext.execute();
        return runContext;
    }
    getTaskTree() {
        return [];
    }
    help(stream, indent = 0) {
        stream.write(alignedString_1.alignedString([indent, 'Tasks                            Description                        ']));
        stream.write(alignedString_1.alignedString([indent, '-------------------------------  -----------------------------------']));
    }
}
exports.CommandSet = CommandSet;
;
exports.default = CommandSet;
//# sourceMappingURL=CommandSet.js.map