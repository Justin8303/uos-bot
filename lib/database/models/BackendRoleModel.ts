import {Document, Model, Query, Schema} from "mongoose";
import {IBackendRole} from "../interfaces/role/IBackendRole";
import {IBackendRoleMethods} from "../interfaces/role/IBackendRoleMethods";
import {APIRole, Role} from "discord.js";

export type BackendRoleModel = Model<IBackendRole, {}, IBackendRoleMethods> & {
    getFromDiscord(role: Role | APIRole): Promise<Query<(Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods) | null, Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods, {}, IBackendRole>>
    getFromSnowflake(guild: string, snowflake: string): Promise<Query<(Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods) | null, Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods, {}, IBackendRole>>
}