const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'uvr',
    category: 'Tags',
    description: 'Ultimate Vocal Remover guides and links',
    aliases: [],
    syntax: `uvr [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`Ultimate Vocal Remover`)
        .setDescription(`## • Official website\nhttps://ultimatevocalremover.com/\n## • Instrumental, Vocal Separation & Mastering Guide\nhttps://docs.google.com/document/d/17fjNvJzj8ZGSer7c7OFe_CNfUKbAxEh_OBv94ZdRG5c/edit`)
        .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}