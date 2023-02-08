import {Client} from "discord.js";
import {List} from "../commands/list";
import dbConnect from "../../lib/database/dbConnect";

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        await dbConnect();
        await client.application.commands.set(List);

        console.log(`${client.user.username} is online`);
    });
};