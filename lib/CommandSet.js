"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esm_1 = require("consultant/lib/esm");
const esm_2 = require("ponyfills/lib/esm");
const RunContext_1 = require("./RunContext");
const alignedString_1 = require("./utils/alignedString");
const reservedWords = ['exec'];
exports.ProxyHandler = {
    get(target, name) {
    }
};
class CommandSet {
    constructor() {
        this.tasks = {
            label: 'jsmake',
            strict: true,
            children: {}
        };
    }
    locatePath(pathstr) {
        const split = pathstr.split(' ');
        let pointer = this.tasks;
        while (split.length > 1) {
            const name = split.shift();
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
    locateNode(nodePath) {
        const split = nodePath.splice(0);
        let pointer = this.tasks.children;
        while (split.length > 1) {
            const name = split.shift();
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
    addCommand(pathstr, command) {
        const split = pathstr.split(' ');
        for (const reservedWord of reservedWords) {
            if (split.indexOf(reservedWord) !== -1) {
                throw new Error(`${reservedWord} is a reserved word and should\'t be a name for a command`);
            }
        }
        const targetNode = this.locateNode(split);
        targetNode.parent[targetNode.name] = esm_2.assign({}, targetNode.parent[targetNode.name], {
            type: esm_1.Consultant.types.command,
            id: pathstr,
            label: command.name,
            description: command.description,
            uiHidden: false,
            helpDetails: true,
            strict: true
        });
    }
    getConsultant() {
        const consultantInstance = new esm_1.Consultant(this.tasks);
        return consultantInstance;
    }
    async exec(args) {
        const consultant = this.getConsultant(), runContext = new RunContext_1.RunContext(consultant);
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