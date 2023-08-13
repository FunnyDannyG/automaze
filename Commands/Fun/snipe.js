const { EmbedBuilder } = require("discord.js");
const ms = require(`pretty-ms`);

const responses = [
    'I won\'t tell what was deleted',
    'Don\'t insist...I won\'t tell what was deleted 😤',
    'Was something deleted? I wasn\'t aware',
    'Wanna know what was deleted?\n\n> **Answer:** A message 😁 (ye, not that funny)',
    'Hey, soul sister\nAin\'t that Mr. Mister on the radio, stereo...🎤',
    'Nice try...',
    'I ain\'t gonna tell you what was deleted 🤐',
    'Nothing was deleted ig',
    'A message was deleted. Can I help you with anything else?',
    'Sorry, I didn\'t see what was deleted. Anyone saw?',
    'Deleted message was: This AI HUB shit gets dangerous'
];

module.exports = {
    name: 'snipe',
    category: 'Fun',
    description: 'Returns the last deleted message in current or specified channel (not anymore, sorry)',
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
        const randomIndex = Math.floor(Math.random() * responses.length);
        const randomAnswer = responses[randomIndex];
        const embed = new EmbedBuilder()
                            .setTitle(`💀 I saw what you deleted (kind of)`)
                            .setColor(0xFF0000)
                            .setDescription(`${message.author} ${randomAnswer}`)
                            .setFooter({text: 'Note: This command will be removed soon'});
        message.channel.send({embeds: [embed]});
    }
}