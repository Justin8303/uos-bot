import mongoose, {Model, model} from "mongoose";
import {BackendInteractionModel} from "../models/BackendInteractionModel";
import {IBackendInteraction} from "../interfaces/interaction/IBackendInteraction";
import BackendInteractionSchema from "../schemes/interaction/BackendInteractionSchema";

// @ts-ignore
export const BackendInteraction: BackendInteractionModel = (<Model<IBackendInteraction, BackendInteractionModel>>mongoose.models.Interaction || model<IBackendInteraction, BackendInteractionModel>("Interaction", BackendInteractionSchema, "Interactions"))