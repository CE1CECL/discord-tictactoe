import MessagingTunnel, { MessagingAnswer } from './MessagingTunnel';
import { GuildMember, Message, MessageComponentInteraction, TextChannel } from 'discord.js';
export default class ComponentInteractionMessagingTunnel extends MessagingTunnel {
    private readonly interaction;
    private readonly originalAuthor?;
    private _reply?;
    constructor(interaction: MessageComponentInteraction, originalAuthor?: GuildMember);
    get author(): GuildMember;
    get channel(): TextChannel;
    get reply(): Message | undefined;
    replyWith(answer: MessagingAnswer, _direct?: boolean): Promise<Message>;
    editReply(answer: MessagingAnswer): Promise<void>;
    end(reason?: MessagingAnswer): Promise<void>;
}
