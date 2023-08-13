const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { byValue, byNumber } = require('sort-es');

module.exports = {
    category: `Fun`,
    scope: `global`,
    type: `slash`, 
    data: new SlashCommandBuilder()
                .setName('topbanana')
                .setDescription('SEE HOW MUCH SOMEONE GOT BANAN!!!!11!111!11'),
    async execute(client, interaction) {
        const lbUnsorted = JSON.parse(interaction.client.banana.export()).keys
        const lbSorted = lbUnsorted.sort(byValue(i => i.value, byNumber({ desc: true }))).slice(0, 10)

        let description = [];
        for (const entry of lbSorted) {
            const entryVal = Object.values(entry);
            const user = await interaction.client.users.fetch(entryVal[0])
            description.push(`**‣ ${user.username}** - ${entryVal[1]}`)
        }

        const bananEmbed = new EmbedBuilder()
                                .setTitle(`THE FORTNITE BALLS LEADERBANAN`)
                                .setDescription(description.join(`\n`))
                                .setColor(`Yellow`);

        await interaction.reply({ embeds: [bananEmbed] })
    }
}
