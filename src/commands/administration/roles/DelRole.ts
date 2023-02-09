import {Command} from "../../../interfaces/ChatInputApplicationCommandData";
import {ApplicationCommandOptionType, ApplicationCommandType} from "discord-api-types/v10";
import {BackendRole} from "../../../../lib/database/entities/BackendRole";

export const DelRole: Command = {
    name: "delrole",
    description: "delete a role",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "role",
            type: ApplicationCommandOptionType.Role,
            description: "role that you want to delete",
            required: true
        },
    ],
    defaultMemberPermissions: ["ManageRoles"],
    run: async (client, interaction) => {
        const role = interaction.options.get("role", true);

        if (!role.role) return;

        let dbRole = await BackendRole.getFromDiscord(role.role);
        if (!dbRole) return;

        let usedHeader = await dbRole.getRoleUseHeader();
        if (usedHeader.length > 0) {
            await interaction.followUp({
                embeds: [{
                    title: `Role could not be deleted`,
                    description: `The role could not be deleted because ${usedHeader.map(x => x.name).map(x => "**" + x + "**").join(", ")} has it as a header!`,
                    color: 15548997
                }],
                ephemeral: true
            });
            return;
        }

        let usedCategories = await dbRole.getRoleUseCategories();
        if (usedCategories.length > 0) {
            await interaction.followUp({
                embeds: [{
                    title: `Role could not be deleted`,
                    description: `The role could not be deleted because ${usedCategories.map(x => x.name).map(x => "**" + x + "**").join(", ")} has it as a category.`,
                    color: 15548997
                }],
                ephemeral: true
            });
            return;
        }

        if (interaction.guild) {
            let r = await dbRole.getDiscordRole(interaction.guild);
            r?.delete();
        }

        await interaction.followUp({
            embeds: [{
                title: `Role deleted`,
                description: `The role has been deleted!`,
                color: 5763719
            }],
            ephemeral: true
        });
    }
};