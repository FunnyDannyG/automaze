const { EmbedBuilder } = require("discord.js");
const models = require(`../../JSON/fight_characters.json`)

module.exports = {
    name: 'profile',
    category: 'Game',
    description: 'Your user info, level and model',
    aliases: ['prof', 'p'],
    syntax: 'profile [member]',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const member = message.mentions.members.first() || message.member;

        const level = client.levels.ensure(member.user.id, 1);
        const model = client.models.has(member.user.id) ? client.models.get(member.user.id) : 'None :(';
        const epoch = client.epochs.ensure(message.author.id, 0);

        function percentToBar(percentile) {
            const filled = Math.floor(percentile / 10);
            const bar = [`*[*`, Array(filled).fill(`▰`), Array(10 - filled).fill(`▱`), `*]*`].flat();
            return bar.join(``);
        }

        function calculateRequiredExpForLevel(x) {
            return 100 * x ** 2 - 100 * x;
        }

        const profileEmbed = new EmbedBuilder()
        .setTitle(`${member.user.username} 🀄`)
        .setColor(`Grey`)
        .setAuthor({name: member.user.username, iconURL: member.user.avatarURL()})
        .setDescription(`**• User ID**: ${member.user.id}`)
        .addFields({
            name: 'Level',
            value: `${percentToBar(client.exp.ensure(member.user.id, 0) / calculateRequiredExpForLevel(level + 1) * 100)} - **${level.toString()}** (${client.exp.ensure(member.user.id, 0)}/${calculateRequiredExpForLevel(level + 1)})`
        }, {
            name: 'Epoch',
            value: `${epoch}`
        }, {
            name: 'Owned Model',
            value: model
        });

        if (model !== 'None :(') {
            profileEmbed.setImage(models[model].image);
        }

        message.reply({embeds: [profileEmbed]});
    }
}