import {Guild} from "discord.js";

export interface IBackendChannelMethods {
    getGuild(): Promise<Guild>
}