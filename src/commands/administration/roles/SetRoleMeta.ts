import {Command} from "../../../interfaces/ChatInputApplicationCommandData";
import {ApplicationCommandOptionType, ApplicationCommandType} from "discord-api-types/v10";
import {BackendRole} from "../../../../lib/database/entities/BackendRole";

export const SetRoleMeta: Command = {
    name: "setrolemeta",
    description: "set role meta",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "role",
            type: ApplicationCommandOptionType.Role,
            description: "role that you want to add metadata to",
            required: true
        },
        {
            name: "meta-key",
            type: ApplicationCommandOptionType.String,
            description: "metadata key",
            required: true
        },
        {
            name: "meta-value",
            type: ApplicationCommandOptionType.String,
            description: "metadata value",
            required: true
        },
    ],
    defaultMemberPermissions: ["ManageRoles"],
    run: async (client, interaction) => {
        const role = interaction.options.get("role", true);

        if (!role.role) return;

        let dbRole = await BackendRole.getFromDiscord(role.role);
        if (!dbRole) return;

        let metaKey = interaction.options.get("meta-key", true).value?.toString() ?? "";
        let metaVal = interaction.options.get("meta-value", true).value?.toString() ?? "";

        let object = dbRole.toObject()
        if (!object.meta)
            object.meta = {}

        object.meta[metaKey] = metaVal;
        dbRole.meta = object.meta;
        dbRole.save();

        await interaction.followUp({
            embeds: [{
                title: `Role meta updated`,
                description: `The role metadata has been updated!`,
                color: 5763719
            }],
            ephemeral: true
        });
    }
};