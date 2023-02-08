import mongoose, {Model, model} from "mongoose";
import {IBackendRole} from "../interfaces/role/IBackendRole";
import {BackendRoleModel} from "../models/BackendRoleModel";
import RoleSchema from "../schemes/role/BackendRoleSchema";

// @ts-ignore
export const BackendRole: BackendRoleModel = (<Model<IBackendRole, BackendRoleModel>>mongoose.models.Role || model<IBackendRole, BackendRoleModel>("Role", RoleSchema, "Roles"))