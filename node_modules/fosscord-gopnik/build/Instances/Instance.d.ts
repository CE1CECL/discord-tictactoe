/// <reference types="node" />
/// <reference types="node" />
import EventEmitter from "events";
import childProcess from "child_process";
import Discord from "fosscord.js";
import InstanceManager, { InstanceOptions } from "./InstanceManager";
declare class Instance extends EventEmitter {
    manager: InstanceManager;
    id: number;
    env: {
        [key: string]: string | undefined;
    };
    process?: childProcess.ChildProcess;
    instance: InstanceOptions;
    _evals: Map<string, Promise<any>>;
    _fetches: Map<string, Promise<any>>;
    constructor(manager: typeof InstanceManager.prototype, id: number, instance: InstanceOptions);
    spawn: (timeout?: number) => Promise<childProcess.ChildProcess>;
    kill: () => void;
    respawn: (timeout?: number) => Promise<childProcess.ChildProcess>;
    send: (message: unknown) => Promise<Discord.Shard>;
    fetchClientValue: (prop: string) => Promise<unknown>;
    eval: {
        (script: string): Promise<unknown>;
        <T>(fn: (client: Discord.Client<boolean>) => T): Promise<T[]>;
    };
    _handleMessage: (message: unknown) => void;
    _handleExit: (respawn?: boolean | undefined) => void;
}
export default Instance;
