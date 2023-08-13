const { EmbedBuilder } = require("discord.js");
const ms = require(`pretty-ms`)

module.exports = {
    name: 'esnipe',
    category: 'Fun',
    description: 'Returns the last edited message in current or specified channel',
    aliases: ['editsnipe'],
    syntax: `esnipe [channel]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const channel = message.mentions.channels.first() || client.channels.cache.get(args[0]) || message.channel;
        const coll = client.esnipes.filter(msg => msg.oldMsg.channelId === channel.id)

        const esnipedMsgs = coll.last();

        if (!esnipedMsgs) {
            return void message.channel.send(`No message was edited, or incomplete message data`)
        }

        const snipedAuthor = client.users.cache.get(coll.lastKey().split(`_`)[0]);
        const relativeTimestamp = ms(message.createdTimestamp - coll.lastKey().split(`_`)[1], {verbose: true});

        const embed = new EmbedBuilder()
        .setTitle(`💀 i saw what you edited`)
        .setColor(0xFFFF00)
        .setAuthor({name: snipedAuthor.username, iconURL: snipedAuthor.avatarURL()})
        .setFields([
            {
                name: `Before`,
                value: esnipedMsgs.oldMsg.content
            },
            {
                name: `After`,
                value: esnipedMsgs.newMsg.content
            }
        ])
        .setFooter({text: `Created ${relativeTimestamp} ago in #${channel.name} | requested by ${message.author.username}`})

        message.channel.send({embeds: [embed]})
    }
}