import Discord from "fosscord.js";
import Fosscord from "../index";
declare class InstanceClientUtil {
    client: typeof Fosscord.Client.prototype;
    _singleton?: InstanceClientUtil;
    id: string;
    client_id: number;
    constructor(client: typeof Fosscord.Client.prototype);
    send: (message: any) => Promise<void>;
    fetchClientValues: {
        (prop: string): Promise<unknown[]>;
        (prop: string, shard: number): Promise<unknown>;
    };
    broadcastEval: {
        <T>(fn: (client: Discord.Client<boolean>) => Discord.Awaited<T>): Promise<Discord.Serialized<T>[]>;
        <T_1>(fn: (client: Discord.Client<boolean>) => Discord.Awaited<T_1>, options: {
            shard: number;
        }): Promise<Discord.Serialized<T_1>>;
        <T_2, P>(fn: (client: Discord.Client<boolean>, context: Discord.Serialized<P>) => Discord.Awaited<T_2>, options: {
            context: P;
        }): Promise<Discord.Serialized<T_2>[]>;
        <T_3, P_1>(fn: (client: Discord.Client<boolean>, context: Discord.Serialized<P_1>) => Discord.Awaited<T_3>, options: {
            context: P_1;
            shard: number;
        }): Promise<Discord.Serialized<T_3>>;
    };
    respawnAll: (options?: Discord.MultipleShardRespawnOptions | undefined) => Promise<void>;
    _handleMessage: (message: unknown) => void;
    _respond: (type: string, message: unknown) => void;
    singleton: typeof Discord.ShardClientUtil.singleton;
    instanceIdsForGuildId: (id: Discord.Snowflake) => Promise<{
        guild: typeof Fosscord.Guild.prototype;
        childId: number;
        instanceId: string;
    }[]>;
    instanceIdsForUserId: (id: Discord.Snowflake) => Promise<{
        user: typeof Fosscord.User.prototype;
        childId: number;
        instanceId: string;
    }[]>;
}
export default InstanceClientUtil;
