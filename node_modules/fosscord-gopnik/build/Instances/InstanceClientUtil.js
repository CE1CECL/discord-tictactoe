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
const fosscord_js_1 = __importDefault(require("fosscord.js"));
class InstanceClientUtil {
    constructor(client) {
        this.id = new URL(process.env.INSTANCE_API_ENDPOINT).hostname;
        this.client_id = parseInt(process.env.INSTANCE_CHILD_ID);
        this.send = (message) => new Promise((resolve, reject) => {
            process.send(message, (err) => {
                if (err)
                    reject(err);
                resolve();
            });
        });
        this.fetchClientValues = fosscord_js_1.default.ShardClientUtil.prototype.fetchClientValues.bind(this);
        this.broadcastEval = fosscord_js_1.default.ShardClientUtil.prototype.broadcastEval.bind(this);
        this.respawnAll = fosscord_js_1.default.ShardClientUtil.prototype.respawnAll.bind(this);
        //@ts-ignore
        this._handleMessage = fosscord_js_1.default.ShardClientUtil.prototype._handleMessage.bind(this);
        // @ts-ignore
        this._respond = fosscord_js_1.default.ShardClientUtil.prototype._respond.bind(this);
        this.singleton = fosscord_js_1.default.ShardClientUtil.singleton.bind(this);
        this.instanceIdsForGuildId = (id) => __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.broadcastEval((c, { id }) => {
                const client = c;
                //@ts-ignore
                if (!client.instanced)
                    throw new Error("this cannot be possible lol");
                //@ts-ignore
                return { guild: client.guilds.cache.find((x) => x.id === id), childId: client.instanced.client_id, instanceId: client.instanced.id };
            }, { context: { id } });
            return resp.filter(x => !!x.guild);
        });
        this.instanceIdsForUserId = (id) => __awaiter(this, void 0, void 0, function* () {
            const resp = yield this.broadcastEval((c, { id }) => {
                const client = c;
                //@ts-ignore
                if (!client.instanced)
                    throw new Error("this cannot be possible lol");
                //@ts-ignore
                return { user: client.users.cache.find((x) => x.id === id), childId: client.instanced.client_id, instanceId: client.instanced.id };
            }, { context: { id } });
            return resp.filter(x => !!x.user);
        });
        this.client = client;
        if (!process.send)
            throw new Error("not child process?");
        process.on("message", this._handleMessage.bind(this));
        client.on("ready", () => {
            process.send({ _ready: true });
        });
    }
}
exports.default = InstanceClientUtil;
