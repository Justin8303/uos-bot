import {Schema, Types} from "mongoose";
import {IBackendRoleMethods} from "./IBackendRoleMethods";

export interface IBackendRole {
    _id: Schema.Types.ObjectId
    guild: string
    snowflake: string
    created_by: string
    name: string
    displayName: string
    color: number
    position: string
    header?: Schema.Types.ObjectId
    categories?: [Schema.Types.ObjectId]
    is_header: boolean
    is_category: boolean
    formatted: boolean
}

export type IBackendRolePublic = IBackendRole & { _id: Types.ObjectId }
export type IBackendRoleDocument = (IBackendRole & IBackendRoleMethods & Document) | null