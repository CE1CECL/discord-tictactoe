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
const DuelRequest_1 = __importDefault(require("../entity/DuelRequest"));
const GameBoard_1 = __importDefault(require("../entity/GameBoard"));
const GameStateValidator_1 = __importDefault(require("./GameStateValidator"));
const AI_1 = __importDefault(require("../../tictactoe/AI"));
class GameStateManager {
    constructor(bot) {
        this.bot = bot;
        this.gameboards = [];
        this.memberCooldownEndTimes = new Map();
        this.validator = new GameStateValidator_1.default(this);
    }
    requestDuel(tunnel, invited) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.validator.isInteractionValid(tunnel, invited)) {
                const duel = new DuelRequest_1.default(this, tunnel, invited, this.bot.configuration.requestExpireTime, this.bot.configuration.requestReactions);
                const message = yield tunnel.replyWith(duel.content);
                yield duel.attachTo(message);
                const cooldown = (_a = this.bot.configuration.requestCooldownTime) !== null && _a !== void 0 ? _a : 0;
                if (cooldown > 0) {
                    this.memberCooldownEndTimes.set(tunnel.author.id, Date.now() + cooldown * 1000);
                }
            }
        });
    }
    createGame(tunnel, invited) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.validator.isInteractionValid(tunnel, invited)) {
                const gameboard = new GameBoard_1.default(this, tunnel, invited !== null && invited !== void 0 ? invited : new AI_1.default(), this.bot.configuration);
                this.gameboards.push(gameboard);
                const message = yield tunnel.replyWith(gameboard.content);
                yield gameboard.attachTo(message);
            }
        });
    }
    endGame(gameboard, winner) {
        if (winner) {
            this.bot.eventHandler.emitEvent('win', {
                winner,
                loser: gameboard.entities.find(entity => entity !== winner)
            });
        }
        else if (winner === null) {
            this.bot.eventHandler.emitEvent('tie', {
                players: gameboard.entities
            });
        }
        this.gameboards.splice(this.gameboards.indexOf(gameboard), 1);
    }
}
exports.default = GameStateManager;
