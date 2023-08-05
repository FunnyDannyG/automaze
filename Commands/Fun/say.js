const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'say',
    category: 'Fun',
    description: 'say.',
    aliases: [],
    syntax: `say <channelID>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        if (message.author.id !== '707400633451282493') {
            return;
        }

        const channel = args[0] || message.channel.id;
        const content = message.content.split(' ').slice(2).join(' ');

        if (!content) {
            return;
        }

        message.guild.channels.cache.get(channel).send(content).then(() => {
            message.delete()
        })
    }
}