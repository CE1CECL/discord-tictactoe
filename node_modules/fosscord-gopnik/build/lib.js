"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const fosscord_js_1 = __importDefault(require("fosscord.js"));
const InstanceClientUtil_1 = __importDefault(require("./Instances/InstanceClientUtil"));
const patch = (holdingObject, functionName, newFunction, callOriginal = true) => {
    var originalFunction = holdingObject[functionName];
    if (!originalFunction)
        originalFunction = holdingObject.prototype[functionName];
    var patched = (...args) => {
        if (callOriginal)
            var result = originalFunction.call(holdingObject, ...args);
        return newFunction.call(holdingObject, callOriginal ? result : originalFunction, ...args);
    };
    holdingObject.prototype[functionName] = holdingObject[functionName] = patched;
};
patch(fosscord_js_1.default.Options, "createDefault", (result) => {
    return Object.assign(result, {
        http: {
            agent: {},
            version: 9,
            api: process.env.INSTANCE_API_ENDPOINT || 'https://dev.fosscord.com/api',
            cdn: process.env.INSTANCE_CDN_ENDPOINT || 'https://cdn.fosscord.com',
            invite: process.env.INSTANCE_INVITE_ENDPOINT || 'https://fosscord.com/invite',
        },
    });
});
patch(fosscord_js_1.default.WebSocketManager, "handlePacket", (func, packet, shard) => {
    if (!packet || typeof packet.op !== "number" || !packet.t)
        return; //what
    // console.log(`received packet ${JSON.stringify(packet)}`)
    if (packet.op === 0) {
        switch (packet.t) {
            case "READY":
                packet.d.application = packet.d.user;
                break;
        }
        for (var curr in packet.d) {
            if (packet.d[curr] === null)
                delete packet.d[curr];
        }
    }
    return func.call(shard.manager, packet, shard);
}, false);
const originalResolveData = fosscord_js_1.default.MessagePayload.prototype.resolveData;
fosscord_js_1.default.MessagePayload.prototype.resolveData = function () {
    const ret = originalResolveData.call(this);
    if (!ret.data)
        return ret;
    if ("message_reference" in ret.data && ret.data.message_reference &&
        "reply" in ret.options && ret.options.reply) {
        var message = ret.options.reply.messageReference;
        ret.data.message_reference.channel_id = message.channelId;
        ret.data.message_reference.guild_id = message.guildId;
    }
    if ("embeds" in ret.data && Array.isArray(ret.data.embeds)) {
        for (var embed of ret.data.embeds) {
            if (embed.footer && !embed.footer.text)
                delete embed.footer;
        }
    }
    this.data = ret.data;
    return ret;
};
class Client extends fosscord_js_1.default.Client {
    constructor() {
        super(...arguments);
        this.instanced = process.env.INSTANCE_MANAGER ? new InstanceClientUtil_1.default(this) : null;
    }
}
exports.Client = Client;
;
// Object.assign(Discord, { Client });
exports.default = Object.assign(Object.assign({}, fosscord_js_1.default), { Client });
