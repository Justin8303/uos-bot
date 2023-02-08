import {AuditLogEvent, Client} from "discord.js";
import {addPadding} from "../../../lib/utils/stringManipulation";

export default (client: Client): void => {
    client.on("roleUpdate", async (oldRole, newRole) => {
        let guildEditAuditLogs = (await newRole.guild.fetchAuditLogs({
            type: AuditLogEvent.RoleUpdate,
            limit: 5
        }))
        let roleEditAudit = guildEditAuditLogs.entries.find(x => x.target?.id == newRole.id);
        if (roleEditAudit?.executor?.bot) return;


        if (await newRole.hasBackendInstance()) {
            let dbRole = await newRole.getBackendRole();
            if (!dbRole) return;
            dbRole.name = newRole.name;
            dbRole.color = newRole.color;

            let customName = newRole.name;
            if (dbRole.is_header && dbRole.formatted) {
                customName = addPadding(customName, 16);

                dbRole.displayName = customName;
                await newRole.edit({
                    name: customName,
                });
            } else if (dbRole.is_category && dbRole.formatted) {
                customName = addPadding(customName, 16, true);

                dbRole.displayName = customName;
                await newRole.edit({
                    name: customName,
                });
            } else {
                dbRole.displayName = newRole.name;
            }

            dbRole.save();
        }
    });
};