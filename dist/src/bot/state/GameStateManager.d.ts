import GameBoard from '../entity/GameBoard';
import MessagingTunnel from '../messaging/MessagingTunnel';
import TicTacToeBot from '../TicTacToeBot';
import Entity from '../../tictactoe/Entity';
import { GuildMember } from 'discord.js';
export default class GameStateManager {
    readonly bot: TicTacToeBot;
    readonly memberCooldownEndTimes: Map<string, number>;
    readonly gameboards: Array<GameBoard>;
    private readonly validator;
    constructor(bot: TicTacToeBot);
    requestDuel(tunnel: MessagingTunnel, invited: GuildMember): Promise<void>;
    createGame(tunnel: MessagingTunnel, invited?: GuildMember): Promise<void>;
    endGame(gameboard: GameBoard, winner?: Entity | null): void;
}
