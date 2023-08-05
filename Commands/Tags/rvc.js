const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'rvc',
    category: 'Tags',
    description: 'Retrieval-based Voice Conversions guide links made by kalo',
    aliases: [],
    syntax: `rvc [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`RVC Guides`)
        .setDescription(`## • Make an AI cover using an existing model on RVC v2\nhttps://docs.google.com/document/d/13_l1bd1Osgz7qlAZn-zhklCbHpVRk6bYOuAuB78qmsE/edit\n## • Train a new voice model using RVC v2\nhttps://docs.google.com/document/d/13ebnzmeEBc6uzYCMt-QVFQk-whVrK4zw8k7_Lw3Bv_A/edit\n## • Install RVC v2 locally\nhttps://docs.google.com/document/d/1KKKE7hoyGXMw-Lg0JWx16R8xz3OfxADjwEYJTqzDO1k/edit`)
        .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}