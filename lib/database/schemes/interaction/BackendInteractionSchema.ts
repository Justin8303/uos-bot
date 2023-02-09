import {Document, HydratedDocument, Query, QueryWithHelpers, Schema} from "mongoose";
import {Guild, Interaction} from "discord.js";
import {IBackendInteraction} from "../../interfaces/interaction/IBackendInteraction";
import {BackendInteractionModel} from "../../models/BackendInteractionModel";
import {IBackendInteractionMethods} from "../../interfaces/interaction/IBackendInteractionMethods";
import {BackendInteraction} from "../../entities/BackendInteraction";
import {randomUUID} from "crypto";
import {InteractionType} from "discord-api-types/v10";

const schema = new Schema<IBackendInteraction, BackendInteractionModel, IBackendInteractionMethods>(
    {
        name: {
            type: String,
            required: true
        },
        created_by: {
            type: String,
            required: true
        },
        guild: {
            type: String,
            required: true
        },
        interactionId: {
            type: String,
            required: false
        },
        meta: {
            type: Object,
            required: false,
            default: {}
        },
        type: {
            type: Number,
            required: true
        },
        parent: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: "Interaction"
        }
    }
)

schema.method("getGuild", async function getGuild(): Promise<Guild> {
    return await global.discordBot.guilds.fetch(this.guild);
})

schema.method("getParent", async function getParent(): Promise<Query<(Document<unknown, any, IBackendInteraction> & IBackendInteraction & Required<{ _id: Schema.Types.ObjectId }> & {} & IBackendInteractionMethods) | null, Document<unknown, any, IBackendInteraction> & IBackendInteraction & Required<{ _id: Schema.Types.ObjectId }> & {} & IBackendInteractionMethods, {}, IBackendInteraction> & {}> {
    return BackendInteraction.findById(this.parent);
})

schema.method("getParentCommand", async function getParentCommand(): Promise<Query<(Document<unknown, any, IBackendInteraction> & IBackendInteraction & Required<{ _id: Schema.Types.ObjectId }> & {} & IBackendInteractionMethods) | null, Document<unknown, any, IBackendInteraction> & IBackendInteraction & Required<{ _id: Schema.Types.ObjectId }> & {} & IBackendInteractionMethods, {}, IBackendInteraction> & {}> {
    let p = await BackendInteraction.findById(this.parent);
    if (p != null && p.type != InteractionType.ApplicationCommand) {
        return p.getParentCommand();
    }

    return p;
})

schema.static("getFromDiscord", async function getFromDiscord(interaction: Interaction): Promise<(Document<unknown, any, IBackendInteraction> & IBackendInteraction & Required<{_id: Schema.Types.ObjectId}> & IBackendInteractionMethods) | null> {
    let id = "";
    if (interaction.isAnySelectMenu()) {
        id = interaction.customId;
    } else if (interaction.isButton()) {
        id = interaction.customId;
    } else {
        id = interaction.id;
    }

    return await BackendInteraction.findOne({
        interactionId: id
    });
})

schema.static("createFromDiscord", async function createFromDiscord(interaction: Interaction, name: string, parent?: IBackendInteraction, derived: boolean = false, type?: InteractionType): Promise<Document<unknown, any, IBackendInteraction> & IBackendInteraction & Required<{ _id: Schema.Types.ObjectId }> & {} & IBackendInteractionMethods> {
    return await BackendInteraction.create({
        name: name,
        interactionId: derived ? randomUUID().toString() : interaction.id,
        guild: interaction.guildId,
        parent: parent?._id,
        type: type ?? interaction.type,
        created_by: interaction.user.id,
        meta: derived ? {} : {
            // @ts-ignore
            options: interaction.options.data,
            // @ts-ignore
            commandName: interaction.commandName,
            // @ts-ignore
            commandId: interaction.commandId
        }
    });
})

export default schema;