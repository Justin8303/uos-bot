import {Command} from "../../../interfaces/ChatInputApplicationCommandData";
import {ApplicationCommandOptionType, ApplicationCommandType} from "discord-api-types/v10";
import {BackendRole} from "../../../../lib/database/entities/BackendRole";
import {IBackendRoleDocument} from "../../../../lib/database/interfaces/role/IBackendRole";

export const DelRoleMeta: Command = {
    name: "delrolemeta",
    description: "delete role meta",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "role",
            type: ApplicationCommandOptionType.Role,
            description: "role that you want to remove metadata from",
            required: true
        },
        {
            name: "meta-key",
            type: ApplicationCommandOptionType.String,
            description: "metadata key",
            required: true,
            autocomplete: true
        },
    ],
    defaultMemberPermissions: ["ManageRoles"],
    run: async (client, interaction) => {
        const role = interaction.options.get("role", true);

        if (!role.role) return;

        let dbRole = await BackendRole.getFromDiscord(role.role);
        if (!dbRole) return;

        let metaKey = interaction.options.get("meta-key", true).value?.toString() ?? "";


        let meta = dbRole.meta;
        delete meta[metaKey];
        console.log(meta);
        dbRole.update({
            $set: {
                meta: meta
            }
        })

        await interaction.followUp({
            embeds: [{
                title: `Role meta updated`,
                description: `The role metadata has been removed!`,
                color: 5763719
            }],
            ephemeral: true
        });
    },
    autoComplete: async (client, interaction) => {
        const focusedOption = interaction.options.getFocused(true);
        const role = interaction.options.get("role", true).value;

        if (focusedOption.name === "meta-key") {
            if (!role)
                throw new Error("Role not found!");

            let dbRole = await BackendRole.findOne({
                snowflake: role
            })

            if (!dbRole)
                throw new Error("DbRole not found")

            await interaction.respond(Object.keys(dbRole.meta).map(key => ({ name: key, value: key })));
            return;
        }
    }
}