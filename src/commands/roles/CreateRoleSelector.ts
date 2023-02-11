import {Command} from "../../interfaces/ChatInputApplicationCommandData";
import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ButtonStyle,
    InteractionType
} from "discord-api-types/v10";
import {BackendRole} from "../../../lib/database/entities/BackendRole";
import {ActionRowBuilder, ButtonBuilder, SelectMenuBuilder} from "discord.js";
import {BackendInteraction} from "../../../lib/database/entities/BackendInteraction";

export const createRoleSelector: Command = {
    name: "createroleselector",
    description: "create button for role selection",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "title",
            type: ApplicationCommandOptionType.String,
            description: "Embed title",
            required: true
        },
        {
            name: "text",
            type: ApplicationCommandOptionType.String,
            description: "Embed text",
            required: true
        },
        {
            name: "meta-key",
            type: ApplicationCommandOptionType.String,
            description: "Meta key for role selection",
            required: true,
            autocomplete: true
        },
        {
            name: "button-text",
            type: ApplicationCommandOptionType.String,
            description: "Button text",
            required: true
        },
        {
            name: "select-title",
            type: ApplicationCommandOptionType.String,
            description: "Select placeholder",
            required: true
        },
        {
            name: "nested-meta-key",
            type: ApplicationCommandOptionType.String,
            description: "Meta key for NESTED role selection",
            required: false,
            autocomplete: true
        },
    ],
    defaultMemberPermissions: ["ManageRoles"],
    run: async (client, interaction) => {
        if (!interaction.isChatInputCommand() || !interaction.inGuild()) return;

        let p = await BackendInteraction.createFromDiscord(interaction, "createRoleSelector");
        let btn = await BackendInteraction.createFromDiscord(interaction, "createRoleSelector-button", p, true, InteractionType.MessageComponent);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(btn.interactionId)
                    .setEmoji("➕")
                    .setLabel(interaction.options.get("button-text", true).value?.toString() ?? "")
                    .setStyle(ButtonStyle.Primary)
            )

        await interaction.followUp({
            embeds: [{
                title: interaction.options.get("title", true).value?.toString() ?? "",
                description: interaction.options.get("text", true).value?.toString() ?? "",
                color: 5793266,
            }],
            components: [row],
        })
    },
    autoComplete: async (client, interaction) => {
        const focusedOption = interaction.options.getFocused(true);

        if (!interaction.inGuild())
            return;

        if (focusedOption.name === "meta-key" || focusedOption.name == "nested-meta-key") {
            let dbRoles = await BackendRole.find({
                guild: interaction.guildId
            })

            let metas: { name: string, value: string }[] = [];

            for (let r of dbRoles) {
                metas = [...metas, ...Object.keys((await r).meta).filter(x => !metas.find(y => y.name == x)).map(key => ({ name: key, value: key }))];
            }

            await interaction.respond(metas);
            return;
        }
    },
    handleInteraction: async (client, interaction) => {
        let dbInteraction = await BackendInteraction.getFromDiscord(interaction);

        if (!dbInteraction)
            return;

        let parent = await dbInteraction?.getParentCommand()

        if (!parent)
            return;


        if (dbInteraction.name === "createRoleSelector-button" && interaction.isRepliable()) {
            let metaKey = parent.meta.options.find((x: any) => x.name === "meta-key").value?.toString() ?? "";
            let backendRoles = await BackendRole.find({
                meta: {
                    [metaKey]: "true"
                },
                guild: interaction.guildId
            })

            if (backendRoles.length == 0) {
                await interaction.reply({content: "No dbrole found with matching parameters!", ephemeral: true});
                return;
            }

            let selectTitle = parent.meta.options.find((x: any) => x.name === "select-title").value?.toString() ?? "";

            let sel = await BackendInteraction.createFromDiscord(interaction, "createRoleSelector-select", parent, true, InteractionType.MessageComponent);

            const row = new ActionRowBuilder<SelectMenuBuilder>()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId(sel.interactionId)
                        .setPlaceholder(selectTitle)
                        .setMinValues(1)
                        .addOptions(backendRoles.map<any>(r => ({ label: r.displayName, value: r.snowflake })).sort((a, b) => {
                            let x = a.label.toLowerCase();
                            let y = b.label.toLowerCase();

                            if (x > y) { return -1 }
                            if (x < y) { return 1 }

                            return 0;
                        }))
                )

            await interaction.reply({
                components: [row],
                ephemeral: true
            });
        }

        if (dbInteraction.name === "createRoleSelector-select") {
            if (interaction.isSelectMenu() && interaction.inGuild()) {
                let selected = interaction.values[0];

                let dbRole = await BackendRole.getFromSnowflake(interaction.guildId, selected);

                if (!dbRole) {
                    await interaction.reply({content: "No dbrole found with matching parameters!", ephemeral: true});
                    return;
                }

                if (dbRole.is_category) {
                    let roles = (await dbRole.getRoleUseCategories()).filter(x => Object.keys(x.meta).find(y => parent?.meta.options.find((x: { name: string; }) => x.name == "nested-meta-key").value.split(",").includes(y)));

                    if (!roles || roles.length == 0) {
                        interaction.reply({
                            embeds: [{
                                title: `No roles found!`,
                                description: `No Roles found with matching filters`,
                                color: 15548997
                            }],
                            ephemeral: true
                        });
                        return;
                    }

                    let sel = await BackendInteraction.createFromDiscord(interaction, "createRoleSelector-select", parent, true, InteractionType.MessageComponent);
                    const row = new ActionRowBuilder<SelectMenuBuilder>()
                        .addComponents(
                            new SelectMenuBuilder()
                                .setCustomId(sel.interactionId)
                                .setPlaceholder("Rolle auswählen")
                                .setMinValues(1)
                                .addOptions(roles.map<any>(r => ({ label: r.displayName, value: r.snowflake })).sort((a, b) => {
                                    let x = a.label.toLowerCase();
                                    let y = b.label.toLowerCase();

                                    if (x > y) { return -1 }
                                    if (x < y) { return 1 }

                                    return 0;
                                }))
                        )

                    let repl = {
                        components: [row],
                        ephemeral: true
                    };

                    await interaction.reply(repl);

                } else {
                    if (interaction.guild) {
                        let role = await dbRole.getDiscordRole(interaction.guild);

                        if (!role) {
                            await interaction.reply({content: "No discord role for dbrole"});
                            return;
                        }

                        let guildUser = await interaction.guild.members.fetch(interaction.user);
                        let guildRole = await interaction.guild.roles.fetch(role.id);

                        if (!guildRole) {
                            await interaction.reply({content: "No discord role for dbrole"});
                            return;
                        }

                        if (guildUser.roles.cache.has(guildRole.id)) {
                            await interaction.reply({
                                embeds: [{
                                    title: `Role could not be assigned!`,
                                    description: `User ${guildUser} already has role ${guildRole}`,
                                    color: 15548997
                                }],
                                ephemeral: true
                            });
                            return;
                        }

                        guildUser.roles.add(guildRole);

                        await interaction.reply({
                            embeds: [{
                                title: `Role assigned!`,
                                description: `User ${guildUser} has now role ${guildRole} assigned!`,
                                color: 5763719
                            }],
                            ephemeral: true
                        });
                        return;
                    }
                }
            }
        }
    }
};