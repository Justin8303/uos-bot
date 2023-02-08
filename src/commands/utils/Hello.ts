import {ApplicationCommandType} from "discord-api-types/v10";
import {Command} from "../../interfaces/ChatInputApplicationCommandData";

export const Hello: Command = {
    name: "hello",
    description: "Returns a greeting",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        if (!interaction.isCommand()) return;
        const content = "Hello there!";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};