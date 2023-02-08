import {Command} from "../../interfaces/ChatInputApplicationCommandData";
import {APIEmbedField, ApplicationCommandOptionType, ApplicationCommandType} from "discord-api-types/v10";
import {BackendRole} from "../../../lib/database/entities/BackendRole";

export const Info: Command = {
    name: "info",
    description: "info about an element",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "role",
            description: "role info",
            options: [
                {
                    name: "role",
                    type: ApplicationCommandOptionType.Role,
                    description: "role that you want information about",
                    required: true
                }
            ]
        }
    ],
    defaultMemberPermissions: ["ManageRoles"],
    run: async (client, interaction) => {
        const role = interaction.options.get("role", true);

        if (!role.role) return;

        let dbRole = await BackendRole.getFromDiscord(role.role);
        if (!dbRole) return;

        let fields: APIEmbedField[] = [{
            name: "Displayname",
            value: `<@&${dbRole.snowflake}>`,
            inline: true
        }];

        let header = await dbRole.getHeader();
        if (header != null) {
            fields.push({
                name: "Header",
                value: `<@&${header.snowflake}>`,
                inline: true
            })
        }

        let categories = await dbRole.getCategories();
        if (categories && categories.length > 0) {
            fields.push({
                name: "Categories",
                value: categories.map(x => "- " + x.name).join("\n")
            })
        }

        let relatedHeaders = await dbRole.getRoleUseHeader();
        let relatedCategories = await dbRole.getRoleUseCategories();

        if ((relatedHeaders && relatedHeaders.length > 0) || (relatedCategories && relatedCategories.length > 0)) {
            fields.push({
                name: "Relations",
                value: "Database relations"
            })
        }

        if (relatedHeaders && relatedHeaders.length > 0) {
            fields.push({
                name: "Headers",
                value: relatedHeaders.map(x => "- " + x.name).join("\n")
            })
        }

        if (relatedCategories && relatedCategories.length > 0) {
            fields.push({
                name: "Categories",
                value: relatedCategories.map(x => "- " + x.name).join("\n")
            })
        }

        await interaction.followUp({
            embeds: [{
                title: `Info about Role ${dbRole.name}`,
                description: `Known information about the role\n`,
                fields: fields,
                color: 5793266
            }],
            ephemeral: true
        });
    }
};