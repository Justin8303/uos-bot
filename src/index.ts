import {Client, GatewayIntentBits} from "discord.js";
import * as dotenv from "dotenv";

import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import roleDelete from "./listeners/role/roleDelete";
import roleCreate from "./listeners/role/roleCreate";
import roleUpdate from "./listeners/role/roleUpdate";
import memerRoleUpdate from "./listeners/member/memerRoleUpdate";

console.log("Bot is starting...");

dotenv.config();

//init type overwrites
import "../types/RoleExtend";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ]
});

//register global bot
global.discordBot = client;

client.login(process.env.TOKEN)

ready(client);

roleCreate(client);
roleUpdate(client);
roleDelete(client);

memerRoleUpdate(client);

interactionCreate(client);

console.log(client);