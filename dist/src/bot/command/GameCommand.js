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
const CommandInteractionMessagingTunnel_1 = __importDefault(require("../messaging/CommandInteractionMessagingTunnel"));
const TextMessagingTunnel_1 = __importDefault(require("../messaging/TextMessagingTunnel"));
const localize_1 = __importDefault(require("../../i18n/localize"));
class GameCommand {
    constructor(manager) {
        this.manager = manager;
        this.config = manager.bot.configuration;
    }
    handleMessage(message, noTrigger = false) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (message.member &&
                !message.author.bot &&
                message.channel.isText() &&
                (noTrigger ||
                    (this.config.textCommand && message.content.startsWith(this.config.textCommand)))) {
                const tunnel = new TextMessagingTunnel_1.default(message);
                const invited = (_a = message.mentions.members) === null || _a === void 0 ? void 0 : _a.first();
                return this.handleInvitation(tunnel, message.member, invited);
            }
        });
    }
    handleInteraction(interaction, noTrigger = false) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if ((interaction === null || interaction === void 0 ? void 0 : interaction.isCommand()) &&
                interaction.inCachedGuild() &&
                ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.isText()) &&
                (noTrigger || interaction.commandName === this.config.command)) {
                const tunnel = new CommandInteractionMessagingTunnel_1.default(interaction);
                const member = yield interaction.member.fetch();
                const mentionned = (_c = interaction.options.getMember((_b = this.config.commandOptionName) !== null && _b !== void 0 ? _b : 'opponent', false)) !== null && _c !== void 0 ? _c : undefined;
                return this.handleInvitation(tunnel, member, mentionned);
            }
        });
    }
    handleInvitation(tunnel, inviter, invited) {
        return __awaiter(this, void 0, void 0, function* () {
            if (invited) {
                if (!invited.user.bot) {
                    if (inviter.user.id !== invited.user.id &&
                        invited.permissionsIn(tunnel.channel).has('VIEW_CHANNEL')) {
                        yield this.manager.requestDuel(tunnel, invited);
                    }
                    else {
                        yield tunnel.replyWith({ content: localize_1.default.__('duel.unknown-user') }, true);
                    }
                }
                else {
                    yield tunnel.replyWith({ content: localize_1.default.__('duel.no-bot') }, true);
                }
            }
            else {
                yield this.manager.createGame(tunnel);
            }
        });
    }
}
exports.default = GameCommand;
