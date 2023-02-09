import {Document, HydratedDocument, Query, Schema, Types} from "mongoose";
import {IBackendRoleMethods} from "../../interfaces/role/IBackendRoleMethods";
import {IBackendRole} from "../../interfaces/role/IBackendRole";
import {BackendRoleModel} from "../../models/BackendRoleModel";
import {BackendRole} from "../../entities/BackendRole";
import {Guild, Role, Role as DiscordRole} from "discord.js";

const schema = new Schema<IBackendRole, BackendRoleModel, IBackendRoleMethods>(
    {
        name: {
            type: String,
            required: true
        },
        created_by: {
            type: String,
            required: true
        },
        guild: {
            type: String,
            required: true
        },
        snowflake: {
            type: String,
            required: false
        },
        is_header: {
            type: Boolean,
            required: false,
            default: false
        },
        is_category: {
            type: Boolean,
            required: false,
            default: false
        },
        color: {
            type: Number,
            required: false,
        },
        displayName: {
            type: String,
            required: false
        },
        position: {
            type: String,
            required: false
        },
        header: {
            type: Types.ObjectId,
            required: false,
            ref: "Role"
        },
        categories: {
            type: [Types.ObjectId],
            required: false,
            ref: "Role"
        },
        formatted: {
            type: Boolean,
            required: true,
            default: true
        },
        meta: {
            type: Object,
            required: false,
            default: {}
        }
    }
)

schema.method("getHeader", async function getHeader(): Promise<Query<(Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods) | null, Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods, {}, IBackendRole>> {
    return BackendRole.findById(this.header)
})

schema.method("getCategories", async function getCategories(): Promise<Query<Array<HydratedDocument<IBackendRole, IBackendRoleMethods, {}>>, Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods, {}, IBackendRole>> {
    return BackendRole.find({
        _id: {
            $in: this.categories
        },
        guild: this.guild
    })
})

schema.method("getRoleUseHeader", async function getRoleUseHeader(): Promise<Query<Array<HydratedDocument<IBackendRole, IBackendRoleMethods, {}>>, Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods, {}, IBackendRole>> {
    return BackendRole.find({
        header: this._id,
        guild: this.guild
    });
})

schema.method("getRoleUseCategories", async function getRoleUseCategories(): Promise<Query<Array<HydratedDocument<IBackendRole, IBackendRoleMethods, {}>>, Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods, {}, IBackendRole>> {
    return BackendRole.find({
        categories: {
            $all: [this._id]
        },
        guild: this.guild
    });
})

schema.method("getDiscordRole", async function getDiscordRole(guild: Guild): Promise<Role | null> {
    return guild.roles.fetch(this.snowflake);
})

schema.method("createDiscordRole", async function createDiscordRole(guild: Guild): Promise<Role> {
    return guild.roles.create({
        name: this.displayName,
        color: this.color
    })
})

schema.method("getGuild", async function getGuild(): Promise<Guild> {
    return await global.discordBot.guilds.fetch(this.guild);
})

schema.static("getFromDiscord", async function getFromDiscord(role: DiscordRole): Promise<Query<(Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods) | null, Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods, {}, IBackendRole>> {
    if (role.id === null) {
        return null;
    }

    return BackendRole.findOne({
        snowflake: role.id,
        guild: role.guild.id
    });
})

schema.static("getFromSnowflake", async function getFromSnowflake(guild: string, snowflake: string): Promise<Query<(Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods) | null, Document<unknown, any, IBackendRole> & IBackendRole & Required<{ _id: Schema.Types.ObjectId }> & IBackendRoleMethods, {}, IBackendRole>> {
    return BackendRole.findOne({
        snowflake: snowflake,
        guild: guild
    });
})

schema.pre("save", async function (next) {
    if (this.snowflake == null) {
        const guild = await this.getGuild();
        let pos = undefined;

        if (this.header) {
            let header = await this.getHeader();
            if (!header) return;

            let role = await header.getDiscordRole(guild);
            if (!role) return;

            console.log(role.position);
            pos = role.position - 1;
        }

        if (this.categories && this.categories.length > 0) {
            let categories = await this.getCategories();

            let role = await categories[0]?.getDiscordRole(guild);
            if (!role) return;

            console.log(role.position);
            pos = role.position - 2;
        }


        console.log("create role in guild", pos, this.name);
        const role = await guild.roles.create({
            name: this.displayName,
            color: this.color,
            position: pos,
            mentionable: !this.is_header && !this.is_category,
            hoist: this.is_header || this.is_category
        })

        this.snowflake = role.id;

        next();
    }

    next();
})

export default schema;