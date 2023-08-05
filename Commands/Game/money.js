const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'money',
    category: 'Game',
    description: 'Show how financial stable you are',
    aliases: ['cash', 'finance', 'moneys', 'cashes'],
    syntax: `money [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        let description = [];
        const member = message.mentions.members.first() || message.member;

        if (!client.currencies.has(member.user.id)) {
            description.push(`Nothing to see here :(`);
        } else {
            description.push(Object.values(client.currencies.get(member.user.id)).map(entry => `**‣ ${entry.name}**: ${entry.value}`));
        }

        const embed = new EmbedBuilder()
        .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()})
        .setDescription(`## Currencies\n${description.join(`\n`)}`)
        .setColor(`Green`);

        message.reply({embeds: [embed]})
    }
}