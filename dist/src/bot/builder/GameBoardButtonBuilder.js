"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameBoardBuilder_1 = __importDefault(require("./GameBoardBuilder"));
const discord_js_1 = require("discord.js");
class GameBoardButtonBuilder extends GameBoardBuilder_1.default {
    constructor() {
        super(...arguments);
        this.buttonLabels = ['X', 'O'];
        this.buttonStyles = ['SECONDARY', 'PRIMARY', 'DANGER'];
        this.customEmojies = false;
        this.disableButtonsAfterUsed = false;
    }
    withButtonsDisabledAfterUse() {
        this.disableButtonsAfterUsed = true;
        return this;
    }
    withEntityPlaying(entity) {
        if (entity) {
            return super.withEntityPlaying(entity);
        }
        else {
            return this;
        }
    }
    withEmojies(first, second) {
        this.customEmojies = true;
        return super.withEmojies(first, second);
    }
    toMessageOptions() {
        return {
            content: this.title + this.state
        };
    }
    createButton(row, col) {
        const button = new discord_js_1.MessageButton();
        const buttonIndex = row * this.boardSize + col;
        const buttonData = this.boardData[buttonIndex];
        if (buttonData !== 0) {
            if (this.customEmojies) {
                button.setEmoji(this.emojies[buttonData]);
            }
            else {
                button.setLabel(this.buttonLabels[buttonData - 1]);
            }
            if (this.disableButtonsAfterUsed) {
                button.setDisabled(true);
            }
        }
        else {
            button.setLabel(' ');
        }
        return button.setCustomId(buttonIndex.toString()).setStyle(this.buttonStyles[buttonData]);
    }
}
exports.default = GameBoardButtonBuilder;
