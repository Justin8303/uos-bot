import {Guild, GuildMember, User} from "discord.js";
declare module "discord.js" {
    interface User {
        getGuildMember(guild: Guild): Promise<GuildMember>
    }
}

User.prototype.getGuildMember = function (guild) {
    return guild.members.fetch(this);
}