"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const localize_1 = __importDefault(require("../../i18n/localize"));
const AI_1 = __importDefault(require("../../tictactoe/AI"));
class GameBoardBuilder {
    constructor() {
        this.emojies = ['⬜', '🇽', '🅾️'];
        this.title = '';
        this.state = '';
        this.boardSize = 0;
        this.boardData = [];
    }
    withTitle(player1, player2) {
        this.title =
            localize_1.default.__('game.title', {
                player1: player1.displayName,
                player2: player2.displayName
            }) + '\n\n';
        return this;
    }
    withEmojies(first, second) {
        this.emojies[1] = first;
        this.emojies[2] = second;
        return this;
    }
    withBoard(boardSize, board) {
        this.boardSize = boardSize;
        this.boardData = board;
        return this;
    }
    withEntityPlaying(entity) {
        if (entity instanceof AI_1.default) {
            this.state = localize_1.default.__('game.waiting-ai');
        }
        else if (!entity) {
            this.state = localize_1.default.__('game.load');
        }
        else {
            this.state = localize_1.default.__('game.action', { player: entity.toString() });
        }
        return this;
    }
    withEndingMessage(winner) {
        if (winner) {
            this.state = localize_1.default.__('game.win', { player: winner.toString() });
        }
        else {
            this.state = localize_1.default.__('game.end');
        }
        return this;
    }
    toMessageOptions() {
        let board = '';
        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            board += this.emojies[this.boardData[i]] + ' ';
            if ((i + 1) % this.boardSize === 0) {
                board += '\n';
            }
        }
        const state = this.state && board ? '\n' + this.state : this.state;
        return {
            allowedMentions: { parse: ['users'] },
            content: this.title + board + state
        };
    }
}
exports.default = GameBoardBuilder;
GameBoardBuilder.MOVE_REACTIONS = ['↖️', '⬆️', '↗️', '⬅️', '⏺️', '➡️', '↙️', '⬇️', '↘️'];
