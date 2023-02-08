import {Role} from "discord.js";
import {IBackendRole} from "../lib/database/interfaces/role/IBackendRole";
import {BackendRole} from "../lib/database/entities/BackendRole";
import {Document, Query, Schema} from "mongoose";
import {IBackendRoleMethods} from "../lib/database/interfaces/role/IBackendRoleMethods";
declare module "discord.js" {
    interface Role {
        getBackendRole(): Promise<Query<(Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods) | null, Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods, {}, IBackendRole>>
        hasBackendInstance(): Promise<boolean>
    }
}

Role.prototype.getBackendRole = function () {
    return BackendRole.getFromDiscord(this);
}

Role.prototype.hasBackendInstance = async function () {
    let backendRole = await this.getBackendRole();

    return (backendRole != null);
}