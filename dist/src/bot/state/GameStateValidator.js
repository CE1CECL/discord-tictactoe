"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameStateValidator {
    constructor(manager) {
        this.manager = manager;
    }
    get config() {
        return this.manager.bot.configuration;
    }
    get cooldownEndTimes() {
        return this.manager.memberCooldownEndTimes;
    }
    isInteractionValid(tunnel, invited) {
        if (process.env.Fosscord == 'yes') {
            return true;
        }
        return (this.isMessagingAllowed(tunnel) &&
            this.isMemberAllowed(tunnel.author) &&
            !this.manager.gameboards.some(gameboard => [tunnel.author, invited].some(entity => entity && gameboard.entities.includes(entity))) &&
            (this.config.simultaneousGames ||
                !this.manager.gameboards.some(gameboard => gameboard.tunnel.channel === tunnel.channel)));
    }
    isMessagingAllowed(tunnel) {
        return (this.hasPermissionsInChannel(tunnel) &&
            (!this.config.allowedChannelIds ||
                this.config.allowedChannelIds.length === 0 ||
                this.config.allowedChannelIds.includes(tunnel.channel.id)));
    }
    hasPermissionsInChannel(tunnel) {
        var _a, _b, _c;
        const allowed = (_c = (_b = (_a = tunnel.channel.guild.me) === null || _a === void 0 ? void 0 : _a.permissionsIn(tunnel.channel)) === null || _b === void 0 ? void 0 : _b.has(GameStateValidator.PERM_LIST)) !== null && _c !== void 0 ? _c : false;
        if (!allowed) {
            console.error(`Cannot operate because of a lack of permissions in the channel #${tunnel.channel.name}`);
        }
        return allowed;
    }
    isMemberAllowed(member) {
        return this.isMemberAllowedByRole(member) && this.isMemberAllowedByCooldown(member);
    }
    isMemberAllowedByRole(member) {
        return (!this.config.allowedRoleIds ||
            this.config.allowedRoleIds.length == 0 ||
            member.permissions.has('ADMINISTRATOR') ||
            member.roles.cache.some(role => this.config.allowedRoleIds.includes(role.id)));
    }
    isMemberAllowedByCooldown(member) {
        return (!this.config.requestCooldownTime ||
            this.config.requestCooldownTime === 0 ||
            !this.cooldownEndTimes.has(member.id) ||
            this.cooldownEndTimes.get(member.id) < Date.now());
    }
}
exports.default = GameStateValidator;
GameStateValidator.PERM_LIST = [
    'ADD_REACTIONS',
    'READ_MESSAGE_HISTORY',
    'SEND_MESSAGES',
    'VIEW_CHANNEL'
];
