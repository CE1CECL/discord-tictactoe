import MessagingTunnel, { MessagingAnswer } from './MessagingTunnel';
import { CommandInteraction, GuildMember, Message, TextChannel } from 'discord.js';
export default class CommandInteractionMessagingTunnel extends MessagingTunnel {
    private readonly interaction;
    private _reply?;
    constructor(interaction: CommandInteraction);
    get author(): GuildMember;
    get channel(): TextChannel;
    get reply(): Message | undefined;
    replyWith(answer: MessagingAnswer, _direct?: boolean): Promise<Message>;
    editReply(answer: MessagingAnswer): Promise<void>;
    end(reason?: MessagingAnswer): Promise<void>;
}
