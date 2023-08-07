const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'paperspace',
    category: 'Tags',
    description: 'Retrieval-based Voice Conversions Paperspace guide made by LollenApe',
    aliases: [],
    syntax: `paperspace [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`Paperspace Guide`)
        .setDescription(`## • Make an AI cover using an existing model on RVC v2\nhttps://docs.google.com/document/d/1lIAK4Y0ylash_1M2UTTL_tfA3_mEzP0D2kjX2A3rfSY/edit?usp=sharing`)
        .setColor(`Blue`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}
