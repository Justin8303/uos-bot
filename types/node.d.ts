import {Client} from "discord.js";

export declare global {
    declare module globalThis {
        var discordBot: Client
    }
}
