const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'tensor',
    category: 'Tags',
    description: 'A guide to install and load tensorboard',
    aliases: ['tensorboard', 'tb'],
    syntax: `tensor [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`Tensorboard`)
        .setDescription(`~~## • Tensorboard local install guide~~\n~~https://discord.com/channels/1089076875999072296/1117648692468527174~~\n## • The built in TensorBoard script fails at the moment. While we fix this, here's an alternate install guide\nhttps://docs.google.com/document/d/1ihvqWnSyabvZ9jX6BsOxEY1FpplwjY3Jse3she_VO6I/edit?usp=sharing`)
        .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}