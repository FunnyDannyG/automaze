const { EmbedBuilder, AuditLogEvent } = require("discord.js");

module.exports = {
    name: "guildBanAdd",
    once: false,
    run(Client, ban){

        const banEmbed = new EmbedBuilder()
            .setTitle(`${ban.user.username} has been banned!`)
            .setColor(`Red`);
    
        ban.guild.fetchAuditLogs({type: AuditLogEvent.MemberBanAdd}).then(auditLog => {
            const banEntry = auditLog.entries.first();
            banEmbed.setDescription(`Executed by ${banEntry.executor} <t:${Math.round(Date.now() / 1000)}:R>`);
            ban.guild.channels.cache.get(Client.discordIDs.Admin.BanLog).send({embeds: [banEmbed]});
        });

    }
}