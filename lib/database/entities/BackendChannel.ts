import mongoose, {Model, model} from "mongoose";
import {BackendChannelModel} from "../models/BackendChannelModel";
import BackendChannelSchema from "../schemes/channel/BackendChannelSchema";
import {IBackendChannel} from "../interfaces/category/IBackendChannel";

// @ts-ignore
export const BackendChannel: BackendRoleModel = (<Model<IBackendChannel, BackendChannelModel>>mongoose.models.Role || model<IBackendChannel, BackendChannelModel>("Channel", BackendChannelSchema, "Channel"))