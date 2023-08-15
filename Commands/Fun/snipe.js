const { EmbedBuilder } = require("discord.js");
const ms = require(`pretty-ms`)

module.exports = {
    name: 'snipe',
    category: 'Fun',
    description: 'Returns the last deleted message in current or specified channel',
    aliases: [],
    syntax: `snipe [channel]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        class Extractor {
            static extractAttachmentLinks(msg) {
                if (!msg?.content) {
                    return;
                }

                const text = msg.content;

                const matches = text.match(/\bhttps?:\/\/[^>\s<]+(?![^<]*<>)/gim);

                if (!matches) {
                    return;
                }
              
                if (matches.filter(url => ['tenor.com', 'giphy.com'].includes(new URL(url).host)).length) {
                    return matches.filter(url => ['tenor.com', 'giphy.com'].includes(new URL(url).host));
                }

                if (matches.filter(url => url.endsWith('.gif') || url.endsWith('.jpeg') || url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.img')).length) {
                    return matches.filter(url => url.endsWith('.gif') || url.endsWith('.jpeg') || url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.img'));
                }

                return;
            }
        }

        const channel = message.mentions.channels.first() || client.channels.cache.get(args[0]) || message.channel;
        const coll = client.snipes.filter(msg => msg.channelId === channel.id);

        const snipedMsg = coll.last();

        if (!snipedMsg) {
            return void message.channel.send(`No message was deleted, or incomplete message data`)
        }

        const snipedAuthor = client.users.cache.get(coll.lastKey().split(`_`)[0]);
        const relativeTimestamp = ms(message.createdTimestamp - coll.lastKey().split(`_`)[1], {verbose: true});

        const embed = new EmbedBuilder()
        .setTitle(`💀 i saw what you deleted`)
        .setColor(0xFF0000)
        .setAuthor({name: snipedAuthor.username, iconURL: snipedAuthor.avatarURL()})
        .setFooter({text: `Created ${relativeTimestamp} ago in #${channel.name} | requested by ${message.author.username}`})

        if (snipedMsg.content) {
            embed.setDescription(snipedMsg.content)
        }

        if (snipedMsg.attachments.first()) {
            embed.setImage(snipedMsg.attachments.first().url);
        }

        if (Extractor.extractAttachmentLinks(snipedMsg)) {
            embed.setImage(Extractor.extractAttachmentLinks(snipedMsg)[0]);
        }

        message.channel.send({embeds: [embed]})
    }
}