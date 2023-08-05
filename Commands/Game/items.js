const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'items',
    category: 'Game',
    description: 'Show your owned items',
    aliases: ['item', 'inv', 'inventory'],
    syntax: `items [member]`,
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

        if (!client.items.has(member.user.id) || !Object.values(client.items.get(member.user.id)).filter(entry => entry.value).length) {
            description.push(`Nothing to see here :(`);
        } else {
            description.push(Object.values(client.items.get(member.user.id)).filter(entry => entry.value).map(entry => `**‣ ${entry.name}**: ${entry.value}`).join(`\n`));
        }

        const embed = new EmbedBuilder()
        .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()})
        .setDescription(`## Items\n${description.join(`\n`)}`)
        .setColor(`Green`);

        message.reply({embeds: [embed]})
    }
}