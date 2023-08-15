const { Events, AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildAuditLogEntryCreate,
	run(client, auditLogEntry) {
		addModlogEvent(auditLogEntry, client);
	},
};

async function addModlogEvent(auditLogEntry, client) {
    const { action, executorId, targetId } = auditLogEntry;
    const currentChannel = require('../JSON/modlog.json');
    const desiredEvents = [
        AuditLogEvent.MemberUpdate, AuditLogEvent.MemberPrune, 
        AuditLogEvent.MemberBanAdd, AuditLogEvent.MemberKick
    ]

    if (!desiredEvents.includes(action) || (currentChannel == null)) return;

    const executor = await client.users.fetch(executorId);
    const target = await client.users.fetch(targetId);
    const banEmbed = new EmbedBuilder();

    switch(action) {
        case AuditLogEvent.MemberUpdate:
            banEmbed
                .setTitle(`${target.username} has been timed out!`)
                .setColor(`Red`)
                .setDescription(`Executed by ${executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            await client.channels.cache.get(currentChannel.id).send({embeds: [banEmbed]});
            break;
        case AuditLogEvent.MemberPrune:
            banEmbed = new EmbedBuilder()
                .setTitle(`${target.username} was pruned!`)
                .setColor(`Red`)
                .setDescription(`Executed by ${executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            await client.channels.cache.get(currentChannel.id).send({embeds: [banEmbed]});
            break;
        case AuditLogEvent.MemberBanAdd:
            banEmbed
                .setTitle(`${target.username} has been banned!`)
                .setColor(`Red`)
                .setDescription(`Executed by ${executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            await client.channels.cache.get(currentChannel.id).send({embeds: [banEmbed]});
            break;
        case AuditLogEvent.MemberKick:
            banEmbed
                .setTitle(`${target.username} has been kicked!`)
                .setColor(`Red`)
                .setDescription(`Executed by ${executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            await client.channels.cache.get(currentChannel.id).send({embeds: [banEmbed]});
            break;
        default:
            console.error(`How did we get here?\nWho let the ${action} in?`);
    }
}
