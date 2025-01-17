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
const localize_1 = __importDefault(require("../../i18n/localize"));
class AppCommandRegister {
    constructor(commandManager, name, optionName) {
        this.commandManager = commandManager;
        this.name = name;
        this.optionName = optionName;
    }
    handleDeployMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.guild &&
                message.member &&
                message.client.user &&
                message.mentions.has(message.client.user) &&
                message.member.permissions.has('ADMINISTRATOR')) {
                const words = message.content.split(' ');
                const tttdeploy = process.env.tttdeploy || '?tttdeploy';
                const tttdelete = process.env.tttdelete || '?tttdelete';
                if (words.length === 2) {
                    if (words.includes(tttdeploy)) {
                        yield this.registerInGuild(message.guild.id);
                        yield message.reply(`Command /${this.name} has been registered.`);
                    }
                    else if (words.includes(tttdelete)) {
                        const executed = yield this.deleteInGuild(message.guild.id);
                        if (executed) {
                            yield message.reply(`Command /${this.name} has been unregistered.`);
                        }
                        else {
                            yield message.reply(`Command /${this.name} not found.`);
                        }
                    }
                }
            }
        });
    }
    registerInGuild(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.commandManager.create({
                name: this.name,
                description: localize_1.default.__('command.description'),
                options: [
                    {
                        type: 'USER',
                        name: this.optionName,
                        description: localize_1.default.__('command.option-user')
                    }
                ]
            }, guildId);
        });
    }
    deleteInGuild(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            const commands = yield this.commandManager.fetch({ guildId });
            const command = commands === null || commands === void 0 ? void 0 : commands.find(cmd => cmd.name === this.name);
            if (command) {
                yield this.commandManager.delete(command.id, guildId);
                return true;
            }
            else {
                return false;
            }
        });
    }
}
exports.default = AppCommandRegister;
