import {Command} from "../../interfaces/ChatInputApplicationCommandData";
import {ApplicationCommandOptionType, ApplicationCommandType, InteractionType} from "discord-api-types/v10";
import {BackendRole} from "../../../lib/database/entities/BackendRole";
import {addPadding} from "../../../lib/utils/stringManipulation";
import {ObjectId} from "mongoose";

export const AddRole: Command = {
    name: "addrole",
    description: "add a new role",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "header",
            description: "add role header",
            options: [
                {
                    name: "name",
                    type: ApplicationCommandOptionType.String,
                    description: "role name",
                    required: true
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "category",
            description: "add role category (automatically assigned when used by role)",
            options: [
                {
                    name: "name",
                    type: ApplicationCommandOptionType.String,
                    description: "role name",
                    required: true
                },
                {
                    name: "header",
                    type: ApplicationCommandOptionType.String,
                    description: "header",
                    required: false,
                    autocomplete: true
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "default",
            description: "add default role",
            options: [
                {
                    name: "name",
                    type: ApplicationCommandOptionType.String,
                    description: "role name",
                    required: true
                },
                {
                    name: "header",
                    type: ApplicationCommandOptionType.String,
                    description: "header",
                    required: false,
                    autocomplete: true
                },
                {
                    name: "category",
                    type: ApplicationCommandOptionType.String,
                    description: "category",
                    required: false,
                    autocomplete: true
                }
            ]
        }
    ],
    defaultMemberPermissions: ["ManageRoles"],
    autoComplete: async (client, interaction) => {
        const focusedOption = interaction.options.getFocused(true);

        if (!interaction.guild) return;

        if (focusedOption.name === "header") {
            let headers = await BackendRole.find({
                is_header: true
            })

            await interaction.respond(headers.map(role => ({ name: role.name, value: role.snowflake })));
            return;
        }

        if (focusedOption.name === "category") {
            let headers = await BackendRole.find({
                is_category: true
            })

            await interaction.respond(headers.map(role => ({ name: role.name, value: role.snowflake })));
            return;
        }
    },
    run: async (client, interaction) => {
        if (interaction.type !== InteractionType.ApplicationCommand) return;
        if (!interaction.isChatInputCommand()) return;
        if (!interaction.guild) return;

        const name = interaction.options.get("name", true);

        if (!name.value || typeof name.value !== "string") return;

        if (interaction.options.getSubcommand() === "header") {
            await BackendRole.create({
                name: name.value,
                is_header: true,
                guild: interaction.guild.id,
                displayName: addPadding(name.value, 16),
                created_by: interaction.user.id
            })

            await interaction.followUp({
                embeds: [{
                    title: `Role created`,
                    description: `The role has been created!`,
                    color: 5763719
                }],
                ephemeral: true
            });

            return;
        }

        const header = interaction.options.get("header", false);
        let headerId: ObjectId | undefined;

        if (header?.value && typeof header.value === "string") {
            let brole = await BackendRole.getFromSnowflake(interaction.guild.id, header.value);
            if (brole)
                headerId = brole._id;
        }

        console.log(headerId)

        if (interaction.options.getSubcommand() === "category") {
            await BackendRole.create({
                name: name.value,
                is_category: true,
                guild: interaction.guild.id,
                displayName: addPadding(name.value, 16, true),
                created_by: interaction.user.id,
                header: headerId
            })

            await interaction.followUp({
                embeds: [{
                    title: `Role created`,
                    description: `The role has been created!`,
                    color: 5763719
                }],
                ephemeral: true
            });

            return;
        }

        const category = interaction.options.get("category", false);
        let categoryId: ObjectId | undefined;

        if (category?.value && typeof category.value === "string") {
            let brole = await BackendRole.getFromSnowflake(interaction.guild.id, category.value);
            if (brole)
                categoryId = brole._id;
        }

        if (interaction.options.getSubcommand() === "default") {
            await BackendRole.create({
                name: name.value,
                guild: interaction.guild.id,
                displayName: name.value,
                created_by: interaction.user.id,
                header: headerId,
                categories: [categoryId]
            })

            await interaction.followUp({
                embeds: [{
                    title: `Role created`,
                    description: `The role has been created!`,
                    color: 5763719
                }],
                ephemeral: true
            });

            return;
        }
    }
};