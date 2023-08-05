const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'tts',
    category: 'Tags',
    description: 'Text-to-speech RVC conversion',
    aliases: ['texttospeech'],
    syntax: `tts [member]`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const embed = new EmbedBuilder()
        .setTitle(`TTS Guides`)
        .setDescription(`## • Official guide\nhttps://rentry.co/RVC-TTS-Guide`)
        .setColor(`Yellow`);

        if (message.mentions.members.first()) {
            return void message.channel.send({content: `*Tag suggestion for ${message.mentions.members.first()}*`, embeds: [embed]});
        }

        message.channel.send({embeds: [embed]});
    }
}