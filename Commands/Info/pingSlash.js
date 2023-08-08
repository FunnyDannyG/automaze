const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ms = require(`pretty-ms`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pong!'),
    async execute(interaction) {
        const pingEmbed = new EmbedBuilder()
            .setTitle(`WHO PINGED GRRR!!!! <:joe_angry:1093358453780652052>`)
            .setDescription(`- **Client's average ping**: ${interaction.client.ws.ping}ms\n- **Time passed since last ready**: ${ms(interaction.client.uptime, { verbose: true })}`)
            .setColor(`Green`);
        interaction.reply({ embeds: [pingEmbed] })
    }
};