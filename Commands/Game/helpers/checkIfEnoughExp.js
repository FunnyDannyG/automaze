const { EmbedBuilder } = require("discord.js");

module.exports = (client, message, user) => {
    const level = client.levels.ensure(user.id, 1);
    const exp = client.exp.ensure(user.id, 0)

    function calculateRequiredExpForLevel(x) {
        return 100 * x ** 2 - 100 * x;
    }

    if (exp >= calculateRequiredExpForLevel(level + 1)) {
        const levelUpEmbed = new EmbedBuilder()
        .setTitle(`${user.username} HAS LEVEL UP!`)
        .setColor(`Green`)
        .setDescription(`## \`${level}\` -> \`${level + 1}\``)
        .setFooter({text: `Required XP for new level: ${calculateRequiredExpForLevel(level + 2)} exp`});

        message.channel.send({embeds: [levelUpEmbed]});
        client.exp.set(user.id, exp - calculateRequiredExpForLevel(level + 1));
        client.levels.inc(user.id);
    }
}