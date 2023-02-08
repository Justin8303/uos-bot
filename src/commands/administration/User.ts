import {Command} from "../../interfaces/ChatInputApplicationCommandData";
import {ApplicationCommandOptionType, ApplicationCommandType, InteractionType} from "discord-api-types/v10";
import {BackendRole} from "../../../lib/database/entities/BackendRole";
import {IBackendRoleDocument} from "../../../lib/database/interfaces/role/IBackendRole";

export const User: Command = {
    name: "user",
    description: "user management",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            type: ApplicationCommandOptionType.SubcommandGroup,
            name: "role",
            description: "user role management",
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "assign",
                    description: "assign role to user",
                    options: [
                        {
                            name: "user",
                            type: ApplicationCommandOptionType.User,
                            description: "the user to assign the role to",
                            required: true
                        },
                        {
                            name: "role",
                            type: ApplicationCommandOptionType.String,
                            description: "the role to assign",
                            required: true,
                            autocomplete: true
                        }
                    ]
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "revoke",
                    description: "revoke role from user",
                    options: [
                        {
                            name: "user",
                            type: ApplicationCommandOptionType.User,
                            description: "the user to revoke the role from",
                            required: true
                        },
                        {
                            name: "role",
                            type: ApplicationCommandOptionType.String,
                            description: "the role to revoke",
                            required: true,
                            autocomplete: true
                        }
                    ]
                }
            ]
        }
    ],
    defaultMemberPermissions: ["ManageRoles"],
    autoComplete: async (client, interaction) => {
        const focusedOption = interaction.options.getFocused(true);
        const user = interaction.options.get("user", true);

        if (!interaction.guild) return;

        if (interaction.options.getSubcommandGroup() == "role") {
            if (focusedOption.name === "role") {
                let roles: NonNullable<IBackendRoleDocument>[] = [];

                if (user.value) {
                    if (interaction.options.getSubcommand() === "assign") {
                        let blacklist = (await interaction.guild.members.fetch(<string>user.value)).roles.cache.map(x => x.id);
                        roles = await BackendRole.find({
                            snowflake: {
                                $nin: blacklist
                            },
                            is_header: false,
                            name: {
                                $regex: focusedOption.value
                            }
                        })
                    }

                    if (interaction.options.getSubcommand() == "revoke") {
                        let whitelist = (await interaction.guild.members.fetch(<string>user.value)).roles.cache.map(x => x.id);
                        roles = await BackendRole.find({
                            snowflake: {
                                $in: whitelist
                            },
                            is_header: false,
                            name: {
                                $regex: focusedOption.value
                            }
                        })
                    }
                } else {
                    roles = await BackendRole.find({
                        is_header: false,
                        name: {
                            $regex: focusedOption.value
                        }
                    })
                }

                await interaction.respond(roles.map(role => ({ name: role.name, value: role.snowflake })));
                return;
            }
        }
    },
    run: async (client, interaction) => {
        if (interaction.type !== InteractionType.ApplicationCommand) return;
        if (!interaction.isChatInputCommand()) return;

        if (interaction.options.getSubcommandGroup() === "role") {

            const user = interaction.options.getUser("user", true);
            const role = interaction.options.getString("role", true);

            if (!user || !role || !interaction.guild) return;

            let guildUser = await interaction.guild.members.fetch(user);
            let guildRole = await interaction.guild.roles.fetch(role);

            if (!guildRole) return;

            if (interaction.options.getSubcommand() === "assign") {
                if (guildUser.roles.cache.has(guildRole.id)) {
                    await interaction.followUp({
                        embeds: [{
                            title: `Role could not be assigned!`,
                            description: `User ${guildUser} already has role ${guildRole}`,
                            color: 15548997
                        }],
                    });
                    return;
                }

                guildUser.roles.add(guildRole);

                await interaction.followUp({
                    embeds: [{
                        title: `Role assigned!`,
                        description: `User ${guildUser} has now role ${guildRole} assigned!`,
                        color: 5763719
                    }],
                });
                return;
            }


            if (interaction.options.getSubcommand() === "revoke") {
                if (!guildUser.roles.cache.has(guildRole.id)) {
                    await interaction.followUp({
                        embeds: [{
                            title: `Role could not be revoked!`,
                            description: `User ${guildUser} does not have role ${guildRole}`,
                            color: 15548997
                        }],
                    });
                    return;
                }

                guildUser.roles.remove(guildRole);

                await interaction.followUp({
                    embeds: [{
                        title: `Role revoked!`,
                        description: `User ${guildUser} has now role ${guildRole} revoked!`,
                        color: 5763719
                    }],
                });
                return;
            }
        }
    }
};