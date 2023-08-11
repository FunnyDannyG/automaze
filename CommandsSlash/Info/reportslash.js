const { SlashCommandBuilder, MessageEmbed } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a message and send its details to a specific channel.')
        .addStringOption(option => 
            option.setName('message_link')
                .setDescription('Link to the reported message')
                .setRequired(true)),
    category: 'Moderation', // Adjust the category as needed
    async execute(interaction) {
        const messageLink = interaction.options.getString('message_link');
        
        const messageRegex = /channels\/(\d+)\/(\d+)\/(\d+)/;
        const [, guildId, channelId, messageId] = messageLink.match(messageRegex);
        console.log(guildId, channelId, messageId);
        try {
            const guild = interaction.client.guilds.cache.get(guildId);
            if (!guild) {
                throw new Error('Guild not found.');
            }
            
            const channel = guild.channels.cache.get(channelId);
            
            const message = await channel.messages.fetch(messageId);
            const reportEmbed = new EmbedBuilder()
                .setTitle(`Reported Message`)
                .addFields(
                    { name: 'Message ID', value: message.id },
                    
                    { name: 'Message Content', value: message.content },
                    
                    { name: 'Reported by', value: interaction.user.tag },
                    { name: 'Reported User', value: message.author.tag },
                )
                .setColor('#FF0000');  // Use uppercase 'RED' for color
                
            const user = interaction.user;
            await user.send({ embeds: [reportEmbed] });
            //Please make sure to add a channel
            const reportChannel = guild.channels.cache.get('ADD CHANNEL');
            
            await reportChannel.send({ embeds: [reportEmbed] });
            
            await interaction.reply({ content: 'Reported message details have been sent to your direct messages and the specified report channel.', ephemeral: true });
            
        } catch (error) {
            interaction.reply(`Error: ${error.message}`);
        }
    }
};
