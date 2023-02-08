import {
    AutocompleteInteraction,
    ButtonInteraction,
    CacheType,
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    Client,
    ContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction,
    SelectMenuInteraction,
    UserContextMenuCommandInteraction
} from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    autoComplete?: (client: Client, interaction: AutocompleteInteraction<CacheType>) => void;
    run: (client: Client, interaction: ChatInputCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType> | UserContextMenuCommandInteraction<CacheType> | (SelectMenuInteraction<CacheType> & ContextMenuCommandInteraction<CacheType>) | (ButtonInteraction<CacheType> & ContextMenuCommandInteraction<CacheType>) | (AutocompleteInteraction<CacheType> & ContextMenuCommandInteraction<CacheType>) | (ModalSubmitInteraction<CacheType> & ContextMenuCommandInteraction<CacheType>)) => void;
}