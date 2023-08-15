const { Events, AuditLogEvent } = require('discord.js');

module.exports = {
	name: Events.GuildAuditLogEntryCreate,
	run(client, auditLogEntry, guild) {
        console.log("a");
		addModlogEvent(auditLogEntry, client);
	},
};

async function addModlogEvent(auditLogEntry, client) {
    const { action, executorId, targetId } = auditLogEntry;
    const currentChannel = require('../JSON/modlog.json');
    const desiredEvents = [
        AuditLogEvent.MemberUpdate, 
        AuditLogEvent.MemberPrune, AuditLogEvent.MemberBanAdd, 
        AuditLogEvent.MemberBanRemove, AuditLogEvent.MemberKick
    ]
    console.log(`${action} ${!desiredEvents.includes(action)} ${currentChannel == null}`);
    if (!desiredEvents.includes(action) || (currentChannel == null)) return;
    console.log("c");
    const executor = await client.users.fetch(executorId);
    const target = await client.users.fetch(targetId);

    switch(action) {
        case AuditLogEvent.MemberUpdate:
            await client.channels.cache.get(currentChannel.id).send(`${target.tag} was timed out by ${executor.tag}`);
            console.log(`${target.tag} was timed out by ${executor}`);
            break;
        case AuditLogEvent.MemberPrune:
            await client.channels.cache.get(currentChannel.id).send(`${target} was pruned by ${executor}`);
            console.log(`${target.tag} was pruned by ${executor.tag}`);
            break;
        case AuditLogEvent.MemberBanAdd:
            await client.channels.cache.get(currentChannel.id).send(`${target.tag} was banned by ${executor.tag}`);
            console.log(`${target.tag} was banned by ${executor.tag}`);
            break;
        case AuditLogEvent.MemberBanRemove:
            await client.channels.cache.get(currentChannel.id).send(`${target.tag} was unbanned by ${executor.tag}`);
            console.log(`${target.tag} was unbanned by ${executor.tag}`);
            break;
        case AuditLogEvent.MemberKick:
            await client.channels.cache.get(currentChannel.id).send(`${target.tag} was kicked by ${executor.tag}`);
            console.log(`${target.tag} was kicked by ${executor.tag}`);
            break;
        default:
            console.error(`How did we get here?\nWho let the ${action} in?`);
    }
}
