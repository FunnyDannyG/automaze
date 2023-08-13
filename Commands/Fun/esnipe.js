const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'esnipe',
    category: 'Fun',
    description: 'DEPRECATED',
    aliases: [`esniper`],
    syntax: `esnipe`,
    run: async (client, message, args, prefix) => {
        const embedBuilder = new EmbedBuilder()
            .setTitle('DEPRECATED!')
            .setColor(0xFF0000)
            .setDescription('Boomer! This command no longer exists!');
        await message.reply({embeds: [embedBuilder]});
    }
}