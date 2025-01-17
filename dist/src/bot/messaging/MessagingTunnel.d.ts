import { GuildMember, Message, TextChannel, WebhookEditMessageOptions } from 'discord.js';
export declare type MessagingAnswer = WebhookEditMessageOptions;
export default abstract class MessagingTunnel {
    abstract get author(): GuildMember;
    abstract get channel(): TextChannel;
    abstract get reply(): Message | undefined;
    abstract replyWith(answer: MessagingAnswer, direct?: boolean): Promise<Message>;
    abstract editReply(answer: MessagingAnswer): Promise<void>;
    abstract end(reason?: MessagingAnswer): Promise<void>;
}
