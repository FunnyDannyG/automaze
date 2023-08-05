const { ActionRowBuilder, EmbedBuilder } = require("discord.js");
const shuffle = require('shuffle-array');

module.exports = (turn, embed, description, interaction, fields, optionsGUI) => {
    const newActionRow = ActionRowBuilder.from(turn[0].skillsGUI);
    shuffle(newActionRow.components);
    newActionRow.components.map(button => {
        button.setLabel(`██████████`);
    });

    description.push(`‣ **${turn[0].user.username}** is affected by blindness! Their moveset is censored and shuffled`);
    description.push(`‣ It is **${turn[0].user.username}** turn!`);

    turn[0].effects.splice(turn[0].effects.findIndex(e => e === 'Blindness'), 1);

    interaction.update({
        embeds: [EmbedBuilder.from(embed).setDescription(description.join(`\n`)).setFields(fields)],
        components: [newActionRow, optionsGUI]
    });
}