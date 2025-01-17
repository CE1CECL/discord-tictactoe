import MessagingTunnel, { MessagingAnswer } from './MessagingTunnel';
import { GuildMember, Message, TextChannel } from 'discord.js';
export default class TextMessagingTunnel extends MessagingTunnel {
    private readonly origin;
    private _reply?;
    constructor(origin: Message);
    get author(): GuildMember;
    get channel(): TextChannel;
    get reply(): Message | undefined;
    replyWith(answer: MessagingAnswer, direct?: boolean): Promise<Message>;
    editReply(answer: MessagingAnswer): Promise<void>;
    end(reason?: MessagingAnswer): Promise<void>;
}
