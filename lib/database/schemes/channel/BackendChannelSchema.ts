import {Schema} from "mongoose";
import {IBackendChannel} from "../../interfaces/category/IBackendChannel";
import {IBackendChannelMethods} from "../../interfaces/category/IBackendChannelMethods";
import {Guild} from "discord.js";
import {BackendChannelModel} from "../../models/BackendChannelModel";

const schema = new Schema<IBackendChannel, BackendChannelModel, IBackendChannelMethods>(
    {
        name: {
            type: String,
            required: true
        },
        guild: {
            type: String,
            required: true
        },
        snowflake: {
            type: String,
            required: false
        },
        type: {
            type: Number,
            required: true
        }
    }
)

schema.method("getGuild", async function getGuild(): Promise<Guild> {
    return await global.discordBot.guilds.fetch(this.guild);
})

schema.pre("save", async function (next) {
    if (this.snowflake == null) {
        const guild = await this.getGuild();



        next();
    }

    next();
})

export default schema;