const { EmbedBuilder } = require("discord.js");
const models = require(`../../JSON/fight_characters.json`);

module.exports = {
    name: 'modelinfo',
    category: 'Game',
    description: 'Information about a model and their stats',
    aliases: ['minfo'],
    syntax: 'modelinfo <model>',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {String} prefix 
     */
    run: (client, message, args, prefix) => {
        const input = message.content.split(' ').slice(1).join(' ');
        if (!input) {
            return void message.reply(`specify a model`);
        }

        if (!models[input] && !Object.values(models).find(i => i.aliases && i.aliases.includes(input))) {
            return void message.reply(`that model does not exist`);
        }

        const model = models[input] || Object.values(models).find(i => i.aliases && i.aliases.includes(input));
        const level = client.levels.ensure(message.author.id, 1);
        const epoch = client.epochs.ensure(message.author.id, 0);

        const absoluteStats = Object.keys(model.stats)
        .map((stat, index) => `**‣ ${stat}**: ${Object.values(model.stats)[index]}`)
        .join(`\n`);

        const relativeStats = Object.keys(model.stats)
        .map((stat, index) => {
            if (stat === 'attack') {
                return `**‣ ${stat}**: ${Math.round(Object.values(model.stats)[index] * ((4 + level) / 5) + epoch / 5)}`
            }

            if (stat === 'health') {
                return `**‣ ${stat}**: ${Math.round(Object.values(model.stats)[index] * ((4 + level) / 5) + epoch)}`
            }

            if (stat === 'stamina') {
                return `**‣ ${stat}**: ${Object.values(model.stats)[index] + epoch / 10}`
            }

            if (stat === 'precision') {
                return `**‣ ${stat}**: ${Object.values(model.stats)[index] + epoch / 10}`
            }
        })
        .join(`\n`);

        const letterStats = Object.keys(model.stats)
        .map((stat, index) => {
            if (Object.values(model.stats)[index] <= 0) {
                return `**‣ ${stat}**: ∅`
            }

            if(1 <= Object.values(model.stats)[index] && Object.values(model.stats)[index] <= 20) {
                return `**‣ ${stat}**: E`;
            }
            
            if(21 <= Object.values(model.stats)[index] && Object.values(model.stats)[index] <= 40) {
                return `**‣ ${stat}**: D`;
            }
            
            if(41 <= Object.values(model.stats)[index] && Object.values(model.stats)[index] <= 60) {
                return `**‣ ${stat}**: C`;
            }

            if(61 <= Object.values(model.stats)[index] && Object.values(model.stats)[index] <= 80) {
                return `**‣ ${stat}**: B`;
            }

            if(81 <= Object.values(model.stats)[index] && Object.values(model.stats)[index] <= 99) {
                return `**‣ ${stat}**: A`;
            }

            if(stat >= 100) {
                return `**${stat}**: ∞`;
            }
        })
        .join(`\n`);

        const moveset = Object.keys(model.skills)
        .map(skill => `**‣ ${model.skills[skill].name}**: ${model.skills[skill].description} Consumes **${model.skills[skill].staminaCost}** stamina.`)
        .join(`\n`);

        const infoEmbed = new EmbedBuilder()
        .setTitle(model.name)
        .setDescription(model.description)
        .setFields(
            {
                name: 'Absolute Stats',
                value: absoluteStats,
                inline: true
            },
            {
                name: `Relative Stats`,
                value: relativeStats,
                inline: true
            },
            {
                name: `Letter Grades`,
                value: letterStats,
                inline: true
            },
            {
                name: `Moveset`,
                value: moveset
            }
        )
        .setImage(model.image)
        .setColor(`Aqua`); 

        message.reply({embeds: [infoEmbed]});
    }
}