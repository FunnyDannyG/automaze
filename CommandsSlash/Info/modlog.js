const { channel } = require('diagnostics_channel');
const { SlashCommandBuilder, PermissionFlagsBits, AuditLogEvent } = require('discord.js');

module.exports = {
    category: 'Utilities',
    scope: 'Global',
    type: 'slash',

    data: new SlashCommandBuilder()
        .setName('modlog')
        .setDescription('Create a modlog channel')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Create modlog channel')
                .addStringOption(option => option
                    .setName('name')
                    .setDescription('defaults to modlog')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('change')
                .setDescription('Change modlog channel')
                .addChannelOption(option => option
                    .setName('name')
                    .setDescription('channel to switch modlog to')
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete modlog channel'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(client, interaction) {
        if(interaction.options.getSubcommand() == 'add') {
            client.on('channelCreate', (channel) => {
                console.log(channel);
            });
            await interaction.reply(`${interaction.options.getString()} channel was created`);
        } else if(interaction.options.getSubcommand() == 'change') {
            client.on('channelUpdate', (oldChannel, newChannel) => {
                console.log(oldChannel, newChannel);
            });
            await interaction.reply(`Modlog was changed to channel ${interaction.options.getString()}`);
        } else if(interaction.options.getSubcommand() == 'add') {
            client.on('channelDelete', (channel) => {
                console.log(channel);
            });
            await interaction.reply(`Modlog was deleted}`);
        }
    },
};