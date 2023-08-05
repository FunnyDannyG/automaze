const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'realtime',
    category: 'Tags',
    description: 'RVC real-time conversion guide',
    aliases: ['rt'],
    syntax: `realtime [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`Real-time conversion RVC guide`)
        .setDescription(`## • W-Okada's Voice Changer with RVC\nhttps://docs.google.com/document/d/11eofqJXiHiVsLt_JjCwHROt_0OSryPFb1toyDBuLoXc/\n## • Real-time conversion RVC guide (local)\nhttps://docs.google.com/document/d/1haQAWn4Hnh3Aq8SSGX0tBSY3rDzjYJAcczrUy63oTTs/edit`)
        .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}