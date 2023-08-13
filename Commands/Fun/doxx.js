const Chance = require("chance");
const chance = new Chance;
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: 'doxx',
    category: 'Fun',
    description: 'NOT ACTUAL DOXXING. creates random ip and house address',
    aliases: [],
    syntax: `doxx`,
    run: async (client, message, args, prefix) => {
        const embedBuilder = new EmbedBuilder()
            .setTitle('DEPRECATED!')
            .setColor(0xFF0000)
            .setDescription('Use **/doxx** instead');
        await message.reply({ embeds: [embedBuilder] });
    }
}