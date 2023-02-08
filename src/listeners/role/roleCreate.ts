import {AuditLogEvent, Client, Role} from "discord.js";
import {BackendRole as DatabaseRole} from "../../../lib/database/entities/BackendRole";

export default (client: Client): void => {
    client.on("roleCreate", async (role: Role) => {
        let guildAuditLogs = await role.guild.fetchAuditLogs({
            type: AuditLogEvent.RoleCreate,
            limit: 5
        })

        let roleAudit = guildAuditLogs.entries.find(x => x.target?.id == role.id);
        if (roleAudit?.executor?.bot) return;

        await DatabaseRole.create({
            snowflake: role.id,
            created_by: roleAudit?.executor?.id,
            color: role.color,
            displayName: role.name,
            is_header: false,
            name: role.name,
        })
    });
};