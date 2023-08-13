const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    category: `Fun`,
    scope: `global`,
    type: `slash`,
    data: new SlashCommandBuilder()
                .setName('banana')
                .setDescription('BANAN SOMEOME!!!!11!111!11')
                .addUserOption(option =>
                    option.setName('user').setDescription('User to banan')
                 )
    ,
    async execute(client, interaction) {
        const member = interaction.options.getUser('user');
        //const client = interaction.client;
        const userId = interaction.user.id;

        if (!member) {
            return interaction.reply(`dumbass who you watn to banan?/?/????`);
        }

        if (member.id === client.user.id) {
            return interaction.reply(`LOL WHO UR BANNANING KID U AINT SLICK 🤣🤣🤣🤣🤣`);
        }

        if (Date.now() - client.bananaCD.get(userId) < 300000) {
            return await interaction.reply(`dumbass yuo alredy banan ppl, wait GRRRRRRRRRRRRRRR!!!!!!!!!!!!!!!!!!!!!!!! yu gto ${300000 - (Date.now() - interaction.client.bananaCD.get(userId))} milliseconds left im too lazy to do math do it yourself GRRRRRRRRRR`)
        }

        const bananEmbed = new EmbedBuilder()
                                .setTitle(`${member.username} GOT BANANA LOL LOL LOL`)
                                .setDescription(`HEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO\nHEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO\nHEY YOU ${member} YOU FUCKING GOT BANAN LMFAOOOOOOOOO`)
                                .setImage(`https://media.tenor.com/29FOpiFsnn8AAAAC/banana-meme.gif`)
                                .setColor(`Yellow`)
                                .setFooter({ text: `BRO GOT BANAN'D ${interaction.client.banana.ensure(member.id, 0) + 1} TIMES XDDDDDD` });

        interaction.client.banana.inc(member.id);
        interaction.client.bananaCD.set(userId, Date.now())

        interaction.reply({ embeds: [bananEmbed] })
    }
}
