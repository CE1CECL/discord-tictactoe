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
const EventHandler_1 = __importDefault(require("./bot/EventHandler"));
const TicTacToeBot_1 = __importDefault(require("./bot/TicTacToeBot"));
const localize_1 = __importDefault(require("./i18n/localize"));
const discord_js_1 = require("discord.js");
class TicTacToe {
    constructor(config) {
        this.config = config !== null && config !== void 0 ? config : {};
        this.eventHandler = new EventHandler_1.default();
        this.bot = new TicTacToeBot_1.default(this.config, this.eventHandler);
        localize_1.default.loadFromLocale(this.config.language);
    }
    login(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginToken = token !== null && token !== void 0 ? token : this.config.token;
            if (!loginToken) {
                throw new Error('Bot token needed to start Discord client.');
            }
            else if (!this.config.command && !this.config.textCommand) {
                throw new Error('Game slash or text command needed to start Discord client.');
            }
            const version = process.env.version || 9;
            const agent = process.env.agent || {};
            const api = process.env.api || 'https://discord.com/api';
            const cdn = process.env.cdn || 'https://cdn.discordapp.com';
            const invite = process.env.invite || 'https://discord.gg';
            const template = process.env.template || 'https://discord.new';
            const headers = process.env.headers || [];
            const scheduledEvent = process.env.scheduledEvent || 'https://discord.com/events';
            const client = new discord_js_1.Client({
                intents: [
                    discord_js_1.Intents.FLAGS.GUILDS,
                    discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
                    discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
                ],
                http: {
                    version: version,
                    agent: agent,
                    api: api,
                    cdn: cdn,
                    invite: invite,
                    template: template,
                    headers: headers,
                    scheduledEvent: scheduledEvent
                }
            });
            yield client.login(loginToken);
            this.bot.attachToClient(client);
        });
    }
    attach(client) {
        this.bot.attachToClient(client);
    }
    handleMessage(message) {
        this.bot.handleMessage(message);
    }
    handleInteraction(interaction) {
        this.bot.handleInteraction(interaction);
    }
    on(eventName, listener) {
        this.eventHandler.registerListener(eventName, listener);
    }
}
module.exports = TicTacToe;
