"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const fosscord_js_1 = __importDefault(require("fosscord.js"));
const Instance_1 = __importDefault(require("./Instance"));
class InstanceManager extends events_1.default {
    constructor(file, options) {
        super();
        this.shardList = "auto";
        this.mode = "process";
        this.createChild = (options, id = this.shards.size) => {
            const child = new Instance_1.default(this, id, options);
            this.shards.set(id, child);
            this.emit("childCreate", child);
            return child;
        };
        this.spawn = (timeout = 30000) => __awaiter(this, void 0, void 0, function* () {
            for (const instance of this.options.instances) {
                if (instance.baseUrl) {
                    instance.http = {
                        api: `https://${instance.baseUrl}/api`,
                        cdn: `https://${instance.baseUrl}/cdn`,
                        invite: `https://${instance.baseUrl}/invite`
                    };
                }
                const child = this.createChild(instance);
                yield child.spawn(timeout);
            }
        });
        this.broadcast = fosscord_js_1.default.ShardingManager.prototype.broadcast.bind(this);
        this.broadcastEval = (script, options) => {
            const discordoptions = {
                context: options.context,
                shard: options.instance,
            };
            //@ts-ignore
            return fosscord_js_1.default.ShardingManager.prototype.broadcastEval.call(this, script, discordoptions);
        };
        this.fetchClientValues = fosscord_js_1.default.ShardingManager.prototype.fetchClientValues.bind(this);
        this.respawnAll = ({ instanceDelay = 5000, respawnDelay = 500, timeout = 30000 } = {}) => {
            return fosscord_js_1.default.ShardingManager.prototype.respawnAll.call(this, {
                shardDelay: instanceDelay,
                respawnDelay,
                timeout,
            });
        };
        //@ts-ignore
        // _performOnShards = Discord.ShardingManager.prototype._performOnShards.bind(this);
        this._performOnShards = (method, args, shard) => {
            const promises = [];
            //@ts-ignore
            for (const sh of this.shards.values())
                promises.push(sh[method](...args));
            return Promise.all(promises);
        };
        this.file = file;
        options = Object.assign({ respawn: true, childArgs: [], execArgs: [], instances: [] }, options);
        if (!options.instances.length)
            throw new Error("List of instances cannot be empty");
        this.options = options;
        this.shards = new fosscord_js_1.default.Collection;
    }
}
;
exports.default = InstanceManager;
