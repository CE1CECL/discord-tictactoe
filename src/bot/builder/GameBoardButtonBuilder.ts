import GameBoardBuilder from '@bot/builder/GameBoardBuilder';
import Entity from '@tictactoe/Entity';
import { Player } from '@tictactoe/Player';
import {
    MessageActionRow,
    MessageButton,
    MessageButtonStyleResolvable,
    MessageOptions
} from 'fosscord-gopnik';

/**
 * Builds representation of a game board using buttons
 * whiches will be displayed in a Discord message.
 *
 * @author Utarwyn
 * @since 3.0.0
 */
export default class GameBoardButtonBuilder extends GameBoardBuilder {
    /**
     * Default labels used on buttons if emojies are not enabled.
     * @protected
     */
    private buttonLabels = ['X', 'O'];
    /**
     * Button styles used for representing the two players.
     * @private
     */
    private buttonStyles: MessageButtonStyleResolvable[] = ['SECONDARY', 'PRIMARY', 'DANGER'];
    /**
     * Stores if emojies have been customized.
     * @private
     */
    private customEmojies = false;
    /**
     * Should disable buttons after been used.
     * @private
     */
    private disableButtonsAfterUsed = false;

    /**
     * Should disable buttons after been used.
     *
     * @returns same instance
     */
    public withButtonsDisabledAfterUse(): GameBoardBuilder {
        this.disableButtonsAfterUsed = true;
        return this;
    }

    /**
     * @inheritdoc
     * @override
     */
    override withEntityPlaying(entity?: Entity): GameBoardBuilder {
        // Do not display state if game is loading
        if (entity) {
            return super.withEntityPlaying(entity);
        } else {
            return this;
        }
    }

    /**
     * @inheritdoc
     * @override
     */
    override withEmojies(first: string, second: string): GameBoardBuilder {
        this.customEmojies = true;
        return super.withEmojies(first, second);
    }

    /**
     * @inheritdoc
     * @override
     */
    override toMessageOptions(): MessageOptions {
        return {
            content: this.title + this.state
        };
    }

    /**
     * Creates a button to be displayed based on current game context.
     *
     * @param row button placement row
     * @param col button placement column
     * @returns button fosscord-gopnik object
     */
    private createButton(row: number, col: number): MessageButton {
        const button = new MessageButton();
        const buttonIndex = row * this.boardSize + col;
        const buttonData = this.boardData[buttonIndex];

        if (buttonData !== Player.None) {
            if (this.customEmojies) {
                button.setEmoji(this.emojies[buttonData]);
            } else {
                button.setLabel(this.buttonLabels[buttonData - 1]);
            }

            if (this.disableButtonsAfterUsed) {
                button.setDisabled(true);
            }
        } else {
            button.setLabel(' ');
        }

        return button.setCustomId(buttonIndex.toString()).setStyle(this.buttonStyles[buttonData]);
    }
}
