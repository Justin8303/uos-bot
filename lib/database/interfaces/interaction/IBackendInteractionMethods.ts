import {Guild} from "discord.js";
import {Document, Query, Schema} from "mongoose";
import {IBackendInteraction} from "./IBackendInteraction";

export interface IBackendInteractionMethods {
    getGuild(): Promise<Guild>
    getParent(): Promise<Query<(Document<unknown, any, IBackendInteraction> & IBackendInteraction & Required<{ _id: Schema.Types.ObjectId }> & {} & IBackendInteractionMethods) | null, Document<unknown, any, IBackendInteraction> & IBackendInteraction & Required<{ _id: Schema.Types.ObjectId }> & {} & IBackendInteractionMethods, {}, IBackendInteraction> & {}>
    getParentCommand(): Promise<Query<(Document<unknown, any, IBackendInteraction> & IBackendInteraction & Required<{ _id: Schema.Types.ObjectId }> & {} & IBackendInteractionMethods) | null, Document<unknown, any, IBackendInteraction> & IBackendInteraction & Required<{ _id: Schema.Types.ObjectId }> & {} & IBackendInteractionMethods, {}, IBackendInteraction> & {}>
}