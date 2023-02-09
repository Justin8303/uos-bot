import {Document, Model, Query, Schema} from "mongoose";
import {IBackendInteraction} from "../interfaces/interaction/IBackendInteraction";
import {IBackendInteractionMethods} from "../interfaces/interaction/IBackendInteractionMethods";
import {Interaction} from "discord.js";
import {InteractionType} from "discord-api-types/v10";

export type BackendInteractionModel = Model<IBackendInteraction, {}, IBackendInteractionMethods> & {
    getFromDiscord(interaction: Interaction): Promise<(Document<unknown, any, IBackendInteraction> & IBackendInteraction & Required<{_id: Schema.Types.ObjectId}> & IBackendInteractionMethods) | null>
    createFromDiscord(interaction: Interaction, name: string, parent?: IBackendInteraction, derived?: boolean, type?: InteractionType): Promise<Document<unknown, any, IBackendInteraction> & IBackendInteraction & Required<{ _id: Schema.Types.ObjectId }> & {} & IBackendInteractionMethods>
}