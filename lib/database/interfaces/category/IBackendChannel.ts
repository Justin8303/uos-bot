import {Schema, Types} from "mongoose";
import {IBackendChannelMethods} from "./IBackendChannelMethods";

export interface IBackendChannel {
    _id: Schema.Types.ObjectId
    guild: string
    snowflake: string
    type: number
}

export type IBackendChannelPublic = IBackendChannel & { _id: Types.ObjectId }
export type IBackendChannelDocument = (IBackendChannel & IBackendChannelMethods & Document) | null