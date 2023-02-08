import {Document, HydratedDocument, Query, Schema} from "mongoose";
import {IBackendRole} from "./IBackendRole";
import {Guild, Role} from "discord.js";

export interface IBackendRoleMethods {
    getRoleUseHeader(): Promise<Query<Array<HydratedDocument<IBackendRole, IBackendRoleMethods, {}>>, Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods, {}, IBackendRole>>
    getRoleUseCategories(): Promise<Query<Array<HydratedDocument<IBackendRole, IBackendRoleMethods, {}>>, Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods, {}, IBackendRole>>
    getDiscordRole(guild: Guild): Promise<Role | null>
    getHeader(): Promise<Query<(Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods) | null, Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods, {}, IBackendRole>>
    getCategories(): Promise<Query<Array<HydratedDocument<IBackendRole, IBackendRoleMethods, {}>>, Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods, {}, IBackendRole>>
    createDiscordRole(guild: Guild): Promise<Role>
    getGuild(): Promise<Guild>
}