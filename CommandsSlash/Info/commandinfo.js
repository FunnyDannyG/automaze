const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    category: `Info`,
    scope: `global`,
    type: `slash`,

    data: new SlashCommandBuilder()
        .setName(`commandinfo`)
        .setDescription(`Show specific info of a command`)
        .addStringOption(option =>
            option.setName('cmd')
                .setDescription('Command to search for')
                .setRequired(true)
                .setAutocomplete(true)),

    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = client.slashCommands.map(command => command.data.name);
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));

        await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })).slice(0, 25));
    },

    async execute(client, interaction) {
        const cmd = interaction.options.getString(`cmd`);

        if (!client.commands.get(cmd) && !client.commands.find(c => c.aliases && c.aliases.includes(cmd) && c.aliases !== [])) {
            return await interaction.reply({ content: `That command does not exist!`, ephemeral: true });
        }

        const command = client.slashCommands.get(cmd);

        const commandInfoEmbed = new EmbedBuilder()
            .setDescription(`# \`/${command.data.name}\`\n- **Category**: ${command.category}\n- **Description**: ${command.data.description}\n- **Syntax**: \`/${command.data.name} ${command.data.options.map(option => option.required ? `<${option.name}>` : `[${option.name}]`).join(` `)}\`\n- **Arguments**:\n ${command.data.options.length ? command.data.options.map(option => `\`${option.name}\` - ${option.description}`).join(`\n`) : `This command does not have any available arguments`}`)
            .setColor(`Yellow`);

        await interaction.reply({ embeds: [commandInfoEmbed] });
    }
}