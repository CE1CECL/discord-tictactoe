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
const path_1 = __importDefault(require("path"));
const child_process_1 = __importDefault(require("child_process"));
const fosscord_js_1 = __importDefault(require("fosscord.js"));
class Instance extends events_1.default {
    constructor(manager, id, instance) {
        var _a, _b, _c;
        super();
        this._evals = new Map();
        this._fetches = new Map();
        this.spawn = (timeout = 30000) => __awaiter(this, void 0, void 0, function* () {
            this.process = child_process_1.default.fork(path_1.default.resolve(this.manager.file), { env: this.env })
                .on("message", this._handleMessage.bind(this))
                .on("exit", this._handleExit);
            this.emit("spawn", this.process);
            // if (timeout === -1 || timeout === Infinity) return Promise.resolve(this.process);
            return this.process;
        });
        // spawn = (timeout?: number) => Discord.Shard.prototype.spawn.call(this, timeout);
        this.kill = () => {
            var _a, _b;
            (_a = this.process) === null || _a === void 0 ? void 0 : _a.removeListener("exit", this._handleExit);
            (_b = this.process) === null || _b === void 0 ? void 0 : _b.kill();
            this._handleExit();
        };
        this.respawn = (timeout) => __awaiter(this, void 0, void 0, function* () {
            this.kill();
            return this.spawn(timeout);
        });
        this.send = fosscord_js_1.default.Shard.prototype.send.bind(this);
        this.fetchClientValue = fosscord_js_1.default.Shard.prototype.fetchClientValue.bind(this);
        this.eval = fosscord_js_1.default.Shard.prototype.eval.bind(this);
        //@ts-ignore
        this._handleMessage = fosscord_js_1.default.Shard.prototype._handleMessage.bind(this);
        //@ts-ignore
        this._handleExit = fosscord_js_1.default.Shard.prototype._handleExit.bind(this);
        this.id = id;
        this.manager = manager;
        this.instance = instance;
        this.env = Object.assign({}, process.env, {
            INSTANCE_MANAGER: true,
            INSTANCE_CHILD_ID: this.id,
            INSTANCE_COUNT: this.manager.options.instances.length,
            INSTANCE_TOKEN: instance.token,
            INSTANCE_API_ENDPOINT: (_a = instance.http) === null || _a === void 0 ? void 0 : _a.api,
            INSTANCE_CDN_ENDPOINT: (_b = instance.http) === null || _b === void 0 ? void 0 : _b.cdn,
            INSTANCE_INVITE_ENDPOINT: (_c = instance.http) === null || _c === void 0 ? void 0 : _c.invite,
        });
    }
}
;
exports.default = Instance;
