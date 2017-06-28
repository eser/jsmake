"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consultant = require("consultant");
const ponyfills_1 = require("ponyfills");
const RunContext_1 = require("./RunContext");
const alignedString_1 = require("./utils/alignedString");
const reservedWords = ['exec'];
exports.ProxyHandler = {
    get(target, name) {
    }
};
class CommandSet {
    constructor() {
        this.tasks = {};
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
    addCommand(pathstr, command) {
        const split = pathstr.split(' ');
        for (const reservedWord of reservedWords) {
            if (split.indexOf(reservedWord) !== -1) {
                throw new Error(`${reservedWord} is a reserved word and should\'t be a name for a command`);
            }
        }
        let pointer = this.tasks;
        while (split.length > 1) {
            const name = split.shift();
            if (!(name in pointer)) {
                pointer[name] = {};
            }
            pointer = pointer[name];
        }
        pointer[split[0]] = command;
    }
    buildConsultantRules(target, pathStack) {
        const result = {};
        for (const itemKey in target) {
            const item = target[itemKey];
            if (result.children === undefined) {
                result.children = {};
            }
            const newPathStack = [...pathStack, itemKey];
            let itemContent = {
                type: consultant.types.command,
                id: newPathStack.join(' '),
                label: item.name,
                description: item.description
            };
            if (!Array.isArray(item.prerequisites)) {
                itemContent = ponyfills_1.assign(itemContent, this.buildConsultantRules(target[itemKey], newPathStack));
            }
            result.children[itemKey] = itemContent;
        }
        return result;
    }
    getConsultant() {
        const consultantRules = this.buildConsultantRules(this.tasks, []), consultantInstance = new consultant(consultantRules);
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