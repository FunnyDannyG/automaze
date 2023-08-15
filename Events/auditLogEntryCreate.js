const { Events, AuditLogEvent } = require('discord.js');

module.exports = {
	name: Events.GuildAuditLogEntryCreate,
	run(_, auditLogEntry, guild) {
        console.log("entry was created")
		addModlogEvent(auditLogEntry, guild);
	},
};

async function addModlogEvent(auditLogEntry, guild) {
    const { action, executorId, targetId } = auditLogEntry;
    const savedChannel = require('../JSON/modlog.json');
    const currentChannel = guild.channels.cache.get(savedChannel.id);
    const desiredEvents = [
        AuditLogEvent.AutoModerationUserCommunicationDisabled, 
        AuditLogEvent.MemberPrune, AuditLogEvent.MemberBanAdd, 
        AuditLogEvent.MemberBanRemove, AuditLogEvent.MemberKick
    ]

    if (!(action in desiredEvents) || (currentChannel == null)) return;

    const executor = await guild.users.fetch(executorId);
    const target = await guild.users.fetch(targetId);

    switch(action) {
        case AuditLogEvent.AutoModerationUserCommunicationDisabled:
            currentChannel.send(`${target.tag} was timed out by ${executor.tag}`);
            break;
        case AuditLogEvent.MemberPrune:
            currentChannel.send(`${target.tag} was pruned by ${executor.tag}`);
            break;
        case AuditLogEvent.MemberBanAdd:
            currentChannel.send(`${target.tag} was banned by ${executor.tag}`);
            break;
        case AuditLogEvent.MemberBanRemove:
            currentChannel.send(`${target.tag} was unbanned by ${executor.tag}`);
            break;
        case AuditLogEvent.MemberKick:
            currentChannel.send(`${target.tag} was kicked by ${executor.tag}`);
            break;
        default:
            currentChannel.send(`How did we get here?\nWho let the ${action} in?`);
    }
}
