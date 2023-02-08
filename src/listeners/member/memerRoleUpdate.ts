import {Client} from "discord.js";

export default (client: Client): void => {
    client.on("guildMemberUpdate", async (oldMember, newMember) => {
        // If the role(s) are present on the old member object but no longer on the new one (i.e role(s) were removed)
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        // If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));

        //handle role removal
        if (removedRoles.size > 0) {
            console.log(`The roles ${removedRoles.map(r => r.name)} were removed from ${oldMember.displayName}.`);

            removedRoles.each(async role => {
                //skip because role is not being tracked in database
                if (!await role.hasBackendInstance()) return;

                //retrieve backend role and parents
                let bRole = await role.getBackendRole();
                let bParentRole = await bRole?.getHeader();

                if (bParentRole != null && bParentRole.is_header == true) {
                    let usedHeaders = await bParentRole.getRoleUseHeader();
                    //we only search through roles that the user has
                    let filteredUsedParents = usedHeaders.filter(x => newMember.roles.cache.has(x.snowflake));

                    let dcRole = await bParentRole.getDiscordRole(newMember.guild);
                    if (filteredUsedParents.length == 0 && dcRole) {
                        await newMember.roles.remove(dcRole);
                    }
                }

                let bRelatedRoles = await bRole?.getCategories();
                if (bRelatedRoles) {
                    for (let role of bRelatedRoles) {
                        //skip current role that gets removed
                        if (newMember.roles.cache.some(x => x.id === role?.snowflake)) {
                            let usedCategories = await role.getRoleUseCategories();
                            //we only search through roles that the user has
                            let filteredUsedRelated = usedCategories.filter(x => newMember.roles.cache.has(x.snowflake));

                            let dcRole = await role.getDiscordRole(newMember.guild);
                            if (filteredUsedRelated.length == 0 && dcRole) {
                                await newMember.roles.remove(dcRole);
                            }
                        }
                    }
                }
            })
        }

        //handle role addition
        if (addedRoles.size > 0) {
            console.log(`The roles ${addedRoles.map(r => r.name)} were added to ${oldMember.displayName}.`);

            addedRoles.each(async role => {
                //skip because role is not being tracked in database
                if (!await role.hasBackendInstance()) return;
                console.log("backend instance")

                //retrieve backend role and parents
                let bRole = await role.getBackendRole();
                let bParentRole = await bRole?.getHeader();

                if (bParentRole != null && bParentRole.is_header) {
                    if (!newMember.roles.cache.has(bParentRole.snowflake)) {
                        let dcParent = await bParentRole.getDiscordRole(newMember.guild);
                        if (dcParent) {
                            await newMember.roles.add(dcParent);
                        }
                    }
                }

                let bRelatedRoles = await bRole?.getCategories();
                if (bRelatedRoles) {
                    for (let role of bRelatedRoles) {
                        if (!newMember.roles.cache.has(role.snowflake)) {
                            let dcRelated = await role.getDiscordRole(newMember.guild);

                            if (dcRelated) {
                                await newMember.roles.add(dcRelated);
                            }
                        }
                    }
                }
            })
        }
    });
};