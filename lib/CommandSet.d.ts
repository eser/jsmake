import { Command } from './Command';
import { RunContext } from './RunContext';
export declare class CommandSet {
    constructor();
    locateCommandSet(pathstr: any): any;
    locateCommand(pathstr: any): any;
    createCommandSet(pathstr: any): {
        parent: any;
        name: any;
    };
    createCommand(pathstr: any, options: any): Command;
    exec(argv: any): Promise<RunContext>;
    menu(): void;
    help(): void;
}
export default CommandSet;
