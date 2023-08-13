const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: '8ball',
    category: 'Fun',
    description: 'Answer questions of your life',
    aliases: [`8balls`],
    syntax: `8ball`,
    run: async (client, message, args, prefix) => {
        const embedBuilder = new EmbedBuilder()
            .setTitle('DEPRECATED!')
            .setColor(0xFF0000)
            .setDescription('This command is deprecated, use /8ball instead');
        await message.reply({embeds: [embedBuilder]});
    }
}