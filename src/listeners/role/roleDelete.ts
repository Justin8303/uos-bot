import {Client, Role} from "discord.js";
import {BackendRole as DatabaseRole} from "../../../lib/database/entities/BackendRole";

export default (client: Client): void => {
    client.on("roleDelete", async (role: Role) => {
        let dbRole = await role.getBackendRole();
        if (!dbRole) return;

        dbRole.remove();

        await DatabaseRole.findOneAndDelete({
            snowflake: role.id
        })
    });
};