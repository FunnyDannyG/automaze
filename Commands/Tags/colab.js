const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'colab',
    category: 'Tags',
    description: 'Links to inference and training colabs made by kalo',
    aliases: [],
    syntax: `colab [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`RVC Colabs`)
        .setDescription(`## • RVC v2 Easy GUI Colab\nhttps://colab.research.google.com/drive/1Gj6UTf2gicndUW_tVheVhTXIIYpFTYc7?usp=sharing\n## • RVC v2 Training Colab\nhttps://colab.research.google.com/drive/1TU-kkQWVf-PLO_hSa2QCMZS1XF5xVHqs?usp=sharing`)
        .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}