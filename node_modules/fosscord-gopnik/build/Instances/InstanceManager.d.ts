/// <reference types="node" />
import EventEmitter from "events";
import Discord from "fosscord.js";
import Instance from "./Instance";
export declare type InstanceOptions = {
    token: string;
    baseUrl?: string;
    http?: Discord.HTTPOptions;
};
export interface InstanceManagerOptions {
    respawn?: boolean;
    childArgs?: string[];
    execArgs?: string[];
    instances: InstanceOptions[];
}
export declare type BroadcastEvalOptions = {
    context: any;
    instance: number;
};
declare class InstanceManager extends EventEmitter {
    options: InstanceManagerOptions;
    shards: Discord.Collection<number, Instance>;
    shardList: string;
    file: string;
    mode: string;
    constructor(file: string, options: InstanceManagerOptions);
    createChild: (options: InstanceOptions, id?: number) => Instance;
    spawn: (timeout?: number) => Promise<void>;
    broadcast: (message: unknown) => Promise<Discord.Shard[]>;
    broadcastEval: (script: Function, options: BroadcastEvalOptions) => Promise<{}>;
    fetchClientValues: {
        (prop: string): Promise<unknown[]>;
        (prop: string, shard: number): Promise<unknown>;
    };
    respawnAll: ({ instanceDelay, respawnDelay, timeout }?: {
        instanceDelay?: number | undefined;
        respawnDelay?: number | undefined;
        timeout?: number | undefined;
    }) => Promise<Discord.Collection<number, Discord.Shard>>;
    _performOnShards: (method: string, args: any[], shard?: number) => Promise<any[]>;
}
export default InstanceManager;
