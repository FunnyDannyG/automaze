const { EmbedBuilder } = require(`discord.js`);

module.exports = {
    name: 'dutchguides',
    category: 'Tags',
    description: 'Uitleg voor het maken van AI-Covers in het Nederlands door Tamer',
    aliases: ['nl_guides', 'nl_g'],
    syntax: `dutchguides <member>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`Handleiding`)
        .setDescription(`## • Nederlandse Cover Handleiding\nhttps://docs.google.com/document/d/1jNLqaC0BaWsL7w-T8OLolAiQQFVn05p5O8QH-dKFBK8/edit?usp=sharing`)
        .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestie voor ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}