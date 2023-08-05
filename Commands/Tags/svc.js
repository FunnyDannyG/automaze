const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'svc',
    category: 'Tags',
    description: 'why do you still use svc',
    aliases: [],
    syntax: `svc`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        message.channel.send(`https://media.discordapp.net/attachments/1089308888085577808/1118602866156896356/IMG_6652.gif`);
    }
}