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
const GameBoardBuilder_1 = __importDefault(require("../builder/GameBoardBuilder"));
const GameBoardButtonBuilder_1 = __importDefault(require("../builder/GameBoardButtonBuilder"));
const localize_1 = __importDefault(require("../../i18n/localize"));
const AI_1 = __importDefault(require("../../tictactoe/AI"));
const Game_1 = __importDefault(require("../../tictactoe/Game"));
class GameBoard {
    constructor(manager, tunnel, member2, configuration) {
        this.manager = manager;
        this.tunnel = tunnel;
        this.game = new Game_1.default();
        this._entities = [tunnel.author, member2];
        this.reactionsLoaded = false;
        this.configuration = configuration;
    }
    get entities() {
        return this._entities;
    }
    get content() {
        const builder = this.configuration.gameBoardReactions
            ? new GameBoardBuilder_1.default()
            : new GameBoardButtonBuilder_1.default();
        builder
            .withTitle(this.entities[0], this.entities[1])
            .withBoard(this.game.boardSize, this.game.board)
            .withEntityPlaying(this.reactionsLoaded ? this.getEntity(this.game.currentPlayer) : undefined);
        if (this.game.finished) {
            builder.withEndingMessage(this.getEntity(this.game.winner));
        }
        const emojies = this.configuration.gameBoardEmojies;
        if (emojies && emojies.length === 2) {
            builder.withEmojies(emojies[0], emojies[1]);
        }
        if (this.configuration.gameBoardDisableButtons &&
            builder instanceof GameBoardButtonBuilder_1.default) {
            builder.withButtonsDisabledAfterUse();
        }
        return builder.toMessageOptions();
    }
    static reactionToMove(reaction) {
        return GameBoardBuilder_1.default.MOVE_REACTIONS.indexOf(reaction);
    }
    static buttonIdentifierToMove(identifier) {
        var _a;
        return (_a = parseInt(identifier)) !== null && _a !== void 0 ? _a : -1;
    }
    attachTo(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.configuration.gameBoardReactions) {
                for (const reaction of GameBoardBuilder_1.default.MOVE_REACTIONS) {
                    try {
                        yield message.react(reaction);
                    }
                    catch (_a) {
                        yield this.onExpire();
                        return;
                    }
                }
            }
            this.reactionsLoaded = true;
            yield this.update();
            yield this.attemptNextTurn();
        });
    }
    attemptNextTurn() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentEntity = this.getEntity(this.game.currentPlayer);
            if (currentEntity instanceof AI_1.default) {
                const result = currentEntity.operate(this.game);
                if (result.move !== undefined) {
                    yield this.playTurn(result.move);
                }
            }
            else {
                this.awaitMove();
            }
        });
    }
    update(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction) {
                return interaction.update(this.content);
            }
            else {
                return this.tunnel.editReply(this.content);
            }
        });
    }
    getEntity(index) {
        return index && index > 0 ? this._entities[index - 1] : undefined;
    }
    onEmojiMoveSelected(collected) {
        return __awaiter(this, void 0, void 0, function* () {
            const move = GameBoardBuilder_1.default.MOVE_REACTIONS.indexOf(collected.first().emoji.name);
            return this.playTurn(move);
        });
    }
    onButtonMoveSelected(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const move = GameBoard.buttonIdentifierToMove(interaction.customId);
            return this.playTurn(move, interaction);
        });
    }
    playTurn(move, interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.game.updateBoard(this.game.currentPlayer, move);
            if (this.game.finished) {
                const winner = this.getEntity(this.game.winner);
                if (this.configuration.gameBoardDelete) {
                    yield this.tunnel.end(new GameBoardBuilder_1.default().withEndingMessage(winner).toMessageOptions());
                }
                else {
                    yield ((_b = (_a = this.tunnel.reply) === null || _a === void 0 ? void 0 : _a.reactions) === null || _b === void 0 ? void 0 : _b.removeAll());
                    yield this.update(interaction);
                }
                this.manager.endGame(this, winner !== null && winner !== void 0 ? winner : null);
            }
            else {
                this.game.nextPlayer();
                yield this.update(interaction);
                yield this.attemptNextTurn();
            }
        });
    }
    onExpire() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tunnel.end({ content: localize_1.default.__('game.expire') });
            this.manager.endGame(this);
        });
    }
    awaitMove() {
        var _a, _b;
        const expireTime = ((_a = this.configuration.gameExpireTime) !== null && _a !== void 0 ? _a : 30) * 1000;
        if (!this.tunnel.reply)
            return;
        const currentEntity = (_b = this.getEntity(this.game.currentPlayer)) === null || _b === void 0 ? void 0 : _b.id;
        if (this.configuration.gameBoardReactions) {
            this.tunnel.reply
                .awaitReactions({
                filter: (reaction, user) => reaction.emoji.name != null &&
                    user.id === currentEntity &&
                    this.game.isMoveValid(GameBoard.reactionToMove(reaction.emoji.name)),
                max: 1,
                time: expireTime,
                errors: ['time']
            })
                .then(this.onEmojiMoveSelected.bind(this))
                .catch(this.onExpire.bind(this));
        }
        else {
            this.tunnel.reply
                .createMessageComponentCollector({
                filter: interaction => interaction.user.id === currentEntity &&
                    this.game.isMoveValid(GameBoard.buttonIdentifierToMove(interaction.customId)),
                max: 1,
                time: expireTime
            })
                .on('collect', this.onButtonMoveSelected.bind(this))
                .on('end', (_, reason) => __awaiter(this, void 0, void 0, function* () {
                if (reason !== 'limit') {
                    yield this.onExpire();
                }
            }));
        }
    }
}
exports.default = GameBoard;
