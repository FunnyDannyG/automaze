const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ms = require(`pretty-ms`);

module.exports = {
    category: `Info`,
    scope: `Global`,
    type: `slash`,

    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong! Display client\'s ping and uptime'),

    async execute(client, interaction) {
        const pingEmbed = new EmbedBuilder()
            .setTitle(`WHO PINGED GRRR!!!! <:joe_angry:1093358453780652052>`)
            .setDescription(`- **Client's average ping**: ${interaction.client.ws.ping}ms\n- **Time passed since last ready**: ${ms(interaction.client.uptime, { verbose: true })}`)
            .setColor(`Green`);
        await interaction.reply({ embeds: [pingEmbed] })
    }
};