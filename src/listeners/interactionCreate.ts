import {
    AutocompleteInteraction,
    ButtonInteraction,
    CacheType,
    ChatInputCommandInteraction,
    Client,
    ContextMenuCommandInteraction,
    Interaction,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    SelectMenuInteraction,
    UserContextMenuCommandInteraction
} from "discord.js";
import {List} from "../commands/list";
import {BackendInteraction} from "../../lib/database/entities/BackendInteraction";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isAutocomplete()) {
            await handleSlashAutocomplete(client, interaction);
            return;
        }

        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(client, interaction);
            return;
        }

        await handleInteraction(client, interaction);
    });
};

const handleSlashAutocomplete = async (client: Client, interaction: AutocompleteInteraction<CacheType>): Promise<void> => {
    const slashCommand = List.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    if (!slashCommand.autoComplete) {
        console.error(`Command ${interaction.commandName} has no autocomplete handler.`);
        return;
    }

    slashCommand.autoComplete(client, interaction);
}

const handleSlashCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType> | UserContextMenuCommandInteraction<CacheType> | (SelectMenuInteraction<CacheType> & ContextMenuCommandInteraction<CacheType>) | (ButtonInteraction<CacheType> & ContextMenuCommandInteraction<CacheType>) | (AutocompleteInteraction<CacheType> & ContextMenuCommandInteraction<CacheType>) | (ModalSubmitInteraction<CacheType> & ContextMenuCommandInteraction<CacheType>)): Promise<void> => {
    const slashCommand = List.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        await interaction.followUp({content: "An error has occurred"});
        return;
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction);
};

const handleInteraction = async (client: Client, interaction: Interaction): Promise<void> => {
    let dbInteraction = await BackendInteraction.getFromDiscord(interaction);

    if (!dbInteraction)
        return;

    let pc = await dbInteraction.getParentCommand()
    if (pc == null) {
        return;
    }

    const slashCommand = List.find(c => c.name === pc?.meta.commandName);
    if (!slashCommand) {
        console.error(`No interaction handler matching ${dbInteraction.interactionId} was found.`);
        return;
    }

    if (!slashCommand.handleInteraction) {
        console.error(`Interaction ${dbInteraction.interactionId} has no interaction handler.`);
        return;
    }

    slashCommand.handleInteraction(client, interaction);
};
