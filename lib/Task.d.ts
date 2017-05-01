export declare class Task {
    static notAssigned(): Promise<void>;
    static from(source: any): any;
    constructor(name: any, description: any, parameters: any, prerequisites: any, action: any);
    setDescription(description: any): void;
    setParameters(parameters: any): void;
    setPrerequisites(prerequisites: any): void;
    setAction(action: any): void;
    setMenuHidden(visibility: any): void;
    execute(argv: any): Promise<void>;
}
export default Task;
