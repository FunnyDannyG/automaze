const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'banana',
    category: 'Fun',
    description: 'BANAN SOMEOME!!!!11!111!11',
    aliases: ['banan'],
    syntax: `banana <member>`,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: async (client, message, args, prefix) => {
        const embedBuilder = new EmbedBuilder()
            .setTitle('DEPRECATED!')
            .setColor(0xFF0000)
            .setDescription('Use **/banana** instead');
        await message.reply({ embeds: [embedBuilder] });
    }
}