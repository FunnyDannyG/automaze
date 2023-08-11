module.exports.run = async (client, interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.slashCommands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
    
        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: `There was an error while executing this command!\n\`\`\`\n${error.toString()}\n\`\`\``, ephemeral: true });
            } else {
                await interaction.reply({ content: `There was an error while executing this command!\n\`\`\`\n${error.toString()}\n\`\`\``, ephemeral: true });
            }
        }
    }

    if (interaction.isAutocomplete()) {
        const command = interaction.client.slashCommands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
			return;
        }

        try {
			await command.autocomplete(client, interaction);
		} catch (error) {
			console.error(error);
		}
    }
};