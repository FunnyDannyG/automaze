const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, AuditLogEvent } = require('discord.js');
const fs = require('fs');
let currentChannel = require('../../JSON/modlog.json');

module.exports = {
    category: 'Utilities',
    scope: 'local',
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
                .addStringOption(option => option
                    .setName('name')
                    .setDescription('channel name to switch current modlog to')
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete modlog channel')
                .addStringOption(option => option
                    .setName('reason')
                    .setDescription('reason for deleting modlog')))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(client, interaction) {
        if(interaction.options.getSubcommand() == 'add') {
            createChannel(client, interaction);
        } else if(interaction.options.getSubcommand() == 'change') {
            changeChannel(client, interaction);
        } else if(interaction.options.getSubcommand() == 'add') {
            deleteChannel(interaction);
        }
    },
};

async function createChannel(client, interaction) {
    if(currentChannel.id == null) {
        const name = interaction.options.getString('name') ? interaction.options.getString('name') : "modlog";
        currentChannel = await interaction.guild.channels.create({
            name: name,
            type: ChannelType.AuditLogEvent
        });
        fs.writeFileSync(`${process.cwd()}/JSON/modlog.json`, JSON.stringify(currentChannel));
        await interaction.reply({ content:`Modlog channel "${currentChannel.name}" was created`, ephemeral: true});
        console.log(`Modlog channel "${currentChannel.name}" was created`);
    } else {
        await interaction.reply({ content:`Modlog channel "${currentChannel.name}" already exists`, ephemeral: true});
        console.log(`Modlog channel "${currentChannel.name}" already exists`);
    }
}

async function changeChannel(client, interaction) {
    const previousName = currentChannel.name;
    const newName = interaction.options.getString('name');
    await client.channels.cache.get(currentChannel.id).edit({ name: newName });
    currentChannel.name = newName;
    fs.writeFileSync(`${process.cwd()}/JSON/modlog.json`, JSON.stringify(currentChannel));
    await interaction.reply({ content:`Modlog changed from ${previousName} to ${currentChannel.name}`, ephemeral: true});
    console.log(`Modlog changed from ${previousName} to ${currentChannel.name}`);
}

async function deleteChannel(client, interaction) {
    const previousName = currentChannel.name;
    const reason = interaction.options.getString('reason');
    await client.channels.cache.get(currentChannel.id).delete(reason);
    if(reason) {
        await interaction.reply({ content:`Modlog channel "${previousName}" was deleted because ${reason}`, ephemeral: true});
        console.log(`Modlog channel "${previousName}" was deleted because ${reason}`);
    } else {
        await interaction.reply({ content:`Modlog channel "${previousName}" was deleted`, ephemeral: true });
        console.log(`Modlog channel "${previousName}" was deleted`);
    }
    fs.writeFileSync(`${process.cwd()}/JSON/modlog.json`, '{}');
}