const { Events, AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildAuditLogEntryCreate,
	run(client, auditLogEntry, guild) {
		addModlogEvent(client, auditLogEntry, guild);
	},
};

async function addModlogEvent(client, auditLogEntry, guild) {
    const { action, executorId, targetId } = auditLogEntry;
    let currentChannel = require('../JSON/modlog.json');
    const desiredEvents = [
        AuditLogEvent.MemberUpdate, AuditLogEvent.MemberPrune, 
        AuditLogEvent.MemberBanAdd, AuditLogEvent.MemberKick
    ]

    if (!desiredEvents.includes(action) || (currentChannel == null)) return;

    const executor = await client.users.fetch(executorId);
    const guildMember = await guild.members.cache.get(targetId);
    
    const target = guildMember.user;
    const eventEmbed = new EmbedBuilder();

    switch(action) {
        case AuditLogEvent.MemberUpdate:
            eventEmbed
                .setTitle(`${target.username} was timed out`)
                .setColor(`Red`)
                .setDescription(`until ${guildMember.communicationDisabledUntil}\nExecuted by ${executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            await client.channels.cache.get(currentChannel.id).send({embeds: [eventEmbed]});
            break;
        case AuditLogEvent.MemberPrune:
            eventEmbed
                .setTitle(`${target.username} was pruned!`)
                .setColor(`Red`)
                .setDescription(`Executed by ${executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            await client.channels.cache.get(currentChannel.id).send({embeds: [eventEmbed]});
            break;
        case AuditLogEvent.MemberBanAdd:
            eventEmbed
                .setTitle(`${target.username} has been banned!`)
                .setColor(`Red`)
                .setDescription(`Executed by ${executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            await client.channels.cache.get(currentChannel.id).send({embeds: [eventEmbed]});
            break;
        case AuditLogEvent.MemberKick:
            eventEmbed
                .setTitle(`${target.username} has been kicked!`)
                .setColor(`Red`)
                .setDescription(`Executed by ${executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            await client.channels.cache.get(currentChannel.id).send({embeds: [eventEmbed]});
            break;
        default:
            console.error(`How did we get here?\nWho let the ${action} in?`);
    }
}
