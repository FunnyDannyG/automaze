const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'rvcorsvc',
    category: 'Tags',
    description: 'What to choose? RVC or SVC?',
    aliases: ['svcorrvc'],
    syntax: `rvcorsvc [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`RVC or SVC?`)
        .setDescription(`## • Training in RVC is much faster, however the voice inference will sound more robotic\n## • Inferring in SVC results in a better quality voice, in exchange for longer training time`)
        .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}