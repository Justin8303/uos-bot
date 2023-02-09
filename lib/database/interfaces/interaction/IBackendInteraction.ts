import {Schema, Types} from "mongoose";
import {IBackendInteractionMethods} from "./IBackendInteractionMethods";
import {InteractionType} from "discord-api-types/v10";

export interface IBackendInteraction {
    _id: Schema.Types.ObjectId
    guild: string
    interactionId: string
    created_by: string
    name: string
    type: InteractionType
    parent?: Schema.Types.ObjectId
    meta: { [key: string]: any }
}

export type IBackendInteractionPublic = IBackendInteraction & { _id: Types.ObjectId }
export type IBackendInteractionDocument = (IBackendInteraction & IBackendInteractionMethods & Document) | null