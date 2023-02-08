import {Model} from "mongoose";
import {IBackendChannel} from "../interfaces/category/IBackendChannel";
import {IBackendChannelMethods} from "../interfaces/category/IBackendChannelMethods";

export type BackendChannelModel = Model<IBackendChannel, {}, IBackendChannelMethods> & {

}